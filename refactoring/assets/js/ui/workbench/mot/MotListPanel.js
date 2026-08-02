// ============================================================================
// assets/js/ui/workbench/mot/MotListPanel.js
// ============================================================================
// Step 1 — liste, recherche, pagination
// Step 2 — toolbar CRUD (à venir)
//
// Contrat Panel :
//   constructor()
//   render()              → Node racine
//   show(items, pager)    → remplit table + pagination
//   clear()               → empty state
//   showLoading()         → notice loading
//   showError(msg)        → notice error
//   destroy()
//
// Callbacks :
//   onSearch(fn)          → (q: string) => void
//   onSelect(fn)          → (row: {mot_id, mot_lbl}) => void
//
// Pagination :
//   La factory pagination() publie sur busEvent 'wb:mot:page'.
//   MotWorkbench souscrit à cet événement et appelle load(page).
// ============================================================================

import { create, clear, table, pagination, notice }
    from '/assets/js/core/domhelper.js'

export class MotListPanel
{
    constructor()
    {
        this._onSelectFn = null
        this._onSearchFn = null

        this.el      = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.el = create('section', { class: 'wb_mot_list_panel' })

        //──────────────────────────────────────────────────────────────
        // Header
        //──────────────────────────────────────────────────────────────

        const header = create('header', { class: 'wb_panel_header' })
        header.appendChild(create('h2', { text: 'Mots' }))

        //──────────────────────────────────────────────────────────────
        // Barre de recherche
        //──────────────────────────────────────────────────────────────

        const searchBar = create('div', { class: 'wb_mot_search' })

        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_mot_search_input',
            placeholder : 'Rechercher un mot…',
        })

        const searchBtn = create('button', {
            type  : 'button',
            class : 'wb_mot_search_btn',
            text  : 'Rechercher',
        })

        // Déclenchement : clic OU Entrée
        searchBtn.addEventListener('click', () => this._triggerSearch())
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._triggerSearch()
        })

        searchBar.append(this.inputEl, searchBtn)

        //──────────────────────────────────────────────────────────────
        // Zone table + zone pagination
        //──────────────────────────────────────────────────────────────

        this.tableEl = create('div', { class: 'wb_mot_table' })
        this.pagerEl = create('div', { class: 'wb_mot_pager' })

        this.el.append(header, searchBar, this.tableEl, this.pagerEl)

        this.clear()

        return this.el
    }

    /**
     * Affiche la liste et la pagination.
     * @param {Array}       items  — [{mot_id, mot_lbl}]
     * @param {Object|null} pager  — objet pager CodeIgniter
     */
    show(items, pager = null)
    {
        clear(this.tableEl)
        clear(this.pagerEl)

        if (!items?.length)
        {
            this.tableEl.appendChild(notice('empty'))
            return
        }

        this.tableEl.appendChild(
            table({
                id         : 'wbMotTable',
                data       : items,
                columns    : [
                    { key: 'mot_id',  label: 'ID'  },
                    { key: 'mot_lbl', label: 'Mot' },
                ],
                attrs      : { class: 'cp_table' },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )

        if (pager)
        {
            this.pagerEl.appendChild(
                pagination({
                    pager,
                    busEvent   : 'wb:mot:page',     // namespaced — pas de collision
                    style      : 'compact',
                    maxVisible : 5,
                })
            )
        }
    }

    clear()
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('empty'))
    }

    showLoading()
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('loading'))
    }

    showError(msg)
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('error', msg))
    }

    destroy()
    {
        this._onSelectFn = null
        this._onSearchFn = null
        this.el          = null
        this.inputEl     = null
        this.tableEl     = null
        this.pagerEl     = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    /** @param {Function} fn  (q: string) => void */
    onSearch(fn) { this._onSearchFn = fn }

    /** @param {Function} fn  (row: {mot_id, mot_lbl}) => void */
    onSelect(fn) { this._onSelectFn = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _triggerSearch()
    {
        this._onSearchFn?.(this.inputEl?.value.trim() ?? '')
    }
}

export default MotListPanel
