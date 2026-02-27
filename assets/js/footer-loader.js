/**
 * Footer Loader - Shavuot EDU
 * Misma lógica robusta que SHAVUOT SYSTEM HOME.
 * Captura document.currentScript en top-level antes de cualquier callback.
 */

const _footerScriptSrc = document.currentScript ? document.currentScript.src : '';

class FooterLoader {
    constructor() {
        this.basePath = this._calcBasePath();
        console.log('[FooterLoader EDU] basePath:', this.basePath);
    }

    _calcBasePath() {
        try {
            if (_footerScriptSrc) {
                const scriptUrl = new URL(_footerScriptSrc);
                const siteRoot = scriptUrl.pathname.replace(/\/assets\/js\/footer-loader\.js$/, '');
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
            console.warn('[FooterLoader EDU] fallback basePath:', e);
        }
        for (const script of document.getElementsByTagName('script')) {
            const src = script.getAttribute('src') || '';
            if (src.includes('footer-loader.js')) {
                const path = src.replace(/assets\/js\/footer-loader\.js$/, '');
                return path || './';
            }
        }
        return './';
    }

    async _loadTemplate() {
        try {
            const res = await fetch(`${this.basePath}components/footer.html`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.text();
        } catch (err) {
            console.warn('[FooterLoader EDU] usando fallback:', err);
            return this._fallback();
        }
    }

    _fallback() {
        return `
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-simple">
                <div class="footer-links-simple">
                    <a href="${this.basePath}about/index.html">About Us</a>
                    <span class="separator">|</span>
                    <a href="${this.basePath}contact/index.html">Contact</a>
                    <span class="separator">|</span>
                    <a href="${this.basePath}privacy/index.html">Privacy</a>
                    <span class="separator">|</span>
                    <a href="${this.basePath}terms/index.html">Terms</a>
                    <span class="separator">|</span>
                    <a href="${this.basePath}cookies/index.html">Cookies</a>
                </div>
                <p class="footer-copyright">
                    &copy; 2025 Shavuot System. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</footer>`;
    }

    _process(html) {
        return html.replace(/\{\{basePath\}\}/g, this.basePath);
    }

    async insertFooter() {
        const container = document.getElementById('footer-container');
        if (!container) { console.warn('[FooterLoader EDU] #footer-container no encontrado'); return; }
        const raw = await this._loadTemplate();
        container.innerHTML = this._process(raw);
        console.log('[FooterLoader EDU] Footer insertado');
    }
}

async function loadFooter() {
    const loader = new FooterLoader();
    await loader.insertFooter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
