# documentation/ARCHITECTURE/ROADMAP/index.md

# Roadmap d'architecture

Cette roadmap décrit les grandes phases d'évolution de Zealot.

L'objectif n'est pas d'imposer une architecture, mais de construire progressivement une plateforme de gestion de connaissances, capable de s'adapter à de nouveaux domaines métier.

Chaque phase produit une architecture exploitable avant de passer à la suivante.

---

# Vision générale

```
Vision
    ↓
Audit
    ↓
CRUD
    ↓
Workbench
    ↓
Features
    ↓
Connectors
    ↓
Knowledge
    ↓
Système Expert
    ↓
Publication
```

---

# Phase 00 — Vision

Définir les objectifs du projet.

Documentation :

* [/documentation/VISION.md](/documentation/VISION.md)

Objectifs :

* définir les principes fondateurs ;
* identifier les domaines de connaissances ;
* formaliser les objectifs à long terme ;
* définir les invariants d'architecture.

---

# Phase 01 — Audit

Documentation :

* [Phase01-Audit.md](/documentation/ARCHITECTURE/ROADMAP/Phase01-Audit.md)

Objectif :

Auditer l'architecture existante avant toute évolution importante.

Cette phase produit une documentation fiable du backend CMS.

---

# Phase 02 — CRUD

Objectif :

Mettre à disposition un CRUD complet pour chaque modèle.

Ordre actuel :

* CmsCategory
* CmsArticle
* CmsSection
* CmsPart
* ComponentType

Les interfaces restent volontairement simples afin de valider les traitements métier.

---

# Phase 03 — Workbench

Objectif :

Remplacer progressivement les formulaires HTML par des environnements d'édition spécialisés.

Exemples :

* ArticleWorkbench
* CategoryWorkbench
* SceneWorkbench
* ModelWorkbench
* ImageWorkbench

Les Workbench deviennent les interfaces principales d'administration.

---

# Phase 04 — Features

Objectif :

Créer une couche de services Javascript réutilisables.

Les Features encapsulent :

* les appels API ;
* le cache ;
* la pagination ;
* les recherches ;
* les traitements métier côté client.

---

# Phase 05 — Connectors

Objectif :

Connecter Zealot à des sources externes.

Exemples :

* INSEE
* INPI
* OMDb
* OpenStreetMap
* JsonPlaceholder

Les Connectors masquent les spécificités des API.

---

# Phase 06 — Knowledge

Objectif :

Construire le modèle de connaissances.

Les connaissances pourront relier :

* équipements ;
* documents ;
* normes ;
* images ;
* diagnostics ;
* observations ;
* historiques ;
* concepts scientifiques.

Cette phase constitue le socle du futur système expert.

---

# Phase 07 — Système Expert

Objectif :

Exploiter les relations entre les connaissances afin de produire :

* diagnostics ;
* explications ;
* recommandations ;
* aides à la décision.

---

# Phase 08 — Publication

Objectif :

Diffuser les connaissances.

Supports envisagés :

* portail CMS ;
* documentation technique ;
* API ;
* exports ;
* rapports ;
* présentations.

---

# Documents associés

## Architecture

* [/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md](/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md)

## Décisions

* [/documentation/ARCHITECTURE/DECISIONS/index.md](/documentation/ARCHITECTURE/DECISIONS/index.md)

## Flows

* [/documentation/ARCHITECTURE/FLOWS/](/documentation/ARCHITECTURE/FLOWS/)

## API

* [/documentation/API/index.md](/documentation/API/index.md)
