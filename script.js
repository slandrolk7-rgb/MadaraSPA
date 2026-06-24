/* ========================================
   Madara Spa - Premium Wellness Website
   JavaScript Functionality
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const loadingScreen = document.getElementById('loadingScreen');
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop = document.getElementById('backToTop');
    const toast = document.getElementById('toast');
    const bookingForm = document.getElementById('bookingForm');
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialsDots = document.getElementById('testimonialsDots');
    const navLinks = document.querySelectorAll('.nav-link');

    // ========================================
    // Loading Screen
    // ========================================
    function hideLoadingScreen() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Initialize scroll animations after loading
            initScrollAnimations();
        }, 2000);
    }

    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen);
    }

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ========================================
    // Dark/Light Mode Toggle
    // ========================================
    function initTheme() {
        const savedTheme = localStorage.getItem('madara-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('madara-theme', 'light');
            updateThemeIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('madara-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = isDark ? '☾' : '☀';
    }

    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // ========================================
    // Smooth Scroll & Active Navigation
    // ========================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Back to Top Button
    // ========================================
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    // ========================================
    // Scroll Animations (AOS-like)
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay if specified
                    const delay = entry.target.getAttribute('data-aos-delay');
                    if (delay) {
                        setTimeout(() => {
                            entry.target.classList.add('aos-animate');
                        }, parseInt(delay));
                    } else {
                        entry.target.classList.add('aos-animate');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Testimonials Slider
    // ========================================
    let currentTestimonial = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonialCards.length;
    let autoSlideInterval;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === index) {
                card.classList.add('active');
            } else if (i < index) {
                card.classList.add('prev');
            }
        });

        // Update dots
        const dots = testimonialsDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(next);
    }

    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(prev);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 6000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    testimonialNext.addEventListener('click', () => {
        stopAutoSlide();
        nextTestimonial();
        startAutoSlide();
    });

    testimonialPrev.addEventListener('click', () => {
        stopAutoSlide();
        prevTestimonial();
        startAutoSlide();
    });

    // Dot navigation
    testimonialsDots.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showTestimonial(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
    testimonialsSlider.addEventListener('mouseleave', startAutoSlide);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            stopAutoSlide();
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
            startAutoSlide();
        }
    }

    startAutoSlide();

    // ========================================
    // Booking Form
    // ========================================
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        setTimeout(() => {
            // Show success toast
            showToast('Appointment request sent successfully! We will contact you shortly.');

            // Reset form
            this.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });

    // ========================================
    // Toast Notification
    // ========================================
    function showToast(message) {
        const toastMessage = toast.querySelector('.toast-message');
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // ========================================
    // Gallery Lightbox (Simple)
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const desc = this.querySelector('p').textContent;
            showToast(`${title} - ${desc} (Gallery feature: Replace with actual images)`);
        });
    });

    // ========================================
    // Parallax Effect for Hero
    // ========================================
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg-image');
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
        }
    }

    // Only enable parallax on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ========================================
    // Counter Animation for Stats
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text);
                    const suffix = text.replace(/[0-9]/g, '');

                    if (!isNaN(number)) {
                        animateValue(target, 0, number, 2000, suffix);
                    }
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateValue(element, start, end, duration, suffix) {
        const range = end - start;
        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));
        stepTime = Math.max(stepTime, minTimer);

        let startTime = new Date().getTime();
        let endTime = startTime + duration;
        let timer;

        function run() {
            let now = new Date().getTime();
            let remaining = Math.max((endTime - now) / duration, 0);
            let value = Math.round(end - (remaining * range));
            element.textContent = value + suffix;

            if (value == end) {
                clearInterval(timer);
            }
        }

        timer = setInterval(run, stepTime);
        run();
    }

    // Initialize counter animation
    setTimeout(animateCounters, 2500);

    // ========================================
    // Service Card Hover Effects
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // Feature Card 3D Tilt Effect
    // ========================================
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // Navbar Link Hover Sound (Optional)
    // ========================================
    // Uncomment to add subtle hover sounds
    /*
    const hoverSound = new Audio();
    hoverSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE...';

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.volume = 0.1;
            hoverSound.play().catch(() => {});
        });
    });
    */

    // ========================================
    // Performance: Lazy Load Images (when added)
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Console Easter Egg
    // ========================================
    console.log('%c✦ Madara Spa ✦', 'font-size: 24px; font-weight: bold; color: #c9a96e;');
    console.log('%cWelcome to our digital sanctuary.', 'font-size: 14px; color: #8b7355;');
    console.log('%cDesigned with care by Janith Buddhika', 'font-size: 12px; color: #8a7d6b;');

})();