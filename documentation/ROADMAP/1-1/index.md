Phase 0 — Les fondations

Objectif : obtenir un composant vide mais parfaitement intégré au CMS.

ModelWorkbench

Structure :

app/
├── Controllers/
│   └── Admin/
│       └── ModelWorkbench.php

app/Views/
│   └── admin/
│       └── modelworkbench.php

assets/js/components/
└── modelworkbench/
    ├── index.js
    ├── ModelWorkbench.js
    └── core/
        └── SceneManager.js

À la fin :

le composant est déclaré dans le Component Registry ;
il s'ouvre dans le CMS ;
une scène Three.js vide apparaît.

Aucune fonctionnalité métier.

Phase 1 — Viewer

Premier objectif concret.

+-----------------------------+
| Toolbar                     |
+--------------+--------------+
|              |              |
|              | Inspector    |
|              |              |
| Scene         |              |
|              |              |
|              |              |
+--------------+--------------+
| Console                     |
+-----------------------------+

Fonctionnalités :

OrbitControls
grille
axes
lumière
resize automatique

C'est notre "Hello World".

Phase 2 — Chargement

On ajoute

ModelLoader

supportant

OBJ

OBJ+MTL

GLTF

uniquement.

Je laisserais FBX, 3DS, STL plus tard.

Phase 3 — Analyse

C'est ici que commence la valeur ajoutée.

Le bouton

Analyser

produit

Nom

Format

Bounding Box

Centre

Dimensions

Nombre de Mesh

Nombre de matériaux

Nombre d'enfants

Liste des objets

Le tout affiché dans l'Inspector.

Phase 4 — Explorer

Une arborescence.

FW190

├── Fuselage

├── Verrière

├── Hélice

├── Train G

└── Train D

Un clic sélectionne l'objet.

Phase 5 — Inspector

Pour chaque objet

Nom

UUID

Visible

Position

Rotation

Scale

Bounding Box

Nombre de vertices

Nombre de triangles

Material
Phase 6 — Sélection

Quand on clique

Explorer

↓

l'objet est surligné.

Quand on clique dans la scène

↓

l'Explorer sélectionne le nœud.

Synchronisation complète.

Phase 7 — Repository

À ce moment apparaît

ModelRepository

Le viewer devient capable de conserver plusieurs modèles.

Repository

↓

FW190

B17

Audi

Frégate
Phase 8 — Base SQL

Les analyses deviennent persistantes.

Importer

↓

Analyse

↓

BDD

↓

Réutilisation

Le deuxième chargement ne recalcule plus tout.

Phase 9 — Assemblages

C'est là qu'on retrouve tes notes.

B17

↓

Moteur

↓

Hélice

↓

Pivot

Puis

Train

↓

Roue

↓

Rotation

Les points d'assemblage deviennent des objets métier.

Phase 10 — Animation

On reconnecte

Trajectoire

ObjetAnimee

SceneAnim

mais cette fois dans une architecture propre.
