// assets/js/ui/workbench/layouts/CmsArticleWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// Phase E : migration vers new WorkbenchBase + ComponentRegistry
//
// Changements vs version précédente (WorkbenchBase0) :
//   • WorkbenchBase0       → core/WorkbenchBase
//   • this.componentRegistry
//     this.register()
//     this.initRegisteredComponents()
//     this.initRegisteredComponentsIn() → this._registry (ComponentRegistry)
//   • this._bootstrapComponentBus()    → this._registry.initAll() (même appel)
//   • this.publish()                   → this.bus.publish()
//   • this.dom.create()                → create() importé de domhelper
//   • setupComponentRegistry()         → _setupRegistry() (interne)
//   • destroy() ajouté explicitement
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase      from '../core/WorkbenchBase.js'
import { TabSystem }      from '../TabSystem.js'
import { ComponentRegistry } from '../core/ComponentRegistry.js'
import { create }         from '/assets/js/core/domhelper.js'

import { initApex }              from '/assets/js/components/apex.js'
import { initCallout }           from '/assets/js/components/callout.js'
import { initCodeVal }           from '/assets/js/components/codeval.js'
import { initLeaflet }           from '/assets/js/components/leaflet.js'
import { initMermaid }           from '/assets/js/components/mermaid.js'
import { init as initThree }     from '/assets/js/components/three/index.js'

export class CmsArticleWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({
            id  : 'cms-article-wb',
            name: 'Cms Article Workbench',
            ...config
        })

        this.debugEnabled = config.debug ?? true
        this.tabSystem    = null
        this.article      = null
        this._renderMode  = 'flat'
        this._registry    = new ComponentRegistry('CmsArticleWorkbench')
    }

    // ── Structure HTML (override WorkbenchBase.renderStructure) ───────────────

    renderStructure()
    {
        this.container.innerHTML = `
            <div class="cms_article_wrap">
                <header class="cms_article_header" id="wb-header"></header>
                <div id="wb-debug" style="display:none;"></div>
                <main class="cms_article_body" id="wb-content"></main>
                <footer class="wb-footer" id="wb-footer"></footer>
            </div>
        `
    }

    // ── Point d'entrée principal ──────────────────────────────────────────────

    loadFromPHP(article, content)
    {
        this.article = article
        this.renderHeader(article)

        const sections = Array.isArray(article.sections) ? article.sections : []

        if (sections.length > 1)
        {
            this._renderMode = 'tabs'
            this.loadSections(sections)
        }
        else
        {
            this._renderMode = 'flat'
            this.renderContent(content)
        }

        this._setupRegistry()

        // Mode flat  : contenu présent → init réelle des composants
        // Mode tabs  : panes vides → seules les bus subscriptions sont enregistrées
        this._registry.initAll()

        this.bus.publish('cms:article:loaded', {
            slug : article?.slug,
            mode : this._renderMode,
        })

        if (this.debugEnabled)
        {
            this.showDebug(article, content, sections)
        }
    }

    // ── Mode onglets ──────────────────────────────────────────────────────────

    loadSections(sections)
    {
        const contentEl = this.getElement('#wb-content')
        if (!contentEl) return

        const tabsEl = create('div', { id: 'wb-tabs', class: 'wb_tabs' })
        contentEl.innerHTML = ''
        contentEl.appendChild(tabsEl)

        this.tabSystem = new TabSystem({ busEvent: 'cms:section:change' })

        ;[...sections]
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .forEach(section =>
            {
                const tabId = `section-${section.id}`
                const label = section.title ?? section.titre ?? `Section ${section.id}`

                this.tabSystem.addTab(
                    tabId,
                    label,
                    () => create('div', { class: 'wb_section_content' }),
                    (paneEl) => this.fetchSection(section.id, paneEl)
                )
            })

        this.tabSystem.render(tabsEl)
    }

    /**
     * Charge le HTML d'une section, puis initialise les composants
     * uniquement dans ce pane via _registry.initIn(paneEl).
     * Les panes déjà rendus ne sont pas affectés.
     *
     * @param {number}      sectionId
     * @param {HTMLElement} paneEl
     */
    async fetchSection(sectionId, paneEl)
    {
        paneEl.innerHTML = '<p class="wb_section_loading">⏳ Chargement…</p>'

        try
        {
            const res = await fetch(`/cms/section/${sectionId}`)
            if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

            paneEl.innerHTML = await res.text()

            this._registry.initIn(paneEl)

            this.bus.publish('cms:section:rendered', { sectionId })
        }
        catch (err)
        {
            paneEl.innerHTML = `
                <p class="wb_section_error">
                    ❌ Section ${sectionId} indisponible
                    <small style="display:block;margin-top:4px;opacity:.65">${err.message}</small>
                </p>`
            console.error(`[CmsArticleWorkbench] fetchSection(${sectionId}) →`, err)
        }
    }

    // ── Mode plat ─────────────────────────────────────────────────────────────

    renderContent(contentHtml)
    {
        const content = this.getElement('#wb-content')
        if (content)
        {
            content.innerHTML = contentHtml || '<p>Aucun contenu disponible.</p>'
        }
    }

    // ── Header ────────────────────────────────────────────────────────────────

    renderHeader(article)
    {
        const header = this.getElement('#wb-header')
        if (!header || !article) return

        header.innerHTML = `
            <h1>${article.title || 'Sans titre'}</h1>
            ${article.description ? `<p>${article.description}</p>` : ''}
            ${article.published_at ? `
                <p class="cms_article_meta">
                    Publié le <time>${new Date(article.published_at).toLocaleDateString('fr-FR')}</time>
                </p>
            ` : ''}
        `
    }

    // ── Registry ──────────────────────────────────────────────────────────────

    _setupRegistry()
    {
        this._registry
            .register('apex',    initApex)
            .register('callout', initCallout)
            .register('leaflet', initLeaflet)
            .register('mermaid', initMermaid)
            .register('three',   initThree)
            .register('codeval', initCodeVal)
    }

    // ── TabSystem (accès externe) ─────────────────────────────────────────────

    getTabs() { return this.tabSystem }

    // ── Debug ─────────────────────────────────────────────────────────────────

    showDebug(article, content, sections = [])
    {
        const debugPanel = this.getElement('#wb-debug')
        if (!debugPanel) return

        const compList = [...this._registry.keys()]
            .map(k => `<span style="margin-left:6px;color:#7fff7f;">✓ ${k}</span>`)
            .join('')

        const secList = sections.length
            ? sections.map(s =>
                `<li>#${s.id} — ${s.title ?? '?'} (pos: ${s.position ?? '?'})</li>`
              ).join('')
            : '<li style="opacity:.5">aucune</li>'

        debugPanel.style.display = 'block'
        debugPanel.innerHTML = `
            <div style="background:#1a2a4a;color:#eee236;padding:12px;margin:10px 0;border-radius:6px;font-family:monospace;font-size:0.8rem;">
                <strong>🐞 DEBUG — CmsArticleWorkbench (Phase E)</strong>
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
        `
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this._registry.destroy()
        this.tabSystem = null
        this.article   = null
        super.destroy()
    }
}

// ── Helper ────────────────────────────────────────────────────────────────────

export function createCmsArticleWorkbench(containerSelector = '#wb-container')
{
    const wb = new CmsArticleWorkbench()
    wb.init(containerSelector)
    return wb
}
