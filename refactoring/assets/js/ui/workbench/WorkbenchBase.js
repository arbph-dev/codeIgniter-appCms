// ================================================
// assets/js/ui/workbench/WorkbenchBase.js
// Base abstraite pour tous les Workbenches
// ================================================
// Iteration005 : import bus direct, domhelper, publish/subscribe
// Iteration007
//   + initRegisteredComponentsIn(rootElement) — init ciblée sur un pane
//     Complète initRegisteredComponents() (scan global, conservé pour compat)

import { bus }                                       from '/assets/js/core/eventBus.js';
import { qs, qsa, byId, create, clear, toggle }      from '/assets/js/core/domhelper.js';

export class WorkbenchBase {

    constructor(config = {}) {
        this.id        = config.id   || `wb-${Date.now()}`;
        this.name      = config.name || 'Unnamed Workbench';
        this.container = null;

        // Bus importé directement (Iter005)
        this.bus = bus;

        // Registry des composants (Iter004)
        this.componentRegistry = new Map();

        // Utilitaires DOM exposés aux classes filles (Iter005)
        this.dom = { qs, qsa, byId, create, clear, toggle };

        this.localBus = config.localBus || null;
        this.store    = config.store    || null;

        this.options = {
            hasHeader  : true,
            hasNavbar  : false,
            hasSidebar : false,
            hasFooter  : false,
            fullPage   : true,
            ...config.options
        };

        this.state = {
            isLoaded   : false,
            currentTab : null,
            data       : null
        };

        this.components = new Map();
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    async init(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`[Workbench] Container "${containerSelector}" non trouvé`);
            return false;
        }
        this.renderStructure();
        this.attachEvents();
        this.bootstrap();
        this.state.isLoaded = true;
        console.log(`[Workbench] ${this.name} initialisé`);
        return true;
    }

    renderStructure() {
        this.container.innerHTML = `
            <div class="wb-header"></div>
            <div class="wb-body">
                <div class="wb-content"></div>
            </div>
        `;
    }

    bootstrap() {}

    attachEvents() {
        this.bus.subscribe('wb:refresh', () => this.refresh());
    }

    // ── Sélecteurs DOM ───────────────────────────────────────────────────────

    getElement(selector) {
        return qs(selector, this.container);
    }

    // ── Visibilité ────────────────────────────────────────────────────────────

    show() { if (this.container) this.container.style.display = ''; }
    hide() { if (this.container) this.container.style.display = 'none'; }

    refresh() { console.log(`[Workbench] ${this.name} rafraîchi`); }

    destroy() {
        this.components.clear();
        console.log(`[Workbench] ${this.name} détruit`);
    }

    // ── Registry des composants ───────────────────────────────────────────────

    register(componentName, initFunction) {
        if (typeof initFunction === 'function') {
            this.componentRegistry.set(componentName, initFunction);
            console.log(`[Workbench] Composant enregistré : ${componentName}`);
        } else {
            console.warn(`[Workbench] register() : initFunction invalide pour "${componentName}"`);
        }
    }

    /**
     * Init globale — scanne document entier.
     * Utilisé à l'ouverture de la page (mode plat) ou en premier appel.
     * Conservé pour compatibilité descendante.
     */
    initRegisteredComponents() {
        console.log(`[Workbench] Init globale — ${this.componentRegistry.size} composant(s)`);
        for (const [name, initFn] of this.componentRegistry) {
            try {
                initFn();
                console.log(`[Workbench] → ${name} initialisé (global)`);
            } catch (e) {
                console.error(`[Workbench] Erreur init "${name}"`, e);
            }
        }
    }

    /**
     * Iter007 — Init ciblée sur un élément racine (pane TabSystem).
     *
     * Chaque initFn reçoit rootElement comme premier argument.
     * Les composants refactorisés (initXxx(root = document)) scannent
     * uniquement rootElement.querySelectorAll(…) au lieu de document.
     *
     * Avantage : un composant déjà rendu dans un pane précédent n'est
     * pas ré-initialisé quand un nouveau pane est activé.
     *
     * @param {Element} rootElement — pane ou tout autre conteneur DOM
     */
    initRegisteredComponentsIn(rootElement) {
        if (!rootElement) {
            console.warn('[Workbench] initRegisteredComponentsIn : rootElement manquant');
            return;
        }
        console.log(`[Workbench] Init ciblée (${this.componentRegistry.size} composant(s)) dans`, rootElement);
        for (const [name, initFn] of this.componentRegistry) {
            try {
                initFn(rootElement);
                console.log(`[Workbench] → ${name} initialisé dans pane`);
            } catch (e) {
                console.error(`[Workbench] Erreur init "${name}" dans pane`, e);
            }
        }
    }

    // ── Façade bus (Iter005) ──────────────────────────────────────────────────

    publish(eventName, data = null) {
        this.bus.publish(eventName, data);
    }

    subscribe(eventName, callback) {
        this.bus.subscribe(eventName, callback);
    }

}

export default WorkbenchBase;
