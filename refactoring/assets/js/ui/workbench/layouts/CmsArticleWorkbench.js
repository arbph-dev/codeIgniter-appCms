// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
//=============================================================================
// Iter005 : imports directs composants, bus via WorkbenchBase
// Iter006.1 : loadSections(), fetchSection(), mode tabs/plat
// Iter007
//   ~ fetchSection() : initRegisteredComponents() → initRegisteredComponentsIn(paneEl)
//     Chaque composant est initialisé uniquement dans le pane courant.
//     Les panes déjà rendus ne sont pas affectés.

import WorkbenchBase from '../WorkbenchBase.js';
import { TabSystem }  from '../TabSystem.js';

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

        this.debugEnabled = config.debug ?? true;
        this.tabSystem    = null;
        this.article      = null;
        this._renderMode  = 'flat';
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

        // Enregistrement des composants
        this.setupComponentRegistry();

        // Iter007 : en mode plat → init globale (document)
        //           en mode tabs → no-op ici, init ciblée dans fetchSection()
        if (this._renderMode === 'flat') {
            this.initRegisteredComponents();
        } else {
            // Premier appel sans root : setup des bus subscriptions (guard _initialized)
            // sans scanner de DOM vide. Chaque composant sera init dans son pane.
            this._bootstrapComponentBus();
        }

        this.publish('cms:article:loaded', {
            slug : article?.slug,
            mode : this._renderMode,
        });

        if (this.debugEnabled) {
            this.showDebug(article, content, sections);
        }
    }

    /**
     * Iter007 — En mode tabs, déclenche une fois initXxx() sans root
     * pour que chaque composant enregistre ses bus subscriptions (_initialized guard).
     * Aucun élément DOM n'est scanné (les panes sont vides à ce stade).
     */
    _bootstrapComponentBus() {
        console.log('[CmsArticleWorkbench] Bootstrap bus composants (mode tabs)');
        for (const [name, initFn] of this.componentRegistry) {
            try {
                // Appel sans argument → root = document, mais les panes sont vides
                // → aucun composant trouvé, seuls les bus subscriptions sont enregistrés
                initFn();
                console.log(`[CmsArticleWorkbench] → ${name} bus enregistré`);
            } catch (e) {
                console.error(`[CmsArticleWorkbench] Erreur bootstrap bus "${name}"`, e);
            }
        }
    }

    // ── Mode onglets ──────────────────────────────────────────────────────────

    loadSections(sections) {
        const contentEl = this.getElement('#wb-content');
        if (!contentEl) return;

        const tabsEl = this.dom.create('div', { id: 'wb-tabs', class: 'wb_tabs' });
        contentEl.innerHTML = '';
        contentEl.appendChild(tabsEl);

        this.tabSystem = new TabSystem({ busEvent: 'cms:section:change' });

        [...sections]
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .forEach(section => {
                const tabId = `section-${section.id}`;
                const label = section.title ?? section.titre ?? `Section ${section.id}`;

                this.tabSystem.addTab(
                    tabId,
                    label,
                    () => this.dom.create('div', { class: 'wb_section_content' }),
                    (paneEl) => this.fetchSection(section.id, paneEl)
                );
            });

        this.tabSystem.render(tabsEl);
    }

    /**
     * Iter007 — Charge le HTML d'une section, puis init les composants
     * UNIQUEMENT dans ce pane via initRegisteredComponentsIn(paneEl).
     *
     * Les panes déjà rendus ne sont pas affectés.
     *
     * @param {number}      sectionId
     * @param {HTMLElement} paneEl
     */
    async fetchSection(sectionId, paneEl) {
        paneEl.innerHTML = '<p class="wb_section_loading">⏳ Chargement…</p>';

        try {
            const res = await fetch(`/cms/section/${sectionId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

            paneEl.innerHTML = await res.text();

            // Iter007 : init ciblée — seul ce pane est scanné
            this.initRegisteredComponentsIn(paneEl);

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

    // ── Registry ─────────────────────────────────────────────────────────────

    setupComponentRegistry() {
        this.register('apex',    initApex);
        this.register('callout', initCallout);
        this.register('leaflet', initLeaflet);
        this.register('mermaid', initMermaid);
        this.register('three',   initThree);
        this.register('codeval', initCodeVal);
    }

    // ── TabSystem (accès externe) ─────────────────────────────────────────────

    getTabs() { return this.tabSystem; }

    // ── Debug ──────────────────────────────────────────────────────────────────

    showDebug(article, content, sections = []) {
        const debugPanel = this.getElement('#wb-debug');
        if (!debugPanel) return;

        const compList = [...this.componentRegistry.keys()]
            .map(k => `<span style="margin-left:6px;color:#7fff7f;">✓ ${k}</span>`)
            .join('');

        const secList = sections.length
            ? sections.map(s =>
                `<li>#${s.id} — ${s.title ?? '?'} (pos: ${s.position ?? '?'})</li>`
              ).join('')
            : '<li style="opacity:.5">aucune</li>';

        debugPanel.style.display = 'block';
        debugPanel.innerHTML = `
            <div style="background:#1a2a4a;color:#eee236;padding:12px;margin:10px 0;border-radius:6px;font-family:monospace;font-size:0.8rem;">
                <strong>🐞 DEBUG — CmsArticleWorkbench (Iter007)</strong>
                <button onclick="this.parentElement.parentElement.style.display='none'"
                        style="float:right;background:#c0392b;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">
                    Fermer
                </button>
                <br>
                <strong>Mode :</strong> <span style="color:#7db8f7;">${this._renderMode}</span>
                &nbsp;|&nbsp;
                <strong>Init :</strong> <span style="color:#7db8f7;">${this._renderMode === 'tabs' ? 'ciblée par pane' : 'globale (document)'}</span>
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
