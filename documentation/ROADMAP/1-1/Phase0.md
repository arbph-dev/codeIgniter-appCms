
# Phase 0 – Les fondations

## Objectifs

Construire les briques communes qui serviront à tous les futurs Workbench.

Cette phase ne cherche pas à réaliser un éditeur complet mais à établir une architecture stable, modulaire et réutilisable.

À son terme, le premier Workbench (ModelWorkbench) devra pouvoir être développé sans remise en question de l'architecture.

---

# Vision

Le projet ne consiste plus simplement à afficher des modèles 3D.

L'objectif est de construire un ensemble cohérent d'ateliers spécialisés (Workbench) partageant une architecture commune.

Chaque atelier manipule des objets métier mais repose sur les mêmes composants techniques :

- EventBus
- Registry
- Renderer
- API
- Asset
- Geometry
- Relations
- Components

---

# Architecture générale

```
Workbench
│
├── SceneWorkbench
│
├── ModelWorkbench
├── TerrainWorkbench
├── BuildingsWorkbench
├── MaterialWorkbench
├── AnimationWorkbench
├── TrajectoryWorkbench
├── PhysicsWorkbench
├── CameraWorkbench
└── LightWorkbench
```

Les différents Workbench devront être totalement indépendants tout en pouvant communiquer grâce à l'EventBus.

---

# Les couches techniques

L'architecture est organisée en couches.

```
Mathématiques

↓

Géométrie

↓

Assets

↓

Renderers

↓

Workbench
```

---

## 1. Bibliothèque Math

Aucune dépendance graphique.

Exemples :

- vecteurs
- matrices
- quaternions
- projections cartographiques
- interpolation
- cinématique
- balistique
- physique
- conversions

Cette bibliothèque devra exister :

- en Javascript
- en PHP

afin de produire les mêmes résultats.

Elle constituera également le moteur scientifique de CodeVal.

---

## 2. Bibliothèque Geometry

Elle manipule des objets géométriques.

Exemples :

- Point
- Segment
- Plan
- Triangle
- BoundingBox
- BoundingSphere
- Mesh
- Trajectoire

Cette couche ne dépend pas de Three.js.

Elle représente la géométrie du projet.

---

## 3. Asset

Le concept d'Asset devient central.

Un Asset représente une ressource exploitable.

Il contient :

- métadonnées
- géométrie
- dimensions
- hiérarchie
- matériaux
- textures
- animations
- notes
- versions
- références

Un modèle n'est donc plus seulement un fichier OBJ ou GLTF.

Il devient un objet métier.

---

# Le concept de Workbench

Un Workbench est un environnement de travail spécialisé.

Tous les Workbench partageront une structure commune.

```
Workbench

├── Toolbar
├── Explorer
├── Inspector
├── Properties
├── Viewport
├── Console
└── EventBus
```

Chaque atelier ne remplacera que la partie métier.

---

# Premier Workbench

Le premier atelier développé sera :

## ModelWorkbench

Son objectif est d'analyser les modèles 3D.

Fonctions prévues :

- import
- visualisation
- analyse
- BoundingBox
- hiérarchie
- composants
- textures
- matériaux
- export des informations

Il devient le point d'entrée de tous les modèles.

---

# Gestion des modèles

Chaque modèle sera décrit par une fiche.

Exemple :

```
ModelAsset

id

nom

format

path

dimensions

BoundingBox

centre

rotation

échelle

objets enfants

textures

matériaux

notes
```

Les formats supportés progressivement :

- OBJ
- OBJ + MTL
- GLTF / GLB
- 3DS
- DAE
- STL
- PLY
- VRML
- FBX

---

# Analyse automatique

Lors du chargement d'un modèle, plusieurs informations devront être calculées automatiquement.

- Bounding Box globale
- Bounding Box des composants
- Centre
- Dimensions
- Hiérarchie
- Nombre de Mesh
- Nombre de matériaux
- Textures
- Objets enfants
- Points d'assemblage (à terme)

---

# Les composants

Un modèle pourra être constitué de plusieurs éléments.

Exemple :

```
Voiture

├── Châssis
├── Roue AVG
├── Roue AVD
├── Roue ARG
├── Roue ARD
├── Volant
├── Portes
└── Capot
```

Chaque composant pourra ensuite recevoir :

- une animation
- une trajectoire
- une liaison
- des propriétés métier

---

# Gestion des trajectoires

Les travaux déjà réalisés autour de `SceneAnim`, `ObjetAnimee`, `Trajectoire` et `ColorBank` constituent la première version du futur moteur d'animation.

Ils devront évoluer vers une architecture indépendante de Three.js afin d'être réutilisables dans plusieurs Workbench.

À terme, une trajectoire décrira :

- position
- rotation
- vitesse
- accélération
- période
- interpolation

Elle pourra être calculée par CodeVal ou construite graphiquement.

---

# TerrainWorkbench (prévision)

Le domaine cartographique est identifié comme un chantier majeur.

Il sera développé dans une phase ultérieure mais son architecture est déjà anticipée.

Fonctionnalités envisagées :

- MNT (Modèle Numérique de Terrain)
- Bathymétrie
- Courbes de niveau
- Orthophotos
- Tuiles cartographiques
- Occupation des sols
- Hydrographie
- Routes
- Navigation

---

# BuildingsWorkbench (prévision)

Les bâtiments constitueront un atelier autonome.

Il exploitera les modèles préparés par le ModelWorkbench.

Fonctions envisagées :

- assemblage
- composants
- niveaux
- façades
- ouvertures
- mobilier
- matériaux
- LOD
- génération procédurale

---

# CodeVal

CodeVal ne sera plus uniquement un moteur de calcul de courbes.

Il deviendra le moteur scientifique du framework.

Il pourra produire :

- des trajectoires
- des projections cartographiques
- des simulations physiques
- des calculs balistiques
- des courbes ApexCharts
- des objets géométriques
- des animations Three.js

---

# Principe directeur

Toutes les briques devront respecter la même philosophie :

- **indépendantes** : chaque module peut évoluer seul ;
- **réutilisables** : un calcul ou une géométrie n'appartient pas à un Workbench particulier ;
- **orientées métier** : les Workbench ajoutent les comportements spécifiques sans modifier les fondations ;
- **pilotées par événements** : la communication passe par l'EventBus afin de limiter les dépendances directes.

---

## Livrables de la Phase 0

À la fin de cette phase, nous disposerons :

- d'une architecture Workbench commune ;
- des premières bibliothèques `Math`, `Geometry` et `Asset` ;
- du squelette des composants PHP et JavaScript ;
- du `ModelWorkbench` minimal capable de charger, visualiser et analyser un modèle 3D ;
- des bases du futur moteur d'animation issu de `SceneAnim` ;
- d'une architecture suffisamment générique pour accueillir ensuite les domaines **cartographie**, **bâtiments**, **physique**, **animation** et **simulation** sans remise en cause des fondations.

Je trouve que cette feuille de route marque un tournant important. Les discussions sur Three.js ont commencé par un simple rendu 3D, puis se sont enrichies avec les trajectoires, l'analyse des modèles, la cartographie et CodeVal. Ce document synthétise cette évolution en une architecture cohérente : les **Workbench** deviennent la façade visible, tandis que les bibliothèques **Math**, **Geometry** et **Asset** constituent le socle commun sur lequel tout le reste pourra être construit. C'est une base solide pour les phases suivantes.
