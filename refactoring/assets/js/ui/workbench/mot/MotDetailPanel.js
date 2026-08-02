// ============================================================================
// assets/js/ui/workbench/mot/MotDetailPanel.js
// ============================================================================
// Step 1 — champs plats depuis la row de liste (mot_id, mot_lbl)
//           Pas de second appel API : le Workbench passe la row directement.
//
// Step 2 — actions CRUD (Modifier / Supprimer)
// Step 3 — enrichissement via fetchMot({ id }) côté Workbench
//           + MotRelationsPanel (synonymes, catégories, …)
//
// Contrat Panel :
//   constructor()
//   render()      → Node racine
//   show(mot)     → affiche {mot_id, mot_lbl, …}
//   clear()       → empty state
//   destroy()
// ============================================================================

import { create, clear, detail } from '/assets/js/core/domhelper.js'

export class MotDetailPanel
{
    constructor()
    {
        this.el     = null
        this.bodyEl = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.el = create('section', { class: 'wb_mot_detail_panel' })

        const header = create('header', { class: 'wb_panel_header' })
        header.appendChild(create('h2', { text: 'Détail' }))

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.el.append(header, this.bodyEl)

        this.clear()

        return this.el
    }

    /**
     * Affiche les propriétés d'un mot.
     *
     * Step 1  : row directe depuis la liste — {mot_id, mot_lbl}
     * Step 3  : objet enrichi par fetchMot({ id }) — champs relations inclus
     *
     * @param {Object|null} mot
     */
    show(mot)
    {
        clear(this.bodyEl)

        if (!mot)
        {
            this._showEmpty()
            return
        }

        //──────────────────────────────────────────────────────────────
        // Step 1 — champs plats
        //──────────────────────────────────────────────────────────────

        this.bodyEl.appendChild(
            detail([
                { label : 'ID',  value : mot.mot_id  },
                { label : 'Mot', value : mot.mot_lbl },
                // Step 3 : ajouter ici catégorie, synonymes, etc.
            ])
        )

        // Step 2 : actions CRUD à insérer ici (panel boutons ou inline)
    }

    clear()
    {
        if (!this.bodyEl) return
        this._showEmpty()
    }

    destroy()
    {
        this.el     = null
        this.bodyEl = null
    }

    // ── Privées ───────────────────────────────────────────────────────────────

    _showEmpty()
    {
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', {
                class : 'wb_empty',
                text  : 'Sélectionnez un mot dans la liste.',
            })
        )
    }
}

export default MotDetailPanel
