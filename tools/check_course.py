#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verificador de consistencia do curso — Scorpion Bits / SESC.

O index.html e escrito a mao (para funcionar mesmo sem JavaScript) e o
assets/course.js guarda a mesma ordem para montar a navegacao dentro dos
decks. Dois lugares com a mesma informacao divergem com o tempo — este
script compara os dois e aponta a diferenca antes que ela va para o ar.

Tambem confere:
  - se todo caminho declarado existe de fato no disco;
  - se os modulos bloqueados sao mesmo impossiveis de abrir;
  - se as contagens "N de M disponiveis" batem com os cards;
  - se cada deck declara o proprio data-module e carrega o manifesto.

Uso:  python tools/check_course.py
Sai com codigo 1 se encontrar qualquer divergencia.

Nota: o manifesto e lido por expressao regular, nao por um interpretador
JS — o formato de assets/course.js e controlado por nos e mantido em uma
entrada por linha justamente para isso.
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
problems = []


def note(msg):
    problems.append(msg)


def read(rel):
    return io.open(os.path.join(ROOT, rel), encoding='utf-8').read()


# ---------- manifesto ------------------------------------------------------
manifest = read('assets/course.js')

AREA_RE = re.compile(r"id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'")
MOD_RE = re.compile(
    r"\{\s*n:\s*'([^']*)',\s*slug:\s*'([^']*)',\s*title:\s*'([^']*)',"
    r"\s*state:\s*'([^']*)'(?:,\s*path:\s*'([^']*)')?\s*\}"
)

areas = []
area_marks = list(AREA_RE.finditer(manifest))
for i, am in enumerate(area_marks):
    end = area_marks[i + 1].start() if i + 1 < len(area_marks) else len(manifest)
    chunk = manifest[am.start():end]
    mods = [
        {'n': g[0], 'slug': g[1], 'title': g[2], 'state': g[3], 'path': g[4] or None}
        for g in MOD_RE.findall(chunk)
    ]
    areas.append({'id': am.group(1), 'name': am.group(2), 'modules': mods})

flat = [m for a in areas for m in a['modules']]

if not flat:
    note('nao consegui ler nenhum modulo de assets/course.js — o formato mudou?')

# ---------- index ----------------------------------------------------------
index_html = read('index.html')

CARD_RE = re.compile(
    r'<(a|div)\s+(?:href="([^"]+)"\s+)?[^>]*class="course-card([^"]*)"'
    r'[\s\S]*?<span class="lesson-tag[^"]*">([^<]+)</span>'
    r'\s*<h3 class="course-title">([\s\S]*?)</h3>'
)

# So contam os cards que estao dentro de uma .course-grid. O index tambem tem
# a secao "Materiais para baixar", cujos cards nao sao modulos — sem este
# recorte eles entrariam na conta e a comparacao com o manifesto acusaria uma
# divergencia que nao existe.
GRID_RE = re.compile(r'<div class="course-grid">([\s\S]*?)</section>')
grids = ''.join(GRID_RE.findall(index_html))

cards = []
for tag, href, cls, label, title in CARD_RE.findall(grids):
    cards.append({
        'tag': tag,
        'href': href or None,
        'locked': 'locked' in cls.split(),
        'label': label.strip(),
        'title': re.sub(r'<[^>]+>', '', title).replace('&amp;', '&').strip(),
    })

# ---------- 1. mesma quantidade -------------------------------------------
if len(cards) != len(flat):
    note('quantidade divergente: index.html tem %d cards, course.js tem %d modulos'
         % (len(cards), len(flat)))

# ---------- 2. mesma ordem, titulo e estado -------------------------------
for i in range(min(len(cards), len(flat))):
    card, mod = cards[i], flat[i]

    if card['title'] != mod['title']:
        note('posicao %d: titulo difere — index "%s" / course.js "%s"'
             % (i + 1, card['title'], mod['title']))

    mod_locked = mod['state'] == 'soon'
    if card['locked'] != mod_locked:
        note('"%s": index diz %s, course.js diz "%s"'
             % (mod['title'], 'bloqueado' if card['locked'] else 'disponivel', mod['state']))

    if card['locked'] and (card['tag'] == 'a' or card['href']):
        note('"%s" esta bloqueado mas e um link no index.html — precisa ser <div> sem href'
             % mod['title'])

    if not mod_locked:
        if not mod['path']:
            note('"%s" esta como "%s" no course.js mas sem "path"' % (mod['title'], mod['state']))
        else:
            target = mod['path'] + 'index.html' if mod['path'].endswith('/') else mod['path']
            if not os.path.exists(os.path.join(ROOT, target)):
                note('"%s": caminho nao existe no disco — %s' % (mod['title'], mod['path']))

# ---------- 3. contagens "N de M disponiveis" -----------------------------
COUNT_RE = re.compile(
    r'<section class="area" id="area-([^"]+)"[\s\S]*?<span class="area-count">(\d+) de (\d+) dispon'
)
for area_id, shown, total in COUNT_RE.findall(index_html):
    area = next((a for a in areas if a['id'] == area_id), None)
    if area is None:
        note('area "%s" existe no index.html mas nao no course.js' % area_id)
        continue
    real = len([m for m in area['modules'] if m['state'] != 'soon'])
    if int(shown) != real:
        note('area "%s": indice diz %s disponiveis, o real e %d' % (area_id, shown, real))
    if int(total) != len(area['modules']):
        note('area "%s": indice diz %s modulos, o real e %d' % (area_id, total, len(area['modules'])))

# ---------- 4. cada pagina de aula se declara ------------------------------
# Vale para 'deck' e para 'pdf': a pagina-involucro do PDF usa a mesma moldura
# e a mesma navegacao entre modulos, entao depende igualmente do data-module
# bater com o slug do manifesto. Deixar o 'pdf' de fora ja escondeu um
# data-module desatualizado uma vez.
for mod in [m for m in flat if m['state'] in ('deck', 'pdf')]:
    rel = os.path.join(mod['path'], 'index.html')
    if not os.path.exists(os.path.join(ROOT, rel)):
        continue
    html = read(rel)
    if 'data-module="%s"' % mod['slug'] not in html:
        note('%s nao declara data-module="%s"' % (rel, mod['slug']))
    if 'assets/course.js' not in html:
        note('%s nao carrega assets/course.js — a navegacao entre modulos nao vai aparecer' % rel)

# ---------- resultado ------------------------------------------------------
if problems:
    sys.stderr.write('\n%d divergencia(s):\n\n' % len(problems))
    for p in problems:
        sys.stderr.write('  - %s\n' % p)
    sys.stderr.write('\n')
    sys.exit(1)

print('OK - curso consistente: %d modulos, %d disponiveis, %d areas'
      % (len(flat), len([m for m in flat if m['state'] != 'soon']), len(areas)))
