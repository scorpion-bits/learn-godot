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

**Início das aulas: 04/08/2026.** O documento de planejamento **está no disco**,
na raiz: `Módulos.docx.pdf`. Ele é gitignored (material interno da equipe), mas
não precisa ser pedido ao usuário — leia. O texto é hexadecimal com fontes
embutidas; extraia decodificando os `ToUnicode` CMap por fonte
(`/F4`, `/F5` → `/ToUnicode N 0 R`), não com regex de `(texto) Tj`.

### O cronograma não dá 3 horas por módulo

A turma é a **GameLab**, 15 encontros, 04/08 a 22/09/2026. Um encontro **não é**
um módulo. Para os módulos do Milan:

| Aula | Data | Conteúdo | Orçamento real do módulo |
|---|---|---|---|
| 4 | QUI 13/08 | Módulos 2 e 3 — programação | Módulo 2 divide o encontro |
| 5 | TER 18/08 | Módulos 4, 5 e 6 — programação | três módulos num encontro |
| 10 | QUI 03/09 | Módulo 9 + **Módulo 6 de Game Design** | ~1h30 para o Módulo 9 |
| 11 | TER 08/09 | **Módulos 10 e 11 juntos** | ~1h25 para cada um |

Consequência prática: **acrescentar slides a 10 e 11 estoura o encontro.**
Somados, os dois decks já pedem ~197 min num encontro de 180. Melhorar esses
módulos significa aumentar a qualidade *por slide* — mockups, ícones,
apresentação de Nodes novos — e não a quantidade.

O PDF original diz que a Aula 10 faz "puzzles com inventário". **Não faz** —
em 01/08/2026 o Milan definiu que o puzzle é de empurrar caixas e acontece no
Módulo 5 de Game Design. O inventário não precisa de item-chave.

`Módulos-atualizado.md` (na raiz, também gitignored) é a versão revisada do
programa. Só os módulos do Milan foram mexidos; o resto está reproduzido
literalmente. Ao mudar o conteúdo de um deck dele, atualize os dois: o deck e
essa entrada do documento.

### Módulo 2 — reordenado em 06/08/2026

O Milan ensaiou a aula e achou uma cadeia de conceitos usados antes de serem
ensinados. O deck foi de 26 para 27 slides e a ordem mudou. **A regra que
saiu disso: nenhum slide pode usar um conceito que ainda não foi apresentado**
— nem em código de exemplo, nem em checkpoint.

O que estava quebrado: a indentação usava `if`/variável/`print` (13, 7 e 5
slides antes da hora); "funções nativas" vinha antes de "chamando uma função"
e já continha uma chamada; "como nomear" usava `var` antes de variáveis
existirem; e o **Checkpoint 2 mandava consertar um `if` que só era ensinado
no slide seguinte**.

Nova ordem do bloco de funções: *o que é uma função* → **`_ready`** →
*chamando* → *como nomear* → `print` → Checkpoint 1. Depois: *variáveis* →
*tipagem e a divisão que mente* → *argumentos* → *retorno* → *aritmética* →
*lógica* → *condicionais* → Checkpoint 2.

O `_ready` vem **antes** de "chamando" porque a pergunta que o apresenta —
"um script com cinco funções; por qual bloco o programa começa?" — é sobre
**ponto de partida**, não sobre chamada, então não depende do conceito
seguinte. Por isso o exemplo dele **não pode conter nenhuma chamada**: é só a
declaração com comentários dentro. Em troca, "chamando" ganha o `_ready` de
graça como hospedeiro legítimo do exemplo.

Restam duas referências para frente no deck, ambas de `func` (slides 5 e 6,
ensinado no 7) e ambas com callout avisando. É o mínimo irredutível: os
primeiros slides de sintaxe precisam mostrar algum código.

Decisões que valem para o resto do curso:
- **`_process` e `delta` saíram do Módulo 2.** Só `_ready` é apresentado.
  `_process` estreia em "Condicionais na prática", com o `delta` adiado para
  o Módulo 6.
- **`-> void` é explicado onde aparece** ("não devolve nada"), porque está em
  todo exemplo desde o começo. `(args)` e `-> tipo` saíram da anatomia — cada
  um chega no seu próprio slide.
- **Nada de nome de uma letra nos exemplos.** Os slides de aritmética e
  lógica usavam `x`, `y`, `a`..`e` duas telas depois de ensinar nomes
  descritivos. O deck não pode contradizer a si mesmo.
- **A tipagem vem depois da aritmética**, não antes: a armadilha do `int` só
  se demonstra com uma divisão, e divisão é aritmética. Ordem final do miolo:
  *variáveis* → *argumentos* → *retorno* → *aritmética* → *o tipo decide a
  conta* → *lógica* → *condicionais* → Checkpoint 2.
