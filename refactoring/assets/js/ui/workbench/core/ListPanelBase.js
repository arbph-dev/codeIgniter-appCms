// assets/js/ui/workbench/core/ListPanelBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Base commune des ListPanels Workbench.
//
// Responsabilités :
//   • contrat callbacks  : onSearch / onSelect / onNew / onPage
//   • états              : showLoading / showError / clear
//   • pagination         : _renderPager via pagination({ onClick })
//   • header optionnel   : toolbar({ title, action })
//
// Ce que ListPanelBase ne fait PAS :
//   • rendu des lignes métier (_renderRows / columns) → sous-classe
//   • appels API
//   • bus métier (wb:xxx:page) — la pagination passe par onPage(fn)
//
// Prérequis D02 : domhelper.pagination accepte onClick (prioritaire sur busEvent).
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { create, clear, pagination, notice } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'

export class ListPanelBase extends PanelBase
{
    /**
     * @param {object}  [options]
     * @param {string}  [options.title]            Titre toolbar (null = pas de header auto)
     * @param {string}  [options.newLabel]         Label bouton Nouveau (null = pas de bouton)
     * @param {string}  [options.panelClass]       Classe CSS du <section>
     * @param {string}  [options.searchPlaceholder]
     * @param {string}  [options.pagerStyle]       'compact' | 'buttons' | 'prev-next'
     * @param {number}  [options.pagerMaxVisible]
     */
    constructor({
        title             = null,
        newLabel          = null,
        panelClass        = 'wb_list_panel',
        searchPlaceholder = 'Rechercher…',
        pagerStyle        = 'compact',
        pagerMaxVisible   = 5,
    } = {})
    {
        super()

        this._title             = title
        this._newLabel          = newLabel
        this._panelClass        = panelClass
        this._searchPlaceholder = searchPlaceholder
        this._pagerStyle        = pagerStyle
        this._pagerMaxVisible   = pagerMaxVisible

        // Callbacks Panel → Workbench
        this._onSearchFn = null
        this._onSelectFn = null
        this._onNewFn    = null
        this._onPageFn   = null

        // Refs DOM (remplies par render())
        this.element  = null
        this.inputEl  = null
        this.tableEl  = null   // zone résultats (table, grille, liste…)
        this.pagerEl  = null
    }

    // ── Cycle de vie ──────────────────────────────────────────────────────────

    /**
     * Structure DOM standard :
     *   header (toolbar) → search → body (tableEl) → pager (pagerEl)
     * Surcharger render() uniquement si le markup doit diverger (ex. ImageTagger).
     */
    render()
    {
        this.element = create('section', { class: this._panelClass })

        const header = this._renderHeader()
        if (header) this.element.appendChild(header)

        this.element.appendChild(this._renderSearch())

        this.tableEl = create('div', { class: 'wb_list_body' })
        this.element.appendChild(this.tableEl)

        this.pagerEl = create('div', { class: 'wb_list_pager' })
        this.element.appendChild(this.pagerEl)

        this.clear()
        return this.element
    }

    destroy()
    {
        this._onSearchFn = null
        this._onSelectFn = null
        this._onNewFn    = null
        this._onPageFn   = null

        this.element = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    // ── Surface Workbench → Panel ─────────────────────────────────────────────

    /**
     * Affiche les items + pagination.
     * Délègue le rendu des lignes à _renderRows (sous-classe).
     *
     * @param {object[]} items
     * @param {object|null} pager  { currentPage, pageCount, … }
     */
    show(items, pager = null)
    {
        if (!this.tableEl) return

        clear(this.tableEl)
        clear(this.pagerEl)

        if (!items?.length)
        {
            this.tableEl.appendChild(notice('empty'))
            return
        }

        this._renderRows(items)
        this._renderPager(pager)
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

    clear()
    {
        if (!this.tableEl) return
        clear(this.tableEl)
        clear(this.pagerEl)
        this.tableEl.appendChild(notice('empty'))
    }

    // ── Surface Panel → Workbench (callbacks) ─────────────────────────────────

    onSearch(fn) { this._onSearchFn = fn }
    onSelect(fn) { this._onSelectFn = fn }
    onNew(fn)    { this._onNewFn    = fn }
    onPage(fn)   { this._onPageFn   = fn }

    // ── Hooks sous-classe ─────────────────────────────────────────────────────

    /**
     * Obligatoire — injecte le contenu métier dans this.tableEl.
     * Typiquement : table({ data, columns, onRowClick: item => this._onSelectFn?.(item) })
     *
     * @param {object[]} items
     */
    _renderRows(items)
    {
        throw new Error(`${this.constructor.name} must implement _renderRows(items)`)
    }

    /**
     * Header toolbar. Retourne null pour supprimer le header.
     * Override si actions non standard.
     */
    _renderHeader()
    {
        if (!this._title) return null

        return toolbar({
            title  : this._title,
            action : this._newLabel
                ? { label: this._newLabel, onClick: () => this._onNewFn?.() }
                : null,
        })
    }

    /**
     * Barre de recherche. Override pour masquer ou personnaliser.
     */
    _renderSearch()
    {
        const wrap = create('div', { class: 'wb_list_search' })

        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_list_search_input',
            placeholder : this._searchPlaceholder,
            autocomplete: 'off',
        })

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._triggerSearch()
        })

        const btn = create('button', {
            type  : 'button',
            class : 'wb-btn',
            text  : 'Rechercher',
        })
        btn.addEventListener('click', () => this._triggerSearch())

        wrap.append(this.inputEl, btn)
        return wrap
    }

    // ── Internes ──────────────────────────────────────────────────────────────

    _renderPager(pager)
    {
        if (!this.pagerEl || !pager) return

        this.pagerEl.appendChild(
            pagination({
                pager,
                onClick    : (page) => this._onPageFn?.(page),
                style      : this._pagerStyle,
                maxVisible : this._pagerMaxVisible,
            })
        )
    }

    _triggerSearch()
    {
        this._onSearchFn?.(this.inputEl?.value.trim() ?? '')
    }
}

export default ListPanelBase