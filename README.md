# ZEALOT - État Actuel du Projet

## TODAY
[/index.md](/index.md)

---

Le portail historique [https://zealot.fr/](https://zealot.fr/) contient déjà les briques. Il faut maintenant les extraire et les confronter à l'architecture actuelle.

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



|Workbench|Rôle actuel|Ce qu'il apporte|Ce qu'il faut en faire|
|---|---|---|---|
|`/admin/modelworkbench`|Prototype Three.js|Viewer, scènes, ressources 3D|Conserver comme laboratoire du moteur 3D|
|`/cms/article/test-art`|CmsArticleWorkbench|Intégration CMS complète, composants, édition|À démanteler progressivement pour extraire les briques communes|
|`/workbench/mot`| Runtime|CRUD, pagination, recherche, Panels|Conserver comme Workbench de référence|
|`/workbench/component-catalog`|Référence Builder|Catalogue des composants, descripteurs|Faire évoluer vers l'atelier de conception des composants|
|`workbench/image`| Runtime | Galerie d'image|Faire évoluer vers ImageTaggerWorkbench|
|`workbench/adresse`| Référence Runtime | Carnet d'adresse|Faire évoluer vers un widget AdressePickerDialog|

cette répartition correspond à 2 familles.

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

**Prochaines étapes (Phase 4)**

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

- PERSONNES
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
- project/audit
- project/daily
- project/stages/PANEL_CONTRACT.md


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

