// ============================================
// MAIN JAVASCRIPT - Interactive Features
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // === NAVIGATION ===
    initNavigation();

    // === ANIMATIONS ===
    initScrollAnimations();

    // === COUNTER ANIMATIONS ===
    initCounters();

    // === LAZY LOADING ===
    initLazyLoading();

    // === CAROUSEL ===
    initCarousel();
});

// === CAROUSEL FUNCTIONS ===
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track ? track.children : []);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselDots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const updateSlider = (index) => {
        const slideWidth = 100 / getItemsPerView();
        track.style.transform = `translateX(-${index * slideWidth}%)`;

        // Update dots - only one dot per slide if we want, or adjust dot count
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        currentIndex = index;
    };

    function getItemsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    const nextSlide = () => {
        let index = currentIndex + 1;
        const totalSlides = slides.length;
        const itemsPerView = getItemsPerView();

        if (index > totalSlides - itemsPerView) {
            index = 0;
        }
        updateSlider(index);
    };

    const prevSlide = () => {
        let index = currentIndex - 1;
        const totalSlides = slides.length;
        const itemsPerView = getItemsPerView();

        if (index < 0) {
            index = totalSlides - itemsPerView;
        }
        updateSlider(index);
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    // Event Listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', stopAutoPlay);
    track.parentElement.addEventListener('mouseleave', startAutoPlay);

    // Initial start
    startAutoPlay();
}

// === NAVIGATION FUNCTIONS ===
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Sticky navbar on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (navMenu && navToggle) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// === COUNTER ANIMATIONS ===
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// === LAZY LOADING ===
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// === FORM VALIDATION ===
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        const errorElement = input.parentElement.querySelector('.form-error');

        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--error-color)';
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.style.display = 'block';
            }
        } else {
            input.style.borderColor = 'var(--gray-200)';
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                    errorElement.style.display = 'block';
                }
            }
        }
    });

    return isValid;
}

// === MODAL FUNCTIONS ===
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Fade in animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// === UTILITY FUNCTIONS ===

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        openModal,
        closeModal,
        formatCurrency,
        debounce
    };
}
