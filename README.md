# ZEALOT - État Actuel du Projet

Le portail historique contient déjà les briques. Il faut maintenant les extraire et les confronter à l'architecture actuelle.

la vue principale propose les librairies et les scripts dont "autocomplete"
- [/old/app/Views/cms/index.php](/old/app/Views/cms/index.php)

le document est structuré depuis le contrôleur
- [/old/app/Controllers/Cms.php](/old/app/Controllers/Cms.php)

## API 
les API ont été testée et validé depuis le portail actuel : [documentation/API/index.md](/documentation/API/index.md)

Les apis ont chacune un "features", structuré avec controller, form, renderer, service et store

Les apis en relation comme adresse ont chacune un features : codepostal , typevoie
Les services historiques et les "API de relation" possèdent déjà deux niveaux d'accès :
- TypeVoie (CRUD complet) :
  - recherche paginée fetchTv()
  - recherche fetchTvLike() pour autocomplete
  

CodePostal (read only car référentiel)
- recherche paginée avec q, codepostal, codeinsee
- fetchCpLike() pour autocomplete.
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/features/codepostal/codepostal.service.js



https://zealot.fr/admin/modelworkbench
https://zealot.fr/cms/article/test-art
https://zealot.fr/workbench/mot
https://zealot.fr/workbench/component-catalog

```md
|Workbench|Rôle actuel|Ce qu'il apporte|Ce qu'il faut en faire|
|---|---|---|---|
|`/admin/modelworkbench`|Prototype Three.js|Viewer, scènes, ressources 3D|Conserver comme laboratoire du moteur 3D|
|`/cms/article/test-art`|CmsArticleWorkbench|Intégration CMS complète, composants, édition|À démanteler progressivement pour extraire les briques communes|
|`/workbench/mot`|Référence Runtime|CRUD, pagination, recherche, Panels|Conserver comme Workbench de référence|
|`/workbench/component-catalog`|Référence Builder|Catalogue des composants, descripteurs|Faire évoluer vers l'atelier de conception des composants|
```

D'ailleurs, cette répartition correspond presque exactement aux familles que tu avais commencé à dessiner.

```
Workbench

            Runtime                       Builder
    ──────────────────────       ─────────────────────────

    MotWorkbench                 ComponentCatalogWorkbench
    ImageWorkbench               CarouselWorkbench
    ImageTaggerWorkbench         MathGraphWorkbench
    KnowledgeWorkbench           SceneWorkbench
                                 ModelWorkbench
```

Je ne mettrais plus `ModelWorkbench` dans Runtime.

|Responsabilité|Mot|ComponentCatalog|Model|CMS|Destination|
|---|:-:|:-:|:-:|:-:|---|
|Layout|✓|✓|✓|✓|`WorkbenchView`|
|Panels|✓|✓|✓|✓|`PanelBase` + `ui/panels`|
|Formulaires|✓|✓|✓|✓|`shared/Form.js`|
|Templates|△|△|✓|✓|`shared/templates`|
|Validation|✓|△|△|✓|`shared/validation`|
|Composants (Three, Carousel, Apex...)|✗|✓|✓|✓|`ui/widgets` + `components/`|
|Bus / callbacks|✓|✓|✓|✓|Architecture cible|

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


---


# Zealot - Refactoring/

## 00 - Vision & Objectifs/

### Consolidation (en cours)
- Inventaire complet **en cours**
- Nettoyage des doublons
- Documentation des flux critiques
- Figer la structure de dossiers
- Mise à jour ZEALOT-STATE-ACTUEL.md

### Base 
Centralisation de la logique (Services)
Refactoring des contrôleurs principaux
Amélioration du système d’authentification & permissions
Standardisation des réponses API

### Architecture
Introduction des Repositories
Event system
Cache stratégique
ComponentRegistry

### Evolutions
Amélioration du ModelWorkbench
Outils de génération de CRUD
Documentation développeur
Tests automatisés sur les parties critiques

---
## Inventaire complet



[daily/2026-07-28.md](/project/daily/2026-07-28.md) note journaliere

[daily/guide-composants.md](/project/daily/guide-composants.md)

[project/audit/Phase 0 - Inventory.md](/project/audit/Phase%200%20-%20Inventory.md)

[documentation/REFERENTIELS/shell.md](documentation/REFERENTIELS/shell.md)

[files.md](/files.md) : fichiers a gérer

