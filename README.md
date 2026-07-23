# ZEALOT - État Actuel du Projet

**Date :** 23 juillet 2026  
**Version :** X.X.X (Phase 0 - Consolidation)  
**Statut :** Pré-refactoring

## Présentation du Projet

**Zealot** est un **Framework d’Applications Métier** full-stack, orienté données et hautement extensible.

Il ne s’agit **pas uniquement d’un CMS**, même s’il en intègre un puissant. Zealot a été conçu pour permettre la construction rapide d’applications complexes nécessitant :

- Une forte composante **données** (structurées et relationnelles)
- Des interfaces d’administration avancées
- Des visualisations interactives (2D/3D, graphiques, cartes, etc.)
- Un système de **composants dynamiques** réutilisables
- Une architecture modulaire permettant d’ajouter facilement de nouveaux domaines métier

### Objectifs principaux

- Accélérer le développement d’applications métier sur mesure
- Fournir un socle technique robuste et maintenable (CodeIgniter 4)
- Offrir un système de composants visuels puissant (Component Registry + Renderers)
- Permettre la visualisation et la manipulation avancée de données (ModelWorkbench)
- Combiner la flexibilité d’un framework avec la productivité d’un CMS

### Fonctionnalités clés

- **CMS avancé** : gestion de contenu structuré (articles, sections, parts, arbres)
- **Système de composants** : Apex Charts, Leaflet, Three.js, Mermaid, CodeVal, etc.
- **ModelWorkbench** : outil d’exploration et de visualisation de modèles de données
- **API par domaine** : Géographie, Économie, Entités, Images, etc.
- **Architecture modulaire** : Services, Repositories, Component Registry, Traits
- **Interface d’administration** : extensible et personnalisable
- **Outils de développement** : génération, tests, workbench

### Positionnement

Zealot se situe entre :
- Un **CMS classique** (trop rigide)
- Un **framework brut** (trop bas niveau)

Il offre un juste milieu : structure forte + extensibilité + outils haut niveau.

### Technologies

- **Backend** : CodeIgniter 4 + PHP 8.2+
- **Frontend** : Vanilla JS + composants modulaires
- **Base de données** : MySQL / MariaDB
- **Visualisation** : Three.js, ApexCharts, Leaflet, Mermaid, etc.

---

**Prochaines étapes (Phase 0)**
- Nettoyage et inventaire complet du code
- Documentation des flux principaux
- Identification et suppression des doublons
- Définition de la nouvelle architecture cible


---

# Phase 0

## TODO
revoir la structure de la documentation
url a consulter : 

## evolution cms 
- [https://zealot.fr/](https://zealot.fr/)

- [https://zealot.fr/admin/cmstree](https://zealot.fr/admin/cmstree) : Visualisation des element cms classé hiérachirquement de la catégorie à la parts
- [https://zealot.fr/admin/cmspart](https://zealot.fr/admin/cmspart) : Visualisation des element parts
- [https://zealot.fr/admin/cmspart/edit/1](https://zealot.fr/admin/cmspart/edit/1) : Edition d element parts


- [https://zealot.fr/cms/category/test-cat](https://zealot.fr/cms/category/test-cat)
- [https://zealot.fr/cms/article/test-art](https://zealot.fr/cms/article/test-art)
- [https://zealot.fr/cms/section/999](https://zealot.fr/cms/section/999)
- [https://zealot.fr/cms/part/5](https://zealot.fr/cms/part/5)



## not found
- https://zealot.fr/admin/cmscategory/edit/999
- https://zealot.fr/admin/cmscategory/999

- https://zealot.fr/cms/tree


## ancienne version
- [https://zealot.fr/admin/](https://zealot.fr/admin/)
- [https://zealot.fr/](https://zealot.fr/)



## Décrire les flux

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/admin/bootstrap.js
/refactoring/assets/js/cms/bootstrap.js


https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/cms/bootstrap.js
refactoring/assets/js/cms/bootstrap.js

url
route
controleur
dependances :
model
service
vues
- app/Views/cms/article.php
  dependances : 
  - refactoring/assets/js/cms/bootstrap.js
 
- app/Views/admin/modelworkbench.php
   utilise app/Views/cms/libs.php

## Reprise documentation
un fichier de code doit comporter un fichier de notes ? NON

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Routes.php

Zealot - Refactoring/
├── 00 - Vision & Objectifs/
├── 01 - Phase 0 - Consolidation & Nettoyage/
├── 02 - Phase 1 - Architecture/
├── 03 - Phase 2 - Refactoring Core/
├── 04 - Phase 3 - Améliorations & Features/
├── Archives/
├── Templates/
└── Roadmap.md

