# Curso de Godot — Scorpion Bits / SESC

> Este arquivo é carregado automaticamente no início de toda sessão.
> Leia-o inteiro antes de tocar em qualquer coisa.
> As regras técnicas de didática e estilo estão em `.agents/AGENTS.md` — leia também.

## O que é este repositório

O site completo de um curso presencial de desenvolvimento de jogos em Godot,
ministrado pelo **SESC** através da empresa **Scorpion Bits**. Publicado como
site estático via GitHub Pages em **learn.scorpionbits.com**.

Os arquivos HTML em `lessons/` **são os slides projetados durante a aula** —
não são documentação sobre as aulas. Cada `<section class="slide">` é um slide.

**Objetivo do curso:** que os alunos construam seu próprio jogo 2D Top-Down.
A maioria **nunca programou na vida**. Cada encontro dura ~3 horas.

**Início das aulas: 04/08/2026.** Cronograma completo no documento de
planejamento (`Módulos.docx.pdf`, fora do versionamento — peça ao usuário).

## Quem é o usuário e o que é dele

O usuário é o **Milan**. O curso é feito por uma equipe de seis pessoas, e a
divisão de responsabilidade é levada a sério.

**Módulos do Milan — pode editar livremente:**
Programação **2, 3, 4, 9, 10 e 11**.

**De outros integrantes — NÃO alterar conteúdo, texto, ordem nem didática:**
Programação 1, 5, 7, 8, 12 · Game Design 1–7 · Arte 1–2 · Música 1.

**Exceção — Módulo 6 (Física para Jogos), do Thales e Giovane:** em 31/07/2026
o Thales autorizou reestruturar o deck livremente, incluindo conteúdo, ordem e
didática. `lessons/programacao/06/` deixou de ser somente-forma. Continue
tratando o material como dele: mudanças grandes merecem ser comunicadas, e o
vocabulário que ele criou (`LifeComponent`, `KnockbackComponent`,
`external_force`, o fluxo Hitbox→Hurtbox→Signal) deve ser preservado, porque é
ele quem vai dar a aula.

Quando uma aula do Milan divergir de uma aula de colega **sem essa permissão**,
a adaptação acontece do lado do Milan — o deck do colega é referência fixa.

