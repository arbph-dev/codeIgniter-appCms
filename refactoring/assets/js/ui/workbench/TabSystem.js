// assets/js/ui/workbench/TabSystem.js
// ─────────────────────────────────────────────────────────────────────────────
// Iteration007
// + onTabChange(fn)  callback pur en alternative à busEvent
//   Le Workbench l'utilise pour lazy-load les données du tab actif
//   sans coupler TabSystem à un namespace bus particulier
// + resetTab(id)     force la re-initialisation au prochain activate()
//   utile après un save : le tab "Adresses" se rechargera à la prochaine visite
// + markDirty(id)    indicateur visuel de modifications non enregistrées
// + clearDirty(id)   retire l'indicateur
// ~ destroy()        nettoie _onTabChangeFn
// ─────────────────────────────────────────────────────────────────────────────

import { bus }    from '/assets/js/core/eventBus.js'
import { create } from '/assets/js/core/domhelper.js'

export class TabSystem
{
    /**
     * @param {object} config
     * @param {string}  [config.busEvent]   Event bus publié au changement d'onglet (optionnel)
     * @param {string}  [config.cssWrap]
     * @param {string}  [config.cssNav]
     * @param {string}  [config.cssBtn]
     * @param {string}  [config.cssActive]
     * @param {string}  [config.cssContent]
     * @param {string}  [config.cssPane]
     */
    constructor(config = {})
    {
        this.tabs     = new Map()
        this.activeId = null
        this.el       = null

        this.busEvent       = config.busEvent || null
        this._onTabChangeFn = null   // iter007 — callback pur

        this.css = {
            wrap    : config.cssWrap    || 'wb_tabs',
            nav     : config.cssNav     || 'wb_tabs_nav',
            btn     : config.cssBtn     || 'wb_tab_btn',
            active  : config.cssActive  || 'active',
            content : config.cssContent || 'wb_tabs_content',
            pane    : config.cssPane    || 'wb_tab_pane',
        }
    }

    // ── Ajout d'un onglet ─────────────────────────────────────────────────────

    /**
     * Ajoute un onglet. Chaînable.
     *
     * @param {string}   id
     * @param {string}   label
     * @param {Function} renderFn  () => HTMLElement | string
     * @param {Function} initFn    (paneEl) => void | Promise — lancé UNE SEULE FOIS
     */
    addTab(id, label, renderFn = null, initFn = null)
    {
        this.tabs.set(id, {
            id,
            label,
            renderFn,
            initFn,
            initialized : false,
            el          : null,
            btnEl       : null,
        })
        return this
    }

    // ── Activation ────────────────────────────────────────────────────────────

    /**
     * Active un onglet par son id.
     *
     * Iter006 : tab.initialized positionné AVANT initFn (protège le double-init).
     * Iter007 : appelle _onTabChangeFn après activation.
     */
    activate(id)
    {
        if (!this.tabs.has(id))
        {
            console.warn(`[TabSystem] Onglet inconnu : "${id}"`)
            return
        }

        // Mise à jour visuelle
        for (const [tabId, tab] of this.tabs)
        {
            const isActive = tabId === id
            if (tab.btnEl) tab.btnEl.classList.toggle(this.css.active, isActive)
            if (tab.el)    tab.el.style.display = isActive ? '' : 'none'
        }

        // Init paresseuse
        const tab = this.tabs.get(id)

        if (!tab.initialized && tab.initFn)
        {
            tab.initialized = true

            try
            {
                const result = tab.initFn(tab.el)

                if (result && typeof result.then === 'function')
                {
                    result.catch(err =>
                    {
                        console.error(`[TabSystem] initFn async "${id}" →`, err)
                        tab.initialized = false
                    })
                }
            }
            catch (err)
            {
                console.error(`[TabSystem] initFn "${id}" →`, err)
                tab.initialized = false
            }
        }

        this.activeId = id

        // iter007 — callback pur (prioritaire sur busEvent)
        this._onTabChangeFn?.(id)

        // busEvent — conservé pour compatibilité descendante
        if (this.busEvent)
        {
            bus.publish(this.busEvent, { tabId: id })
        }

        console.log(`[TabSystem] Onglet actif : "${id}"`)
    }

    // ── Rendu ─────────────────────────────────────────────────────────────────

