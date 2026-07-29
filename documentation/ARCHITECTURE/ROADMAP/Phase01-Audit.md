# Phase 01 — Audit de l'architecture CMS

## Objectif

Établir un état de référence fiable de l'architecture actuelle avant l'intégration des Workbench.

Cette phase ne modifie pas les concepts.

Elle consiste à :

* documenter ;
* vérifier ;
* simplifier ;
* supprimer les éléments obsolètes ;
* identifier les évolutions nécessaires.

---

# Axe 1 — Inventaire

Produire un inventaire complet des fichiers.

Pour chaque fichier :

* domaine ;
* statut ;
* documentation ;
* dépendances ;
* utilisateurs ;
* action à réaliser.

---

## Fichiers d'architecture

Ces fichiers constituent le socle du système de rendu des composants. Ils sont documentés individuellement et doivent faire l'objet d'un audit avant toute évolution.

| Fichier | Domaine | Statut code | Documentation | Doc | Action | Priorité |
|---|---|---|---|---|---|---|
| [app/Libraries/Components/DescriptorDefinition.php](/refactoring/app/Libraries/Components/DescriptorDefinition.php) | Backend / Architecture | ✅ Stable | ✅ Stable | [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md) | Vérifier la double implémentation | P1 |
| [app/Libraries/Components/DescriptorMapper.php](/refactoring/app/Libraries/Components/DescriptorMapper.php) | Backend / Architecture | 🔵 En développement | ✅ Stable | [/documentation/ARCHITECTURE/DescriptorMapper.md](/documentation/ARCHITECTURE/DescriptorMapper.md) | Vérifier l'utilisation de ComponentTypeModel | P1 |
| [app/Libraries/Components/ComponentRenderer.php](/refactoring/app/Libraries/Components/ComponentRenderer.php) | Backend / Architecture | ✅ Stable | 🟡 À documenter | — | Documenter | P1 |
| [app/Libraries/Components/AdminComponentRenderer.php](/refactoring/app/Libraries/Components/AdminComponentRenderer.php) | Backend / Architecture | ✅ Stable | 🟡 À documenter | — | Documenter | P1 |
| [app/Libraries/Components/Renderers/ComponentRendererInterface.php](/refactoring/app/Libraries/Components/Renderers/ComponentRendererInterface.php) | Backend / Contrat | ✅ Stable | 🟡 À documenter | — | Documenter | P1 |
| [app/Libraries/Cms/ComponentRegistry.php](/refactoring/app/Libraries/Cms/ComponentRegistry.php) | Backend / Registry | 🟣 Prototype | ⚪ | — | ❌ À supprimer | P2 |
| [app/Libraries/Components/ComponentRegistry.php](/refactoring/app/Libraries/Components/ComponentRegistry.php) | Backend / Registry | ✅ Stable |  ✅ Stable | [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md) | - | P2 |
| [app/Libraries/Components/AdminComponentRegistry.php](/refactoring/app/Libraries/Components/AdminComponentRegistry.php) | Backend / Registry | ✅ Stable |  ✅ Stable | [/documentation/ARCHITECTURE/AdminComponentRegistry.md](/documentation/ARCHITECTURE/AdminComponentRegistry.md) | - | P2 |



## Implémentations des Renderers

Tous les Renderers exploitent un `DescriptorDefinition` et implémentent le contrat défini par `ComponentRendererInterface`.

### Renderers

| Classe | Statut | Documentation |
|---|---|---|
| [ApexRenderer](/refactoring/app/Libraries/Components/Renderers/ApexRenderer.php) | ✅ | À créer |
| [CalloutRenderer](/refactoring/app/Libraries/Components/Renderers/CalloutRenderer.php) | ✅ | À créer |
| [CodeValRenderer](/refactoring/app/Libraries/Components/Renderers/CodeValRenderer.php) | ✅ | À créer |
| [LeafletRenderer](/refactoring/app/Libraries/Components/Renderers/LeafletRenderer.php) | ✅ | À créer |
| [MermaidRenderer](/refactoring/app/Libraries/Components/Renderers/MermaidRenderer.php) | ✅ | À créer |
| [RawRenderer](/refactoring/app/Libraries/Components/Renderers/RawRenderer.php) | ✅ | À créer |
| [ThreeRenderer](/refactoring/app/Libraries/Components/Renderers/ThreeRenderer.php) | 🔵 | À créer |

