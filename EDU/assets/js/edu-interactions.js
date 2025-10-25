/**
 * SHAVUOT EDU - Foro de Leguminosas 2025-2026
 * Interacciones y funcionalidades específicas para la página EDU
 */

class EDUInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupPricingCards();
        this.setupCTAButtons();
        this.setupSmoothScrolling();
        this.setupCounterAnimations();
        this.setupParallaxEffect();
    }

    /**
     * Configurar animaciones de scroll
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        const animatedElements = document.querySelectorAll(
            '.strength-card, .pricing-card, .timeline-item, .section-header'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Funcionalidad de las tarjetas de precios
     */
    setupPricingCards() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            const button = card.querySelector('.plan-button');
            
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const planName = card.querySelector('.plan-name').textContent;
                    const planPrice = card.querySelector('.amount').textContent;
                    
                    this.handlePlanSelection(planName, planPrice);
                });
            }

            // Efecto hover mejorado
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('featured')) {
                    card.style.transform = 'scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }

    /**
     * Manejar selección de plan
     */
    handlePlanSelection(planName, planPrice) {
        // Crear modal de contacto
        const modal = this.createContactModal(planName, planPrice);
        document.body.appendChild(modal);
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Cerrar modal
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        [closeBtn, overlay].forEach(el => {
            if (el) {
                el.addEventListener('click', () => {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                });
            }
        });
    }

    /**
     * Crear modal de contacto
     */
    createContactModal(planName, planPrice) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>Contactar para ${planName}</h3>
                <p class="modal-price">Inversión: $${planPrice} USD</p>
                <form class="contact-form">
                    <div class="form-group">
                        <label for="company">Empresa</label>
                        <input type="text" id="company" name="company" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-name">Nombre de Contacto</label>
                        <input type="text" id="contact-name" name="contact-name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Mensaje</label>
                        <textarea id="message" name="message" rows="4" 
                                placeholder="Cuéntanos sobre tu empresa y objetivos..."></textarea>
                    </div>
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i>
                        Enviar Solicitud
                    </button>
                </form>
            </div>
        `;

        // Agregar estilos del modal
        this.addModalStyles();

        // Manejar envío del formulario
        const form = modal.querySelector('.contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form, planName);
        });

        return modal;
    }

    /**
     * Agregar estilos del modal
     */
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .contact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .contact-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s ease;
            }
            
            .contact-modal.show .modal-content {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #333;
            }
            
            .modal-content h3 {
                color: var(--edu-primary);
                margin-bottom: 8px;
                font-size: 1.5rem;
            }
            
            .modal-price {
                color: var(--edu-secondary);
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 24px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #333;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
                font-family: inherit;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--edu-primary);
            }
            
            .submit-btn {
                width: 100%;
                padding: 16px;
                background: var(--edu-gradient);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    padding: 30px 20px;
                    width: 95%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Manejar envío del formulario
     */
    handleFormSubmission(form, planName) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simular envío (aquí integrarías con tu backend)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            submitBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                // Cerrar modal
                const modal = form.closest('.contact-modal');
                modal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
                
                // Mostrar mensaje de éxito
                this.showSuccessMessage(planName);
            }, 1500);
        }, 2000);
    }

    /**
     * Mostrar mensaje de éxito
     */
    showSuccessMessage(planName) {
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>¡Solicitud enviada! Te contactaremos pronto sobre el ${planName}.</span>
        `;
        
        // Estilos del toast
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            message.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 4000);
    }

    /**
     * Configurar botones CTA
     */
    setupCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const text = button.textContent.trim();
                
                if (text.includes('Contactar')) {
                    e.preventDefault();
                    this.scrollToSection('.pricing-section');
                } else if (text.includes('Presentación')) {
                    e.preventDefault();
                    this.showVideoModal();
                } else if (text.includes('Brochure')) {
                    e.preventDefault();
                    this.downloadBrochure();
                }
            });
        });
    }

    /**
     * Scroll suave a sección
     */
    scrollToSection(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Mostrar modal de video
     */
    showVideoModal() {
        // Implementar modal de video aquí
        console.log('Mostrar video de presentación');
    }

    /**
     * Descargar brochure
     */
    downloadBrochure() {
        // Implementar descarga de brochure
        console.log('Descargar brochure del foro');
    }

    /**
     * Configurar scroll suave
     */
    setupSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    /**
     * Animaciones de contador
     */
    setupCounterAnimations() {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        };

        // Observar stats para animación
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    
                    if (number && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        animateCounter(entry.target, number);
                    }
                }
            });
        });

        stats.forEach(stat => statsObserver.observe(stat));
    }

    /**
     * Efecto parallax sutil
     */
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.edu-hero .hero-background span');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new EDUInteractions();
});

// Agregar estilos de animación
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .strength-card,
    .pricing-card,
    .timeline-item,
    .section-header {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .strength-card.animate-in,
    .pricing-card.animate-in,
    .timeline-item.animate-in,
    .section-header.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .pricing-card {
        transition-delay: 0.1s;
    }
    
    .pricing-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .pricing-card:nth-child(3) {
        transition-delay: 0.3s;
    }
`;

document.head.appendChild(animationStyles);
