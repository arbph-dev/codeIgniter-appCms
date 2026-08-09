// assets/js/ui/shared/DialogManager.js
// ─────────────────────────────────────────────────────────────────────────────
// Infrastructure IHM pour les <dialog> natifs.
//
// Différences vs old/dialog.js :
//   • Pas de scan DOM à l'init — les dialogs sont créés programmatiquement
//     et enregistrés via register()
//   • select() publie dialog:select ET ferme — les champs relation n'ont
//     pas à connaître le DialogManager
//   • Pas de verrou activeDialog — plusieurs dialogs peuvent exister,
//     le navigateur gère la modale native
//   • Les <dialog> sont insérés dans document.body pour éviter les
//     problèmes de stacking context (overflow:hidden sur les parents)
//
// Export : dialogManager (singleton)
// Bus events entrants  : dialog:show (id), dialog:close (id)
// Bus events sortants  : dialog:select { sourceId, item }
// ─────────────────────────────────────────────────────────────────────────────

import { bus } from '/assets/js/core/eventBus.js'

class DialogManager
{
    constructor()
    {
        /** @type {Map<string, HTMLDialogElement>} */
        this._map = new Map()

        // Bus entrant — compatibilité avec les onclick inline éventuels
        bus.subscribe('dialog:show',  (id) => this.show(id))
        bus.subscribe('dialog:close', (id) => this.close(id))
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Enregistre un <dialog> déjà construit et l'insère dans document.body.
     * Appelé par RelationPickerDialog.render().
     *
     * @param {string}             id
     * @param {HTMLDialogElement}  el
     */
    register(id, el)
    {
        this._map.set(id, el)
        document.body.appendChild(el)
    }

    /**
     * Désenregistre et retire le <dialog> du DOM.
     * Appelé par RelationPickerDialog.destroy().
     *
     * @param {string} id
     */
    unregister(id)
    {
        const el = this._map.get(id)
        if (el)
        {
            if (el.open) el.close()
            el.remove()
            this._map.delete(id)
        }
    }

    /**
     * Ouvre le dialog en mode modal (showModal).
     * @param {string} id
     */
    show(id)
    {
        const el = this._map.get(id)
        if (!el) {
            console.warn(`[DialogManager] Dialog introuvable : "${id}"`)
            return
        }
        el.showModal()
    }

    /**
     * Ferme le dialog.
     * @param {string} id
     */
    close(id)
    {
        const el = this._map.get(id)
        if (el?.open) el.close()
    }

    /**
     * Publie dialog:select puis ferme.
     * Appelé par RelationPickerDialog quand l'utilisateur sélectionne un item.
     *
     * @param {string} id    — dialog source
     * @param {object} item  — item sélectionné (données brutes)
     */
    select(id, item)
    {
        bus.publish('dialog:select', { sourceId: id, item })
        this.close(id)
    }
}

export const dialogManager = new DialogManager()
