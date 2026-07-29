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

Livrable :

* tableau d'inventaire des fichiers.

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
* [/documentation/ARCHITECTURE/ComponentRegistry.md](/documentation/ARCHITECTURE/ComponentRegistry.md)
* [/documentation/ARCHITECTURE/DescriptorDefinition.md](/documentation/ARCHITECTURE/DescriptorDefinition.md)
* [/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md](/documentation/ARCHITECTURE/ARCHITECTURE-OVERVIEW.md)

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
