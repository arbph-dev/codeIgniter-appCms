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


## [/assets/js/core/domhelper.js : pagination()](/refactoring/assets/js/core/domhelper.js#L338)
Construit un bloc de pagination en DOM pur (zéro innerHTML).

Options :
```js
    pager        {object}   { currentPage, pageCount }   — requis
    busEvent     {string}   nom de l'event bus à publier   (défaut : 'page')
    style        {string}   'buttons' | 'prev-next' | 'compact'
    cssPage      {string}   classe CSS du bouton page     (défaut : 'cp_page_btn')
    cssWrap      {string}   classe CSS du conteneur       (défaut : 'cp_pagination')
    cssActive    {string}   classe CSS du bouton actif    (défaut : 'active')
    maxVisible   {number}   nb max de pages affichées en style 'buttons'
                             0 = toutes (défaut : 0)
```
  Retourne :
    HTMLElement  (div)   — à appender directement dans le panel

  Exemple :
```js  
    clear(panels.pagination)
    panels.pagination.appendChild(pagination({
        pager    : store.pagination,
        busEvent : 'mot:page',
        style    : 'buttons'
    }))
```
