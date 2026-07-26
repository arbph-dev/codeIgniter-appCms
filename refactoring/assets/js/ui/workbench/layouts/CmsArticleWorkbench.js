// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
//=============================================================================
// Iteration005
// - Suppression import bootstrap.js / initCms()
// + Imports directs de chaque composant
// + Bus via WorkbenchBase.publish() (plus de window.eventBusPublish)
// + TabSystem importé et disponible via initTabSystem()
// + setupComponentRegistry : un composant = un register()
// + showDebug : liste les composants enregistrés

import WorkbenchBase from '../WorkbenchBase.js';
import { TabSystem }  from '../TabSystem.js';

// ── Imports directs des composants (remplace bootstrap.js) ───────────────────
// Ordre respecté : apex avant codeval (codeval publie apex:render)
import { initApex }    from '/assets/js/components/apex.js';
import { initCallout } from '/assets/js/components/callout.js';
import { initCodeVal } from '/assets/js/components/codeval.js';
import { initLeaflet } from '/assets/js/components/leaflet.js';
import { initMermaid } from '/assets/js/components/mermaid.js';
import { init as initThree } from '/assets/js/components/three/index.js';

export class CmsArticleWorkbench extends WorkbenchBase {

    constructor(config = {}) {
        super({
            id  : 'cms-article-wb',
            name: 'Cms Article Workbench',
            ...config
        });

        this.debugEnabled = config.debug ?? true;   // false en production
        this.tabSystem    = null;
        this.article      = null;
    }

    // ── Structure HTML ────────────────────────────────────────────────────────

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

    // ── Chargement depuis PHP ─────────────────────────────────────────────────

    loadFromPHP(article, content) {
        this.article = article;

        this.renderHeader(article);
        this.renderContent(content);

        // Iter005 : enregistrement individuel des composants
        this.setupComponentRegistry();
        this.initRegisteredComponents();

        // Iter005 : publication bus après chargement (via façade WorkbenchBase)
        this.publish('cms:article:loaded', { slug: article?.slug });

        if (this.debugEnabled) {
            this.showDebug(article, content);
        }
    }

    // ── Rendu header ──────────────────────────────────────────────────────────

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

    // ── Rendu contenu ─────────────────────────────────────────────────────────

    renderContent(contentHtml) {
        const content = this.getElement('#wb-content');
        if (content) {
            content.innerHTML = contentHtml || '<p>Aucun contenu disponible.</p>';
        }
    }

    // ── Registry des composants ───────────────────────────────────────────────
    // Iter005 : un composant = un register(), sans passer par bootstrap.js

    setupComponentRegistry() {
        // Dépendance : apex avant codeval
        this.register('apex',    initApex);

        // Indépendants
        this.register('callout', initCallout);
        this.register('leaflet', initLeaflet);
        this.register('mermaid', initMermaid);
        this.register('three',   initThree);

        // Consommateur d'events (en dernier)
        this.register('codeval', initCodeVal);
    }

    // ── TabSystem (optionnel) ─────────────────────────────────────────────────
    // À activer pour un rendu par sections (Iter006+)
    //
    // Exemple d'usage :
    //   const tabs = wb.initTabSystem('#wb-content');
    //   tabs.addTab('section-1', 'Introduction', () => renderSection(1))
    //       .addTab('section-2', 'Développement', () => renderSection(2))
    //       .render(wb.getElement('#wb-content'));

    initTabSystem() {
        this.tabSystem = new TabSystem({
            busEvent : 'cms:section:change',
        });
        return this.tabSystem;
    }

    // ── Debug ──────────────────────────────────────────────────────────────────

    showDebug(article, content) {
        const debugPanel = this.getElement('#wb-debug');
        if (!debugPanel) return;

        const composants = [...this.componentRegistry.keys()]
            .map(k => `<span style="margin-left:6px;color:#7fff7f;">✓ ${k}</span>`)
            .join('');

        debugPanel.style.display = 'block';
        debugPanel.innerHTML = `
            <div style="background:#1a2a4a;color:#eee236;padding:12px;margin:10px 0;border-radius:6px;font-family:monospace;font-size:0.8rem;">
                <strong>🐞 DEBUG — CmsArticleWorkbench (Iter005)</strong>
                <button onclick="this.parentElement.parentElement.style.display='none'"
                        style="float:right;background:#c0392b;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">
                    Fermer
                </button>
                <br>
                <strong>Composants :</strong>${composants}
                <br><br>
                <strong>Article :</strong>
                <pre style="max-height:200px;overflow:auto;color:#eee;">${JSON.stringify(article, null, 2)}</pre>
                <hr style="border-color:#334">
                <strong>Content length :</strong> ${content ? content.length : 0} caractères
            </div>
        `;
    }

}

// ── Helper ────────────────────────────────────────────────────────────────────

export function createCmsArticleWorkbench(containerSelector = '#wb-container') {
    const wb = new CmsArticleWorkbench();
    wb.init(containerSelector);
    return wb;
}