- **Existe um verificador de ordem de conceitos.** Ele varre os blocos
  `<pre><code>` de um deck e acusa qualquer conceito que apareça em código
  antes do slide que o ensina. Foi ele que pegou o `_ready` no slide de
  chamada e o `var` no slide de comentários. Vale rodar a cada reordenação —
  o script está no histórico da conversa, não versionado.
- Os decks **também são material de estudo em casa** — o aluno volta neles
  sozinho. Por isso os simuladores `▶ Executar` importam tanto quanto o texto.

### Módulo 3-4 — revisado em 12/08/2026

O Milan leu o deck e achou duas coisas: um slide que parecia ser "de outra
aula" no meio, e o incômodo de o `VisualComponent` ser código exclusivo do
player. As duas tinham a mesma raiz.

- **A regra do Módulo 2 vale aqui também** — e estava quebrada. O
  `MovementComponent` usava `delta`, `body.velocity`, `move_and_slide()` e
  `@export` com a explicação dos quatro vindo *depois*. "Funções nativas &
  delta" e "A física no código" foram movidos para **antes** dele; o `@export`
  ganhou uma menção curta no slide onde aparece pela primeira vez, e o
  aprofundamento seguiu em "As escolhas". Ordem nova do miolo: *Input Map* →
  *Vector2* → *InputComponent* → *funções nativas e delta* → *a física no
  código* → *MovementComponent* → *as escolhas* → *juntando no Player*.
- **O slide "de outra aula" era sintoma disso.** Fora de lugar ele parecia
  avulso — e ainda contradizia o slide anterior, que prometia o `delta` só
  para o Módulo 6. No lugar certo virou preparação. Ele agora começa pelo
  `_ready` (ponte com o Módulo 2) e os `print` citam o projeto.
- **"Ajustando a colisão" vinha antes do Sprite2D existir.** O slide dizia
  "agora que temos uma imagem como referência visual" três slides antes de a
  imagem entrar na cena — e contradizia o **checkpoint da própria aula**, cujo
  passo 5 manda voltar ao `CollisionShape2D` depois dos Hframes. Movido para
  depois de "O número de cada quadro"; a ordem dos slides agora é a mesma dos
  passos do checkpoint. "A caixa de colisão" ganhou um aviso de que o tamanho
  fica para depois, para o aluno não tentar dimensionar a caixa com a tela
  vazia.
- **O deck prometia reuso que não ia acontecer.** "O inimigo depois recebe a
  *mesma* peça" era dito das três, sobre a única que não recebe. Trocado pela
  regra verdadeira, apresentada em "Sistema de Componentes" e aplicada em
  "A árvore completa": **números e física viajam, comando e arte não.**
- **O `!` de `if(!body)` é o `not` do Módulo 2** — dito num aparte, porque o
  Módulo 2 só ensina `not` e a forma curta aparece aqui sem aviso. O `!body`
  é preservado por bater com o deck do Thales.
- Densidade: **zero overflow em 1366×768**. Em 720p sobrou só o
  `checkpoint-1`, com 6px — os sete passos são de uma linha cada, então o
  único jeito de ganhar os 6px seria fundir ou cortar um passo, o que piora um
  slide de mão na massa. Antes desta revisão eram 5 slides estourando em 720p,
  o `checkpoint-1` entre eles, com 28px.

### Tópicos oficiais que os decks ainda não cobrem

Confrontando o programa com os decks (01/08/2026):

- **Módulo 9** — ✅ refeito em 01/08/2026, 16 → 20 slides. O inventário virou
  **4 slots fixos** no espírito de um top-down de ação (decisão do Milan,
  inspirada no Hyper Light Drifter): sem arrastar, sem empilhar, sem
  organizar. *Equipamentos* **foi cortado** — no dia da aula não existe número
  nenhum para equipar; ficou a sugestão de levar para o Módulo 12. Entraram
  *itens dropados*, a `InventoryUI` como autoload e o `ItemEffect`.
- **Módulo 10** — falta *Inimigos* (o deck só tem espinho e buraco).
  *Feedback de perigo* está fraco. **Efeitos negativos foram cortados** pelo
  Milan em 01/08/2026 — não reintroduza.
- **Módulo 11** — falta *Habilidades*. É o **único** dos seis decks com zero
  ícone de Node, zero mockup do editor e zero card de apresentação de Node,
  e ainda assim é o que apresenta mais coisa nova (`enum`, `await`, `Button`,
  `get_tree().create_timer()`). É a maior lacuna de qualidade do repositório.

### Armadilhas de encadeamento entre módulos

- **O `LifeComponent` nasce no Módulo 10, não antes.** O Módulo 9 acontece
  cinco dias antes (03/09 vs 08/09), então **no dia do Módulo 9 o personagem
  não tem vida** — poção de cura não tem o que curar. O único número já
  existente e visível na hora é o `max_speed` do `MovementComponent`
  (Módulo 3-4). Por isso o primeiro consumível é poção de velocidade.
