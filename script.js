document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const currentSlideEl = document.getElementById('current-slide-num');
    const totalSlidesEl = document.getElementById('total-slides-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const progressFillEl = document.getElementById('progress-fill');
    const progressTextEl = document.getElementById('progress-text');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    totalSlidesEl.textContent = totalSlides;

    // O número do slide na eyebrow é derivado da posição, não escrito à mão.
    // Antes, inserir ou remover um slide obrigava a renumerar todos os
    // seguintes na mão — e um número errado passa despercebido até a aula.
    slides.forEach((slide, index) => {
        const num = slide.querySelector('.eyebrow .num');
        if (num) num.textContent = String(index + 1).padStart(2, '0');
    });

    // --- AVISO DE CONTEÚDO CORTADO ---------------------------------------
    // Num slide mais alto que a tela o corte é invisível: o professor
    // simplesmente não apresenta o que ficou embaixo. Este indicador aparece
    // enquanto sobrar conteúdo e some ao chegar no fim da rolagem.
    const deck = document.querySelector('.deck');
    let scrollHint = null;

    if (deck) {
        scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.setAttribute('aria-hidden', 'true');
        scrollHint.innerHTML = '<span>continua abaixo</span><span class="chev">⌄</span>';
        deck.appendChild(scrollHint);
    }

    function updateScrollHint() {
        if (!deck) return;
        const slide = slides[currentSlideIndex];
        if (!slide) return;
        // 4px de tolerância: arredondamento sub-pixel faz scrollHeight ficar
        // 1-2px acima de clientHeight em slides que na prática cabem.
        const remaining = slide.scrollHeight - slide.clientHeight - slide.scrollTop;
        deck.classList.toggle('has-overflow', remaining > 4);
    }

    slides.forEach(slide => slide.addEventListener('scroll', updateScrollHint, { passive: true }));
    window.addEventListener('resize', updateScrollHint);

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        currentSlideEl.textContent = currentSlideIndex + 1;

        // Button states
        prevBtn.style.opacity = currentSlideIndex === 0 ? '0.4' : '1';
        prevBtn.style.pointerEvents = currentSlideIndex === 0 ? 'none' : 'auto';

        nextBtn.style.opacity = currentSlideIndex === totalSlides - 1 ? '0.4' : '1';
        nextBtn.style.pointerEvents = currentSlideIndex === totalSlides - 1 ? 'none' : 'auto';

        // Topbar progress bar (only present on the redesigned lesson decks)
        if (progressFillEl) {
            progressFillEl.style.width = (((currentSlideIndex + 1) / totalSlides) * 100) + '%';
        }
        if (progressTextEl) {
            progressTextEl.textContent = (currentSlideIndex + 1) + ' / ' + totalSlides;
        }

        // Todo slide começa do topo — sem isso, voltar a um slide já visitado
        // o traz rolado no meio.
        slides[currentSlideIndex].scrollTop = 0;
        updateScrollHint();
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Não sequestrar o teclado quando o foco está num controle que
        // legitimamente usa Espaço/setas (inputs, botões, <summary> das dicas).
        // (nodeType 1 = Element: o alvo pode ser o próprio document, que não tem .matches)
        const t = e.target;
        if (t && t.nodeType === 1 && (t.matches('input, textarea, select, button, summary') || t.isContentEditable)) return;

        // Space: o valor de e.key para a barra de espaço é ' ' (o literal),
        // não 'Space' — 'Space' é o e.code. Aceitamos os dois porque muitos
        // apresentadores/controles remotos de slide enviam a barra de espaço.
        if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space' || e.key === 'PageDown') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            currentSlideIndex = 0;
            updateSlides();
        } else if (e.key === 'End') {
            e.preventDefault();
            currentSlideIndex = totalSlides - 1;
            updateSlides();
        }
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    // --- NAVEGAÇÃO ENTRE MÓDULOS -----------------------------------------
    // Cada deck declara só quem ele é (<body data-module="...">); quem vem
    // antes e depois sai do manifesto em assets/course.js. Assim, inserir um
    // módulo no meio do curso não exige editar link nenhum nas aulas vizinhas.
    (function buildModuleNav() {
        const moduleId = document.body.dataset.module;
        const course = window.COURSE;
        if (!moduleId || !course || !document.querySelector('.presentation-controls')) return;

        const list = course.flat;
        const here = list.findIndex(m => m.slug === moduleId);
        if (here === -1) return;

        // Pula os módulos ainda indisponíveis: mandar o aluno para uma página
        // bloqueada seria pior do que não oferecer o link.
        const findOpen = step => {
            for (let i = here + step; i >= 0 && i < list.length; i += step) {
                if (list[i].state !== 'soon') return list[i];
            }
            return null;
        };

        const depth = (moduleId.match(/\//g) || []).length + 2; // lessons/<area>/<mod>/
        const toRoot = '../'.repeat(depth);
        const nav = document.createElement('div');
        nav.className = 'module-nav';

        // Módulos 3 e 4 foram unidos numa aula só, então o rótulo precisa
        // concordar no plural ("Módulos 3 e 4", não "Módulo 3 e 4").
        const label = mod => (mod.n.includes(' e ') ? 'Módulos ' : 'Módulo ') + mod.n;

        [['prev', findOpen(-1), '‹'], ['next', findOpen(1), '›']].forEach(([dir, mod, chev]) => {
            if (!mod) return;
            const a = document.createElement('a');
            a.className = 'module-nav-link ' + dir;
            a.href = toRoot + mod.path;
            if (mod.state === 'pdf') a.target = '_blank';
            a.innerHTML = dir === 'prev'
                ? '<span class="chev">' + chev + '</span><span class="mn-label">' + label(mod) + '</span>'
                : '<span class="mn-label">' + label(mod) + '</span><span class="chev">' + chev + '</span>';
            a.title = (dir === 'prev' ? 'Módulo anterior: ' : 'Próximo módulo: ') + mod.title;
            nav.appendChild(a);
        });

        if (nav.children.length) {
            document.querySelector('.presentation-controls').appendChild(nav);
        }
    })();

    // Initialize
    updateSlides();

    // As fontes web mudam a altura do texto ao carregar; remede depois delas
    // para não marcar (ou deixar de marcar) overflow com base no fallback.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateScrollHint);
    }

    // --- CODE SIMULATOR LOGIC ---
    
    // Devolve o contêiner que agrupa um simulador (aba de código ou janela
    // inteira). Usado tanto na preparação quanto na execução, para que os dois
    // sempre enxerguem o mesmo <code> e o mesmo painel de Output.
    function simContext(btn) {
        return btn.closest('.code-tab-content') || btn.closest('.code-window');
    }

    // Auto-wrap code lines in spans for animation.
    //
    // Só embrulhamos blocos que realmente pertencem a um simulador ("▶ Executar").
    // O wrapper quebra o innerHTML por '\n' e remonta cada linha num <span>, o que
    // destrói qualquer elemento que envolva MAIS DE UMA linha (o navegador reequilibra
    // a árvore e o elemento perde o restante do conteúdo). Blocos de código puramente
    // ilustrativos podem conter spans multi-linha propositais — como o destaque
    // interativo por tecla da Aula de Introdução à Programação — então ficam de fora.
    document.querySelectorAll('.play-sim-btn').forEach(btn => {
        const context = simContext(btn);
        if (!context) return;

        context.querySelectorAll('code').forEach(codeBlock => {
            // Skip if already wrapped
            if (codeBlock.querySelector('.code-line')) return;

            let lines = codeBlock.innerHTML.split('\n');
            let newHtml = '';
            lines.forEach((line, index) => {
                // Include empty lines to maintain line numbers properly
                newHtml += `<span class="code-line" data-line="${index + 1}">${line}</span>\n`;
            });
            codeBlock.innerHTML = newHtml;
        });
    });

    // A simulação é declarada no próprio HTML, no atributo data-sim do botão,
    // e não mais numa tabela aqui indexada pelo id do botão. Antes, mexer numa
    // linha de código de um slide exigia lembrar de vir renumerar os passos
    // neste arquivo — e o JS carregava conhecimento de aulas específicas.
    //
    // Formato de um passo:  <linha>[@atraso][#tracker=valor][> texto do Output]
    // Passos separados por ";". O atraso padrão é 600 ms.
    //
    //   data-sim="1@400; 2@700 > Hello, Godot!; 3@700 > Meu primeiro script!"
    //
    // O ">" delimita o texto de saída, então ele pode conter qualquer coisa;
    // @ e # só são lidos antes dele.
    const SIM_DEFAULT_DELAY = 600;

    function parseSim(spec) {
        return spec.split(';').reduce((steps, raw) => {
            const m = raw.trim().match(/^(\d+)(?:@(\d+))?(?:#([\w-]+)=(\S+))?(?:\s*>\s*(.*))?$/);
            if (m) {
                steps.push({
                    line: parseInt(m[1], 10),
                    delay: m[2] ? parseInt(m[2], 10) : SIM_DEFAULT_DELAY,
                    tracker: m[3] ? { id: m[3], value: m[4] } : null,
                    output: m[5] !== undefined ? m[5] : null
                });
            }
            return steps;
        }, []);
    }

    document.querySelectorAll('.play-sim-btn[data-sim]').forEach(btn => {
        const script = parseSim(btn.dataset.sim);
        if (!script.length) return;

        const idleLabel = btn.textContent.trim() || '▶ Executar';

        btn.addEventListener('click', async () => {
            if (btn.classList.contains('running')) return;

            btn.classList.add('running');
            btn.textContent = '⏳ Executando...';

            const context = simContext(btn);
            const lines = [...context.querySelectorAll('.code-line')];
            const outputBox = context.querySelector('.output-content');
            const clear = () => lines.forEach(l => l.classList.remove('active'));

            clear();
            if (outputBox) outputBox.textContent = '';
            context.querySelectorAll('.tracker-val').forEach(t => {
                t.textContent = t.dataset.initial || '0';
            });

            for (const step of script) {
                clear();

                const lineEl = lines.find(l => parseInt(l.dataset.line, 10) === step.line);
                if (lineEl) lineEl.classList.add('active');

                // textContent, não innerHTML: a saída é texto do aluno e não
                // deve ser interpretada como marcação.
                if (step.output !== null && outputBox) {
                    const out = document.createElement('span');
                    out.className = 'out-line';
                    out.textContent = step.output;
                    outputBox.appendChild(out);
                }

                if (step.tracker) {
                    const t = document.getElementById(step.tracker.id);
                    if (t) {
                        t.textContent = step.tracker.value;
                        t.classList.add('bump');
                        setTimeout(() => t.classList.remove('bump'), 300);
                    }
                }

                await new Promise(r => setTimeout(r, step.delay));
            }

            clear();
            btn.classList.remove('running');
            btn.textContent = idleLabel;
        });
    });


    // --- GLOBAL TABS LOGIC ---
    document.querySelectorAll('.godot-editor-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const layout = this.closest('.godot-editor-layout');
            if (!layout) return;
            
            layout.querySelectorAll('.godot-editor-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                layout.querySelectorAll('.godot-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                const targetContent = layout.querySelector('#' + targetId);
                if (targetContent) {
                    targetContent.style.display = 'block'; // or flex, depends. our css sets flex sometimes, but block for text. for .godot-tree we can use display='flex' wait, .godot-tree is flex. we should do style.display = '' so it uses CSS default.
                    targetContent.style.display = '';
                    targetContent.classList.add('active-tab'); // we can also just use CSS
                }
            }
        });
    });

    // --- CRONÔMETROS DOS CHECKPOINTS -------------------------------------
    // Antes existia um único cronômetro, com IDs fixos e 15 minutos cravados
    // no código. Com vários checkpoints por aula, cada caixa passa a declarar
    // a própria duração em data-minutes e o comportamento vem daqui.
    function setupTimer(box) {
        const display = box.querySelector('.timer-display');
        const btn = box.querySelector('.timer-btn');
        if (!display || !btn) return;

        const total = Math.round(parseFloat(box.dataset.minutes || '10') * 60);
        const format = secs => String(Math.floor(secs / 60)).padStart(2, '0') + ':' +
                               String(secs % 60).padStart(2, '0');
        let interval = null;

        display.textContent = format(total);

        btn.addEventListener('click', () => {
            clearInterval(interval);
            let left = total;

            box.classList.add('running');
            box.classList.remove('done');
            btn.disabled = true;
            btn.textContent = 'Rodando…';
            display.textContent = format(left);

            interval = setInterval(() => {
                left -= 1;
                if (left <= 0) {
                    clearInterval(interval);
                    display.textContent = '00:00';
                    box.classList.remove('running');
                    box.classList.add('done');
                    btn.disabled = false;
                    btn.textContent = 'Reiniciar';
                    return;
                }
                display.textContent = format(left);
            }, 1000);
        });
    }

    document.querySelectorAll('.timer-box[data-minutes]').forEach(setupTimer);

    // Compatibilidade: o deck do Módulo 6 usa a marcação antiga (IDs fixos).
    // Mantido intacto para não alterar uma aula de outro integrante.
    const legacyBtn = document.getElementById('startTimerBtn');
    const legacyDisplay = document.getElementById('playtest-timer');
    if (legacyBtn && legacyDisplay) {
        let legacyInterval;
        legacyBtn.addEventListener('click', () => {
            clearInterval(legacyInterval);
            let timer = 900;

            legacyBtn.innerHTML = '⏱ Rodando...';
            legacyBtn.style.opacity = '0.5';
            legacyBtn.style.pointerEvents = 'none';
            legacyDisplay.style.color = '#c592ff';
            legacyDisplay.style.textShadow = '0 0 20px rgba(197, 146, 255, 0.8)';

            legacyInterval = setInterval(function () {
                const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
                const seconds = String(timer % 60).padStart(2, '0');
                legacyDisplay.textContent = minutes + ':' + seconds;

                if (--timer < 0) {
                    clearInterval(legacyInterval);
                    legacyDisplay.textContent = '00:00';
                    legacyBtn.innerHTML = 'Tempo Esgotado!';
                    legacyDisplay.style.color = '#ef4444';
                    legacyDisplay.style.textShadow = '0 0 20px rgba(239, 68, 68, 0.8)';
                }
            }, 1000);
        });
    }


    // --- CODE WINDOW TABS LOGIC ---
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const window = this.closest('.code-window');
            if (!window) return;
            
            window.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                window.querySelectorAll('.code-tab-content').forEach(content => {
                    content.classList.remove('active-tab');
                    content.style.display = 'none';
                });
                
                const targetContent = window.querySelector('#' + targetId);
                if (targetContent) {
                    targetContent.classList.add('active-tab');
                    targetContent.style.display = 'block';
                }
            }
        });
    });

});