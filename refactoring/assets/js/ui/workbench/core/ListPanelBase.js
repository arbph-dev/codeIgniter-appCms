// assets/js/ui/workbench/core/ListPanelBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Base commune des ListPanels.
// CSS : uniquement le canon wb_list_* / wb_panel_* / wb-btn (via PanelStyles).
// Pagination : onClick → onPage(fn)  (prérequis D02 domhelper).
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { DEFAULT_LIST_STYLES,} from '/assets/js/ui/workbench/core/PanelStyles.js'
import { create, clear, pagination, notice } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'

export class ListPanelBase extends PanelBase
{
    /**
     * @param {object}  [options]
     * @param {string}  [options.title]
     * @param {string}  [options.newLabel]
     * @param {string}  [options.searchPlaceholder]
     * @param {string}  [options.pagerStyle]
     * @param {number}  [options.pagerMaxVisible]
     * @param {object}  [options.styles]   override PanelStyles
     */
    constructor({
        title             = null,
        newLabel          = null,
        searchPlaceholder = 'Rechercher…',
        pagerStyle        = 'compact',
        pagerMaxVisible   = 5,
        styles            = null,
    } = {})
    {
        super({ styles })

        this._title             = title
        this._newLabel          = newLabel
        this._searchPlaceholder = searchPlaceholder
        this._pagerStyle        = pagerStyle
        this._pagerMaxVisible   = pagerMaxVisible

        this._onSearchFn = null
        this._onSelectFn = null
        this._onNewFn    = null
        this._onPageFn   = null

        this.element = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    _defaultStyles()
    {
        return DEFAULT_LIST_STYLES
    }

    // ── Cycle de vie ──────────────────────────────────────────────────────────

    render()
    {
        const s = this.styles

        this.element = create('section', { class: s.root })

        const header = this._renderHeader()
        if (header) this.element.appendChild(header)

        this.element.appendChild(this._renderSearch())

        this.tableEl = create('div', { class: s.body })
        this.pagerEl = create('div', { class: s.pager })
        this.element.append(this.tableEl, this.pagerEl)

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

    // ── Workbench → Panel ─────────────────────────────────────────────────────

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

    // ── Panel → Workbench ─────────────────────────────────────────────────────

    onSearch(fn) { this._onSearchFn = fn }
    onSelect(fn) { this._onSelectFn = fn }
    onNew(fn)    { this._onNewFn    = fn }
    onPage(fn)   { this._onPageFn   = fn }

    // ── Hooks ─────────────────────────────────────────────────────────────────

    /** @param {object[]} items */
    _renderRows(items)
    {
        throw new Error(`${this.constructor.name} must implement _renderRows(items)`)
    }

    _renderHeader()
    {
        if (!this._title) return null

        return toolbar({
            title  : this._title,
            action : this._newLabel
                ? {
                    label   : this._newLabel,
                    css     : this.styles.btnNew,
                    onClick : () => this._onNewFn?.(),
                }
                : null,
        })
    }

    _renderSearch()
    {
        const s = this.styles
        const wrap = create('div', { class: s.search })

        this.inputEl = create('input', {
            type         : 'search',
            class        : s.searchInput,
            placeholder  : this._searchPlaceholder,
            autocomplete : 'off',
        })

        const btn = create('button', {
            type  : 'button',
            class : s.searchBtn,
            text  : 'Rechercher',
        })
        btn.addEventListener('click', () => this._triggerSearch())
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._triggerSearch()
        })

        wrap.append(this.inputEl, btn)
        return wrap
    }

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
