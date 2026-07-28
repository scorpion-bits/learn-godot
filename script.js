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
        'slide-12': [
            { line: 4, delay: 800 },
            { line: 5, delay: 800, output: "Player moving to the right" }
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
            
            const slideId = btn.closest('.slide').id;
            const script = simScripts[slideId];
            if (!script) return;
            
            btn.classList.add('running');
            btn.innerHTML = '⏳ Executando...';
            
            const codeWindow = btn.closest('.code-window');
            const lines = codeWindow.querySelectorAll('.code-line');
            const outputBox = codeWindow.querySelector('.output-content');
            
            // Reset
            lines.forEach(l => l.classList.remove('active'));
            if (outputBox) outputBox.innerHTML = '';
            const trackers = codeWindow.querySelectorAll(".tracker-val");
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

});
