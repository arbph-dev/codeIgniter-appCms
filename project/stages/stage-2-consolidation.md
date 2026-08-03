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
- [/assets/js/ui/workbench/views/DescriptorPanel.js](/refactoring/assets/js/ui/workbench/views/DescriptorPanel.js)
- refactoring/assets/js/ui/workbench/views/JsonPanel.js
- refactoring/assets/js/ui/workbench/views/CatalogPanel.js
- refactoring/assets/js/ui/workbench/views/DefinitionPanel.js
- refactoring/assets/js/ui/workbench/mot/MotListPanel.js

a finir
- refactoring/assets/js/ui/workbench/mot/MotDetailPanel.js
- refactoring/assets/js/ui/workbench/catalog/ComponentCatalogWorkbench.js
- refactoring/assets/js/ui/workbench/mot/MotWorkbench.js



## Créer un service template — structure standard pour les services API

## Centraliser apiFetch()
Normaliser les réponses { status, data, pager }

## CSS unifiée — style workbench + panels
voir [workbench--css-patterns--conventions](/project/daily/2026-08-02-003.md#workbench--css-patterns--conventions)


## Tester les workbenches existants — valider qu'ils fonctionnent ensemble