Os módulos 3 e 4 foram **unidos de propósito** numa aula só ("Criando um
Player Básico"), num único encontro. Não é erro; não desfaça.

## Convenções que já foram decididas

- **"Módulo N"** = unidade de conteúdo (o que aparece no site).
  **"Aula N"** = encontro do calendário no cronograma. Nunca troque uma pela outra.
- **Código em inglês, explicação em português.** Sempre.
- **Input Map:** ações próprias (`move_up`, `move_down`, `move_left`,
  `move_right`). **Nunca** reaproveitar as nativas `ui_*` — elas são a
  navegação de menu da engine e conflitam com o Módulo 7.
- **Contrato dos componentes**, compartilhado com o deck do Módulo 6:
  - `InputComponent` — `class_name`, expõe `var direction : Vector2` e `update_direction()`
  - `MovementComponent` — `class_name`, `@export var max_speed : float`, `move(direction, delta)`
  - `VisualComponent` — `class_name`, lê `input_component.direction`
  - Mudar qualquer uma dessas assinaturas quebra a continuidade com o Módulo 6.
- **Spritesheet do curso** (`assets/player.png`): 288×128, grade 8×4, quadros
  de 36×32. Linha 0 = baixo, 1 = esquerda, 2 = direita, 3 = cima; quadro 0 de
  cada linha é o parado. Frames 0–7 baixo, 8–15 esquerda, 16–23 direita,
  24–31 cima. Animações: `running_<dir>` e `idle_<dir>`.

## Arquitetura

```
index.html              Trilha do curso, cards escritos à mão (funciona sem JS)
style.css               Único CSS do projeto
script.js               Navegação de slides, simulador, timers, nav entre módulos
assets/course.js        Manifesto: ordem e estado dos 21 módulos
assets/fonts/           Fontes auto-hospedadas (offline)
assets/icons-ui/        Sprite SVG de ícones de interface (offline)
assets/icons/           951 ícones oficiais do Godot
assets/player.png       Spritesheet do curso
lessons/<area>/<mod>/   Aulas — programacao, game-design, arte, musica
lessons/01|02|06|07/    Redirects dos caminhos antigos (podem sumir um dia)
tools/check_course.py   Verifica index.html contra assets/course.js
```

**O site inteiro roda offline**, de pendrive, via `file://`. Nenhuma
dependência de CDN. Não reintroduza Google Fonts nem Font Awesome via rede.

**Ícones de interface:** `<svg class="ui-icon"><use href="#i-nome"></use></svg>`.
O sprite é injetado por `assets/icons-ui/ui-icons.js`, carregado logo após a
abertura do `<body>`. Não use `<i class="fa-...">`.

## Comandos

```bash
python tools/check_course.py          # consistência do curso
python -m http.server 8791            # servidor local para testar
```

Não há Node.js instalado nesta máquina — não escreva ferramentas em `node`.

## Restrições de trabalho

- **Nunca faça `git push` sem permissão explícita** na conversa.
- **Não invente nomes** para o curso, a empresa, plataformas ou produtos.
  Nada de "Academy", "Studio", "Learning Platform". Use só o que já existe.
- **Não improvise assets.** Se um recurso visual melhoraria a aula e não
  existe, **pare e peça** ao usuário, explicando por que ajuda.
- **Clean URLs:** links entre aulas apontam para o diretório
  (`href="../programacao/06/"`), nunca para o `index.html` final.
- Toda alteração importante precisa de justificativa pedagógica, técnica ou
  de usabilidade.

## Restrições de projeto que não são óbvias

- **Densidade de slide é requisito, não estética.** O deck roda em projetor
  1366×768. Conteúdo que estoura a altura fica escondido atrás de um scroll
  que o professor não percebe — e a aula pula o conteúdo. Depois de mexer num
  slide, meça: `scrollHeight - clientHeight` do `.slide` ativo.
- **Ao medir overflow, só um slide pode estar `.active` por vez.** O `.deck` é
  um flex container: com dois slides ativos os dois dividem a largura, cada um
  fica com metade, o texto quebra em muito mais linhas e a medição acusa
  overflow gigante e falso (chegou a marcar 9744px num slide que cabia).
  Remova `.active` de todos, meça um a um, e devolva o original no fim.
  Confira sempre a largura medida: tem que bater com a do slide sozinho.
- **`innerWidth` zero = viewport perdida.** Ao trocar de aba no navegador de
  teste, o viewport volta a 0×0 e toda medição vira lixo. Redimensione depois
  de cada navegação e confirme `innerWidth` antes de confiar no número.
- **Não use `display:flex` num elemento que mistura texto solto com tags.**
  Cada trecho de texto vira um item de flex independente e a frase se parte em
  colunas. Já quebrou o `.step-list` uma vez.
- **Numeração de slide é automática** (script.js deriva da posição). Mas os
  totais em `progress-text`, `total-slides-num` e nos cards do `index.html`
  são estáticos — atualize ao inserir ou remover slides.
- Estilo inline vence media query. Não fixe colunas de grid por `style=`.
- **Propriedade personalizada declarada no próprio elemento vence a herdada
  do pai.** Se um componente precisa aceitar override de fora (`--scale`,
  `--accent`), use `var(--x, padrão)` e **não** declare `--x` na regra dele.
- **Ao verificar uma correção de CSS/JS, desconfie do cache antes do código.**
  O `python -m http.server` não manda `Cache-Control`; o navegador aplica
  cache heurístico e continua executando o arquivo antigo — mesmo em aba nova
  e mesmo com `no-store` na resposta. A forma confiável de confirmar é servir
  numa **porta diferente**, que o cache nunca viu.
- **Não confie em dimensão de spritesheet deduzida por divisão.** 288/8 dava
  um número inteiro e estava errado mesmo assim (são 9 colunas de 32px, não 8
  de 36). Conte os quadros na imagem ou detecte as faixas transparentes.

## Estado atual (última atualização: 31/07/2026)

**Etapas 1 a 5 do plano concluídas:**

1. Correções críticas de GDScript (`InputComponent` sem `class_name` nem
   membro `direction`; `ui_*` no lugar de ações próprias; assinatura do
   `MovementComponent` divergindo do Módulo 6) e dois bugs de front-end
   (barra de espaço não avançava slide; o wrapper de linhas corrompia o
   slide do teclado interativo).
2. Legibilidade no projetor: altura por flexbox, espaçamento ancorado em vh,
   aviso de conteúdo cortado, e o site inteiro rodando offline (fontes e
   ícones auto-hospedados).
3. Numeração por módulo, pastas por área, redirects nos caminhos antigos,
   índice como trilha das 4 áreas com os 21 módulos, navegação entre módulos.
4. Didática: objetivos e recapitulação em cada aula, checkpoints práticos com
   cronômetro, `Array`/`Dictionary` antes do Módulo 9, e a seção de animação
   reescrita em cima da spritesheet real.
5. Qualidade: ~300 linhas de CSS morto removidas (58 classes órfãs → 4, todas
   aplicadas por JS), estilos inline de 302 → 169, simulador de código
   orientado a dados via `data-sim` no HTML, e acessibilidade (`alt` em todas
   as imagens, abas como `<button>`, foco visível).

**Etapa 6 concluída** — Módulos 9 (Inventário), 10 (Status e Perigos) e 11
(Batalhas 1 — Turno) produzidos do zero, 16 slides cada. O Módulo 2 já
plantava `Array` e `Dictionary` pensando no Inventário.

**Etapa 7 concluída:**

- Nomes de identificadores em inglês nos códigos de exemplo de todos os decks
  (48 trocas). Textos que o jogador lê seguem em português; o Módulo 2 ganhou
  um slide próprio ("Como nomear as coisas") ensinando a regra.
- Módulos 7 e Arte 2 viraram páginas-invólucro com a moldura do site
  (`lessons/programacao/07/`, `lessons/arte/02/`), embutindo o PDF original
  sem alterar o conteúdo de ninguém. `script.js` passou a tolerar página sem
  deck (antes quebrava na primeira linha e derrubava a navegação junto).
- Módulo 6 reestruturado com a permissão do Thales: 11 → 18 slides, com
  objetivos, recapitulação, três checkpoints cronometrados (20/25/15 min),
  slide próprio para `move_toward` vs `lerp`, o `KnockbackComponent` final
  corrigido (faltava no deck original) e o aviso de que `deceleration * delta`
  acima de 1 faz o personagem vibrar. O arco de descoberta dele (construa
  quebrado → observe → entenda) e o vocabulário foram preservados.
- Densidade: **zero slides com overflow** em 1366×768 e 1280×720, nos seis
  decks. A verificação anterior media com dois slides `.active` ao mesmo
  tempo e estava errada — ver a armadilha registrada acima.
- `.mt-0` / `.mb-0` eram usadas em 88 lugares e não existiam no CSS. Agora
  existem.

**Pendências registradas para a equipe** (não são do Milan resolver sozinho):
- Notion diz "Introdução ao LibreSprite"; o PDF entregue é "Pixel Art no
  Aseprite" — e o Aseprite é pago.
- `assets/lessons/06/` manteve o nome antigo enquanto as aulas viraram
  `programacao/06`.
- O cenário `file://` (pendrive) foi projetado mas nunca verificado de fato.
- O PDF embutido nas páginas-invólucro carrega (200, sem erro), mas nunca foi
  visto renderizando de fato — confira num navegador comum.
