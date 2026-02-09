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

    // === MODERN ENHANCEMENTS ===
    initScrollProgress();
    initParticles();
    initTypingEffect();
    initStaggeredAnimations();
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

// ============================================
// MODERN ENHANCEMENTS - Eye-catching Effects
// ============================================

// === SCROLL PROGRESS BAR ===
function initScrollProgress() {
    // Create progress bar element if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);
    }

    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// === PARTICLE GENERATION ===
function initParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Check if particles container already exists
    let particlesContainer = heroSection.querySelector('.particles-container');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.appendChild(particlesContainer);
    }

    // Create particles
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning and animation delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        particlesContainer.appendChild(particle);
    }

    // Add floating shapes
    let floatingShapes = heroSection.querySelector('.floating-shapes');
    if (!floatingShapes) {
        floatingShapes = document.createElement('div');
        floatingShapes.className = 'floating-shapes';
        floatingShapes.innerHTML = `
            <div class="floating-shape"></div>
            <div class="floating-shape"></div>
            <div class="floating-shape"></div>
        `;
        heroSection.appendChild(floatingShapes);
    }
}

// === TYPING EFFECT ===
function initTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle || heroSubtitle.dataset.typed === 'true') return;

    const originalText = heroSubtitle.textContent.trim();
    heroSubtitle.textContent = '';
    heroSubtitle.dataset.typed = 'true';

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    heroSubtitle.appendChild(cursor);

    let charIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    function typeChar() {
        if (charIndex < originalText.length) {
            heroSubtitle.insertBefore(
                document.createTextNode(originalText.charAt(charIndex)),
                cursor
            );
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                cursor.style.display = 'none';
            }, 2000);
        }
    }

    // Start typing after a short delay
    setTimeout(typeChar, 500);
}

// === STAGGERED SCROLL ANIMATIONS ===
function initStaggeredAnimations() {
    // Add stagger-item class to cards within grids
    const gridCards = document.querySelectorAll('.grid .card');
    gridCards.forEach((card, index) => {
        if (!card.classList.contains('stagger-item')) {
            card.classList.add('stagger-item');
            card.classList.add('card-shimmer'); // Add shimmer effect
        }
    });

    // Add stat-card class to quick stats
    const statCards = document.querySelectorAll('.grid-4 .card');
    statCards.forEach(card => {
        if (!card.classList.contains('stat-card')) {
            card.classList.add('stat-card');
        }
    });

    // Intersection Observer for staggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stagger-item').forEach(item => {
        staggerObserver.observe(item);
    });
}

// === ENHANCED HERO SETUP ===
function enhanceHero() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle && !heroTitle.classList.contains('gradient-text-animated')) {
        // Add animated gradient to title on hover
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.classList.add('gradient-text-animated');
        });
        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.classList.remove('gradient-text-animated');
        });
    }

    // Add scroll indicator if not present
    if (hero && !hero.querySelector('.scroll-indicator')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = `
            <div class="scroll-indicator-mouse">
                <div class="scroll-indicator-wheel"></div>
            </div>
        `;
        hero.appendChild(scrollIndicator);

        // Click to scroll down
        scrollIndicator.addEventListener('click', () => {
            const nextSection = hero.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add glow to primary CTA button
    const ctaButton = document.querySelector('.hero-buttons .btn-primary');
    if (ctaButton && !ctaButton.classList.contains('btn-glow')) {
        ctaButton.classList.add('btn-glow');
    }
}

// Initialize hero enhancements
document.addEventListener('DOMContentLoaded', enhanceHero);
