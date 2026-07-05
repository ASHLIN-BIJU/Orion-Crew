// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Preloader Logic
    // ==========================================
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const bodyContainer = document.getElementById('body-container');
    
    // Pause hero animations initially
    const heroElements = document.querySelectorAll('#hero .slide-up');
    heroElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.opacity = '0';
    });

    let progress = 0;
    const duration = 2000; // 2 seconds total loading time
    const intervalTime = 20; 
    const step = (100 / (duration / intervalTime));

    const loadingInterval = setInterval(() => {
        progress += step;
        
        // Add a bit of randomness to make it look like real loading
        if (Math.random() > 0.8 && progress < 90) progress += Math.random() * 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            loadingBar.style.width = '100%';
            loadingText.innerText = '100%';
            
            setTimeout(() => {
                // Slide preloader up
                preloader.style.transform = 'translateY(-100%)';
                // Restore scrolling
                bodyContainer.classList.remove('overflow-hidden');
                
                // Start hero animations
                setTimeout(() => {
                    heroElements.forEach(el => {
                        el.style.animationPlayState = 'running';
                    });
                    setTimeout(() => preloader.remove(), 1200);
                }, 400); // Wait a bit while preloader is sliding up
                
            }, 400); // Small pause at 100%
        } else {
            loadingBar.style.width = `${progress}%`;
            loadingText.innerText = `${Math.floor(progress)}%`;
        }
    }, intervalTime);

    // ==========================================
    // Form Logic
    // ==========================================
    const form = document.getElementById('membership-form');
    const formContainer = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');
    const successIcon = document.getElementById('success-icon');
    const submitBtn = document.getElementById('submit-btn');

    // ==========================================
    // CONFIGURATION
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1MiIkY7wmOufqO-HPICpPWnyGJo8fEAJu71K-IYt4ov4/formResponse';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> <span>Submitting...</span>`;
        lucide.createIcons();
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            // Using no-cors mode because Google Forms doesn't allow cross-origin POST requests by default.
            // This prevents reading the response, but successfully submits the data to Google Sheets.
            await fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Handle success
            showSuccess();
            form.reset();

        } catch (error) {
            console.error('Submission failed:', error);
            alert('There was a problem submitting your form. Please try again or check your connection.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnContent;
            lucide.createIcons();
            submitBtn.disabled = false;
        }
    });

    // Handle "Submit Another Response"
    resetBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        successMessage.classList.remove('fade-in');
        formContainer.classList.remove('hidden');
        successIcon.style.transform = 'scale(0)';
        
        // Add entry animation to form container to make it smooth
        formContainer.style.animation = 'none';
        formContainer.offsetHeight; // trigger reflow
        formContainer.style.animation = null;
        formContainer.classList.add('slide-up');
    });

    // Show Success Message and Animate Icon
    function showSuccess() {
        formContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.classList.add('fade-in');
        
        // Animate checkmark icon after a slight delay
        setTimeout(() => {
            successIcon.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            successIcon.style.transform = 'scale(1)';
        }, 150);
    }

    // ==========================================
    // Intersection Observer for Scroll Animations
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // ==========================================
    // Parallax Scrolling Effect
    // ==========================================
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        requestAnimationFrame(() => {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
                // Use translateY for smooth 2D transform
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    });
});