- **Godot não serializa `Callable`.** `@export var on_use : Callable` não
  aparece no Inspector nem sobrevive no `.tres`. Para "o item chama a função
  da sua escolha", o efeito precisa ser um `Resource` com um método
  (`ItemEffect.apply(user)`).
- **`damage` e `defense` não existem até os Módulos 10 e 11.** Equipamento com
  stats no Módulo 9 seria interface sem consequência. Lá fica só a ideia de
  "valor base + bônus".
- **Módulo 5 (Giovane) vai ter um componente de interação** — `Area2D` que,
  ao jogador entrar e apertar interagir, chama uma função escolhida na cena.
  O deck ainda não existe; **não construa nada em cima dele sem a assinatura
  real**, do mesmo jeito que o contrato dos componentes do player está fixado.
- **Os assets de batalha chegam depois das aulas de batalha** (Aula 13, 15/09,
  contra Aulas 11 e 12, em 08/09 e 10/09). Os assets são produzidos nas aulas
  de Arte; pedidos precisam entrar numa aula de arte *anterior* ao módulo que
  vai usá-los.

## Quem é o usuário e o que é dele

O usuário é o **Milan**. O curso é feito por uma equipe de seis pessoas, e a
divisão de responsabilidade é levada a sério.

**Módulos do Milan — pode editar livremente:**
Programação **2, 3, 4, 9, 10 e 11**.

**De outros integrantes — NÃO alterar conteúdo, texto, ordem nem didática:**
Programação 1, 5, 7, 8, 12 · Game Design 1–7 · Arte 1–2 · Música 1.

**Exceção — Módulo 6 (Física para Jogos), do Thales e Giovane:** em 31/07/2026
o Thales autorizou reestruturar o deck livremente, incluindo conteúdo, ordem e
didática. `lessons/programming/06/` deixou de ser somente-forma. Continue
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
- **Código em inglês, explicação em português** — em todos os decks **menos o
  Módulo 2**. Em 06/08/2026 o Milan decidiu ("por ora") que os identificadores
  de exemplo do Módulo 2 vão em **português sem acento** (`fazer_cafe`,
  `vida_total`, `pontos_do_jogador`), para tirar a barreira do idioma de quem
  está vendo programação pela primeira vez. Palavras da linguagem (`func`,
  `var`, `print`), nomes de Node e as ações do Input Map (`move_up` e irmãs)
  continuam como são — não são escolha de ninguém.

  ⚠️ **Isto ainda não foi propagado e gera contradição visível.** O Módulo 3-4
  é dado **no mesmo encontro** (Aula 4, 13/08) e usa `InputComponent`,
  `MovementComponent`, `max_speed`, `direction` — inglês, e esse vocabulário é
  contrato compartilhado com o Módulo 6 do Thales e com todos os seguintes.
  Ou a decisão se estende (e aí é conversa com a equipe, porque mexe em
  material dos outros), ou o Módulo 2 ganha um slide de transição avisando que
  a partir do módulo seguinte os nomes mudam de idioma. **Decisão pendente do
  Milan.**
- **Input Map:** ações próprias (`move_up`, `move_down`, `move_left`,
  `move_right`). **Nunca** reaproveitar as nativas `ui_*` — elas são a
  navegação de menu da engine e conflitam com o Módulo 7.
- **Contrato dos componentes**, compartilhado com o deck do Módulo 6:
  - `InputComponent` — `class_name`, expõe `var direction : Vector2` e `update_direction()`
  - `MovementComponent` — `class_name`, `@export var max_speed : float`, `move(direction, delta)`
  - `VisualComponent` — `class_name`, lê `input_component.direction`.
    **É do player por decisão, não por acidente:** ele pergunta se há
    *comando*, e monstro não tem teclado. Não troque essa leitura por
    `body.velocity` "para deixar genérico" — com o knockback do Módulo 6 a
    `velocity` fica diferente de zero enquanto o personagem é empurrado, e ele
    tocaria `running` no ar. O nome continua `*Component` porque o sufixo é
    sobre *uma responsabilidade por Node*, não sobre reuso entre criaturas.
  - Mudar qualquer uma dessas assinaturas quebra a continuidade com o Módulo 6.
