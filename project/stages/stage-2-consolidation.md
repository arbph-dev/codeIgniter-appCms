# Phase 2 : Finaliser Stage 1

✋ À finaliser pour Stage 1 :

finaliser Stage 1 
Homogénéisation des contrats Panel (render() / show() / clear() / destroy())

CSS unifiée et cohérente

Services structurés (mot.service.js mentionné avec une dépendance à corriger)



## Homogénéiser les Panels

- vérifier que tous respectent :
  - constructor(config = {})
  - render() → HTMLElement
  - show(data) → void
  - clear() → void
  - destroy() → void
  - onXxx(callback) → void (pour callbacks)

### fichiers
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/core/domhelper.js resssource


- [/assets/js/ui/workbench/views/DescriptorPanel.js](/refactoring/assets/js/ui/workbench/views/DescriptorPanel.js)
- [/assets/js/ui/workbench/views/JsonPanel.js](refactoring/assets/js/ui/workbench/views/JsonPanel.js)
- [/assets/js/ui/workbench/views/CatalogPanel.js](/refactoring/assets/js/ui/workbench/views/CatalogPanel.js)
- [assets/js/ui/workbench/views/DefinitionPanel.js](/refactoring/assets/js/ui/workbench/views/DefinitionPanel.js)
- [/assets/js/ui/workbench/mot/MotListPanel.js](/refactoring/assets/js/ui/workbench/mot/MotListPanel.js)

- [/assets/js/features/mot/mot.service.js](/refactoring/assets/js/features/mot/mot.service.js)
  - correction du bug : fetchMot sans q omet page / per_page.
MotWorkbenchDans le workbench tu appelles déjà :js
[MotWorkbench.js#L128](https://github.com/arbph-dev/codeIgniter-appCms/blob/3b358381bc3778cb22995a99e1697df4b0d0fe5d/refactoring/assets/js/ui/workbench/mot/MotWorkbench.js#L128)
```js
await fetchMot({
    q       : this._q || undefined,
    page    : this._page,
    perPage : 20,
})
```
Après le fix :
- liste initiale → /api/mot?page=1&per_page=20
- recherche → /api/mot?q=foo&page=1&per_page=20
- pagination → /api/mot?page=3&per_page=20 (avec ou sans q)
- détail (step 3) → /api/mot?id=42

Note : le défaut dans le service est perPage = 10, le workbench force 20 — c’est volontaire et correct.

---
/assets/js/ui/workbench/WorkbenchBase.js
ajout await pur this bootsrap [WorkbenchBase.js#L60](https://github.com/arbph-dev/codeIgniter-appCms/blob/25f1ed5eefe1c7043e835110303167869c4a11ae/refactoring/assets/js/ui/workbench/WorkbenchBase.js#L60)
```
async init(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
        console.error(`[Workbench] Container "${containerSelector}" non trouvé`);
        return false;
    }
    this.renderStructure();
    this.attachEvents();
    await this.bootstrap();        // ← attend la fin (load API, etc.)
    this.state.isLoaded = true;
    console.log(`[Workbench] ${this.name} initialisé`);
    return true;
}
```
ComponentCatalogWorkbench utilise deja async, pour MotWorkbench.js
```
async bootstrap() {....}
```


Côté appelants (vues / scripts d’entrée)Tout code qui démarre un workbench doit attendre init :js
```
// OK
await workbench.init('#motWorkbench');
```

```
// ou
workbench.init('#motWorkbench').then(() => {
    // prêt : données chargées
});
```

À vérifier typiquement dans :
- la vue workbench/mot.php (ou le script inline / module associé)

- la vue catalog
  - refactoring/app/Views/workbench/component_catalog.php
- tout autre new MotWorkbench() / new ComponentCatalogWorkbench()

Si l’appel est déjà dans un async IIFE ou un module top-level, un simple await suffit.

---
Polish MotDetailPanel (config = {}, this.element au lieu de this.el)

|Avant|Après|
|---|---|
|constructor()|constructor(config = {})|
|this.el|this.element (comme les autres panels)|
|class: 'wb_empty'|class: 'wb-empty' (convention CSS)|
|peu de JSDoc|JSDoc sur render / clear / destroy|
|show sans garde|if (!this.bodyEl) return|

- refactoring/assets/js/ui/workbench/mot/MotDetailPanel.js


---  
a finir
- refactoring/assets/js/ui/workbench/catalog/ComponentCatalogWorkbench.js
- refactoring/assets/js/ui/workbench/mot/MotWorkbench.js



## Créer un service template — structure standard pour les services API

## Centraliser apiFetch()
Normaliser les réponses { status, data, pager }

## CSS unifiée — style workbench + panels
voir [workbench--css-patterns--conventions](/project/daily/2026-08-02-003.md#workbench--css-patterns--conventions)


## Tester les workbenches existants — valider qu'ils fonctionnent ensemble
