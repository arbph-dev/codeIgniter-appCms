// assets/js/ui/workbench/adresse/AdresseListPanel.js

import ListPanelBase from '/assets/js/ui/workbench/core/ListPanelBase.js'
import { table } from '/assets/js/core/domhelper.js'

export class AdresseListPanel extends ListPanelBase
{
    constructor()
    {
        super({
            title             : 'Adresses',
            newLabel          : ' Nouveau',
            searchPlaceholder : 'Ville, rue, code postal…',
            pagerStyle        : 'compact',
            pagerMaxVisible   : 5,
        })
    }

    _renderRows(items)
    {
        this.tableEl.appendChild(
            table({
                id      : 'wbAdresseTable',
                data    : items,
                columns : [
                    { key: 'id',         label: 'ID'    },
                    { key: 'cp_commune', label: 'Ville' },
                    { key: 'cp_codepostal', label: 'CP'    },
                ],
                attrs      : { class: this.styles.table },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )
    }
}

export default AdresseListPanel
