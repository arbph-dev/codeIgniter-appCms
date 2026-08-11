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
- [ ] retrouver header dans MotListPanel.js

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
> Référence : [2026-08-05-001.md](/project/daily/2026-08-05-001.md)








