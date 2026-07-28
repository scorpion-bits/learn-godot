document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const currentSlideEl = document.getElementById('current-slide-num');
    const totalSlidesEl = document.getElementById('total-slides-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    totalSlidesEl.textContent = totalSlides;

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
        if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
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

    // Initialize
    updateSlides();

    // --- CODE SIMULATOR LOGIC ---
    
    // Auto-wrap code lines in spans for animation
    document.querySelectorAll('.code-content code').forEach(codeBlock => {
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

    const simScripts = {
        'btn-play-sem': [
            { line: 2, delay: 400 },
            { line: 4, delay: 600 },
            { line: 7, delay: 600 },
            { line: 8, delay: 600, output: "Nota B" },
            { line: 10, delay: 600 },
            { line: 11, delay: 600, output: "Nota C" }
        ],
        'btn-play-com': [
            { line: 2, delay: 400 },
            { line: 4, delay: 600 },
            { line: 7, delay: 600 },
            { line: 8, delay: 600, output: "Nota B" }
        ],
        'slide-15': [
            { line: 2, delay: 600 }, { line: 3, delay: 600, output: "0" },
            { line: 2, delay: 600 }, { line: 3, delay: 600, output: "1" },
            { line: 2, delay: 600 }, { line: 3, delay: 600, output: "2" },
            { line: 2, delay: 600 }, { line: 3, delay: 600, output: "3" },
            { line: 2, delay: 600 }, { line: 3, delay: 600, output: "4" }
        ],
        'slide-16': [
            { line: 2, delay: 800, updateTracker: { id: 'health-val', value: '3' } },
            { line: 4, delay: 600 }, { line: 5, delay: 600, output: "Ainda estou vivo!" }, { line: 6, delay: 600, updateTracker: { id: 'health-val', value: '2' } },
            { line: 4, delay: 600 }, { line: 5, delay: 600, output: "Ainda estou vivo!" }, { line: 6, delay: 600, updateTracker: { id: 'health-val', value: '1' } },
            { line: 4, delay: 600 }, { line: 5, delay: 600, output: "Ainda estou vivo!" }, { line: 6, delay: 600, updateTracker: { id: 'health-val', value: '0' } },
            { line: 4, delay: 600 } // condition fails
        ]
    };

    document.querySelectorAll('.play-sim-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (btn.classList.contains('running')) return;
            
            const scriptId = btn.id || btn.closest('.slide').id;
            const script = simScripts[scriptId];
            if (!script) return;
            
            btn.classList.add('running');
            btn.innerHTML = '⏳ Executando...';
            
            const codeWindow = btn.closest('.code-window');
            const context = btn.closest('.code-tab-content') || codeWindow;
            const lines = context.querySelectorAll('.code-line');
            const outputBox = context.querySelector('.output-content');
            
            // Reset
            lines.forEach(l => l.classList.remove('active'));
            if (outputBox) outputBox.innerHTML = '';
            const trackers = context.querySelectorAll(".tracker-val");
            trackers.forEach(t => t.textContent = t.dataset.initial || "0");
            
            for (let step of script) {
                lines.forEach(l => l.classList.remove('active'));
                
                const lineEl = Array.from(lines).find(l => parseInt(l.dataset.line) === step.line);
                if (lineEl) {
                    lineEl.classList.add('active');
                }
                
                if (step.output && outputBox) {
                    outputBox.innerHTML += `<span style="color: #c3e88d;">${step.output}</span><br>`;
                }
                
                
                if (step.updateTracker) {
                    const t = document.getElementById(step.updateTracker.id);
                    if (t) {
                        t.textContent = step.updateTracker.value;
                        t.classList.add("bump");
                        setTimeout(() => t.classList.remove("bump"), 300);
                    }
                }
                
                // Wait delay
                await new Promise(r => setTimeout(r, step.delay));
            }
            
            lines.forEach(l => l.classList.remove('active'));
            btn.classList.remove('running');
            btn.innerHTML = '▶ Executar Código';
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

    // --- GLOBAL TIMER LOGIC ---
    const startTimerBtn = document.getElementById('startTimerBtn');
    const timerDisplay = document.getElementById('playtest-timer');
    let timerInterval;

    if (startTimerBtn && timerDisplay) {
        startTimerBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            let timer = 900; 

            startTimerBtn.innerHTML = "⏱ Rodando...";
            startTimerBtn.style.opacity = "0.5";
            startTimerBtn.style.pointerEvents = "none";
            timerDisplay.style.color = "#c592ff";
            timerDisplay.style.textShadow = "0 0 20px rgba(197, 146, 255, 0.8)";

            timerInterval = setInterval(function () {
                let minutes = parseInt(timer / 60, 10);
                let seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                timerDisplay.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "00:00";
                    startTimerBtn.innerHTML = "Tempo Esgotado!";
                    timerDisplay.style.color = "#ef4444";
                    timerDisplay.style.textShadow = "0 0 20px rgba(239, 68, 68, 0.8)";
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