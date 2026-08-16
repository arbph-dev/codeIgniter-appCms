# PanelBase

source : [`PanelBase.js`](/refactoring/assets/js/ui/workbench/core/PanelBase.js)

## Rôle

`PanelBase` définit le contrat minimal commun à tous les Panels d'un Workbench.

Un Panel est une unité d'interface spécialisée dans l'affichage et la manipulation d'une partie de l'état du Workbench.

Le Panel :

* construit son propre DOM ;
* affiche les données qui lui sont transmises ;
* revient à un état vide ;
* libère ses ressources lorsqu'il est détruit.

Le Panel **ne possède pas la logique d'orchestration du Workbench**.

## Contrat

Contrat Panel (PanelBase)
Chaque Panel expose deux surfaces :

Surface Workbench → Panel (méthodes directes)
render()           → HTMLElement    obligatoire
show(data, pager?) → void           obligatoire
clear()            → void           obligatoire
showLoading()      → void           obligatoire (ListPanel)
showError(msg)     → void           obligatoire (ListPanel)
showFeedback(t, m) → void           obligatoire (DetailPanel)
lock() / unlock()  → void           obligatoire (DetailPanel)
destroy()          → void           obligatoire
Surface Panel → Workbench (callbacks enregistrés)
onSearch(fn)   ListPanel   fn(q: string)
onSelect(fn)   ListPanel   fn(item: object)
onNew(fn)      ListPanel   fn()
onSave(fn)     DetailPanel fn(id: number|null, data: object)
onDelete(fn)   DetailPanel fn(id: number)
onTabChange(fn) TabSystem  fn(tabId: string)   [iter007]
Si une méthode ou signature change, le câblage Workbench casse — c'est le « contrat runtime ».




| Méthode         | Rôle                                                 |
| --------------- | ---------------------------------------------------- |
| `constructor()` | Initialise les références internes, sans side-effect |
| `render()`      | Construit et retourne l'élément DOM racine           |
| `show(...args)` | Affiche les données reçues                           |
| `clear()`       | Remet le Panel dans son état vide                    |
| `destroy()`     | Libère les références, listeners et callbacks        |

`render()` est la seule méthode obligatoirement implémentée par la classe fille.

`show()` et `clear()` possèdent une signature libre adaptée au Panel.

 

## Exemple
[`MotListPanel::show()`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/mot/MotListPanel.js#L59)

```js
class MotListPanel extends PanelBase
{
    render()
    {
        this.element = create('section', {
            class : 'wb_mot_list_panel',
        })

        return this.element
    }

    show(items)
    {
        // affichage des mots
    }

    clear()
    {
        // état vide
    }

    destroy()
    {
        // listeners / callbacks spécifiques

        super.destroy()
    }
}
```

## Responsabilités interdites

`PanelBase` et ses sous-classes ne doivent pas :

* appeler directement une API métier ;
* effectuer un fetch ;
* connaître le modèle backend ;
* orchestrer les autres Panels ;
* créer le layout du Workbench ;
* effectuer la validation métier ;
* gérer les dialogs globaux ;
* contenir la logique de navigation du Workbench.

Le Panel reçoit les données et les affiche.

## Cycle de vie

Le Workbench est responsable du cycle de vie du Panel :

```text
Workbench
    │
    ├── crée le Panel
    │
    ├── WorkbenchView.mountPanels()
    │       │
    │       └── panel.render()
    │
    ├── panel.show(...)
    │
    └── panel.destroy()
```

`WorkbenchView` monte et démonte les éléments DOM, mais **ne détruit pas les Panels**. Leur destruction reste sous la responsabilité du Workbench.

## Règle d'architecture

> **Un Panel sait afficher son état ; le Workbench sait quand et pourquoi cet état doit changer.**
