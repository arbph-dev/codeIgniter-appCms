// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
import WorkbenchBase from '../WorkbenchBase.js';
import { initCms } from '/assets/js/cms/bootstrap.js';

export class CmsArticleWorkbench extends WorkbenchBase {
    constructor(config = {}) {
        super({
            id: 'cms-article-wb',
            name: 'Cms Article Workbench',
            ...config
        });

        this.debugEnabled = true;   // ← Change en false en production
    }

    renderStructure() {
        this.container.innerHTML = `
            <div class="cms_article_wrap">
                <header class="cms_article_header" id="wb-header"></header>
                
                <div id="wb-debug" style="display:none;"></div>
                
                <main class="cms_article_body" id="wb-content"></main>
                <footer class="wb-footer" id="wb-footer"></footer>
            </div>
        `;
    }

    loadFromPHP(article, content) {
        this.renderHeader(article);
        this.renderContent(content);
        this.initComponents();

        if (this.debugEnabled) {
            this.showDebug(article, content);
        }
    }

    renderHeader(article) {
        const header = this.getElement('#wb-header');
        if (!header || !article) return;

        header.innerHTML = `
            <h1>${article.title || 'Sans titre'}</h1>
            ${article.description ? `<p>${article.description}</p>` : ''}
            ${article.published_at ? `
                <p class="cms_article_meta">
                    Publié le <time>${new Date(article.published_at).toLocaleDateString('fr-FR')}</time>
                </p>
            ` : ''}
        `;
    }

    renderContent(contentHtml) {
        const content = this.getElement('#wb-content');
        if (content) {
            content.innerHTML = contentHtml || '<p>Aucun contenu disponible.</p>';
        }
    }

    initComponents() {
        console.log('[CmsArticleWorkbench] → Initialisation des composants CMS');
        try {
            initCms();
        } catch (e) {
            console.error('[CmsArticleWorkbench] Erreur initCms()', e);
        }
    }

    // === DEBUG VISUEL ===
    showDebug(article, content) {
        const debugPanel = this.getElement('#wb-debug');
        if (!debugPanel) return;

        debugPanel.style.display = 'block';
        debugPanel.innerHTML = `
            <div style="background:#1a2a4a; color:#eee236; padding:12px; margin:10px 0; border-radius:6px; font-family:monospace; font-size:0.8rem;">
                <strong>🐞 DEBUG — CmsArticleWorkbench</strong><br>
                <button onclick="this.parentElement.style.display='none'" style="float:right; background:#c0392b; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
                    Fermer
                </button>
                <strong>Article :</strong><br>
                <pre style="max-height:200px; overflow:auto;">${JSON.stringify(article, null, 2)}</pre>
                <hr>
                <strong>Content length :</strong> ${content ? content.length : 0} caractères<br>
                <small>Composants initialisés via initCms()</small>
            </div>
        `;
    }
}

// Helper
export function createCmsArticleWorkbench(containerSelector = '#wb-container') {
    const wb = new CmsArticleWorkbench();
    wb.init(containerSelector);
    return wb;
}
