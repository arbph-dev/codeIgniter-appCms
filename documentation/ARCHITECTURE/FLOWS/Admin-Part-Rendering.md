# Flux d'administration — Rendu d'une Part

Le rendu d'une Part intervient lors de la prévisualisation ou de l'affichage.

Contrairement au CRUD, ce flux construit un composant exécutable.

---

## Flux d'appels

```mermaid
flowchart TD

Part["CmsPart"]:::model

Service["CmsService::renderPart()"]:::service

Mapper["DescriptorMapper"]:::descriptor

Descriptor["DescriptorDefinition"]:::descriptor

Renderer["ComponentRenderer"]:::renderer

Runtime["ApexRenderer / ThreeRenderer / ..."]:::renderer

Html["HTML"]:::view

Part --> Service

Service --> Mapper

Mapper --> Descriptor

Descriptor --> Renderer

Renderer --> Runtime

Runtime --> Html

classDef service fill:#ffd699,stroke:#ff8800,stroke-width:4px;
classDef model fill:#fff2a8,stroke:#c7a600,stroke-width:4px;
classDef descriptor fill:#e8d5ff,stroke:#7a3db8,stroke-width:4px;
classDef renderer fill:#ffb3b3,stroke:#cc0000,stroke-width:4px;
classDef view fill:#e6e6e6,stroke:#666666,stroke-width:4px;
```

---

## Principe

Le CRUD modifie les données.

Le rendu transforme ces données en composant exécutable.

Ces deux responsabilités restent volontairement séparées.
