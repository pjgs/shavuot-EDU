/**
 * Header Loader - Sistema modular para cargar header dinámicamente
 * Funciona en todas las páginas del sitio Shavuot
 */

class HeaderLoader {
    constructor() {
        this.basePath = this.calculateBasePath();
        this.currentPage = this.detectCurrentPage();
        this.headerTemplate = null;
        console.log('HeaderLoader iniciado:', { basePath: this.basePath, currentPage: this.currentPage });
    }

    /**
     * Calcula la ruta base según la profundidad de la página actual
     */
    calculateBasePath() {
        const path = window.location.pathname;
        let depth = 0;

        // Contar niveles de profundidad
        if (path.includes('/PRO/') || path.includes('/EDU/')) {
            depth = 1;
        }

        return depth > 0 ? '../' : './';
    }

    /**
     * Detecta la página actual para estados activos
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('/PRO/')) return 'pro';
        if (path.includes('/EDU/')) return 'edu';
        return 'home';
    }

    /**
     * Carga el template del header desde el archivo components/header.html
     */
    async loadHeaderTemplate() {
        try {
            const response = await fetch(`${this.basePath}components/header.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.headerTemplate = await response.text();
            console.log('Template del header cargado exitosamente');
            return this.headerTemplate;
        } catch (error) {
            console.warn('No se pudo cargar el template del header, usando fallback:', error);
            return this.getFallbackHeader();
        }
    }

    /**
     * Template de fallback si no se puede cargar el archivo
     */
    getFallbackHeader() {
        console.log('Usando template de fallback');
        return `
            <!-- Header Component - Fallback -->
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <div class="logo">
                            <a href="{{basePath}}index.html" class="logo-link">
                                <img src="{{basePath}}assets/images/logo-shavuot-blanco.svg" alt="Shavuot" class="logo-img">
                            </a>
                        </div>
                        <div class="header-actions">
                            <a href="#" class="btn-login-icon" aria-label="Login">
                                <i class="fas fa-user"></i>
                            </a>
                            <button class="hamburger-menu" id="hamburgerMenu" aria-label="Menú" aria-expanded="false">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Mobile Navigation -->
            <nav class="mobile-nav" id="mobileNav" aria-hidden="true" role="navigation">
                <button class="mobile-close" id="mobileClose" aria-label="Cerrar menú">×</button>
                <ul class="nav-list">
                    <li><a href="{{basePath}}index.html" class="nav-link home-link" data-page="home">HOME</a></li>
                    <li><a href="#" class="nav-link lab-link" data-page="lab">LAB</a></li>
                    <li><a href="{{basePath}}PRO/index.html" class="nav-link pro-link" data-page="pro">PRO</a></li>
                    <li><a href="{{basePath}}EDU/index.html" class="nav-link edu-link" data-page="edu">EDU</a></li>
                </ul>
            </nav>

            <!-- Navigation Overlay -->
            <div class="nav-overlay" id="navOverlay"></div>
        `;
    }

    /**
     * Procesa el template reemplazando variables dinámicas
     */
    processTemplate(template) {
        return template.replace(/\{\{basePath\}\}/g, this.basePath);
    }

    /**
     * Inserta el header en el DOM
     */
    async insertHeader() {
        console.log('Insertando header en el DOM...');
        const template = await this.loadHeaderTemplate();
        const processedHTML = this.processTemplate(template);

        if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', processedHTML);
            console.log('Header insertado, inicializando funcionalidad...');
            // Pequeño delay para asegurar que el DOM esté listo
            setTimeout(() => {
                this.initializeHeaderFunctionality();
            }, 100);
        } else {
            console.error('document.body no está disponible');
        }
    }

    /**
     * Inicializa toda la funcionalidad del header
     */
    initializeHeaderFunctionality() {
        console.log('Inicializando funcionalidad del header...');
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupActiveStates();
        this.setupResponsiveHandling();
        this.setupAccessibility();
        console.log('Funcionalidad del header inicializada completamente');
    }

    /**
     * Configuración del menú móvil
     */
    setupMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('navOverlay');
        const mobileClose = document.getElementById('mobileClose');

        console.log('Configurando menú móvil:', { 
            hamburgerMenu: !!hamburgerMenu, 
            mobileNav: !!mobileNav, 
            overlay: !!overlay, 
            mobileClose: !!mobileClose 
        });

        if (!hamburgerMenu || !mobileNav) {
            console.error('Elementos del menú móvil no encontrados');
            return;
        }

        // Función para toggle menú móvil
        const toggleMobileMenu = () => {
            console.log('Toggle menú móvil');
            const isOpen = mobileNav.classList.contains('open');

            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        };

        // Event listeners
        hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click en hamburger menu');
            toggleMobileMenu();
        });
        
        if (mobileClose) {
            mobileClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en botón cerrar');
                this.closeMobileMenu();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en overlay');
                this.closeMobileMenu();
            });
        }

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                console.log('Cerrar menú con Escape');
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Abre el menú móvil
     */
    openMobileMenu() {
        console.log('Abriendo menú móvil');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('navOverlay');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        if (mobileNav) mobileNav.classList.add('open');
        if (overlay) overlay.classList.add('active');
        if (document.body) document.body.classList.add('menu-open');
        if (hamburgerMenu) {
            hamburgerMenu.classList.add('active'); // Agregar clase para animación
            hamburgerMenu.setAttribute('aria-expanded', 'true');
        }
        if (mobileNav) mobileNav.setAttribute('aria-hidden', 'false');
    }

    /**
     * Cierra el menú móvil
     */
    closeMobileMenu() {
        console.log('Cerrando menú móvil');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('navOverlay');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        if (mobileNav) mobileNav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        if (document.body) document.body.classList.remove('menu-open');
        if (hamburgerMenu) {
            hamburgerMenu.classList.remove('active'); // Remover clase para animación
            hamburgerMenu.setAttribute('aria-expanded', 'false');
        }
        if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');
    }

    /**
     * Configuración de la navegación
     */
    setupNavigation() {
        const allLinks = document.querySelectorAll('.nav-link');
        console.log('Configurando navegación, enlaces encontrados:', allLinks.length);

        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const page = link.getAttribute('data-page');
                console.log('Click en enlace:', page);

                // Manejar enlace LAB
                if (page === 'lab') {
                    e.preventDefault();
                    console.log('Abriendo LAB en nueva ventana');
                    window.open('https://shavuotsys.web.app/', '_blank', 'noopener,noreferrer');
                    this.closeMobileMenu();
                    return;
                }

                // Cerrar menú móvil en otros enlaces
                this.closeMobileMenu();
            });
        });

        // Hacer el logo clickeable
        const logoLink = document.querySelector('.logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', () => {
                console.log('Click en logo');
                this.closeMobileMenu();
            });
        }
    }

    /**
     * Configurar estados activos de navegación
     */
    setupActiveStates() {
        const allLinks = document.querySelectorAll('.nav-link');
        console.log('Configurando estados activos para página:', this.currentPage);

        allLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            
            if (page === this.currentPage) {
                link.classList.add('active');
                console.log('Enlace marcado como activo:', page);
            }
        });
    }

    /**
     * Manejo responsivo
     */
    setupResponsiveHandling() {
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Configuración de accesibilidad
     */
    setupAccessibility() {
        // Focus trap para menú móvil
        const mobileNav = document.getElementById('mobileNav');
        if (!mobileNav) return;

        const focusableElements = mobileNav.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            mobileNav.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }
}

/**
 * Función principal para cargar el header
 */
async function loadHeader() {
    console.log('Iniciando carga del header...');
    const headerLoader = new HeaderLoader();
    await headerLoader.insertHeader();
}

// Auto-inicialización
console.log('Header-loader.js cargado, estado del DOM:', document.readyState);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}