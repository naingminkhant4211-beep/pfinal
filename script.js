document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------------------------------
       DOM ELEMENTS
       ---------------------------------------------------- */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast-popup');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const statNums = document.querySelectorAll('.stat-num');
    const sections = document.querySelectorAll('section[id]');
    
    /* ----------------------------------------------------
       SCROLL EFFECT FOR NAVBAR & BACK-TO-TOP
       ---------------------------------------------------- */
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Navbar glassmorphism toggle
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (scrollY > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled down
    
    /* ----------------------------------------------------
       MOBILE NAVIGATION MENU
       ---------------------------------------------------- */
    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Swap menu and close icon displays
        const menuIcon = mobileToggle.querySelector('.icon-menu');
        const closeIcon = mobileToggle.querySelector('.icon-close');
        
        if (navMenu.classList.contains('active')) {
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop background scroll
        } else {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }
    };
    
    mobileToggle.addEventListener('click', toggleMenu);
    
    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    /* ----------------------------------------------------
       ACTIVE SECTION NAVIGATION LINK INDICATOR
       ---------------------------------------------------- */
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Trigger active state when section is centered
    });
    
    sections.forEach(section => activeSectionObserver.observe(section));
    
    /* ----------------------------------------------------
       SCROLL-TRIGGERED FADE IN ANIMATIONS
       ---------------------------------------------------- */
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve once visible to prevent repeating animation when scrolling up/down
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    const revealSections = document.querySelectorAll('.fade-in-section');
    revealSections.forEach(sec => fadeObserver.observe(sec));
    
    /* ----------------------------------------------------
       SKILLS PROGRESS BARS FILL ANIMATION
       ---------------------------------------------------- */
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.skill-bar-fill');
                if (bar) {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress;
                }
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => skillsObserver.observe(card));
    
    /* ----------------------------------------------------
       STATISTICS COUNTER INCREMENT ANIMATION
       ---------------------------------------------------- */
    const countUp = (element) => {
        const targetText = element.getAttribute('data-count');
        const hasPlus = targetText.includes('+');
        const hasPercent = targetText.includes('%');
        
        // Parse numerical target
        const target = parseInt(targetText, 10);
        let current = 0;
        const duration = 2000; // Animation length in ms
        const steps = 60;
        const stepTime = duration / steps;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                element.textContent = `${target}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
            } else {
                element.textContent = `${Math.floor(current)}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
            }
        }, stepTime);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numSpan = entry.target.querySelector('.stat-num');
                if (numSpan) {
                    countUp(numSpan);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.4
    });
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => statsObserver.observe(card));
    
    /* ----------------------------------------------------
       CONTACT FORM SUBMIT UI FEEDBACK
       ---------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
            `;
            
            // Add CSS animation for spinner on the fly if needed
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
            
            // Simulate fake submission timeout
            setTimeout(() => {
                // Clear inputs
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalBtnContent;
                
                // Trigger Toast success popup
                toast.classList.add('show');
                
                // Hide toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
                
            }, 1500);
        });
    }
});