### AdminRenderers

| Classe | Statut | Documentation |
|---|---|---|
| [ApexAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/ApexAdminRenderer.php) | ✅ | À créer |
| [CalloutAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/CalloutAdminRenderer.php) | ✅ | À créer |
| [CodeValAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/CodeValAdminRenderer.php) | ✅ | À créer |
| [LeafletAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/LeafletAdminRenderer.php) | 🔵 | À créer |
| [MermaidAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/MermaidAdminRenderer.php) | ✅ | À créer |
| [RawAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/RawAdminRenderer.php) | ✅ | À créer |
| [ThreeAdminRenderer](/refactoring/app/Libraries/Components/AdminRenderers/ThreeAdminRenderer.php) | 🔵 | À créer |

---

## Dépendances principales

### DescriptorDefinition

Utilisé par :

- tous les Renderers ;
- tous les AdminRenderers ;
- `ComponentRenderer` ;
- `AdminComponentRenderer`.

### ComponentRendererInterface

Implémenté par :

- ApexRenderer
- CalloutRenderer
- CodeValRenderer
- LeafletRenderer
- MermaidRenderer
- RawRenderer
- ThreeRenderer

---

## Points d'audit

- Vérifier la coexistence de deux `DescriptorDefinition` :
    - `/app/Libraries/Components/DescriptorDefinition.php`
    - `/app/Libraries/Cms/DescriptorDefinition.php`

- Vérifier la coexistence de deux `ComponentRegistry`.

- Vérifier si `DescriptorMapper` doit utiliser directement `ComponentTypeModel` ou passer systématiquement par `CmsService::getComponentTypes()`.

- Vérifier les composants historiques encore présents (`TestController`, anciennes vues de composants, etc.).

- Identifier les fichiers devenus obsolètes avant le début des Workbench.




---

# Axe 2 — Documentation Backend

Mettre à jour la documentation des composants principaux.

Priorité :

* [/refactoring/app/Controllers/CmsController.php](/refactoring/app/Controllers/CmsController.php)
* [/refactoring/app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)

Créer ou compléter :

* [/documentation/ARCHITECTURE/CmsController.md](/documentation/ARCHITECTURE/CmsController.md)
* [/documentation/ARCHITECTURE/CmsService.md](/documentation/ARCHITECTURE/CmsService.md)

---

# Axe 3 — Documentation des composants

Mettre à jour :

* [/documentation/composants.md](/documentation/composants.md)
* [/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md](/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md)
* [/documentation/ARCHITECTURE/AdminComponentRegistry.md](/documentation/ARCHITECTURE/AdminComponentRegistry.md)
    - ✅ Conserver /refactoring/app/Libraries/Components/AdminComponentRegistry.php
    - ❌ Supprimer /refactoring/app/Libraries/Components/AdminRenderers/AdminComponentRegistry.php
* [/documentation/ARCHITECTURE/AdminComponentRenderer.md](/documentation/ARCHITECTURE/AdminComponentRenderer.md)
* [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)
* [/documentation/ARCHITECTURE/ComponentRenderer.md](/documentation/ARCHITECTURE/ComponentRenderer.md)
* [/documentation/ARCHITECTURE/ComponentRendererInterface.md](/documentation/ARCHITECTURE/ComponentRendererInterface.md)
* [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md)



## /documentation/ARCHITECTURE/FUTURE

Ce dossier rassemble les concepts d'architecture validés dans leur principe mais non encore implémentés ou stabilisés.

Ces documents servent de support de conception.

Ils ne décrivent pas le fonctionnement actuel du dépôt.

