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

Identifier les travaux nécessaires pour chaque modèle.

Modèles concernés :

* CmsCategoryModel
* CmsArticleModel
* CmsSectionModel
* CmsPartModel
* ComponentTypeModel

Pour chacun :

* modèle ;
* service ;
* contrôleur ;
* vues ;
* tests.

---

# Axe 7 — Préparation des Workbench

Définir les futurs remplacements des interfaces HTML.

Workbench prévus :

* CategoryWorkbench
* ArticleWorkbench
* SceneWorkbench
* ModelWorkbench
* ImageWorkbench

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
