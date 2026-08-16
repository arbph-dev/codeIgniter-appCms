// assets/js/ui/workbench/organisation/OrgListPanel.js

import ListPanelBase from '/assets/js/ui/workbench/core/ListPanelBase.js'
import { table } from '/assets/js/core/domhelper.js'

export class OrgListPanel extends ListPanelBase
{
    constructor()
    {
        super({
            title             : 'Organisations',
            newLabel          : '+ Nouveau',
            panelClass        : 'wb_mot_list_panel', // ou wb_org_list_panel
            searchPlaceholder : 'Nom, SIREN…',
            pagerStyle        : 'compact',
            pagerMaxVisible   : 5,
        })
    }

    _renderRows(items)
    {
        this.tableEl.appendChild(
            table({
                data    : items,
                columns : [
                    { key: 'nom',        label: 'Nom' },
                    { key: 'type_label', label: 'Type' },
                    { key: 'siren',      label: 'SIREN' },
                ],
                attrs      : { class: 'cp_table' },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )
    }
}

export default OrgListPanel