    /**
     * Construit le système d'onglets dans container.
     * Active le premier onglet automatiquement.
     * @returns {TabSystem} this
     */
    render(container)
    {
        this.el = container
        container.innerHTML = ''

        const nav         = create('nav', { class: this.css.nav })
        const contentZone = create('div', { class: this.css.content })

        for (const [id, tab] of this.tabs)
        {
            const btn = create('button', {
                type         : 'button',
                class        : this.css.btn,
                'data-tab-id': id,
                text         : tab.label,
            }, {
                click: () => this.activate(id),
            })
            tab.btnEl = btn
            nav.appendChild(btn)

            const pane = create('div', {
                class        : this.css.pane,
                'data-tab-id': id,
                style        : 'display:none',
            })

            if (tab.renderFn)
            {
                try
                {
                    const result = tab.renderFn()
                    if (result instanceof HTMLElement) pane.appendChild(result)
                    else if (typeof result === 'string') pane.innerHTML = result
                }
                catch (err)
                {
                    console.error(`[TabSystem] renderFn "${id}" →`, err)
                }
            }

            tab.el = pane
            contentZone.appendChild(pane)
        }

        container.appendChild(nav)
        container.appendChild(contentZone)

        const firstId = this.tabs.keys().next().value
        if (firstId) this.activate(firstId)

        return this
    }

    // ── Callback pur (iter007) ────────────────────────────────────────────────

    /**
     * Enregistre un callback appelé à chaque changement d'onglet.
     * Alternative à busEvent — le Workbench préfère ce pattern (callbacks over bus).
     *
     * @param {Function} fn  (id: string) => void
     * @returns {TabSystem} this
     *
     * @example
     * tabs.onTabChange(id => {
     *     if (id === 'adresses') this._loadAdresses()
     * })
     */
    onTabChange(fn)
    {
        this._onTabChangeFn = fn
        return this
    }

    // ── Gestion du dirty state (iter007) ─────────────────────────────────────

    /**
     * Marque un onglet comme "modifié" — indicateur visuel sur le bouton.
     * @param {string} id
     */
    markDirty(id)
    {
        const tab = this.tabs.get(id)
        if (!tab?.btnEl) return

        tab.btnEl.classList.add('wb_tab_dirty')

        if (!tab.btnEl.querySelector('.wb_tab_dirty_dot'))
        {
            const dot = create('span', { class: 'wb_tab_dirty_dot', 'aria-hidden': 'true' })
            tab.btnEl.appendChild(dot)
        }
    }

    /**
     * Retire l'indicateur dirty d'un onglet.
     * @param {string} id
     */
    clearDirty(id)
    {
        const tab = this.tabs.get(id)
        if (!tab?.btnEl) return

        tab.btnEl.classList.remove('wb_tab_dirty')
        tab.btnEl.querySelector('.wb_tab_dirty_dot')?.remove()
    }

    // ── Re-initialisation (iter007) ───────────────────────────────────────────

    /**
     * Force la re-initialisation d'un onglet au prochain activate().
     * Utile après un save pour que initFn soit rappelé (rechargement des données).
     *
     * @param {string}  id
     * @param {boolean} [clearContent=false]  Vide aussi le pane immédiatement
     */
    resetTab(id, clearContent = false)
    {
        const tab = this.tabs.get(id)
        if (!tab)
        {
            console.warn(`[TabSystem] resetTab : onglet "${id}" introuvable`)
            return
        }

        tab.initialized = false

        if (clearContent && tab.el)
        {
            tab.el.innerHTML = ''
        }

        console.log(`[TabSystem] Tab "${id}" réinitialisé`)
    }

    // ── Mise à jour dynamique ─────────────────────────────────────────────────

    /**
     * Remplace le contenu d'un pane.
     * @param {string}             id
     * @param {HTMLElement|string} content
     */
    updateTabContent(id, content)
    {
        const tab = this.tabs.get(id)
        if (!tab?.el)
        {
            console.warn(`[TabSystem] updateTabContent : onglet "${id}" introuvable`)
            return
        }
        tab.el.innerHTML = ''
        if (content instanceof HTMLElement) tab.el.appendChild(content)
        else if (typeof content === 'string') tab.el.innerHTML = content
    }

    /**
     * Ajoute ou met à jour un badge sur le bouton nav (ex: compteur).
     * @param {string} id
     * @param {string} text
     */
    setBadge(id, text)
    {
        const tab = this.tabs.get(id)
        if (!tab?.btnEl) return

        let badge = tab.btnEl.querySelector('.wb_tab_badge')
        if (!badge)
        {
            badge = create('span', { class: 'wb_tab_badge' })
            tab.btnEl.appendChild(badge)
        }
        badge.textContent = text
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this.tabs.clear()
        if (this.el) this.el.innerHTML = ''
        this.activeId       = null
        this._onTabChangeFn = null
    }
}
