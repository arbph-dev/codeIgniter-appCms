// assets/js/ui/workbench/core/WorkbenchView.js
// ─────────────────────────────────────────────────────────────────────────────
// Construit le layout d'un Workbench et gère le montage / démontage des Panels.
//
// Responsabilités (uniquement) :
//   • créer le div layout + les divs de zone dans le container
//   • monter les Panels dans leurs zones (appelle panel.render())
//   • démonter les Panels (vide les zones sans détruire les panels)
//   • exposer getZone() pour accès direct si nécessaire
//
// Ce que WorkbenchView ne fait PAS :
//   • aucun template
//   • aucune validation
//   • aucun appel API
//   • aucune logique métier
//   • ne détruit pas les panels (responsabilité du Workbench)
// ─────────────────────────────────────────────────────────────────────────────

import { create } from '/assets/js/core/domhelper.js'

export class WorkbenchView
{
    /**
     * @param {Readonly<object>} descriptor  Produit par createDescriptor()
     * @param {HTMLElement}      container   Zone cible (ex. .wb-content)
     */
    constructor(descriptor, container)
    {
        this._descriptor = descriptor
        this._container  = container
        this._zones      = new Map()   // name → HTMLElement
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Injecte le layout et les zones dans le container.
     * Doit être appelé avant mountPanels().
     */
    build()
    {
        const layout = create('div', { class: this._descriptor.css })

        this._descriptor.zones.forEach(zone =>
        {
            const el = create('div', { class: zone.css })
            this._zones.set(zone.name, el)
            layout.appendChild(el)
        })

        this._container.appendChild(layout)
    }

    /**
     * Monte les Panels dans leurs zones respectives.
     * Appelle panel.render() et appende le résultat dans la zone.
     *
     * @param {Record<string, PanelBase>} panels  { left: listPanel, right: detailPanel }
     *
     * @example
     * this._view.mountPanels({
     *     left  : this.listPanel,
     *     right : this.detailPanel,
     * })
     */
    mountPanels(panels = {})
    {
        Object.entries(panels).forEach(([zoneName, panel]) =>
        {
            const zone = this._zones.get(zoneName)

            if (!zone)
            {
                console.warn(`[WorkbenchView] Zone introuvable : "${zoneName}"`)
                return
            }

            zone.appendChild(panel.render())
        })
    }

    /**
     * Vide toutes les zones (retire les éléments du DOM).
     * Ne détruit pas les panels — c'est la responsabilité du Workbench.
     */
    unmountPanels()
    {
        this._zones.forEach(zone =>
        {
            while (zone.firstChild) zone.removeChild(zone.firstChild)
        })
    }

    /**
     * Retourne l'élément DOM d'une zone par son nom.
     * @param {string} name
     * @returns {HTMLElement|undefined}
     */
    getZone(name)
    {
        return this._zones.get(name)
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    /**
     * Libère les références internes.
     * Appelé par le Workbench après destroy() des panels.
     */
    destroy()
    {
        this._zones.clear()
        this._container = null
        this._descriptor = null
    }
}

export default WorkbenchView
