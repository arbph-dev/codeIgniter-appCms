
1. Objet du document
état du projet à la clôture de cette conversation ;
décisions validées ;
architecture retenue ;
travaux restant à réaliser ;
ordre de développement.
2. Vision de Zealot

Rappeler la philosophie du projet.

Pas un CMS.

Pas une GMAO.

Pas un ERP.

Mais un assistant métier, construit autour :

de la connaissance ;
des composants interactifs ;
des documents ;
de l'accompagnement de l'utilisateur ;
des standards du Web.

On y retrouvera les exemples que tu as donnés :

pompe eau de mer ;
alternateur ;
variateur ;
rapport d'intervention ;
atelier pédagogique.

Je pense que ces exemples sont précieux parce qu'ils expliquent immédiatement pourquoi Zealot existe.

3. Architecture générale

Les grandes couches du système.

Par exemple :

Interface utilisateur

↓

CMS

↓

Composants

↓

Framework JS

↓

Features métier

↓

API

↓

Base de connaissances

↓

Base de données

Puis les futures couches :

authentification Shield
connecteurs
services externes
IA
automatisation
4. Le CMS

Résumé de l'architecture actuelle.

Catégorie

↓

Article

↓

Section

↓

Part

↓

Descriptor

↓

Renderer

↓

Composant

État d'avancement.

Travaux prévus.

5. Framework de composants

Résumé de toutes les conventions.

Renvoi vers :

documentation/CONVENTIONS.md

sans les recopier entièrement.

6. Les composants existants

Tableau.

composant	état	retrofit

Raw

Callout

Apex

Mermaid

Leaflet

Three.js

7. Les composants futurs

ImageDescriptor

ElectricalDiagram

Grafcet

Timeline

Workspace

Carousel

Video

PDF

Markdown

...

8. Les composants composites

Je pense qu'il faut leur réserver un chapitre.

Parce que c'est probablement l'évolution majeure.

Exemples :

Atelier Alternateur

Courbe paramétrique

Diagnostic pompe

Simulation PID

Maintenance chaudière

etc.

9. Base de connaissances

Le rôle de

Mot

Image

Catégorie

Organisation

Personne

Adresse

Evènement

Relations

Pourquoi "Mot" devient le pivot.

C'est un point extrêmement important.

10. Assistant métier

Toute la réflexion menée hier.

Suggestions.

Liens.

Documents.

Photos.

Synonymes.

Référencement.

Occurrences.

Historique.

Connaissance.

Je pense que c'est ici que Zealot devient réellement différent d'un CMS.

11. Documentation

Organisation proposée.

documentation/

    COMPOSANTS/

    CONVENTIONS.md

    CMS.md

    FEATURES/

    API/

    RETROFIT/

    ROADMAP/

    ARCHITECTURE/
12. Roadmap

Je la vois en grandes étapes.

Phase 1

Stabilisation

Three.js
Mermaid
Leaflet
retrofit
Phase 2

CMS

catégories
articles
administration
authentification
API
Phase 3

Features

Images

Mots

Relations

Organisation

Phase 4

Composants composites

Workspace

Node

Editor

Property Editor

ImageDescriptor

Phase 5

Assistant métier

Suggestions

Recherche

Indexation

Référencement

Connaissance

Phase 6

Ateliers

Alternateur

Pompe

PID

Automatisme

Maintenance

Phase 7

Industrialisation

Documentation

Tests

Packaging

Plugins

API publiques

13. Bibliothèques retenues

Celles que nous avons identifiées.

Three.js
ApexCharts
Mermaid
Leaflet
SVG.js (à étudier)
Cytoscape.js (graphe de connaissances)
ELK.js (mise en page automatique)
MathJax ou KaTeX
Monaco Editor
PDF.js

avec le rôle de chacune.

14. Décisions importantes de cette conversation

Une synthèse concise :

naissance du composant Three.js de seconde génération ;
validation du contrat options ;
séparation stricte PHP / JavaScript ;
généralisation des Registry et Factory ;
cycle de vie commun des composants ;
introduction de la notion de Node ;
distinction entre composants atomiques et composites ;
orientation vers un assistant métier centré sur la connaissance.
Pourquoi ce document est important

À mon avis, cette conversation marque la fin de la phase d'exploration initiale.

Jusqu'à présent, nous avons beaucoup expérimenté : architecture CMS, renderers, composants, conventions, Three.js, Leaflet, EventBus, etc. Grâce à ce travail, plusieurs décisions structurantes sont désormais stabilisées.

La suite ne consistera plus à inventer l'architecture, mais à la faire vivre : migrer les composants existants, enrichir les fonctionnalités, développer les composants composites et construire progressivement l'assistant métier.
