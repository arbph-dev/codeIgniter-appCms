# toolbar.template.js
source : [toolbar.template.js](/refactoring/assets/js/ui/shared/templates/toolbar.template.js)

## import

```js
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'
```

## Applications

### MotDetailPanel.js
```js
const header = toolbar({ title: 'Détail' })
```


### MotListPanel.js


```js
this.element = create('section', { class: 'wb_mot_list_panel' })
//
const header = toolbar({
    title  : 'Mots',
    action : {
        label   : '+ Nouveau',
        css     : 'wb-btn wb_mot_new_btn',
        onClick : () => this._onNewFn?.(),
    },
})
```

- [X] retrouver header dans MotListPanel.js:

https://github.com/arbph-dev/codeIgniter-appCms/blob/ab9af6dbbc53165f526ce9f3c2b85619e9ac651d/refactoring/assets/js/ui/workbench/mot/MotListPanel.js#L53

---

## Décision sur les autres templates

| Fichier            | Décision          | Raison                                          |
|--------------------|-------------------|-------------------------------------------------|
| toolbar.template   | ✅ Créé maintenant | Répété dans les 2 panels existants              |
| detail.template    | ⏳ Différé         | detail() existe déjà dans domhelper             |
| list.template      | ⏳ Différé         | table() / notice() / pagination() dans domhelper|
| form.template      | ⏳ Phase B.3       | Appartient à Form.js                            |

---

## Ressources
> Référence :
> - [2026-08-05-001.md](/project/daily/2026-08-05-001.md)
> 
> - [AdresseDetailPanel.js](/refactoring/assets/js/ui/workbench/adresse/AdresseDetailPanel.js)
> - [AdresseListPanel.js](/refactoring/assets/js/ui/workbench/adresse/AdresseListPanel.js)
> - [MapPanel.js](/refactoring/assets/js/ui/workbench/adresse/MapPanel.js)
>
> - [ImageListPanel.js](/refactoring/assets/js/ui/workbench/image/ImageListPanel.js)
> - [ImagePreviewPanel.js](/refactoring/assets/js/ui/workbench/image/ImagePreviewPanel.js)
>
> - [OrgListPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgListPanel.js)
> - [OrgDetailPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgDetailPanel.js)






