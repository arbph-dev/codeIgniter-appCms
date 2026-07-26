// ================================================
// assets/js/ui/workbench/TabSystem.js
// Système d'onglets générique pour Workbenches
// ================================================
// Iteration005 — nouveau fichier
//
// Usage minimal :
//
//   const tabs = new TabSystem({ busEvent: 'cms:section:change' });
//
//   tabs
//     .addTab('contenu', 'Contenu',  () => monDivContenu)
//     .addTab('plan',    'Plan',     () => monDivPlan,   (pane) => initToc(pane))
//     .render(document.getElementById('wb-tabs'));
//
// Activation programmatique :
//   tabs.activate('plan');
//
// Mise à jour dynamique :
//   tabs.updateTabContent('plan', newHtmlOrElement);

import { bus }    from '/assets/js/core/eventBus.js';
import { create } from '/assets/js/core/domhelper.js';

export class TabSystem {

    /**
     * @param {object} config
     * @param {string}  config.busEvent   — event bus publié au changement d'onglet (optionnel)
     * @param {string}  config.cssWrap    — classe CSS du wrapper racine
     * @param {string}  config.cssNav     — classe CSS de la barre de navigation
     * @param {string}  config.cssBtn     — classe CSS des boutons nav
     * @param {string}  config.cssActive  — classe CSS du bouton/pane actif
     * @param {string}  config.cssContent — classe CSS de la zone de contenu
     * @param {string}  config.cssPane    — classe CSS de chaque pane
     */
    constructor(config = {}) {
        this.tabs     = new Map();   // id → tab descriptor
        this.activeId = null;
        this.el       = null;        // élément racine après render()

        this.busEvent = config.busEvent || null;

        this.css = {
            wrap    : config.cssWrap    || 'wb_tabs',
            nav     : config.cssNav     || 'wb_tabs_nav',
            btn     : config.cssBtn     || 'wb_tab_btn',
            active  : config.cssActive  || 'active',
            content : config.cssContent || 'wb_tabs_content',
            pane    : config.cssPane    || 'wb_tab_pane',
        };
    }

    // ── Ajout d'un onglet ─────────────────────────────────────────────────────

    /**
     * Ajoute un onglet. Chaînable.
     *
     * @param {string}   id       — identifiant unique
     * @param {string}   label    — libellé du bouton
     * @param {Function} renderFn — () => HTMLElement | string  — contenu initial
     * @param {Function} initFn   — (paneEl) => void  — appelé une seule fois à la première activation
     */
    addTab(id, label, renderFn = null, initFn = null) {
        this.tabs.set(id, {
            id,
            label,
            renderFn,
            initFn,
            initialized : false,
            el          : null,     // pane <div>
            btnEl       : null,     // bouton <button>
        });
        return this;
    }

    // ── Activation ────────────────────────────────────────────────────────────

    /**
     * Active un onglet par son id.
     * Déclenche initFn au premier affichage (init paresseuse).
     */
    activate(id) {
        if (!this.tabs.has(id)) {
            console.warn(`[TabSystem] Onglet inconnu : "${id}"`);
            return;
        }

        for (const [tabId, tab] of this.tabs) {
            const isActive = tabId === id;

            if (tab.btnEl) tab.btnEl.classList.toggle(this.css.active, isActive);
            if (tab.el)    tab.el.style.display = isActive ? '' : 'none';

            // Init paresseuse : une seule fois, au premier affichage
            if (isActive && !tab.initialized && tab.initFn) {
                try {
                    tab.initFn(tab.el);
                    tab.initialized = true;
                } catch (e) {
                    console.error(`[TabSystem] Erreur initFn onglet "${id}"`, e);
                }
            }
        }

        this.activeId = id;

        if (this.busEvent) {
            bus.publish(this.busEvent, { tabId: id });
        }

        console.log(`[TabSystem] Onglet actif : "${id}"`);
    }

    // ── Rendu ─────────────────────────────────────────────────────────────────

    /**
     * Construit le système d'onglets dans container et active le premier.
     * @param {HTMLElement} container
     * @returns {HTMLElement} container
     */
    render(container) {
        this.el = container;
        container.innerHTML = '';

        const nav         = create('nav', { class: this.css.nav });
        const contentZone = create('div', { class: this.css.content });

        for (const [id, tab] of this.tabs) {

            // ── Bouton nav ────────────────────────────────────────────────
            const btn = create('button', {
                type         : 'button',
                class        : this.css.btn,
                'data-tab-id': id,
                text         : tab.label,
            }, {
                click: () => this.activate(id),
            });
            tab.btnEl = btn;
            nav.appendChild(btn);

            // ── Pane de contenu ───────────────────────────────────────────
            const pane = create('div', {
                class        : this.css.pane,
                'data-tab-id': id,
                style        : 'display:none',
            });

            if (tab.renderFn) {
                try {
                    const result = tab.renderFn();
                    if (result instanceof HTMLElement) {
                        pane.appendChild(result);
                    } else if (typeof result === 'string') {
                        pane.innerHTML = result;
                    }
                } catch (e) {
                    console.error(`[TabSystem] Erreur renderFn onglet "${id}"`, e);
                }
            }

            tab.el = pane;
            contentZone.appendChild(pane);
        }

        container.appendChild(nav);
        container.appendChild(contentZone);

        // Activer le premier onglet automatiquement
        const firstId = this.tabs.keys().next().value;
        if (firstId) this.activate(firstId);

        return container;
    }

    // ── Mise à jour dynamique ─────────────────────────────────────────────────

    /**
     * Remplace le contenu d'un pane existant.
     * @param {string}               id
     * @param {HTMLElement|string}   content
     */
    updateTabContent(id, content) {
        const tab = this.tabs.get(id);
        if (!tab || !tab.el) {
            console.warn(`[TabSystem] updateTabContent : onglet "${id}" introuvable`);
            return;
        }

        tab.el.innerHTML = '';

        if (content instanceof HTMLElement) {
            tab.el.appendChild(content);
        } else if (typeof content === 'string') {
            tab.el.innerHTML = content;
        }
    }

    /**
     * Ajoute une étiquette/badge à un bouton nav (ex: compteur de sections).
     * @param {string} id
     * @param {string} badgeText
     */
    setBadge(id, badgeText) {
        const tab = this.tabs.get(id);
        if (!tab || !tab.btnEl) return;

        let badge = tab.btnEl.querySelector('.wb_tab_badge');
        if (!badge) {
            badge = create('span', { class: 'wb_tab_badge' });
            tab.btnEl.appendChild(badge);
        }
        badge.textContent = badgeText;
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy() {
        this.tabs.clear();
        if (this.el) this.el.innerHTML = '';
        this.activeId = null;
    }
}