Une fois une architecture implémentée et auditée, sa documentation est déplacée vers `documentation/ARCHITECTURE/`.


---

# Axe 4 — Documentation des flux

Documenter les flux d'exécution.

Déjà réalisés :

* affichage d'un article ;
* affichage d'une section ;
* affichage d'un composant ;
* flux d'appels ;
* administration CmsTree.

Travaux restant :

* ajouter les flux de données ;
* harmoniser les diagrammes Mermaid ;
* appliquer les styles communs ;
* identifier les couches (Routes, Controllers, Services, Models, Renderers, Views).

Les diagrammes sont regroupés dans :

* [/documentation/ARCHITECTURE/FLOWS/](/documentation/ARCHITECTURE/FLOWS/)

---

# Axe 5 — Administration

Documenter complètement :

```
/admin/cmstree
```

Travaux :

* flux d'appels ;
* flux de données ;
* structure hiérarchique ;
* intégration future des catégories hiérarchiques (`catp_id`) ;
* évolution de `CmsService::getCmsTree()`.

---

# Axe 6 — Préparation des CRUD

Objectif : disposer d'un CRUD complet pour chaque modèle du CMS avant l'intégration des Workbench.

Les interfaces d'administration seront réalisées en deux étapes :

1. vues HTML simples permettant de valider les modèles et les flux backend ;
2. remplacement progressif par les Workbench spécialisés.

| Modèle | Create | Read | Update | Delete | Admin | Workbench | Statut | Évolution prévue |
|---|:-:|:-:|:-:|:-:|:-:|:-:|---|---|
| CmsCategoryModel | ✅ | ✅ | ⚪ | ⚪ | ⚪ | ❌ | En cours | Arborescence des catégories |
| CmsArticleModel | ✅ | ✅ | ⚪ | ⚪ | ⚪ | ❌ | En cours | ArticleWorkbench |
| CmsSectionModel | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | ❌ | En cours | SectionWorkbench |
| CmsPartModel | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Stable | PartWorkbench |
| ComponentTypeModel | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | N/A | Stable | Référentiel uniquement |

## Principes

- Valider d'abord le modèle et les flux backend.
- Réaliser un CRUD minimal avec des vues CodeIgniter.
- Vérifier les routes, contrôleurs et services.
- Ajouter les tests fonctionnels.
- Remplacer ensuite l'interface par un Workbench dédié.
- Les Workbench réutiliseront les API existantes et les composants du CMS.

## Dépendances

Le développement des CRUD dépend des travaux réalisés dans les axes précédents :

- audit de l'architecture ;
- documentation des flux ;
- stabilisation des modèles ;
- stabilisation des services.

Les Workbench constitueront la dernière étape d'intégration de chaque module.

---

# Axe 7 — Préparation des Workbench

Définir les futurs remplacements des interfaces HTML.

Workbench prévus :

| Workbench             | Objet                       | Source principale |
| --------------------- | --------------------------- | ----------------- |
| CategoryWorkbench     | Arborescence des catégories | CmsCategoryModel  |
| ArticleWorkbench      | Édition des articles        | CmsArticleModel   |
| SectionWorkbench      | Édition des sections        | CmsSectionModel   |
| PartWorkbench         | Édition des composants      | CmsPartModel      |
| ModelWorkbench        | Ressources Three.js         | API + fichiers    |
| SceneWorkbench        | Assemblage de scènes        | SceneDescriptor   |
| LightWorkbench        | Éclairage                   | LightDescriptor   |
| OrganizationWorkbench | API Entreprise/Organisation | API métier        |



Les Workbench remplaceront progressivement les formulaires d'administration tout en conservant les mêmes services backend.

---

# Livrables

À la fin de cette phase :

* architecture backend documentée ;
* diagrammes homogènes ;
* inventaire complet ;
* documentation des flux ;
* documentation des composants ;
* liste des suppressions ;
* feuille de route des CRUD ;
* feuille de route des Workbench.

Cette phase constitue le socle des développements des phases suivantes.
