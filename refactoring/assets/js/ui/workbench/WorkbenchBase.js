// ================================================
// assets/js/ui/workbench/WorkbenchBase.js
// Base abstraite pour tous les Workbenches
// ================================================

export class WorkbenchBase {



    constructor(config = {}) {
        this.id = config.id || `wb-${Date.now()}`;
        this.name = config.name || 'Unnamed Workbench';
        this.container = null;           // Élément DOM principal

        // ── Références existantes (on réutilise le core actuel) ──
        this.bus = config.eventBus || window.bus || null;           // eventBus global
        this.registry = config.registry || null;
        this.domHelper = config.domHelper || null;

        // ── Instances locales (optionnelles) ──
        this.localBus = config.localBus || null;     // EventBus local si besoin d'isolation
        this.store = config.store || null;           // Store pour la feature (ex: motStore)

        // Configuration
        this.options = {
            hasHeader: true,
            hasNavbar: false,
            hasSidebar: false,
            hasFooter: false,
            fullPage: true,
            ...config.options
        };

        this.state = {
            isLoaded: false,
            currentTab: null,
            data: null
        };

        this.components = new Map();   // Pour stocker les sous-composants
    }







    // ── Initialisation ─────────────────────────────────────
    async init(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`[Workbench] Container ${containerSelector} non trouvé`);
            return false;
        }

        this.renderStructure();
        this.attachEvents();
        this.bootstrap();

        this.state.isLoaded = true;
        console.log(`[Workbench] ${this.name} initialized`);
        return true;
    }




    // Méthode à surcharger par les classes enfants
    renderStructure() {
        // À implémenter dans les classes filles
        this.container.innerHTML = `
            <div class="wb-header"></div>
            <div class="wb-body">
                <div class="wb-content"></div>
            </div>
        `;
    }










    // Bootstrap des sous-composants (à surcharger)
    bootstrap() {
        // Exemple : this.initHeader(); this.initContent(); etc.
    }







    attachEvents() {
        // Gestion globale des événements
        if (this.bus) {
            this.bus.subscribe('wb:refresh', () => this.refresh());
        }
    }



    // Méthodes utilitaires
    getElement(selector) {
        return this.domHelper ? this.domHelper.qs(selector, this.container) : this.container.querySelector(selector);
    }







    show() { if (this.container) this.container.style.display = ''; }

    







    hide() { if (this.container) this.container.style.display = 'none'; }









    refresh() {
        console.log(`[Workbench] ${this.name} refreshed`);
        // À surcharger
    }






    destroy() {
        // Nettoyage
        this.components.clear();
        console.log(`[Workbench] ${this.name} destroyed`);
    }




}
export default WorkbenchBase;// Export pour utilisation
