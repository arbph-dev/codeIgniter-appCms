
# Zealot — Versatile Knowledge Base

**Plateforme de connaissance polyvalente** construite sur CodeIgniter 4.

> Ce n’est plus un simple CMS à widgets.  
> C’est un socle pour explorer, structurer et manipuler des connaissances métier via des **Workbenches** modulaires.

| | |
|---|---|
| **Statut** | Refactoring actif — infrastructure Workbench en stabilisation |
| **Stack** | CodeIgniter 4 · PHP 8.2+ · Vanilla JS · MySQL/MariaDB |
| **Site** | [zealot.fr](https://zealot.fr/) |
| **Licence** | AGPL-3.0 |


---


## Workbench 

Ils doivent permettre de construire les interfaces des applicatifs. Ils représenteront la stack la plus complexe du projet
Ils sont décrits ici : [02-FEATURES/index.md](/02-FEATURES/index.md)


Après différentes versions on arrive a une stabilisation du pattern
- https://zealot.fr/admin/modelworkbench
- https://zealot.fr/cms/article/test-art
- https://zealot.fr/workbench/mot
- https://zealot.fr/workbench/component-catalog
- https://zealot.fr/workbench/image
- https://zealot.fr/workbench/adresse
- https://zealot.fr/workbench/imagetagger



## TODAY
- Travaux [/index.md](/index.md)
- Documentation [/documentation](/documentation)
- Notes quotidiennes : [/project/daily](/project/daily)

### Pyhton
Audit de projet 
- [akinator-0-7](/project/sysex/akinator-0-7.md)
Projet
- [`Orbis`](/Orbis/index.md)

### API
[authentification](documentation/REFERENTIELS/CODEIGNITER/authentification.md)
- mise a jour du code commentée
- filters.php mis a jour pour essai API
  - python (a faire)
  - html : https://zealot.fr/recherche-mot-api.html ( a documenter en référentiel)

#### module personne 
- ressources et debut du projet : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-08-13.md
- documentation de l'API: https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/index.md

- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/index.md#routes-compl%C3%A8tes-du-module

notes de dev a déplacer
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/seeders.md#fix-relationservice--bug-ordre-validation--r%C3%A9solution

---

### workbench
#### ListPanel
factorisation + harmonisation usage callback plutôt que bus dans les panels -> ListPanelBase
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-08-16.md

#### style 
harmonisation usage PanelStyles au niveau PanelBase
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-08-17.md

#### [Authentification](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-08-18.md)
Intégration dans la stack workbench
- voir évolution vers layout et multi workbench
- convention de notation a respecter, dossier et fichier peuvent être diffèrent adresse et AdresseWorkbench => adresse2  mais a bien spécifier dans la vue
- style banner a revoir
- modifier les vues pour intégrer auth via wbapp.js

#### todo
- Image / Tagger style et ListPanel, il utilise un panel qui communiquait sur le bus, les travaux sur ListPanelBase on cassé la communication bus


---

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

### En cours
- [PERSONNES](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/index.md)
- seeder a compléter

### Technologies

- **Backend** : CodeIgniter 4 + PHP 8.2+
- **Frontend** : Vanilla JS + composants modulaires
- **Base de données** : MySQL / MariaDB
- **Visualisation** : Three.js, ApexCharts, Leaflet, Mermaid, etc.

---

**Prochaines étapes (Phase 4)**

Le portail historique [https://zealot.fr/](https://zealot.fr/) contient déjà les briques. Il faut maintenant les extraire et les confronter à l'architecture actuelle.

la vue principale propose les librairies et les scripts dont "autocomplete"
- [/old/app/Views/cms/index.php](/old/app/Views/cms/index.php)

le document est structuré depuis le contrôleur
- [/old/app/Controllers/Cms.php](/old/app/Controllers/Cms.php)

---

## modules métiers
On va préparer des API ,documenter celle qui existe et les lister dans [documentation/API/index.md](/documentation/API/index.md)

- EVENTS
  - documentation/METIERS/EVENTS/index.md

- FORMEJURIDIQUE
  - documentation/METIERS/FORMEJURIDIQUE/index.md

- ORGANISATIONS
  - documentation/METIERS/ORGANISATIONS/index.md
  - une entreprise est déjà une organisation + une entreprise peut avoir des établissements 
    - dependances -> documentation/METIERS/FORMEJURIDIQUE/index.md

- [PERSONNES](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/index.md)
  - Cette API introduit la notion importante de relation qui peut s'appliquer à d'autres ressources : organisations
  - documentation/METIERS/PERSONNES/index.md
  - documentation/METIERS/PERSONNES/personne_relations.md

- MAINTENANCE
  - documentation/METIERS/MAINTENANCE/index.md

- PRODUITS
  - documentation/METIERS/PRODUITS/index.md
    - ébauche, certaines relations sont à répartir vers d'autres ressoucres métiers
      - un vendeur est une entreprise 
      - un produit peut se rapprocher d'un article de GMAO

- JURIDIQUE
  - documentation/METIERS/JURIDIQUE/index.md
    - Doit permettre de recenser les références législatives ; Ne pas confondre avec formes juridiques des entreprises

## Projets à faire évoluer
prenoms
- project/prenoms.md
  - sur la base de mots

grandeurs
- project/GrandeursUnits_Specs.md
- project/Grandeursunits.md
- dossier project/grandeurs

accidents de la route
- project/accidents

## Documentation a revoir
```
codeIgniter-appCms/
├── refactoring/          # Code actif (cible)
│   ├── app/              # Controllers, Models, Libraries, Views, Config
│   └── assets/js/        # Frontend workbench + features
├── old/                  # Ancienne base (référence / migration)
├── documentation/        # Doc stable (en réorganisation)
├── project/
│   ├── daily/            # Notes de session (source de vérité temporaire)
│   ├── stages/           # Contrats & checklists (Panel Contract, etc.)
│   └── audit/
├── README.md
└── LICENSE
```


## evolution cms 
Le CMS va évoluer vers une API
- [https://zealot.fr/admin/cmstree](https://zealot.fr/admin/cmstree) : Visualisation des element cms classé hiérachirquement de la catégorie à la parts
- [https://zealot.fr/admin/cmspart](https://zealot.fr/admin/cmspart) : Visualisation des element parts
- [https://zealot.fr/admin/cmspart/edit/1](https://zealot.fr/admin/cmspart/edit/1) : Edition d element parts
- [https://zealot.fr/cms/category/test-cat](https://zealot.fr/cms/category/test-cat)
- [https://zealot.fr/cms/article/test-art](https://zealot.fr/cms/article/test-art)
- [https://zealot.fr/cms/section/999](https://zealot.fr/cms/section/999)
- [https://zealot.fr/cms/part/5](https://zealot.fr/cms/part/5)

a gérer les routes CRUD
- https://zealot.fr/admin/cmscategory/edit/999
- https://zealot.fr/admin/cmscategory/999
- https://zealot.fr/cms/tree

## ancienne version
- [https://zealot.fr/admin/](https://zealot.fr/admin/)
  - des elements à intégrer dans un AdminWorkbench   
- [https://zealot.fr/](https://zealot.fr/)

