// assets/js/ui/workbench/core/PanelBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Contrat minimal de tous les Panels.
//
// Règles :
//   • render()  doit être implémenté — retourne l'élément DOM racine
//   • show()    signature libre dans la sous-classe
//   • clear()   remet le panel à l'état vide
//   • destroy() libère les ressources ; appelé une seule fois
//
// Ce que PanelBase ne fait PAS :
//   • aucune logique métier
//   • aucun appel API
//   • aucun template
//   • aucune validation
// ─────────────────────────────────────────────────────────────────────────────

export class PanelBase
{
    constructor()
    {
        this.element = null
    }

    // ── Contrat ───────────────────────────────────────────────────────────────

    /**
     * Construit l'élément DOM du panel et le retourne.
     * Doit stocker la référence dans this.element.
     *
     * @returns {HTMLElement}
     */
    render()
    {
        throw new Error(`[${this.constructor.name}] render() n'est pas implémenté.`)
    }

    /**
     * Affiche des données dans le panel.
     * La signature des arguments est libre dans chaque sous-classe.
     *
     * @param {...*} args
     */
    show(...args) { }

    /**
     * Remet le panel dans son état initial (vide).
     */
    clear() { }

    /**
     * Libère toutes les ressources : écouteurs, références DOM, callbacks.
     * Appelé une seule fois, par le Workbench, avant suppression du panel.
     */
    destroy()
    {
        this.element = null
    }
}

export default PanelBase
