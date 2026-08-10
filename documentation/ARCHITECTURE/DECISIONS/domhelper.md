# domhelper
Cette librairie permet de factoriser la création des éléments

## [/assets/js/core/domhelper.js : detail()](/refactoring/assets/js/core/domhelper.js#L558)
employée par les **panels**
Construit une `<dl class="cp_detail">` depuis un tableau de `{ label, value }`.

Exemple :
```js
    panels.detail.appendChild(detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ]))
```
