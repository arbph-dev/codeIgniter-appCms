
// assets/js/ui/workbench/layouts/PortalWorkbench.js
import WorkbenchBase from '../WorkbenchBase.js';

export class PortalWorkbench extends WorkbenchBase {
    constructor(config = {}) {
        super({
            id: 'portal-workbench',
            name: 'Portal Workbench',
            options: {
                hasHeader: true,
                hasNavbar: true,
                hasFooter: true,
                fullPage: true,
                ...config.options
            },
            ...config
        });
    }

    renderStructure() {
        this.container.innerHTML = `
            <div class="cms_article_wrap wb-portal">   <!-- On réutilise la classe existante -->

                <header class="cms_article_header" id="wb-header"></header>

                <main class="cms_article_body" id="wb-content">
                    <!-- Contenu injecté ici -->
                </main>

                <footer class="wb-footer" id="wb-footer"></footer>
            </div>
        `;
    }

    bootstrap() {
        this.applyPortalStyles();
        this.initHeader();
        this.initContent();
    }

    applyPortalStyles() {
        // On force l'utilisation des styles existants
        const wrap = this.getElement('.cms_article_wrap');
        if (wrap) {
            wrap.style.maxWidth = '1000px';   // ajustement léger si besoin
        }
    }

    initHeader() {
        const header = this.getElement('#wb-header');
        if (header) {
            header.innerHTML = `
                <h1 id="wb-title">Portail Zealot</h1>
                <p class="cms_article_meta">Workbench actif — Itération 003</p>
            `;
        }
    }

    initContent() {
        const content = this.getElement('#wb-content');
        if (content) {
            content.innerHTML = `
                <p>Contenu du portail chargé via <strong>PortalWorkbench</strong>.</p>
                <p>Styles article.css + workbench.css sont actifs.</p>
            `;
        }
    }
}

// Helper pour test rapide
export function createPortalWorkbench(container = '#main-content') {
    const wb = new PortalWorkbench();
    wb.init(container);
    return wb;
}
