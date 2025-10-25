/**
 * Footer Loader - Sistema modular para cargar footer dinámicamente
 * Funciona en todas las páginas del sitio Shavuot
 */

class FooterLoader {
    constructor() {
        this.basePath = this.calculateBasePath();
        console.log('FooterLoader iniciado:', { basePath: this.basePath });
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
     * Carga el template del footer desde el archivo components/footer.html
     */
    async loadFooterTemplate() {
        try {
            const response = await fetch(`${this.basePath}components/footer.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const template = await response.text();
            console.log('Template del footer cargado exitosamente');
            return template;
        } catch (error) {
            console.warn('No se pudo cargar el template del footer, usando fallback:', error);
            return this.getFallbackFooter();
        }
    }

    /**
     * Template de fallback si no se puede cargar el archivo
     */
    getFallbackFooter() {
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <p class="footer-copyright">
                            &copy; 2025 Shavuot System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * Procesa el template reemplazando variables dinámicas
     */
    processTemplate(template) {
        return template.replace(/\{\{basePath\}\}/g, this.basePath);
    }

    /**
     * Inserta el footer en el DOM
     */
    async insertFooter() {
        const footerContainer = document.getElementById('footer-container');
        
        if (!footerContainer) {
            console.warn('Footer container no encontrado');
            return;
        }

        console.log('Insertando footer en el DOM...');
        const template = await this.loadFooterTemplate();
        const processedHTML = this.processTemplate(template);

        footerContainer.innerHTML = processedHTML;
        console.log('Footer insertado exitosamente');
        
        // Inicializar funcionalidad del footer
        this.initializeFooterFunctionality();
    }

    /**
     * Inicializa la funcionalidad del footer
     */
    initializeFooterFunctionality() {
        // Newsletter form submission
        const newsletterForm = document.querySelector('.footer-newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('.newsletter-input');
                const email = emailInput.value;
                
                console.log('Newsletter subscription:', email);
                alert(`Thank you for subscribing with: ${email}`);
                emailInput.value = '';
            });
        }

        // Social links tracking
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('aria-label');
                console.log(`Social link clicked: ${platform}`);
                alert(`${platform} link will be configured soon!`);
            });
        });
    }
}

/**
 * Función principal para cargar el footer
 */
async function loadFooter() {
    console.log('Iniciando carga del footer...');
    const footerLoader = new FooterLoader();
    await footerLoader.insertFooter();
}

// Auto-inicialización
console.log('Footer-loader.js cargado, estado del DOM:', document.readyState);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
