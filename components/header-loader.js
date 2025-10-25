/**
 * Header Loader System
 * Carga el header dinámicamente en todas las páginas
 */

class HeaderLoader {
    constructor() {
        this.headerLoaded = false;
        this.init();
    }

    async init() {
        try {
            await this.loadHeader();
            this.initializeHeaderFunctionality();
            this.headerLoaded = true;
        } catch (error) {
            console.error('Error al cargar el header:', error);
        }
    }

    async loadHeader() {
        const response = await fetch('components/header.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const headerHTML = await response.text();

        // Insertar el header al principio del body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHTML;

        const header = tempDiv.querySelector('.header');
        const mobileNav = tempDiv.querySelector('.mobile-nav');

        if (header) {
            document.body.insertBefore(header, document.body.firstChild);
        }
        if (mobileNav) {
            document.body.insertBefore(mobileNav, header.nextSibling);
        }

        // Ajustar las rutas de los assets según la profundidad de la página
        this.adjustAssetPaths();
    }

    adjustAssetPaths() {
        // Determinar la profundidad de la página actual
        const pathDepth = window.location.pathname.split('/').length - 1;
        const prefix = '../'.repeat(Math.max(0, pathDepth - 1));

        // Ajustar ruta del logo
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            const currentSrc = logoImg.getAttribute('src');
            if (currentSrc.includes('../assets/')) {
                logoImg.setAttribute('src', prefix + 'assets/images/logo-shavuot-blanco.svg');
            }
        }

        // Ajustar rutas de los enlaces de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Mantener enlaces absolutos (http, https, #)
                if (href.startsWith('http') || href.startsWith('#')) {
                    return;
                }

                // Ajustar enlaces relativos
                if (href.includes('../')) {
                    link.setAttribute('href', prefix + href.replace('../', ''));
                } else if (href.startsWith('index.html')) {
                    link.setAttribute('href', prefix + href);
                }
            }
        });
    }

    initializeHeaderFunctionality() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupHeaderEvents();
            });
        } else {
            this.setupHeaderEvents();
        }
    }

    setupHeaderEvents() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileNav = document.getElementById('mobileNav');

        if (!hamburgerMenu || !mobileNav) {
            console.warn('No se encontraron los elementos del header');
            return;
        }

        // Toggle menú hamburguesa
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });

        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Ajustar el padding del body para el header fijo
        this.adjustBodyPadding();

        // Marcar el enlace activo
        this.highlightActiveLink();
    }

    adjustBodyPadding() {
        const header = document.querySelector('.header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight}px`;
        }
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Eliminar clase active de todos los enlaces
            link.classList.remove('active');

            // Agregar clase active al enlace correspondiente
            if (href === currentPath ||
                (currentPath.includes('index.html') && href.includes('index.html')) ||
                (currentPath.includes('PRO') && href.includes('PRO')) ||
                (currentPath.includes('EDU') && href.includes('EDU'))) {
                link.classList.add('active');
            }
        });
    }
}

// Función para cargar el header manualmente si es necesario
function loadHeader() {
    if (!window.headerLoader) {
        window.headerLoader = new HeaderLoader();
    }
    return window.headerLoader;
}

// Cargar automáticamente el header cuando se carga la página
(function() {
    // Si no estamos en la página principal, cargar el header
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('/index.html')) {
        window.headerLoader = new HeaderLoader();
    }
})();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeaderLoader, loadHeader };
}