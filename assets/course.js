/* ==========================================================================
   Manifesto do curso — Scorpion Bits / SESC
   ==========================================================================

   Fonte única de verdade para a ORDEM e a NAVEGAÇÃO entre módulos.
   Usado por script.js para montar os links "módulo anterior / próximo" dentro
   de cada deck, sem que nenhuma aula precise saber quem vem antes ou depois.

   Como adicionar um módulo pronto:
     1. coloque os arquivos em lessons/<area>/<numero>/
     2. mude o "state" abaixo de 'soon' para 'deck' (HTML) ou 'pdf'
     3. preencha o "path"
     4. espelhe a mudança no card correspondente em index.html

   O index.html é escrito à mão de propósito: se este .js falhar em carregar,
   a página inicial ainda funciona. Ao mexer aqui, confira lá também —
   `python tools/check_course.py` compara os dois e aponta divergências.

   state:
     'deck'  — aula em HTML neste repositório
     'pdf'   — apresentação entregue em PDF
     'canva' — apresentação hospedada no Canva, embutida numa página-invólucro
               (é o único estado que depende de internet)
     'soon'  — ainda não disponível; fica bloqueada no índice
   ========================================================================== */

window.COURSE = {
    areas: [
        {
            id: 'programming',
            name: 'Programação',
            modules: [
                { n: '1',    slug: 'programming/01',    title: 'Introdução ao Godot',                 state: 'canva', path: 'lessons/programming/01/' },
                { n: '2',    slug: 'programming/02',    title: 'Introdução à Programação',            state: 'deck', path: 'lessons/programming/02/' },
                { n: '3 e 4', slug: 'programming/03-04', title: 'Criando um Player Básico',           state: 'deck', path: 'lessons/programming/03-04/' },
                { n: '5',    slug: 'programming/05',    title: 'Colisores e Area2D',                  state: 'canva', path: 'lessons/programming/05/' },
                { n: '6',    slug: 'programming/06',    title: 'Física para Jogos',                   state: 'deck', path: 'lessons/programming/06/' },
                { n: '7',    slug: 'programming/07',    title: 'Interface 1 — Menu e Pausa',          state: 'pdf',  path: 'lessons/programming/07/' },
                { n: '8',    slug: 'programming/08',    title: 'Interface 2 — Diálogo e Save',        state: 'soon' },
                { n: '9',    slug: 'programming/09',    title: 'Inventário',                          state: 'deck', path: 'lessons/programming/09/' },
                { n: '10',   slug: 'programming/10',    title: 'Status e Perigos',                    state: 'deck', path: 'lessons/programming/10/' },
                { n: '11',   slug: 'programming/11',    title: 'Batalhas 1 — Turno',                  state: 'deck', path: 'lessons/programming/11/' },
                { n: '12',   slug: 'programming/12',    title: 'Batalhas 2 — Tempo Real',             state: 'soon' }
            ]
        },
        {
            id: 'game-design',
            name: 'Game Design',
            modules: [
                { n: '1', slug: 'game-design/01', title: 'Introdução ao Game Design',      state: 'soon' },
                { n: '2', slug: 'game-design/02', title: 'O que é um jogo?',               state: 'soon' },
                { n: '3', slug: 'game-design/03', title: 'A ideia e o jogador',            state: 'soon' },
                { n: '4', slug: 'game-design/04', title: 'Teoria do Fluxo e Game Feel',    state: 'soon' },
                { n: '5', slug: 'game-design/05', title: 'Mecânicas',                      state: 'soon' },
                { n: '6', slug: 'game-design/06', title: 'História',                       state: 'soon' },
                { n: '7', slug: 'game-design/07', title: 'Level Design e Estética',        state: 'soon' }
            ]
        },
        {
            id: 'art',
            name: 'Arte',
            modules: [
                { n: '1', slug: 'art/01', title: 'Produção de Assets',  state: 'soon' },
                { n: '2', slug: 'art/02', title: 'Pixel Art no Aseprite', state: 'pdf', path: 'lessons/art/02/' }
            ]
        },
        {
            id: 'music',
            name: 'Música',
            modules: [
                { n: '1', slug: 'music/01', title: 'Música e SFX', state: 'soon' }
            ]
        }
    ]
};

/* Lista achatada, na ordem em que o curso acontece. */
window.COURSE.flat = window.COURSE.areas.reduce(function (acc, area) {
    area.modules.forEach(function (m) {
        acc.push({ area: area.name, areaId: area.id, n: m.n, slug: m.slug, title: m.title, state: m.state, path: m.path });
    });
    return acc;
}, []);
