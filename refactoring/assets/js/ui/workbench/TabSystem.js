// ================================================
// assets/js/ui/workbench/TabSystem.js
// Système d'onglets générique pour Workbenches
// ================================================
// Iteration005 — création
// Iteration006
// ~ activate() : tab.initialized = true positionné AVANT l'appel initFn
//   (évite double-fetch si l'utilisateur clique rapidement avant la réponse)
// ~ activate() : supporte les initFn async (fire-and-forget sécurisé)
// + render()   : retourne this pour chaînage

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
        this.tabs     = new Map();
        this.activeId = null;
        this.el       = null;

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
     * @param {string}   label    — libellé affiché sur le bouton
     * @param {Function} renderFn — () => HTMLElement | string  — contenu initial du pane
     * @param {Function} initFn   — (paneEl) => void | Promise  — lancé UNE SEULE FOIS
     *                              à la première activation (peut être async)
     */
    addTab(id, label, renderFn = null, initFn = null) {
        this.tabs.set(id, {
            id,
            label,
            renderFn,
            initFn,
            initialized : false,
            el          : null,
            btnEl       : null,
        });
        return this;
    }

    // ── Activation ────────────────────────────────────────────────────────────

    /**
     * Active un onglet par son id.
     *
     * Iter006 : tab.initialized est positionné à true AVANT l'appel de initFn.
     * Cela protège contre le double-appel si l'utilisateur clique rapidement
     * pendant un fetch async en cours.
     */
    activate(id) {
        if (!this.tabs.has(id)) {
            console.warn(`[TabSystem] Onglet inconnu : "${id}"`);
            return;
        }

        // ── Mise à jour visuelle (nav + panes) ───────────────────────────────
        for (const [tabId, tab] of this.tabs) {
            const isActive = tabId === id;
            if (tab.btnEl) tab.btnEl.classList.toggle(this.css.active, isActive);
            if (tab.el)    tab.el.style.display = isActive ? '' : 'none';
        }

        // ── Init paresseuse ───────────────────────────────────────────────────
        const tab = this.tabs.get(id);

        if (!tab.initialized && tab.initFn) {
            // Marquer AVANT l'appel : protège le double-init sur clic rapide
            tab.initialized = true;

            try {
                const result = tab.initFn(tab.el);

                // Support async : log l'erreur sans crasher le système
                if (result && typeof result.then === 'function') {
                    result.catch(err => {
                        console.error(`[TabSystem] initFn async onglet "${id}" →`, err);
                        // Permettre une nouvelle tentative si besoin
                        tab.initialized = false;
                    });
                }
            } catch (err) {
                console.error(`[TabSystem] initFn onglet "${id}" →`, err);
                tab.initialized = false; // Permettre retry sur erreur sync
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
     * Construit et rend le système d'onglets dans container.
     * Active le premier onglet automatiquement.
     *
     * @param   {HTMLElement} container
     * @returns {TabSystem}   this — chaînable
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
                } catch (err) {
                    console.error(`[TabSystem] renderFn onglet "${id}" →`, err);
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

        return this;
    }

    // ── Mise à jour dynamique ─────────────────────────────────────────────────

    /**
     * Remplace le contenu d'un pane.
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
     * Ajoute ou met à jour un badge sur le bouton nav (ex: compteur de parts).
     * @param {string} id
     * @param {string} text
     */
    setBadge(id, text) {
        const tab = this.tabs.get(id);
        if (!tab || !tab.btnEl) return;
        let badge = tab.btnEl.querySelector('.wb_tab_badge');
        if (!badge) {
            badge = create('span', { class: 'wb_tab_badge' });
            tab.btnEl.appendChild(badge);
        }
        badge.textContent = text;
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy() {
        this.tabs.clear();
        if (this.el) this.el.innerHTML = '';
        this.activeId = null;
    }
}
