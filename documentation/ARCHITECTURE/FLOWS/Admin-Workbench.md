# Flux d'administration — Workbench

Le Workbench constitue l'évolution naturelle des formulaires d'administration.

Il devient l'environnement de conception des ressources métier.

---

## Architecture cible

```mermaid
flowchart LR

Workbench:::service

Connector:::descriptor

API:::routes

Resource:::model

Component:::renderer

Preview:::view

Workbench --> Connector

Connector --> API

API --> Resource

Resource --> Component

Component --> Preview

classDef routes fill:#b3d9ff,stroke:#0080ff,stroke-width:4px;
classDef service fill:#ffd699,stroke:#ff8800,stroke-width:4px;
classDef descriptor fill:#e8d5ff,stroke:#7a3db8,stroke-width:4px;
classDef model fill:#fff2a8,stroke:#c7a600,stroke-width:4px;
classDef renderer fill:#ffb3b3,stroke:#cc0000,stroke-width:4px;
classDef view fill:#e6e6e6,stroke:#666666,stroke-width:4px;
```

---

## Objectifs

Le Workbench devra permettre :

- l'édition des modèles ;
- la connexion aux API métier ;
- la création de Resources ;
- la prévisualisation des composants ;
- l'intégration des futurs composants composites (blocs de type WordPress).

À terme, les formulaires CRUD classiques deviendront principalement des interfaces de secours ou de maintenance, tandis que les Workbench constitueront l'interface principale d'administration.
