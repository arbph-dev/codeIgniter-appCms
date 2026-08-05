// assets/js/ui/workbench/mot/MotListPanel.js

import { create, clear, table, pagination, notice }
    from '/assets/js/core/domhelper.js'

export class MotListPanel
{
    constructor()
    {
        this._onSelectFn = null
        this._onSearchFn = null
        this._onNewFn    = null

        this.element  = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    // ── API publique ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_mot_list_panel' })

        // Header + bouton Nouveau
        const header = create('header', { class: 'wb_panel_header' })
        header.appendChild(
            create('h2', { text: 'Mots' })
        )

        const newBtn = create('button', { type  : 'button', class : 'wb-btn wb_mot_new_btn', text  : '+ Nouveau',} )
        newBtn.addEventListener('click', () => this._onNewFn?.())
        header.appendChild(newBtn)

        // Barre de recherche
        const searchBar = create('div', { class: 'wb_mot_search' })
        this.inputEl = create('input', { type : 'search', class : 'wb_mot_search_input', placeholder : 'Rechercher un mot…', })

        const searchBtn = create('button', { type  : 'button', class : 'wb_mot_search_btn', text  : 'Rechercher',})
        searchBtn.addEventListener('click', () => this._triggerSearch())
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._triggerSearch()
        })

        searchBar.append(this.inputEl, searchBtn)

        // Zones table + pagination
        this.tableEl = create('div', { class: 'wb_mot_table' })
        this.pagerEl = create('div', { class: 'wb_mot_pager' })

        this.element.append(header, searchBar, this.tableEl, this.pagerEl)

        this.clear()
        return this.element
    }

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
                    busEvent   : 'wb:mot:page',
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
        this._onNewFn    = null
        this.element     = null
        this.inputEl     = null
        this.tableEl     = null
        this.pagerEl     = null
    }

    // ── Callbacks ─────────────────────────────────────────────────────────────

    onSearch(fn) { this._onSearchFn = fn }
    onSelect(fn) { this._onSelectFn = fn }
    onNew(fn)    { this._onNewFn    = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _triggerSearch()
    {
        this._onSearchFn?.(this.inputEl?.value.trim() ?? '')
    }
}

export default MotListPanel
