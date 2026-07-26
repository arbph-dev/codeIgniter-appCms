// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
//=============================================================================
// Iteration005
//   - Suppression bootstrap.js, imports directs des composants
//   - Bus via WorkbenchBase.publish()
//   - setupComponentRegistry : un register() par composant
//
// Iteration006.1 — Navigation par sections
//   + loadFromPHP : branchement tab-mode / flat-mode selon article.sections
//   + loadSections(sections) : construit TabSystem, un onglet par section
//   + fetchSection(id, paneEl) : charge le HTML depuis /cms/section/{id}
//   ~ showDebug : affiche le nombre de sections et le mode de rendu

import WorkbenchBase from '../WorkbenchBase.js';
import { TabSystem }  from '../TabSystem.js';

// ── Imports directs des composants ───────────────────────────────────────────
// Ordre : apex avant codeval (codeval publie des événements apex:render)
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
        this._renderMode  = 'flat';                 // 'tabs' | 'flat'
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

    // ── Point d'entrée principal ──────────────────────────────────────────────

    /**
     * Appelé depuis article2.php avec les données PHP.
     *
     * Iter006.1 : branchement automatique selon article.sections
     *   → sections.length > 1  : mode onglets  (un fetch par section)
     *   → sinon                : mode plat      (contenu HTML direct)
     *
     * @param {object} article  — données PHP de l'article (titre, slug, sections…)
     * @param {string} content  — HTML complet rendu côté PHP (fallback mode plat)
     */
    loadFromPHP(article, content) {
        this.article = article;

        this.renderHeader(article);

        const sections = Array.isArray(article.sections) ? article.sections : [];

        if (sections.length > 1) {
            this._renderMode = 'tabs';
            this.loadSections(sections);
        } else {
            this._renderMode = 'flat';
            this.renderContent(content);
        }

        // Enregistrement et init des composants
        // Note : en mode tabs, l'init globale ici est quasi no-op
        //        (le DOM de chaque section n'est pas encore chargé).
        //        initRegisteredComponents() est rappelé dans fetchSection()
        //        après injection de chaque section.
        this.setupComponentRegistry();
        this.initRegisteredComponents();

        // Événement bus : article prêt
        this.publish('cms:article:loaded', {
            slug : article?.slug,
            mode : this._renderMode,
        });

        if (this.debugEnabled) {
            this.showDebug(article, content, sections);
        }
    }

    // ── Mode onglets ──────────────────────────────────────────────────────────

    /**
     * Iter006.1 — construit le TabSystem, un onglet par section.
     * Les sections sont triées par position (ou ordre, selon le modèle PHP).
     *
     * @param {Array} sections  — ex: [{ id: 1, title: 'Intro', position: 1 }, …]
     */
    loadSections(sections) {
        const contentEl = this.getElement('#wb-content');
        if (!contentEl) return;

        // Conteneur dédié aux onglets (vide le contenu précédent)
        const tabsEl = this.dom.create('div', { id: 'wb-tabs', class: 'wb_tabs' });
        contentEl.innerHTML = '';
        contentEl.appendChild(tabsEl);

        // Construction du TabSystem
        this.tabSystem = new TabSystem({
            busEvent : 'cms:section:change',
        });

        [...sections]
            .sort((a, b) => (a.position ?? a.ordre ?? 0) - (b.position ?? b.ordre ?? 0))
            .forEach(section => {
                const tabId = `section-${section.id}`;
                const label = section.title ?? section.titre ?? `Section ${section.id}`;

                this.tabSystem.addTab(
                    tabId,
                    label,
                    // renderFn : pane vide, le contenu arrive via fetchSection
                    () => this.dom.create('div', { class: 'wb_section_content' }),
                    // initFn  : chargement lazy au premier affichage
                    (paneEl) => this.fetchSection(section.id, paneEl)
                );
            });

        // render() active automatiquement le premier onglet
        // → fetchSection() est déclenché immédiatement pour la section 1
        this.tabSystem.render(tabsEl);
    }

    /**
     * Iter006.1 — charge le HTML d'une section via GET /cms/section/{id}.
     * Après injection, relance initRegisteredComponents() pour initialiser
     * les composants (apex, mermaid, leaflet…) présents dans la section.
     *
     * ⚠ Limitation connue (Iter007) : initRegisteredComponents() scanne tout
     *   le document. Un composant déjà initialisé dans une section précédente
     *   peut être affecté. Résolution : passer un root element aux init functions.
     *
     * @param {number}      sectionId
     * @param {HTMLElement} paneEl     — pane cible du TabSystem
     */
    async fetchSection(sectionId, paneEl) {
        // Indicateur de chargement
        paneEl.innerHTML = '<p class="wb_section_loading">⏳ Chargement…</p>';

        try {
            const res = await fetch(`/cms/section/${sectionId}`);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }

            // Injection du fragment HTML retourné par CmsController::section()
            paneEl.innerHTML = await res.text();

            // Re-init des composants présents dans cette section
            this.initRegisteredComponents();

            // Événement bus : section rendue
            this.publish('cms:section:rendered', { sectionId });

        } catch (err) {
            paneEl.innerHTML = `
                <p class="wb_section_error">
                    ❌ Section ${sectionId} indisponible
                    <small style="display:block;margin-top:4px;opacity:.65">${err.message}</small>
                </p>`;
            console.error(`[CmsArticleWorkbench] fetchSection(${sectionId}) →`, err);
        }
    }

    // ── Mode plat (fallback) ──────────────────────────────────────────────────

    /**
     * Rendu direct du HTML PHP — utilisé quand l'article n'a pas de sections
     * ou une seule section.
     */
    renderContent(contentHtml) {
        const content = this.getElement('#wb-content');
        if (content) {
            content.innerHTML = contentHtml || '<p>Aucun contenu disponible.</p>';
        }
    }

    // ── Header ────────────────────────────────────────────────────────────────

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

    // ── Registry des composants ───────────────────────────────────────────────

    setupComponentRegistry() {
        this.register('apex',    initApex);     // ① dépendance de codeval
        this.register('callout', initCallout);  // ② indépendants
        this.register('leaflet', initLeaflet);
        this.register('mermaid', initMermaid);
        this.register('three',   initThree);
        this.register('codeval', initCodeVal);  // ③ consommateur d'events
    }

    // ── TabSystem (accès externe) ─────────────────────────────────────────────

    /**
     * Retourne le TabSystem actif, ou null en mode plat.
     * Permet à un script externe d'activer un onglet programmatiquement.
     *
     * Exemple :
     *   wb.getTabs()?.activate('section-3');
     */
    getTabs() {
        return this.tabSystem;
    }

    // ── Debug ──────────────────────────────────────────────────────────────────

    showDebug(article, content, sections = []) {
        const debugPanel = this.getElement('#wb-debug');
        if (!debugPanel) return;

        const compList = [...this.componentRegistry.keys()]
            .map(k => `<span style="margin-left:6px;color:#7fff7f;">✓ ${k}</span>`)
            .join('');

        const secList = sections.length
            ? sections.map(s =>
                `<li>#${s.id} — ${s.title ?? s.titre ?? '?'} (pos: ${s.position ?? s.ordre ?? '?'})</li>`
              ).join('')
            : '<li style="opacity:.5">aucune</li>';

        debugPanel.style.display = 'block';
        debugPanel.innerHTML = `
            <div style="background:#1a2a4a;color:#eee236;padding:12px;margin:10px 0;border-radius:6px;font-family:monospace;font-size:0.8rem;">
                <strong>🐞 DEBUG — CmsArticleWorkbench (Iter006.1)</strong>
                <button onclick="this.parentElement.parentElement.style.display='none'"
                        style="float:right;background:#c0392b;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">
                    Fermer
                </button>
                <br>
                <strong>Mode :</strong> <span style="color:#7db8f7;">${this._renderMode}</span>
                &nbsp;|&nbsp;
                <strong>Composants :</strong>${compList}
                <br><br>
                <strong>Sections (${sections.length}) :</strong>
                <ul style="margin:4px 0 8px 12px;color:#eee;">${secList}</ul>
                <strong>Article :</strong>
                <pre style="max-height:180px;overflow:auto;color:#eee;margin:4px 0;">${JSON.stringify(article, null, 2)}</pre>
                <hr style="border-color:#334;margin:6px 0;">
                <strong>Content length :</strong> ${content ? content.length : 0} car.
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
