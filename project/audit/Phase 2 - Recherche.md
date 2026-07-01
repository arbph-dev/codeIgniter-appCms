# Phase 2 - Recherche

## Event Bus

Étudier :

- Event Bus
- Pub/Sub
- CQRS léger
- Domain Events

Question :

Le bus est-il :

- interface ?
- métier ?
- infrastructure ?

## Component Registry

Étudier :

- registry
- dependency injection
- service locator
- plugin architecture

Objectif :

```
component('table')
component('form')
component('callout')
```

et

```
registry.get('table')
registry.get('form')
```

## API

Étudier :

- REST
- JSON
- HAL

Choisir un standard.

## Livrables

- eventbus.md
- registry.md
- api_conventions.md

---