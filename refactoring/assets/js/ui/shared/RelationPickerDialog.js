// assets/js/ui/shared/RelationPickerDialog.js
// ─────────────────────────────────────────────────────────────────────────────
// Dialog générique de sélection d'une entité liée.
//
// Responsabilités :
//   • créer le <dialog> DOM et l'enregistrer dans DialogManager
//   • gérer la recherche avec debounce via fetchFn
//   • afficher les résultats dans une table
//   • publier dialogManager.select(id, item) sur sélection de ligne
//
// Ce que RelationPickerDialog ne fait PAS :
//   • ne connaît pas le champ Form qui l'a ouvert
//   • ne transforme pas l'item (labelKey, valueKey) — c'est Form.js qui sait
//     quoi extraire de l'item brut retourné dans dialog:select
//   • ne stocke aucun état persistant entre deux ouvertures
//
// Paramètres :
//   id         {string}    — ID unique du dialog (= sourceId dans dialog:select)
//   title      {string}    — titre affiché dans le header
//   fetchFn    {Function}  — async (q: string) => object[]
//   columns    {Array}     — [{key, label}] pour la table de résultats
//   minLength  {number}    — nb de chars avant déclenchement (défaut : 2)
// ─────────────────────────────────────────────────────────────────────────────

import { create, clear, table, notice } from '/assets/js/core/domhelper.js'
import { dialogManager }                from '/assets/js/ui/shared/DialogManager.js'

export class RelationPickerDialog
{
    constructor({
        id,
        title     = 'Sélectionner',
        fetchFn,
        columns   = [],
        minLength = 2,
    } = {})
    {
        this.id        = id
        this.title     = title
        this.fetchFn   = fetchFn
        this.columns   = columns
        this.minLength = minLength

        this._dialogEl  = null
        this._searchEl  = null
        this._resultsEl = null
        this._timer     = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Construit le <dialog>, l'enregistre dans DialogManager.
     * Chaînable.
     * @returns {RelationPickerDialog}
     */
    render()
    {
        const dialog = document.createElement('dialog')
        dialog.id        = this.id
        dialog.className = 'cp_picker_dialog'

        dialog.appendChild(this._buildHeader())
        dialog.appendChild(this._buildSearch())

        this._resultsEl = create('div', { class: 'cp_picker_results' })
        this._showHint()
        dialog.appendChild(this._resultsEl)

        // Réinitialise la recherche à chaque fermeture (Escape ou bouton ✕)
        dialog.addEventListener('close', () => this._reset())

        this._dialogEl = dialog
        dialogManager.register(this.id, dialog)

        return this
    }

    /**
     * Retire le dialog du DOM et du DialogManager.
     */
    destroy()
    {
        clearTimeout(this._timer)
        dialogManager.unregister(this.id)
        this._dialogEl  = null
        this._searchEl  = null
        this._resultsEl = null
    }

    // ── Construction DOM ──────────────────────────────────────────────────────

    _buildHeader()
    {
        const header = create('div', { class: 'cp_picker_header' })

        header.appendChild(create('h2', { text: this.title }))

        const closeBtn = create('button', {
            type        : 'button',
            class       : 'cp_picker_close',
            'aria-label': 'Fermer',
            text        : '✕',
        })
        closeBtn.addEventListener('click', () => dialogManager.close(this.id))
        header.appendChild(closeBtn)

        return header
    }

    _buildSearch()
    {
        const wrap = create('div', { class: 'cp_picker_search' })

        this._searchEl = create('input', {
            type        : 'search',
            autocomplete: 'off',
            placeholder : `Rechercher… (min. ${this.minLength} car.)`,
        })

        this._searchEl.addEventListener('input',   () => this._handleInput())
        this._searchEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') dialogManager.close(this.id)
        })

        wrap.appendChild(this._searchEl)
        return wrap
    }

    // ── Recherche ─────────────────────────────────────────────────────────────

    _handleInput()
    {
        const q = this._searchEl.value.trim()

        clear(this._resultsEl)
        clearTimeout(this._timer)

        if (q.length < this.minLength)
        {
            this._showHint()
            return
        }

        this._resultsEl.appendChild(notice('loading'))

        this._timer = setTimeout(() => this._search(q), 280)
    }

    async _search(q)
    {
        try
        {
            const items = await this.fetchFn(q)
            this._showResults(items)
        }
        catch (err)
        {
            clear(this._resultsEl)
            this._resultsEl.appendChild(notice('error', err.message))
        }
    }

    // ── Résultats ─────────────────────────────────────────────────────────────

    _showResults(items)
    {
        clear(this._resultsEl)

        if (!items?.length)
        {
            this._resultsEl.appendChild(notice('empty'))
            return
        }

        this._resultsEl.appendChild(
            table({
                data       : items,
                columns    : this.columns,
                attrs      : { class: 'cp_table' },
                onRowClick : (item) => this._select(item),
            })
        )
    }

    /**
     * Publie la sélection via DialogManager (qui publie dialog:select + ferme).
     * @param {object} item  — ligne brute retournée par fetchFn
     */
    _select(item)
    {
        dialogManager.select(this.id, item)
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _showHint()
    {
        clear(this._resultsEl)
        this._resultsEl.appendChild(
            create('p', {
                class : 'cp_notice',
                text  : `🔍 Saisir au moins ${this.minLength} caractère(s) pour rechercher.`,
            })
        )
    }

    /** Réinitialise l'état interne — appelé sur close du dialog. */
    _reset()
    {
        if (this._searchEl) this._searchEl.value = ''
        clearTimeout(this._timer)
        this._showHint()
    }
}

export default RelationPickerDialog
