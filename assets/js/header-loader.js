/**
 * Header Loader - Shavuot EDU
 * Misma lógica robusta que SHAVUOT SYSTEM HOME.
 * _headerScriptSrc se captura en top-level antes de cualquier callback.
 */

// ── Captura inmediata — funciona antes de DOMContentLoaded ──────────────────
const _headerScriptSrc = document.currentScript ? document.currentScript.src : '';

// ── Clase principal ─────────────────────────────────────────────────────────
class HeaderLoader {
    constructor() {
        this.basePath = this._calcBasePath();
        this.currentPage = this._detectPage();
        console.log('[HeaderLoader EDU] basePath:', this.basePath, '| página:', this.currentPage);
    }

    /**
     * Calcula la ruta base comparando la URL absoluta del script
     * con la URL de la página actual. Funciona en file:// y http://.
     */
    _calcBasePath() {
        try {
            if (_headerScriptSrc) {
                // El script siempre vive en: <siteRoot>/assets/js/header-loader.js
                const scriptUrl = new URL(_headerScriptSrc);
                const siteRoot = scriptUrl.pathname.replace(/\/assets\/js\/header-loader\.js$/, '');

                const pageUrl = new URL(window.location.href);
                const pagePart = pageUrl.pathname;
                const pageDir = pagePart.endsWith('/')
                    ? pagePart
                    : pagePart.substring(0, pagePart.lastIndexOf('/') + 1);

                const relDir = pageDir.startsWith(siteRoot)
                    ? pageDir.slice(siteRoot.length)
                    : pageDir;

                const depth = relDir.replace(/^\//, '').replace(/\/$/, '')
                    .split('/').filter(Boolean).length;

                return depth > 0 ? '../'.repeat(depth) : './';
            }
        } catch (e) {
            console.warn('[HeaderLoader EDU] No se pudo calcular basePath desde URL:', e);
        }

        // Fallback: leer el atributo src relativo del DOM
        for (const script of document.getElementsByTagName('script')) {
            const src = script.getAttribute('src') || '';
            if (src.includes('header-loader.js')) {
                const path = src.replace(/assets\/js\/header-loader\.js$/, '');
                return path || './';
            }
        }
        return './';
    }

    /** Detecta la página actual para marcar el enlace activo */
    _detectPage() {
        const p = window.location.pathname;
        if (p.includes('/EDU/')) return 'edu';
        if (p.includes('/PRO/')) return 'pro';
        return 'home';
    }

    // ── Carga del template ───────────────────────────────────────────────────

    async _loadTemplate() {
        try {
            const res = await fetch(`${this.basePath}components/header.html`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.text();
        } catch (err) {
            console.warn('[HeaderLoader EDU] Fetch fallido, usando fallback:', err);
            return this._fallback();
        }
    }

    _fallback() {
        return `
<!-- Header fallback EDU -->
<header class="header">
    <div class="container">
        <div class="header-content">
            <div class="logo">
                <a href="{{basePath}}index.html" class="logo-link">
                    <img src="{{basePath}}assets/images/logo-shavuot-blanco.svg" alt="Shavuot" class="logo-img">
                </a>
            </div>
            <div class="header-actions">
                <button class="hamburger-menu" id="hamburgerMenu" aria-label="Menu" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </div>
</header>
<nav class="mobile-nav" id="mobileNav" aria-hidden="true" role="navigation">
    <button class="mobile-close" id="mobileClose" aria-label="Close menu">&times;</button>
    <ul class="nav-list">
        <li><a href="{{basePath}}index.html"     class="nav-link home-link"  data-page="home">HOME</a></li>
        <li><a href="#"                           class="nav-link lab-link"   data-page="lab">LAB</a></li>
        <li><a href="https://pjgs.github.io/shavuot-system/PRO/index.html" class="nav-link pro-link" data-page="pro">PRO</a></li>
        <li><a href="{{basePath}}EDU/index.html" class="nav-link edu-link"  data-page="edu">EDU</a></li>
        <li><a href="#" class="nav-link login-link" data-page="login" style="pointer-events: none; opacity: 0.6; cursor: default;"><i class="fas fa-sign-in-alt"></i> LOGIN</a></li>
    </ul>
</nav>
<div class="nav-overlay" id="navOverlay"></div>`;
    }

    _process(html) {
        return html.replace(/\{\{basePath\}\}/g, this.basePath);
    }

    // ── Inserción ────────────────────────────────────────────────────────────

    async insertHeader() {
        const raw = await this._loadTemplate();
        const html = this._process(raw);
        document.body.insertAdjacentHTML('afterbegin', html);
        setTimeout(() => this._initEvents(), 50);
    }

    // ── Eventos ──────────────────────────────────────────────────────────────

    _initEvents() {
        this._setupMobileMenu();
        this._setupNav();
        this._setActive();
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) this._closeMenu();
        });
    }

    _setupMobileMenu() {
        const btn = document.getElementById('hamburgerMenu');
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('navOverlay');
        const close = document.getElementById('mobileClose');
        if (!btn || !nav) return;

        btn.addEventListener('click', e => { e.stopPropagation(); this._toggleMenu(); });
        close?.addEventListener('click', e => { e.stopPropagation(); this._closeMenu(); });
        overlay?.addEventListener('click', e => { e.stopPropagation(); this._closeMenu(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this._closeMenu();
        });
    }

    _toggleMenu() {
        const nav = document.getElementById('mobileNav');
        nav?.classList.contains('open') ? this._closeMenu() : this._openMenu();
    }

    _openMenu() {
        document.getElementById('mobileNav')?.classList.add('open');
        document.getElementById('navOverlay')?.classList.add('active');
        document.getElementById('hamburgerMenu')?.classList.add('active');
        document.body.classList.add('menu-open');
    }

    _closeMenu() {
        document.getElementById('mobileNav')?.classList.remove('open');
        document.getElementById('navOverlay')?.classList.remove('active');
        document.getElementById('hamburgerMenu')?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    _setupNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('data-page') === 'lab') {
                    window.open('https://shavuotsys.web.app/', '_blank', 'noopener,noreferrer');
                }
                this._closeMenu();
            });
        });
    }

    _setActive() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === this.currentPage);
        });
    }
}

// ── Auto-inicio ──────────────────────────────────────────────────────────────
async function loadHeader() {
    const loader = new HeaderLoader();
    await loader.insertHeader();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}