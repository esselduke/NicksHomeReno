/**
 * NicksHomeReno - Main JavaScript
 * Vanilla JS | No dependencies | WCAG AA compliant
 */

(function() {
    'use strict';

    // ============================================
    // Utility Functions
    // ============================================
    
    const trapFocus = (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', handleTabKey);
        return () => element.removeEventListener('keydown', handleTabKey);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ============================================
    // Header Scroll Effect
    // ============================================
    
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', debounce(handleScroll, 10));

    // ============================================
    // Mobile Navigation
    // ============================================
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('.nav__link');
    let removeFocusTrap = null;

    const openMenu = () => {
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        removeFocusTrap = trapFocus(navMenu);
        
        // Focus first link
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav__link');
            if (firstLink) firstLink.focus();
        }, 100);
    };

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (removeFocusTrap) {
            removeFocusTrap();
            removeFocusTrap = null;
        }
        navToggle.focus();
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-open') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });

    // ============================================
    // Services Card Expandables
    // ============================================
    
    const serviceToggles = document.querySelectorAll('.services__card-toggle');

    serviceToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const detailId = this.getAttribute('aria-controls');
            const detail = document.getElementById(detailId);

            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                detail.setAttribute('hidden', '');
                this.textContent = 'Learn more';
            } else {
                this.setAttribute('aria-expanded', 'true');
                detail.removeAttribute('hidden');
                this.textContent = 'Show less';
            }
        });
    });

    // ============================================
    // Gallery Lightbox
    // ============================================
    
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt
        };
    });

    const openLightbox = (index) => {
        currentImageIndex = index;
        lightboxImage.src = images[index].src;
        lightboxImage.alt = images[index].alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image: ${images[index].alt}`);
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // ============================================
    // FAQ Accordion
    // ============================================
    
    const faqQuestions = document.querySelectorAll('.faq__question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answerId = this.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);

            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherId = q.getAttribute('aria-controls');
                    const otherAnswer = document.getElementById(otherId);
                    if (otherAnswer) {
                        otherAnswer.setAttribute('hidden', '');
                    }
                }
            });

            // Toggle current FAQ
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.setAttribute('hidden', '');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.removeAttribute('hidden');
            }
        });
    });

    // ============================================
    // Contact Form Validation & Submission
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Please enter your full name';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        },
        phone: (value) => {
            if (!value.trim()) return 'Please enter your phone number';
            const phoneRegex = /^[\d\s\(\)\-\+\.]{10,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'Please enter your email address';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        },
        service: (value) => {
            if (!value) return 'Please select a service';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'Please enter project details';
            if (value.trim().length < 10) return 'Please provide more details (at least 10 characters)';
            return '';
        }
    };

    const showError = (fieldName, message) => {
        const input = document.getElementById(fieldName);
        const errorSpan = document.getElementById(`${fieldName}Error`);
        
        if (input && errorSpan) {
            input.classList.add('error');
            errorSpan.textContent = message;
            input.setAttribute('aria-invalid', 'true');
        }
    };

    const clearError = (fieldName) => {
        const input = document.getElementById(fieldName);
        const errorSpan = document.getElementById(`${fieldName}Error`);
        
        if (input && errorSpan) {
            input.classList.remove('error');
            errorSpan.textContent = '';
            input.setAttribute('aria-invalid', 'false');
        }
    };

    const validateField = (fieldName) => {
        const input = document.getElementById(fieldName);
        if (!input) return true;

        const value = input.value;
        const validator = validators[fieldName];
        
        if (validator) {
            const error = validator(value);
            if (error) {
                showError(fieldName, error);
                return false;
            } else {
                clearError(fieldName);
                return true;
            }
        }
        return true;
    };

    // Real-time validation on blur
    ['name', 'phone', 'email', 'service', 'message'].forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
            input.addEventListener('blur', () => validateField(fieldName));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(fieldName);
                }
            });
        }
    });

    const createMailtoLink = (formData) => {
        const subject = encodeURIComponent('New Quote Request – NicksHomeReno');
        const body = encodeURIComponent(
            `New quote request from ${formData.name}\n\n` +
            `Contact Information:\n` +
            `Name: ${formData.name}\n` +
            `Phone: ${formData.phone}\n` +
            `Email: ${formData.email}\n` +
            `${formData.address ? `Address/City: ${formData.address}\n` : ''}` +
            `\n` +
            `Project Details:\n` +
            `Service Needed: ${formData.service}\n` +
            `${formData.budget ? `Budget Range: ${formData.budget}\n` : ''}` +
            `${formData.startMonth ? `Preferred Start: ${formData.startMonth}\n` : ''}` +
            `\n` +
            `Message:\n${formData.message}\n\n` +
            `---\n` +
            `Submitted from nickshomereno.com`
        );
        
        return `mailto:nickshomereno@gmail.com?subject=${subject}&body=${body}`;
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success ? Promise.resolve() : Promise.reject();
        }
    };

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous messages
        formMessage.textContent = '';
        formMessage.className = 'contact__form-message';

        // Validate all fields
        const fieldsToValidate = ['name', 'phone', 'email', 'service', 'message'];
        let isValid = true;

        fieldsToValidate.forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        if (!isValid) {
            formMessage.textContent = 'Please fix the errors above and try again.';
            formMessage.classList.add('error');
            return;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            service: document.getElementById('service').value,
            budget: document.getElementById('budget').value,
            startMonth: document.getElementById('startMonth').value,
            message: document.getElementById('message').value
        };

        // Create mailto link and open
        const mailtoLink = createMailtoLink(formData);
        const mailtoWindow = window.open(mailtoLink, '_blank');

        // Create email text for fallback
        const emailText = 
            `To: nickshomereno@gmail.com\n` +
            `Subject: New Quote Request – NicksHomeReno\n\n` +
            `New quote request from ${formData.name}\n\n` +
            `Contact Information:\n` +
            `Name: ${formData.name}\n` +
            `Phone: ${formData.phone}\n` +
            `Email: ${formData.email}\n` +
            `${formData.address ? `Address/City: ${formData.address}\n` : ''}` +
            `\n` +
            `Project Details:\n` +
            `Service Needed: ${formData.service}\n` +
            `${formData.budget ? `Budget Range: ${formData.budget}\n` : ''}` +
            `${formData.startMonth ? `Preferred Start: ${formData.startMonth}\n` : ''}` +
            `\n` +
            `Message:\n${formData.message}\n\n` +
            `---\n` +
            `Submitted from nickshomereno.com`;

        // Show success message
        setTimeout(() => {
            if (!mailtoWindow || mailtoWindow.closed || typeof mailtoWindow.closed === 'undefined') {
                // Mailto was blocked, offer copy option
                formMessage.innerHTML = 
                    'Your email client may have blocked the request. ' +
                    '<button type="button" id="copyEmail" class="btn btn--primary" style="margin-top: 1rem;">Copy email content</button>';
                formMessage.classList.add('error');
                
                const copyButton = document.getElementById('copyEmail');
                copyButton.addEventListener('click', () => {
                    copyToClipboard(emailText)
                        .then(() => {
                            formMessage.textContent = 'Email content copied! Please paste into your email client and send to nickshomereno@gmail.com';
                            formMessage.className = 'contact__form-message success';
                        })
                        .catch(() => {
                            formMessage.textContent = 'Unable to copy. Please email nickshomereno@gmail.com directly.';
                            formMessage.classList.add('error');
                        });
                });
            } else {
                // Mailto opened successfully
                formMessage.textContent = 'Thanks! Your email draft has opened. Please review and send it to complete your quote request.';
                formMessage.classList.add('success');
                contactForm.reset();
                
                // Clear all error states
                fieldsToValidate.forEach(fieldName => clearError(fieldName));
            }
        }, 500);
    });

    // ============================================
    // Initialization Complete
    // ============================================
    
    console.log('NicksHomeReno website initialized');

})();