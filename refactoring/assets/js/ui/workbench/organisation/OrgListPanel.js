// assets/js/ui/workbench/organisation/OrgListPanel.js

import ListPanelBase from '/assets/js/ui/workbench/core/ListPanelBase.js'
import { table } from '/assets/js/core/domhelper.js'

export class OrgListPanel extends ListPanelBase
{
    constructor()
    {
        super({
            title             : 'Organisations',
            newLabel          : ' Nouveau',
            searchPlaceholder : 'Nom, SIREN…',
            pagerStyle        : 'compact',
            pagerMaxVisible   : 5,
        })
    }

    _renderRows(items)
    {
        this.tableEl.appendChild(
            table({
                id      : 'wbOrgTable',
                data    : items,
                columns : [
                    { key: 'id',         label: 'ID'    },
                    { key: 'nom',        label: 'Nom'   },
                    { key: 'type_label', label: 'Type'  },
                    { key: 'siren',      label: 'SIREN' },
                ],
                attrs      : { class: this.styles.table },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )
    }
}

export default OrgListPanel
