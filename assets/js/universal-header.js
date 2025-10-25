/* =============================================================================
   SHAVUOT UNIVERSAL HEADER - DYNAMIC LOADER SYSTEM
   ============================================================================= */

/**
 * Universal Header System for Shavuot Website
 * Provides consistent header across all pages with dynamic routing
 * and responsive navigation functionality.
 */

class UniversalHeader {
  constructor() {
    this.config = {
      basePath: '',
      currentPage: '',
      isMobile: false,
      isMenuOpen: false,
      headerTemplate: null,
      breakpoints: {
        mobile: 768,
        tablet: 1024
      }
    };

    this.elements = {};
    this.init();
  }

  /**
   * Initialize the universal header system
   */
  async init() {
    try {
      this.determinePageContext();
      this.calculateBasePath();
      await this.loadHeaderTemplate();
      this.renderHeader();
      this.initializeElements();
      this.setupEventListeners();
      this.setupAccessibility();
      this.setupResponsive();

      // Announce successful initialization
      console.log('✅ Shavuot Universal Header initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Universal Header:', error);
      this.fallbackHeader();
    }
  }

  /**
   * Determine current page context for active states
   */
  determinePageContext() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/pro/') || path.includes('/pro.html')) {
      this.config.currentPage = 'pro';
    } else if (path.includes('/edu/') || path.includes('/edu.html')) {
      this.config.currentPage = 'edu';
    } else if (path.includes('/lab') || path.includes('shavuotsys')) {
      this.config.currentPage = 'lab';
    } else {
      this.config.currentPage = 'home';
    }
  }

  /**
   * Calculate base path for assets based on current directory depth
   */
  calculateBasePath() {
    const path = window.location.pathname;

    // Count directory depth from root
    const depth = path.split('/').filter(segment => segment && segment !== 'index.html').length - 1;

    // Calculate relative path back to root
    if (depth <= 0) {
      this.config.basePath = './';
    } else {
      this.config.basePath = '../'.repeat(Math.max(1, depth));
    }
  }

  /**
   * Load header template from components directory
   */
  async loadHeaderTemplate() {
    try {
      const response = await fetch(`${this.config.basePath}components/universal-header.html`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      this.config.headerTemplate = await response.text();
    } catch (error) {
      console.warn('Could not load header template, using fallback:', error);
      this.config.headerTemplate = this.getFallbackTemplate();
    }
  }

  /**
   * Process template with dynamic values
   */
  processTemplate(template) {
    return template
      .replace(/\{\{BASE_PATH\}\}/g, this.config.basePath)
      .replace(/\{\{#IS_HOME\}\}[\s\S]*?\{\{\/IS_HOME\}\}/g,
               this.config.currentPage === 'home' ? 'active' : '')
      .replace(/\{\{#IS_PRO\}\}[\s\S]*?\{\{\/IS_PRO\}\}/g,
               this.config.currentPage === 'pro' ? 'active' : '')
      .replace(/\{\{#IS_EDU\}\}[\s\S]*?\{\{\/IS_EDU\}\}/g,
               this.config.currentPage === 'edu' ? 'active' : '')
      .replace(/\{\{#IS_LAB\}\}[\s\S]*?\{\{\/IS_LAB\}\}/g,
               this.config.currentPage === 'lab' ? 'active' : '');
  }

  /**
   * Render the header into the DOM
   */
  renderHeader() {
    const processedTemplate = this.processTemplate(this.config.headerTemplate);

    // Insert at the beginning of body
    if (document.body) {
      document.body.insertAdjacentHTML('afterbegin', processedTemplate);
    } else {
      // Fallback for edge cases
      document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('afterbegin', processedTemplate);
        this.initializeElements();
        this.setupEventListeners();
      });
    }
  }

  /**
   * Cache DOM elements for better performance
   */
  initializeElements() {
    this.elements = {
      header: document.querySelector('.universal-header'),
      mobileToggle: document.getElementById('mobileMenuToggle'),
      mobileNav: document.getElementById('mobileNav'),
      mobileNavClose: document.getElementById('mobileNavClose'),
      mobileBackdrop: document.getElementById('mobileNavBackdrop'),
      navLinks: document.querySelectorAll('[data-page]'),
      skipLink: document.querySelector('.skip-link')
    };
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Mobile menu close
    if (this.elements.mobileNavClose) {
      this.elements.mobileNavClose.addEventListener('click', () => this.closeMobileMenu());
    }

    // Backdrop click
    if (this.elements.mobileBackdrop) {
      this.elements.mobileBackdrop.addEventListener('click', () => this.closeMobileMenu());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.config.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle external links
    this.setupExternalLinks();

    // Handle page navigation
    this.setupNavigation();

    // Handle resize
    window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Skip link functionality
    if (this.elements.skipLink) {
      this.elements.skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      });
    }

    // ARIA labels and states
    this.updateAriaStates();

    // Focus management
    this.setupFocusManagement();
  }

  /**
   * Setup responsive behavior
   */
  setupResponsive() {
    this.handleResize();
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.config.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.config.isMenuOpen = true;

    if (this.elements.mobileNav) {
      this.elements.mobileNav.hidden = false;
      // Trigger reflow for animation
      this.elements.mobileNav.offsetHeight;
      this.elements.mobileNav.classList.add('is-open');
    }

    if (this.elements.mobileBackdrop) {
      this.elements.mobileBackdrop.hidden = false;
    }

    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.setAttribute('aria-expanded', 'true');
      this.elements.mobileToggle.classList.add('is-active');
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus management
    setTimeout(() => {
      const firstNavLink = this.elements.mobileNav?.querySelector('.mobile-nav-link');
      if (firstNavLink) firstNavLink.focus();
    }, 100);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.config.isMenuOpen = false;

    if (this.elements.mobileNav) {
      this.elements.mobileNav.classList.remove('is-open');
      setTimeout(() => {
        this.elements.mobileNav.hidden = true;
      }, 300);
    }

    if (this.elements.mobileBackdrop) {
      this.elements.mobileBackdrop.hidden = true;
    }

    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.setAttribute('aria-expanded', 'false');
      this.elements.mobileToggle.classList.remove('is-active');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to toggle button
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.focus();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const wasMobile = this.config.isMobile;
    this.config.isMobile = window.innerWidth < this.config.breakpoints.mobile;

    // Close mobile menu when switching to desktop
    if (wasMobile && !this.config.isMobile && this.config.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Setup external link handling
   */
  setupExternalLinks() {
    document.querySelectorAll('.nav-link-external').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.includes('shavuotsys.web.app')) {
          // Open in new tab with proper security
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  /**
   * Setup navigation handling
   */
  setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');

        // Handle external links
        if (page === 'lab') {
          return; // Let external link handler deal with it
        }

        // Add smooth transitions for internal navigation
        if (!link.classList.contains('active')) {
          link.style.opacity = '0.7';
          setTimeout(() => {
            link.style.opacity = '';
          }, 150);
        }
      });
    });
  }

  /**
   * Update ARIA states
   */
  updateAriaStates() {
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.setAttribute('aria-expanded', this.config.isMenuOpen.toString());
    }
  }

  /**
   * Setup focus management for accessibility
   */
  setupFocusManagement() {
    // Trap focus within mobile menu when open
    document.addEventListener('keydown', (e) => {
      if (this.config.isMenuOpen && e.key === 'Tab') {
        const focusableElements = this.elements.mobileNav?.querySelectorAll(
          'a, button, [tabindex="0"]'
        );

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * Debounce function for performance
   */
  debounce(func, wait) {
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

  /**
   * Fallback template if fetch fails
   */
  getFallbackTemplate() {
    return `
      <header class="universal-header" role="banner">
        <div class="header-container">
          <div class="header-wrapper">
            <div class="header-logo">
              <a href="${this.config.basePath}index.html" class="logo-link" aria-label="Shavuot - Inicio">
                <img src="${this.config.basePath}assets/images/logo-shavuot-blanco.svg" alt="Shavuot" class="logo-image">
              </a>
            </div>
            <nav class="desktop-nav" role="navigation">
              <ul class="nav-list">
                <li><a href="${this.config.basePath}index.html" class="nav-link">HOME</a></li>
                <li><a href="https://shavuotsys.web.app/" class="nav-link" target="_blank">LAB</a></li>
                <li><a href="${this.config.basePath}PRO/index.html" class="nav-link">PRO</a></li>
                <li><a href="${this.config.basePath}EDU/index.html" class="nav-link">EDU</a></li>
              </ul>
            </nav>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Abrir menú">
              <span class="hamburger-box"><span class="hamburger-inner"></span></span>
            </button>
          </div>
        </div>
      </header>
      <nav class="mobile-nav-drawer" id="mobileNav" hidden>
        <ul class="mobile-nav-list">
          <li><a href="${this.config.basePath}index.html" class="mobile-nav-link">HOME</a></li>
          <li><a href="https://shavuotsys.web.app/" class="mobile-nav-link" target="_blank">LAB</a></li>
          <li><a href="${this.config.basePath}PRO/index.html" class="mobile-nav-link">PRO</a></li>
          <li><a href="${this.config.basePath}EDU/index.html" class="mobile-nav-link">EDU</a></li>
        </ul>
      </nav>
      <div class="mobile-nav-backdrop" id="mobileNavBackdrop" hidden></div>
    `;
  }

  /**
   * Ultimate fallback if everything fails
   */
  fallbackHeader() {
    console.warn('Using minimal fallback header');
    const fallbackHTML = `
      <header style="background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); padding: 1rem 0; position: fixed; width: 100%; top: 0; z-index: 1000;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
          <a href="${this.config.basePath}index.html">
            <img src="${this.config.basePath}assets/images/logo-shavuot-blanco.svg" alt="Shavuot" style="height: 35px;">
          </a>
          <nav>
            <a href="${this.config.basePath}index.html" style="color: white; margin: 0 1rem; text-decoration: none;">HOME</a>
            <a href="https://shavuotsys.web.app/" target="_blank" style="color: white; margin: 0 1rem; text-decoration: none;">LAB</a>
            <a href="${this.config.basePath}PRO/index.html" style="color: white; margin: 0 1rem; text-decoration: none;">PRO</a>
            <a href="${this.config.basePath}EDU/index.html" style="color: white; margin: 0 1rem; text-decoration: none;">EDU</a>
          </nav>
        </div>
      </header>
      <div style="height: 70px;"></div>
    `;

    if (document.body) {
      document.body.insertAdjacentHTML('afterbegin', fallbackHTML);
    }
  }
}

// Initialize the Universal Header
(() => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new UniversalHeader());
  } else {
    new UniversalHeader();
  }
})();