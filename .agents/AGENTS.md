# Godot Teaching Guidelines (Scorpion Bits)

Sempre que atuar como assistente para criar aulas, apresentações ou códigos voltados para o ensino de Godot neste projeto, siga estritamente estas regras:

## 1. Nomenclatura e Idioma Base
- **Código em Inglês:** Nomeie TODAS as variáveis, funções e componentes de arquitetura estritamente em **Inglês** (ex: `MovementComponent`, `get_direction()`). Isso serve para acostumar os alunos com o padrão da indústria.
- **Explicações em Português:** O texto dos slides e a didática em si devem ser sempre em Português (pt-BR).

## 2. Apresentação de Nodes (Didática Visual)
- **Apresente o Propósito:** Toda vez que um Node novo for introduzido, mostre qual é o seu nome e explique o que ele faz de forma isolada (a filosofia do "Tijolo de Lego").
- **Integração Visual:** Faça o uso constante dos ícones locais em SVG do Godot (localizados em `assets/icons/`).
- **Contexto (Scene Tree/Inspector):** Utilize a estrutura HTML baseada nas classes `.godot-editor-layout`, `.godot-tree`, `.godot-inspector` para desenhar o Node dentro da árvore de cena ou mostrar suas propriedades no Inspector. O aluno precisa "ver" a interface simulada.

## 3. Explicação de Código e Engine Nativa
- **Funções com Underline (`_`):** Sempre explique de forma explícita que funções precedidas por `_` (como `_process` ou `_ready`) são **funções nativas da Engine Godot** que rodam automaticamente (call-backs), ao contrário de funções customizadas.
- **Variáveis Nativas:** Ao utilizar propriedades herdadas (como `velocity` do CharacterBody2D ou o método `move_and_slide()`), dedique um tempo para explicar que essas variáveis e funções existem porque escolhemos aquele Node pai específico.
- **Tipagem de Dados:** Sempre explique de forma simples os tipos de dados fundamentais ao introduzi-los (ex: o que é e como funciona um `Vector2` nos eixos X e Y, o que é um `float`, etc).

## 4. Estrutura e Fluxo (Cronologia)
- **Conceito -> Prática:** Nunca jogue um script complexo na tela sem antes explicar os Nodes que compõem a cena e a teoria por trás deles.
- **Modularidade:** Incentive boas práticas arquiteturais, como separar a lógica em subcomponentes puros (Input, Movement, Visual) em vez de acoplar tudo no script pai.

## 5. Excelência Visual (UI/UX) e Interatividade
- Os slides devem ser bonitos, premium e engajadores. Utilize a estética de **Dark Mode**, painéis translúcidos (Glassmorphism), micro-animações (CSS transitions) e destaque de código. Nunca crie slides com visual "básico" ou monocromático simples.
- **Interatividade:** Sempre que possível em aulas de código, implemente simulações passo a passo (como um botão "Play" que destaca a execução linha a linha sincronizada com o Output) para tornar a lógica tangível para os alunos.

## 6. Atualização Automática de Preferências (Auto-registro)
- Toda vez que o usuário expressar uma nova preferência, diretriz, fluxo de trabalho ou correção de padrão durante a conversa, OU quando o assistente encontrar a solução para um problema complexo/ficar travado em algo, o assistente deve **proativamente editar este arquivo (AGENTS.md)** para registrar o aprendizado. O objetivo é garantir que o conhecimento e as soluções sejam mantidas para as futuras conversas, evitando repetir erros ou pedir as mesmas instruções.

## 7. Fluxo de Git e Deploy
- As aulas estão hospedadas em um site estático via GitHub Pages (no domínio learn.scorpionbits.com para o estúdio Scorpion Bits).
- Sendo assim, **sempre pergunte explicitamente por permissão** antes de executar um comando `git push`. Nunca faça o push automaticamente sem o aval do usuário.
