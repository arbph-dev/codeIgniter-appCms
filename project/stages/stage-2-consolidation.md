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

## Créer un service template — structure standard pour les services API

## Centraliser apiFetch()
Normaliser les réponses { status, data, pager }

## CSS unifiée — style workbench + panels

## Tester les workbenches existants — valider qu'ils fonctionnent ensemble
