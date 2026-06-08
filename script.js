// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let currentSection = '';
    
    // Only on home page
    if (document.querySelector('.hero')) {
        const sections = document.querySelectorAll('section[id], .hero, .why-section, .services-showcase, .how-works, .trust-security');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.id || section.className.split(' ')[0];
            }
        });
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Booking Wizard (Step-by-step booking)
const bookingSteps = document.querySelectorAll('.booking-step');
const bookingFormSteps = document.querySelectorAll('.booking-form-step');
const serviceOptions = document.querySelectorAll('.service-option');
const workerCards = document.querySelectorAll('.worker-card-blog');
const nextStepBtns = document.querySelectorAll('.next-step');
const backStepBtns = document.querySelectorAll('.back-step');
const selectWorkerBtns = document.querySelectorAll('.select-worker');
const bookingForm = document.getElementById('bookingForm');

let selectedService = null;
let selectedWorker = null;

// Service selection
serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
        serviceOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedService = option.dataset.service;
        
        // Enable next button
        document.querySelectorAll('#step-1 .next-step')[0].disabled = false;
    });
});

// Worker selection
selectWorkerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        workerCards.forEach(card => card.classList.remove('selected'));
        btn.closest('.worker-card-blog').classList.add('selected');
        selectedWorker = btn.dataset.worker;
        
        // Enable next button
        document.querySelectorAll('#step-2 .next-step')[0].disabled = false;
    });
});

// Next step navigation
nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentStep = btn.closest('.booking-form-step');
        const currentStepNum = Array.from(bookingFormSteps).indexOf(currentStep) + 1;
        const nextStepNum = currentStepNum + 1;
        
        if (nextStepNum <= 3) {
            // Hide current step
            currentStep.classList.remove('active');
            
            // Show next step
            document.getElementById(`step-${nextStepNum}`).classList.add('active');
            
            // Update step indicators
            updateStepIndicators(nextStepNum);
            
            // Update summary on step 3
            if (nextStepNum === 3) {
                                const workerName = document.querySelector('.worker-card-blog.selected h3');
                const serviceNames = { plumbing: 'Сантехніка', electrical: 'Електрика', carpentry: 'Столярні роботи', hvac: 'Кліматичні системи', handyman: 'Майстер на дім', other: 'Інші послуги' };
                document.getElementById('summary-service').textContent = serviceNames[selectedService] || 'Послуга';
                document.getElementById('summary-worker').textContent = workerName ? workerName.textContent : 'Обраний майстер';
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Back step navigation
backStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentStep = btn.closest('.booking-form-step');
        const currentStepNum = Array.from(bookingFormSteps).indexOf(currentStep) + 1;
        const prevStepNum = currentStepNum - 1;
        
        if (prevStepNum >= 1) {
            currentStep.classList.remove('active');
            document.getElementById(`step-${prevStepNum}`).classList.add('active');
            updateStepIndicators(prevStepNum);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

function updateStepIndicators(stepNum) {
    bookingSteps.forEach(step => step.classList.remove('active'));
    document.querySelector(`[data-step="${stepNum}"]`).classList.add('active');
}

// Booking form validation and submission
if (bookingForm) {
    const bookingValidationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Zа-яА-ЯіїєІЇЄ'`\s-]{2,}$/,
            message: {
                required: 'Вкажіть ім'я та прізвище',
                minLength: 'Введіть щонайменше 2 символи',
                pattern: 'Ім'я може містити лише літери'
            }
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: {
                required: 'Вкажіть email',
                pattern: 'Введіть коректний email'
            }
        },
        phone: {
            required: true,
            pattern: /^[\d\s\-\+\(\)]{10,}$/,
            message: {
                required: 'Вкажіть телефон',
                pattern: 'Введіть коректний номер телефону'
            }
        },
        appointmentDate: {
            required: true,
            message: {
                required: 'Оберіть бажану дату'
            }
        },
        description: {
            required: true,
            minLength: 10,
            message: {
                required: 'Опишіть задачу',
                minLength: 'Опис має містити щонайменше 10 символів'
            }
        },
        agree: {
            required: true,
            message: {
                required: 'Потрібно погодитися з умовами'
            }
        }
    };

    function validateBookingField(fieldName, value, isCheckbox = false) {
        const rules = bookingValidationRules[fieldName];
        if (!rules) return { valid: true };

        if (rules.required) {
            if (isCheckbox) {
                const field = document.getElementById(fieldName);
                if (!field.checked) {
                    return { valid: false, error: rules.message.required };
                }
            } else if (!value.trim()) {
                return { valid: false, error: rules.message.required };
            }
        }

        if (rules.minLength && value.length < rules.minLength) {
            return { valid: false, error: rules.message.minLength };
        }

        if (rules.pattern && value && !rules.pattern.test(value)) {
            return { valid: false, error: rules.message.pattern };
        }

        return { valid: true };
    }

    function showBookingError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearBookingError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    const bookingInputs = bookingForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea');
    
    bookingInputs.forEach(input => {
        if (bookingValidationRules[input.name]) {
            input.addEventListener('blur', () => {
                const validation = validateBookingField(input.name, input.value);
                if (!validation.valid) {
                    showBookingError(input.name, validation.error);
                } else {
                    clearBookingError(input.name);
                }
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    const validation = validateBookingField(input.name, input.value);
                    if (validation.valid) {
                        clearBookingError(input.name);
                    }
                }
            });
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear all errors first
        Object.keys(bookingValidationRules).forEach(fieldName => {
            clearBookingError(fieldName);
        });

        let isValid = true;
        
        // Validate all fields
        Object.keys(bookingValidationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const isCheckbox = field.type === 'checkbox';
                const value = isCheckbox ? '' : field.value;
                const validation = validateBookingField(fieldName, value, isCheckbox);
                if (!validation.valid) {
                    showBookingError(fieldName, validation.error);
                    isValid = false;
                }
            }
        });

        if (isValid) {
            const successMessage = bookingForm.querySelector('.form-success');
            if (successMessage) {
                successMessage.style.display = 'block';
                bookingForm.reset();
                setTimeout(() => {
                    // Reset wizard
                    resetBookingWizard();
                }, 3000);
            }
        }
    });
}

