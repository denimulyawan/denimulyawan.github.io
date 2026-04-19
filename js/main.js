// ==================== MAIN JAVASCRIPT FOR PORTFOLIO WEBSITE ====================

document.addEventListener('DOMContentLoaded', function() {
    // ==================== MOBILE NAVIGATION TOGGLE ====================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Function to close mobile menu
    function closeMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Toggle menu when clicking hamburger
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
            
            // Update active link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // [FIX] Close mobile menu when scrolling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (navMenu && navMenu.classList.contains('active')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                closeMobileMenu();
            }, 100);
        }
    });
    
    // [FIX] Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu || !navToggle) return;
        
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // [FIX] Close mobile menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // ==================== UPDATE ACTIVE LINK ON SCROLL ====================
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // ==================== BACK TO TOP BUTTON ====================
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // ==================== ANIMATE ELEMENTS ON SCROLL ====================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // ==================== NEWSLETTER FORM ====================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            input.value = '';
            
            // Show temporary message
            const originalButtonText = newsletterForm.querySelector('button').innerHTML;
            newsletterForm.querySelector('button').innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                newsletterForm.querySelector('button').innerHTML = originalButtonText;
            }, 2000);
        });
    }
    
    // ==================== SMOOTH SCROLLING FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                closeMobileMenu(); // Close menu if open before scrolling
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== HOVER EFFECT FOR CERTIFICATION ITEMS ====================
    const certItems = document.querySelectorAll('.certification-item');
    certItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ==================== INITIALIZE ANIMATIONS FOR HERO ELEMENTS ====================
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-text h1, .hero-text h5, .hero-roles, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }, 100);
    
    // ==================== TYPING ANIMATION ====================
    initTypingAnimation();
    
    // ==================== ANIMATE EXPERIENCE ITEMS ====================
    function animateExperienceItems() {
        const experienceItems = document.querySelectorAll('.animate-list-item');
        
        experienceItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animationPlayState = 'running';
            }
        });
    }
    
    window.addEventListener('scroll', animateExperienceItems);
    animateExperienceItems(); // Run once on load
    
    // ==================== HOVER EFFECTS FOR TECH TAGS ====================
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ==================== TELEGRAM FORM HANDLER ====================
    handleContactForm();
});

// ==================== TYPING ANIMATION FOR HERO ROLES ====================
function initTypingAnimation() {
    const roleElement = document.getElementById('typing-role');
    const indicators = document.querySelectorAll('.indicator');
    const roles = ['IT Infrastructure Engineer', 'Network Engineer', 'Cloud Engineer', 'Security Engineer'];
    let currentIndex = 0;
    
    if (!roleElement) return;
    
    // Function to change role with typing animation
    function changeRole(newRole, index) {
        // Remove active class from all indicators
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current indicator
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        // Typing animation
        let currentText = '';
        let charIndex = 0;
        
        // Clear current text first
        const clearText = setInterval(() => {
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                roleElement.textContent = currentText;
            } else {
                clearInterval(clearText);
                
                // Start typing new text
                const typeText = setInterval(() => {
                    if (charIndex < newRole.length) {
                        currentText += newRole.charAt(charIndex);
                        roleElement.textContent = currentText;
                        charIndex++;
                    } else {
                        clearInterval(typeText);
                    }
                }, 50);
            }
        }, 30);
    }
    
    // Auto rotate roles every 3 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % roles.length;
        changeRole(roles[currentIndex], currentIndex);
    }, 3000);
    
    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            changeRole(roles[currentIndex], currentIndex);
        });
    });
}

// ==================== TELEGRAM FORM HANDLER ====================
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm) return;
    
    // Helper function to show messages
    function showFormMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('❌ Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('❌ Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to Vercel API endpoint
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success
                showFormMessage('✅ Thank you! Your message has been sent successfully. I will contact you soon.', 'success');
                contactForm.reset();
                
                // Reset floating labels
                const allInputs = contactForm.querySelectorAll('input, textarea');
                allInputs.forEach(input => {
                    const label = input.previousElementSibling;
                    if (label) label.classList.remove('active');
                });
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    if (formMessage && formMessage.style.display !== 'none') {
                        formMessage.style.display = 'none';
                    }
                }, 5000);
                
            } else {
                // Error from server
                showFormMessage(`❌ Error: ${result.error || 'Failed to send message'}`, 'error');
            }
            
        } catch (error) {
            // Network error
            showFormMessage('❌ Network error. Please try again later.', 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
        }
    });
}