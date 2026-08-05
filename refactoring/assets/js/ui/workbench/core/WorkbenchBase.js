// assets/js/ui/workbench/core/WorkbenchBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Base commune de tous les Workbenches.
//
// Responsabilités :
//   • accès au container DOM via init()
//   • accès au bus d'événements via this.bus
//   • sélection d'éléments via getElement()
//   • points d'entrée du cycle de vie : bootstrap(), load(), destroy()
//
// Ce que WorkbenchBase ne fait PAS :
//   • aucune construction de layout
//   • aucune gestion de Panel
//   • aucun enregistrement de composant
//   • aucun template
//   • aucun appel API
// ─────────────────────────────────────────────────────────────────────────────

import { bus } from '/assets/js/core/eventBus.js'

export class WorkbenchBase
{
    constructor(config = {})
    {
        this.name      = config.name ?? 'Workbench'
        this.id        = config.id   ?? null
        this.container = null
        this.bus       = bus
    }

    // ── Point d'entrée ────────────────────────────────────────────────────────

    /**
     * Attache le Workbench à son container DOM, injecte le squelette HTML,
     * puis déclenche bootstrap().
     *
     * @param {string} selector  Sélecteur CSS du container racine.
     * @returns {this}
     */
    init(selector)
    {
        this.container = document.querySelector(selector)

        if (!this.container)
        {
            console.error(`[${this.name}] Container introuvable : "${selector}"`)
            return this
        }

        this.renderStructure()
        this.bootstrap()
        return this
    }

    // ── Cycle de vie (à surcharger) ───────────────────────────────────────────

    /**
     * Injecte le squelette HTML dans le container.
     * Appelé avant bootstrap() — les zones doivent exister quand le Workbench
     * fils appelle getElement().
     *
     * Peut être surchargé pour des structures plus riches (ex. CmsArticleWorkbench).
     */
    renderStructure()
    {
        this.container.innerHTML = `<div class="wb-content"></div>`
    }

    /**
     * Initialisation complète : layout, panels, événements, premier chargement.
     * Appelé automatiquement par init() après renderStructure().
     */
    async bootstrap() { }

    /**
     * Chargement ou rechargement des données.
     * Appelé par bootstrap() puis sur chaque changement d'état (recherche, page…).
     */
    async load() { }

    // ── DOM ───────────────────────────────────────────────────────────────────

    /**
     * Raccourci querySelector, cherche dans le container par défaut.
     *
     * @param {string}      selector
     * @param {HTMLElement} [root]   Racine alternative (optionnel).
     * @returns {HTMLElement|null}
     */
    getElement(selector, root = null)
    {
        return (root ?? this.container).querySelector(selector)
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    /**
     * Libère les ressources du Workbench.
     * Les sous-classes doivent appeler super.destroy() en dernier.
     */
    destroy()
    {
        this.container = null
    }
}

export default WorkbenchBase
