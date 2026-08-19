// assets/js/ui/workbench/personne/PersonneListPanel.js
import ListPanelBase from '/assets/js/ui/workbench/core/ListPanelBase.js'
import { table }     from '/assets/js/core/domhelper.js'

export class PersonneListPanel extends ListPanelBase
{
    constructor()
    {
        super({
            title             : 'Personnes',
            newLabel          : 'Nouveau',
            searchPlaceholder : 'Nom, prénom…',
            pagerStyle        : 'compact',
            pagerMaxVisible   : 5,
        })
    }

    _renderRows(items)
    {
        this.tableEl.appendChild(
            table({
                data       : items,
                columns    : [
                    { key: 'id',             label: 'ID'       },
                    { key: 'nom_complet',    label: 'Nom'      },
                    { key: 'date_naissance', label: 'Né(e) le' },
                ],
                attrs      : { class: this.styles.table },
                onRowClick : (row) => this._onSelectFn?.(row),
            })
        )
    }
}

export default PersonneListPanel
