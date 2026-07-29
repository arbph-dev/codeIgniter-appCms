# Flux d'administration : `/admin/cmstree`

## Objectif

La route `/admin/cmstree` constitue le point d'entrée principal de l'administration du CMS.

Elle construit une représentation arborescente complète du contenu publié afin de permettre :

* la navigation dans le CMS ;
* l'accès rapide aux opérations d'administration ;
* l'édition des catégories, articles, sections et composants.

---

# Flux global

```mermaid
flowchart TD

%%========================
%% Couleurs
%%========================

classDef routes fill:#A9D6FF,stroke:#0080FF,stroke-width:4px;
classDef controller fill:#B7F0B1,stroke:#2E8B57,stroke-width:4px;
classDef service fill:#FFD39B,stroke:#FF8C00,stroke-width:4px;
classDef model fill:#FFF3A3,stroke:#C9A000,stroke-width:4px;
classDef view fill:#E6E6E6,stroke:#808080,stroke-width:4px;

%%========================
%% Flux
%%========================

A["Routes.php<br/>/admin/cmstree"]:::routes

A --> B["Admin\\CmsTree::index()"]:::controller

B --> C["CmsService::getCmsTree()"]:::service

C --> D["CmsCategoryModel"]:::model
C --> E["CmsArticleModel"]:::model
C --> F["CmsSectionModel"]:::model
C --> G["CmsPartModel"]:::model

C --> H["CmsService::enrichPart()"]:::service
H --> I["CmsService::adminLinks()"]:::service

B --> J["View admin/cmstree/index.php"]:::view

J --> K["View admin/cmstree/node.php<br/>(récursif)"]:::view

K --> L["Navigateur"]
```

---

# Description

## 1. Route

La route `/admin/cmstree` est déclarée dans `app/Config/Routes.php`.

Elle est associée au contrôleur `Admin\CmsTree`.

---

## 2. Contrôleur

Le contrôleur `Admin\CmsTree::index()` délègue entièrement la construction de l'arbre au `CmsService`.

Aucune logique métier n'est implémentée dans le contrôleur.

---

## 3. Construction de l'arbre

`CmsService::getCmsTree()` construit une hiérarchie complète :

```text
Catégorie
└── Article
    └── Section
        └── Part
```

Chaque niveau est obtenu à partir de son modèle dédié.

### Flux de données

```mermaid
flowchart TD

Categories["CmsCategoryModel"]:::model
Articles["CmsArticleModel"]:::model
Sections["CmsSectionModel"]:::model
Parts["CmsPartModel"]:::model

Tree["CmsService::getCmsTree()"]:::service

Result["Arbre CMS"]:::descriptor

View["CmsTreeView"]:::view

Categories --> Tree
Articles --> Tree
Sections --> Tree
Parts --> Tree

Tree --> Result
Result --> View

classDef service fill:#ffd699,stroke:#ff8800,stroke-width:4px;
classDef model fill:#fff2a8,stroke:#c7a600,stroke-width:4px;
classDef descriptor fill:#e8d5ff,stroke:#7a3db8,stroke-width:4px;
classDef view fill:#e6e6e6,stroke:#666666,stroke-width:4px;
```
---

## 4. Enrichissement des composants

Avant le rendu, chaque `Part` est enrichie.

Cette étape permet notamment :

* d'associer le type de composant ;
* d'ajouter les informations utiles à l'administration ;
* de préparer les liens d'action.

Cette responsabilité est assurée par :

* `CmsService::enrichPart()`
* `CmsService::adminLinks()`

---

## 5. Rendu

Le contrôleur transmet l'arbre à la vue :

```text
admin/cmstree/index.php
```

L'affichage est ensuite réalisé récursivement par :

```text
admin/cmstree/node.php
```

Chaque nœud affiche :

* son libellé ;
* son type ;
* les actions disponibles ;
* ses enfants.

---

# Responsabilités

| Élément          | Responsabilité                          |
| ---------------- | --------------------------------------- |
| Routes           | Associer l'URL au contrôleur            |
| Admin\CmsTree    | Point d'entrée HTTP                     |
| CmsService       | Construction de l'arbre CMS             |
| CmsCategoryModel | Lecture des catégories                  |
| CmsArticleModel  | Lecture des articles                    |
| CmsSectionModel  | Lecture des sections                    |
| CmsPartModel     | Lecture des composants                  |
| enrichPart()     | Enrichissement métier des composants    |
| adminLinks()     | Génération des actions d'administration |
| index.php        | Vue principale                          |
| node.php         | Rendu récursif de l'arborescence        |

---

# Documents associés

* [[ARCHITECTURE-OVERVIEW]]
* [[CmsService]]
* [[CmsController]]
* [[DescriptorMapper]]
* [[DescriptorDefinition]]

---

# Évolutions prévues

Cette vue constitue la base de l'administration actuelle.

À terme, les formulaires HTML seront progressivement remplacés par des **Workbench** spécialisés (ArticleWorkbench, SectionWorkbench, PartWorkbench, ModelWorkbench, SceneWorkbench), tout en conservant `CmsService` comme point central de la logique métier.
