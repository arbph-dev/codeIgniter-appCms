// assets/js/ui/workbench/mot/MotListPanel.js

import ListPanelBase from '/assets/js/ui/workbench/core/ListPanelBase.js'
import { table } from '/assets/js/core/domhelper.js'

export class MotListPanel extends ListPanelBase
{
    constructor()
    {
        super({
            title             : 'Mots',
            newLabel          : ' Nouveau',
            searchPlaceholder : 'Rechercher un mot…',
            pagerStyle        : 'compact',
            pagerMaxVisible   : 5,
            // styles: omit → DEFAULT_LIST_STYLES (wb_list_*)
        })
    }

    _renderRows(items)
    {
        this.tableEl.appendChild(
            table({
                id      : 'wbMotTable',
                data    : items,
                columns : [
                    { key: 'mot_id',  label: 'ID'  },
                    { key: 'mot_lbl', label: 'Mot' },
                ],
                attrs      : { class: this.styles.table },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )
    }
}

export default MotListPanel