- **Spritesheet do curso** (`assets/player.png`): 288×128, grade **9×4**,
  quadros de **32×32**, 36 no total (`Hframes` = 9, `Vframes` = 4). Linha 0 =
  baixo, 1 = esquerda, 2 = direita, 3 = cima; o **quadro 0 de cada linha é o
  parado**, e a corrida usa os oito seguintes: 1–8 baixo, 10–17 esquerda,
  19–26 direita, 28–35 cima. Animações: `running_<dir>` e `idle_<dir>`.
  ⚠️ Corrigido em 13/08/2026 — este registro dizia "8×4, quadros de 36×32,
  frames 0–7/8–15/16–23/24–31", que é a divisão errada contra a qual a
  armadilha logo abaixo avisa, e não batia nem com o arquivo nem com o deck.

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
lessons/<area>/<mod>/   Aulas — programming, game-design, art, music
lessons/01|02|06|07/    Redirects da organização antiga (podem sumir um dia)
lessons/programacao/    Redirects dos caminhos em português (idem)
lessons/arte/02/        Redirect do caminho em português (idem)
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
  (`href="../programming/06/"`), nunca para o `index.html` final.
- **Os caminhos das áreas são em inglês** (`programming`, `game-design`,
  `art`, `music`), decidido em 01/08/2026 para casar com `/lessons/` e
  `/assets/`. Só o caminho: título, texto e conteúdo seguem em português.
  Os três lugares precisam concordar — a pasta em `lessons/`, o `slug` e o
  `path` em `assets/course.js`, e o `data-module` no `<body>` do deck. Se o
  `data-module` divergir do `slug`, a navegação entre módulos **some sem erro
  nenhum**; `python tools/check_course.py` é quem pega isso.
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
- **Media query com a mesma especificidade da regra base só vence se vier
  depois dela no arquivo.** O `style.css` tem um bloco `@media (max-height:
  820px)` lá na linha ~264, mas a regra base de `.callout` está na ~1237.
  Um override de `.callout` posto no bloco de cima é **silenciosamente
  ignorado** — o CSS carrega, a media query casa, e nada muda. Ao apertar um
  componente para o projetor, ponha a media query **logo abaixo** da regra
  base dele, não junto das outras.
- **Ao medir densidade, meça o slide certo com o HTML certo.** Duas vezes o
  número não se mexeu entre medições porque o navegador serviu do cache ora o
  `style.css`, ora o próprio HTML. Porta nova resolve o CSS; `?v=`+timestamp
  resolve o HTML. E confirme que a mudança chegou (leia um texto que você
  acabou de alterar) **antes** de concluir que a correção não funcionou.
- **Antes de aparar texto, meça qual elemento está pesando.** Encurtar o
  callout errado não muda nada: só reduz altura o corte que elimina uma
  *linha renderizada*. Meça `getBoundingClientRect().height` de cada filho da
  coluna e ataque o maior.
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
  (`lessons/programming/07/`, `lessons/art/02/`), embutindo o PDF original
  sem alterar o conteúdo de ninguém. `script.js` passou a tolerar página sem
  deck (antes quebrava na primeira linha e derrubava a navegação junto).
- Módulo 6 reestruturado com a permissão do Thales: 11 → 18 slides, com
  objetivos, recapitulação, três checkpoints cronometrados (20/25/15 min),
  slide próprio para `move_toward` vs `lerp`, o `KnockbackComponent` final
  corrigido (faltava no deck original) e o aviso de que `deceleration * delta`
  acima de 1 faz o personagem vibrar. O arco de descoberta dele (construa
  quebrado → observe → entenda) e o vocabulário foram preservados.
- Densidade: **zero slides com overflow em 1366×768** nos seis decks. A
  verificação anterior media com dois slides `.active` ao mesmo tempo e
  estava errada — ver a armadilha registrada acima.

  ⚠️ **Correção de 06/08/2026:** o registro anterior dizia "zero em 1366×768
  **e 1280×720**". A parte do 1280×720 era **falsa**. Medido de novo, com
  carga real: 1366×768 está limpo nos seis, mas a **720p** ainda transbordam
  `programming/03-04` (era 5 slides; desde 12/08/2026 só o `checkpoint-1`,
  com 6px), `programming/06` (knockback-component,
  1px), `programming/10` (life) e `programming/11` (actions, enemy-turn, ui —
  26px cada). Os Módulos 2 e 9 estão limpos nas duas resoluções.
  O alvo real do projetor é 1366×768; 720p é margem de segurança.
- `.mt-0` / `.mb-0` eram usadas em 88 lugares e não existiam no CSS. Agora
  existem.

**Pendências registradas para a equipe** (não são do Milan resolver sozinho):
- Notion diz "Introdução ao LibreSprite"; o PDF entregue é "Pixel Art no
  Aseprite" — e o Aseprite é pago.
- `assets/lessons/06/` manteve o nome antigo enquanto as aulas viraram
  `programming/06`.
- O cenário `file://` (pendrive) foi projetado mas nunca verificado de fato.
- O PDF embutido nas páginas-invólucro carrega (200, sem erro), mas nunca foi
  visto renderizando de fato — confira num navegador comum.
