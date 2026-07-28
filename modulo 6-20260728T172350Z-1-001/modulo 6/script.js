document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Counter
        const currentStr = String(currentSlide + 1).padStart(2, '0');
        const totalStr = String(totalSlides).padStart(2, '0');
        slideCounter.textContent = `${currentStr} / ${totalStr}`;

        // Update Buttons
        prevBtn.disabled = currentSlide === 0;

        if (currentSlide === totalSlides - 1) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    }

    // Button Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Timer Logic for Slide 10
    const startTimerBtn = document.getElementById('startTimerBtn');
    const timerDisplay = document.getElementById('playtest-timer');
    let timerInterval;

    if (startTimerBtn && timerDisplay) {
        startTimerBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            let timer = 900; // 10 minutes

            startTimerBtn.textContent = "⏱ Rodando...";
            startTimerBtn.style.opacity = "0.5";
            startTimerBtn.style.pointerEvents = "none";
            timerDisplay.style.color = "#c592ff";

            timerInterval = setInterval(function () {
                let minutes = parseInt(timer / 60, 10);
                let seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                timerDisplay.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "00:00";
                    startTimerBtn.textContent = "Tempo Esgotado!";
                    timerDisplay.style.color = "#ff4d4d";
                }
            }, 1000);
        });
    }

    // Initialize
    updateSlides();
});
