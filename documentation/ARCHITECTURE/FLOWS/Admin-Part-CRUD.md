# Flux d'administration — CRUD des Parts

Une Part représente la plus petite unité éditable du CMS.

Les opérations CRUD permettent de créer, modifier, déplacer et supprimer une Part.

---

## Cycle de vie

```mermaid
flowchart LR

List["Liste"] --> New["Créer"]
List --> Edit["Modifier"]
List --> Delete["Supprimer"]

Edit --> Save["Enregistrer"]

Save --> Refresh["Retour CmsTree"]

classDef action fill:#ffd699,stroke:#ff8800,stroke-width:4px;

class List,New,Edit,Delete,Save,Refresh action
```

---

## Flux d'appels

```mermaid
flowchart TD

Route["/admin/cmspart/..."]:::routes

Controller["CmsPart Controller"]:::controller

Service["CmsService"]:::service

Model["CmsPartModel"]:::model

View["Vue formulaire"]:::view

Browser["Navigateur"]:::view

Route --> Controller

Controller --> Service

Service --> Model

Model --> Service

Service --> View

View --> Browser

Browser --> Controller

classDef routes fill:#b3d9ff,stroke:#0080ff,stroke-width:4px;
classDef controller fill:#b6f2b6,stroke:#009933,stroke-width:4px;
classDef service fill:#ffd699,stroke:#ff8800,stroke-width:4px;
classDef model fill:#fff2a8,stroke:#c7a600,stroke-width:4px;
classDef view fill:#e6e6e6,stroke:#666666,stroke-width:4px;
```

---

## Opérations

Le service centralise les opérations :

- `newPart()`
- `createPart()`
- `insertPart()`
- `updatePart()`
- `deletePart()`
- `movePartUp()`
- `movePartDown()`
- `swapPosition()`

---

## Particularité

Le CRUD manipule uniquement les données.

Aucun composant n'est créé pendant ces opérations.