function resetBookingWizard() {
    // Reset all selections
    selectedService = null;
    selectedWorker = null;
    
    // Reset step indicators and forms
    bookingFormSteps.forEach(step => step.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    updateStepIndicators(1);
    
    // Reset selections
    serviceOptions.forEach(o => o.classList.remove('selected'));
    workerCards.forEach(c => c.classList.remove('selected'));
    
    // Disable next buttons
    nextStepBtns.forEach(btn => btn.disabled = true);
    
    // Hide success message
    const successMessage = bookingForm.querySelector('.form-success');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

// FAQ Accordion functionality
const faqAccordionHeaders = document.querySelectorAll('.faq-accordion-header');

faqAccordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.closest('.faq-accordion-item');
        const isActive = accordionItem.classList.contains('active');

        // Close all other accordion items
        document.querySelectorAll('.faq-accordion-item.active').forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current item
        if (isActive) {
            accordionItem.classList.remove('active');
        } else {
            accordionItem.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
     threshold: 0.1,
     rootMargin: '0px 0px -50px 0px'
 };

 const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             entry.target.style.opacity = '1';
             entry.target.style.transform = 'translateY(0)';
             observer.unobserve(entry.target);
         }
     });
 }, observerOptions);

 document.querySelectorAll('.why-card, .service-showcase-card, .step-item, .step-card').forEach(el => {
     el.style.opacity = '0';
     el.style.transform = 'translateY(20px)';
     el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
     observer.observe(el);
 });

 console.log('%cСайт Logo завантажено', 'color: #5B6FFF; font-size: 16px; font-weight: bold;');
