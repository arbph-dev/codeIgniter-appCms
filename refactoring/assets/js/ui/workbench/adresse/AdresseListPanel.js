// assets/js/ui/workbench/adresse/AdresseListPanel.js

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import {
    create,
    clear,
    table,
    pagination,
    notice,
} from '/assets/js/core/domhelper.js'

import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'

export class AdresseListPanel extends PanelBase
{
    constructor()
    {
        super()

        this._onSelectFn = null
        this._onSearchFn = null
        this._onNewFn    = null

        this.element = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    render()
    {
        this.element = create('section', {
            class: 'wb_mot_list_panel',
        })

        const header = toolbar({
            title  : 'Adresses',
            action : {
                label   : ' Nouveau',
                css     : 'wb-btn wb_mot_new_btn',
                onClick : () => this._onNewFn?.(),
            },
        })

        const searchBar = create('div', {
            class: 'wb_mot_search',
        })

        this.inputEl = create('input', {
            type        : 'search',
            class       : 'wb_mot_search_input',
            placeholder : 'Ville, rue, code postal…',
        })

        const searchBtn = create('button', {
            type  : 'button',
            class : 'wb_mot_search_btn',
            text  : 'Rechercher',
        })

        searchBtn.addEventListener(
            'click',
            () => this._triggerSearch()
        )

        this.inputEl.addEventListener('keydown', e =>
        {
            if (e.key === 'Enter')
                this._triggerSearch()
        })

        searchBar.append(
            this.inputEl,
            searchBtn
        )

        this.tableEl = create('div', {
            class: 'wb_mot_table',
        })

        this.pagerEl = create('div', {
            class: 'wb_mot_pager',
        })

        this.element.append(
            header,
            searchBar,
            this.tableEl,
            this.pagerEl
        )

        this.clear()

        return this.element
    }

    show(items, pager = null)
    {
        clear(this.tableEl)
        clear(this.pagerEl)

        if (!items?.length)
        {
            this.tableEl.appendChild(
                notice('empty')
            )

            return
        }

        this.tableEl.appendChild(
            table({
                id   : 'wbAdresseTable',
                data : items,

                columns : [
                    {
                        key   : 'id',
                        label : 'ID',
                    },
                    {
                        key   : 'cp_commune',
                        label : 'Ville',
                    },
                    {
                        key   : 'cp_codepostal',
                        label : 'CP',
                    },
                ],

                attrs : {
                    class: 'cp_table',
                },

                onRowClick : row =>
                    this._onSelectFn?.(row),
            })
        )

        if (pager)
        {
            this.pagerEl.appendChild(
                pagination({
                    pager,
                    busEvent   : 'wb:adresse:page',
                    style      : 'compact',
                    maxVisible : 5,
                })
            )
        }
    }

    clear()
    {
        if (!this.tableEl)
            return

        clear(this.tableEl)
        clear(this.pagerEl)

        this.tableEl.appendChild(
            notice('empty')
        )
    }

    showLoading()
    {
        if (!this.tableEl)
            return

        clear(this.tableEl)
        clear(this.pagerEl)

        this.tableEl.appendChild(
            notice('loading')
        )
    }

    showError(msg)
    {
        if (!this.tableEl)
            return

        clear(this.tableEl)
        clear(this.pagerEl)

        this.tableEl.appendChild(
            notice('error', msg)
        )
    }

    destroy()
    {
        this._onSelectFn = null
        this._onSearchFn = null
        this._onNewFn    = null

        this.element = null
        this.inputEl = null
        this.tableEl = null
        this.pagerEl = null
    }

    onSearch(fn)
    {
        this._onSearchFn = fn
    }

    onSelect(fn)
    {
        this._onSelectFn = fn
    }

    onNew(fn)
    {
        this._onNewFn = fn
    }

    _triggerSearch()
    {
        this._onSearchFn?.(
            this.inputEl?.value.trim() ?? ''
        )
    }
}

export default AdresseListPanel
