// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
import WorkbenchBase from '/assets/js/ui/workbench/WorkbenchBase.js';
import { initCms } from '/assets/js/cms/bootstrap.js';   // ← Import important

export class CmsArticleWorkbench extends WorkbenchBase {
    constructor(config = {}) {
        super({
            id: 'cms-article-wb',
            name: 'Cms Article Workbench',
            ...config
        });
    }

    renderStructure() {
        this.container.innerHTML = `
            <div class="cms_article_wrap">
                <header class="cms_article_header" id="wb-header"></header>
                <main class="cms_article_body" id="wb-content"></main>
                <footer class="wb-footer" id="wb-footer"></footer>
            </div>
        `;
    }

    loadFromPHP(article, content) {
        this.renderHeader(article);
        this.renderContent(content);
        
        // Initialisation des composants après rendu du HTML
        this.initComponents();
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
            initCms();           // Appel direct après import
        } catch (e) {
            console.error('[CmsArticleWorkbench] Erreur lors de initCms()', e);
        }
    }
}

// Helper
export function createCmsArticleWorkbench(containerSelector = '#wb-container') {
    const wb = new CmsArticleWorkbench();
    wb.init(containerSelector);
    return wb;
}
