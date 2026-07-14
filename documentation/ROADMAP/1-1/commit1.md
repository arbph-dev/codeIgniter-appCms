On pose les fondations. **Aucune logique métier**, uniquement l'architecture.

Le but du commit est qu'à la fin :

- le composant existe,
- il est intégrable dans ton CMS,
- tous les modules futurs ont leur place,
- aucun code ne devra être déplacé par la suite.

---

# Commit 1 — Création de l'architecture

## PHP

```
app/
├── Controllers/
│   └── Admin/
│       └── ModelWorkbench.php
│
├── Views/
│   └── admin/
│       └── modelworkbench.php
```

Pas de Service pour le moment.

Le Workbench est uniquement un composant graphique.

---

# Javascript

```
assets/js/components/

modelworkbench/

│
├── index.js
├── ModelWorkbench.js
│
├── core/
│   ├── SceneManager.js
│   ├── CameraManager.js
│   ├── RendererManager.js
│   ├── LightManager.js
│   ├── GridManager.js
│   ├── AxisManager.js
│   ├── SelectionManager.js
│   ├── EventBus.js
│   └── Config.js
│
├── services/
│   ├── GeometryAnalysis.js
│   ├── HierarchyAnalysis.js
│   └── MaterialAnalysis.js
│
├── transform/
│   ├── BoundingBoxHelper.js
│   ├── PivotHelper.js
│   ├── ScaleHelper.js
│   └── TransformHelper.js
│
├── io/
│   ├── LoaderFactory.js
│   ├── OBJLoader.js
│   ├── GLTFLoader.js
│   └── ExportFactory.js
│
├── data/
│   ├── ModelInfo.js
│   └── ModelRepository.js
│
├── ui/
│   ├── Toolbar.js
│   ├── Inspector.js
│   ├── TreeView.js
│   └── StatusBar.js
│
├── utils/
│   ├── Logger.js
│   ├── UUID.js
│   └── Helpers.js
│
└── assets/
    └── icons/
```

---

# Pourquoi cette organisation ?

On retrouve exactement les domaines fonctionnels.

| Domaine Fonctionnel | Notes |
| core | gère Three.js. |
| analysis | analyse les modèles. |
| transform | modifie les modèles. |
| io | importe/exporte. |
| ui | gère les panneaux. |
| data | décrit les objets. |

---

# Les futures extensions

Cette architecture sera quasiment identique pour

```
TerrainWorkbench

BuildingsWorkbench

TrajectoryWorkbench

PhysicsWorkbench
```

Seuls les dossiers

```
analysis

transform

ui
```

évolueront.

Le cœur restera identique.

---

# Ce qui n'est PAS créé

Pas de

```
math/
physics/
geometry/
```

Three.js fournit déjà cela.

On travaille **au-dessus** de Three.js.

---

# Première responsabilité de chaque classe

|Classe|Rôle|
|---|---|
|ModelWorkbench|chef d'orchestre|
|SceneManager|scène Three.js|
|CameraManager|caméra|
|RendererManager|renderer|
|GridManager|grille|
|AxisManager|axes|
|LightManager|éclairage|
|SelectionManager|sélection|
|GeometryAnalysis|analyse géométrique|
|HierarchyAnalysis|hiérarchie des objets|
|MaterialAnalysis|matériaux|
|LoaderFactory|choix automatique du loader|
|ModelInfo|description d'un modèle|
|ModelRepository|catalogue des modèles|
|Toolbar|barre d'outils|
|Inspector|propriétés|
|TreeView|arborescence|
|StatusBar|informations|

---

# Les interfaces que je souhaite stabiliser dès le début

Même si elles ne font rien au Commit 1, je voudrais que leur API soit pensée dès maintenant.

```
const wb = new ModelWorkbench(container);

await wb.initialize();

await wb.loadModel(modelInfo);

wb.select(object);

wb.inspect(object);

wb.resetCamera();
```

Toutes les futures commandes passeront par cette interface.

---

## Une petite évolution

En relisant toutes tes notes, je renommerais un dossier.

Au lieu de :

```
analysis/
```

je proposerais :

```
services/
```

avec :

```
services/

    GeometryService.js
    HierarchyService.js
    MaterialService.js
    BoundingBoxService.js
```

Pourquoi ?

Parce qu'ils ne feront pas qu'analyser. Ils calculeront, mettront en cache, fourniront des informations et, demain, pourront être appelés par **CodeVal**, **TerrainWorkbench**, **BuildingsWorkbench** ou **TrajectoryWorkbench**.

On commence déjà à construire une **bibliothèque de services 3D** réutilisables dans tout Zealot, plutôt qu'un simple ensemble d'outils propres au visualiseur. C'est, à mon sens, la meilleure base pour les phases suivantes.
