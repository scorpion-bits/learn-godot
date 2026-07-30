# Godot Teaching Guidelines (Scorpion Bits)

Sempre que atuar como assistente para criar aulas, apresentações ou códigos voltados para o ensino de Godot neste projeto, siga estritamente estas regras:

## 1. Nomenclatura e Idioma
- **Código em Inglês:** nomeie TODAS as variáveis, funções e componentes de arquitetura estritamente em **Inglês** (ex: `MovementComponent`, `get_direction()`). Isso acostuma os alunos com o padrão da indústria.
- **Explicações em Português:** o texto dos slides e a didática em si devem ser sempre em Português (pt-BR).

## 2. Didática Visual (Nodes e Editor Godot)
- **Apresente o propósito:** toda vez que um Node novo for introduzido, mostre o nome dele e explique o que faz isoladamente (a filosofia do "Tijolo de Lego").
- **Ícones:** use os SVGs locais do Godot em `assets/icons/`, não ícones genéricos.
- **Contexto de editor (Scene Tree/Inspector):** desenhe o Node dentro da árvore de cena ou mostre suas propriedades no Inspector usando as classes `.godot-editor-layout`, `.godot-tree`, `.godot-inspector`. O aluno precisa "ver" a interface simulada, não só ler sobre ela.

## 3. Explicação de Código e Engine Nativa
- **Funções com underline (`_`):** explique sempre, de forma explícita, que funções precedidas por `_` (como `_process` ou `_ready`) são **funções nativas da Engine Godot** — callbacks que rodam automaticamente — ao contrário de funções customizadas.
- **Variáveis/métodos herdados:** ao usar uma propriedade herdada (como `velocity` ou `move_and_slide()` de um CharacterBody2D), explique que ela existe porque escolhemos aquele Node pai específico — não é mágica.
- **Tipagem de dados:** ao introduzir um tipo fundamental (ex: `Vector2`, `float`, `int`), explique de forma simples o que ele é e como funciona antes de usá-lo em código.

## 4. Estrutura Pedagógica
- **Conceito → Prática:** nunca jogue um script complexo na tela sem antes explicar os Nodes que compõem a cena e a teoria por trás deles.
- **Modularidade:** incentive boas práticas arquiteturais, como separar a lógica em subcomponentes puros (Input, Movement, Visual) em vez de acoplar tudo no script pai.

## 5. Padrão Visual (UI/UX) e Interatividade
- Os slides devem ser bonitos, premium e engajadores: Dark Mode, painéis translúcidos (Glassmorphism), micro-animações (CSS transitions) e destaque de sintaxe de código. Nunca crie slides com visual "básico" ou monocromático.
- **Interatividade:** sempre que possível em aulas de código, implemente simulações passo a passo (um botão "Executar" que destaca a execução linha a linha, sincronizado com o Output) para tornar a lógica tangível.

## 6. Git, Deploy e URLs
- As aulas são hospedadas como site estático via GitHub Pages (domínio learn.scorpionbits.com, estúdio Scorpion Bits).
- **Sempre peça permissão explicitamente** antes de rodar `git push`. Nunca faça push sem o aval do usuário na conversa.
- **Clean URLs:** links entre aulas devem apontar para o diretório (ex: `href="./lessons/01/"`), nunca para o arquivo final (`href=".../index.html"`). O projeto tem um script na raiz que corrige isso localmente para testes via `file:///` — sempre respeite esse padrão de roteamento.

## 7. Auto-registro de Aprendizados
- Toda vez que o usuário expressar uma nova preferência, diretriz, fluxo de trabalho ou correção de padrão durante a conversa — ou quando o assistente resolver um problema complexo ou ficar travado em algo — o assistente deve **proativamente editar este arquivo** para registrar o aprendizado. Isso evita repetir erros ou pedir as mesmas instruções em conversas futuras.
