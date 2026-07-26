// ================================================
// assets/js/ui/workbench/WorkbenchBase.js
// Base abstraite pour tous les Workbenches
// ================================================
// Iteration005
// + Import bus depuis eventBus.js (suppression window.bus / config.eventBus)
// + Import utilitaires DOM depuis domhelper.js (qs, qsa, byId, create, clear, toggle)
// + this.dom : raccourcis DOM exposés aux classes filles
// + publish(event, data) et subscribe(event, cb) : façade bus
// ~ getElement() utilise qs importé (plus de this.domHelper externe)

import { bus }                             from '/assets/js/core/eventBus.js';
import { qs, qsa, byId, create, clear, toggle } from '/assets/js/core/domhelper.js';

export class WorkbenchBase {

    constructor(config = {}) {
        this.id        = config.id   || `wb-${Date.now()}`;
        this.name      = config.name || 'Unnamed Workbench';
        this.container = null;

        // Iteration005 : bus importé directement, fini window.bus / config.eventBus
        this.bus = bus;

        // Registry des composants (Iteration004)
        this.componentRegistry = new Map();

        // Iteration005 : utilitaires DOM exposés aux classes filles
        this.dom = { qs, qsa, byId, create, clear, toggle };

        // Instances optionnelles
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

    // ── Structure HTML (à surcharger) ─────────────────────────────────────────

    renderStructure() {
        this.container.innerHTML = `
            <div class="wb-header"></div>
            <div class="wb-body">
                <div class="wb-content"></div>
            </div>
        `;
    }

    // ── Bootstrap des sous-composants (à surcharger) ──────────────────────────

    bootstrap() {}

    // ── Événements ────────────────────────────────────────────────────────────

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

    // ── Rafraîchissement ─────────────────────────────────────────────────────

    refresh() {
        console.log(`[Workbench] ${this.name} rafraîchi`);
    }

    // ── Nettoyage ────────────────────────────────────────────────────────────

    destroy() {
        this.components.clear();
        console.log(`[Workbench] ${this.name} détruit`);
    }

    // ── Registry des composants (Iteration004) ────────────────────────────────

    register(componentName, initFunction) {
        if (typeof initFunction === 'function') {
            this.componentRegistry.set(componentName, initFunction);
            console.log(`[Workbench] Composant enregistré : ${componentName}`);
        } else {
            console.warn(`[Workbench] register() : initFunction invalide pour "${componentName}"`);
        }
    }

    initRegisteredComponents() {
        console.log(`[Workbench] Initialisation de ${this.componentRegistry.size} composant(s)`);

        for (const [name, initFn] of this.componentRegistry) {
            try {
                initFn();
                console.log(`[Workbench] → ${name} initialisé`);
            } catch (e) {
                console.error(`[Workbench] Erreur init "${name}"`, e);
            }
        }
    }

    // ── Façade bus (Iteration005) ─────────────────────────────────────────────

    publish(eventName, data = null) {
        this.bus.publish(eventName, data);
    }

    subscribe(eventName, callback) {
        this.bus.subscribe(eventName, callback);
    }

}

export default WorkbenchBase;
