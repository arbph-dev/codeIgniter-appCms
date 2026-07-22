# Architecture Three.js / Workbench

> Version 1.0 — Architecture cible
>
> Ce dossier décrit l'architecture du moteur Three.js de Zealot.
> L'objectif est de construire une architecture indépendante de Three.js,
> fondée sur les Descriptors, Resources, Instances et Workbench.

---

# Vision générale

```
                           CMS
                            │
                    DescriptorDefinition
                            │
                            ▼
                     ThreeRenderer
                            │
                            ▼
                    WorkbenchManager
                            │
          ┌─────────────────┴─────────────────┐
          ▼                                   ▼
   ModelWorkbench                     SceneWorkbench
          │                                   │
          ├──────────────┐                    │
          ▼              ▼                    ▼
   ModelResource     LightResource      SceneDescriptor
          │              │                    │
          ▼              ▼                    ▼
     SceneModelInstance  SceneLightInstance  Runtime
                            │
                            ▼
                        THREE.Scene
```


les Workbench manipulent le métier et les interactions utilisateur, les Providers savent acquérir les données, les Resources les normalisent, les Instances les contextualisent dans une scène, et le moteur de rendu (Three.js aujourd'hui, un autre demain) n'est plus que la dernière étape de la chaîne.

---

# Arborescence

```
/assets
  /js
    /components
      /modelworkbench
        /descriptors
          /ModelDescriptor.js
          /SceneDescriptor.js
          /TerrainDescriptor.js
          /SkyboxDescriptor.js
          /LightDescriptor.js
          /ModelInstanceDescriptor.js
          /TerrainInstanceDescriptor.js
          /SkyboxInstanceDescriptor.js
          /LightInstanceDescriptor.js
```

---

# Documentation

| Partie | Description |
|---------|-------------|
| [Descriptors](/documentation/THREEJS/ARCHITECTURE/descriptors/INDEX.md) | Contrats métier |
| [Resources](/documentation/THREEJS/ARCHITECTURE/resources/INDEX.md) | Ressources réutilisables |
| instances | Utilisation des ressources dans une scène |
| workbenches | Outils d'édition |
| providers | Sources externes (API, fichiers...) |
| dialogs | Interfaces utilisateur |
| builders | Construction des objets |
| registry | Catalogues d'objets |
| factory | Création d'objets |
| runtime | Adaptation vers Three.js |
| services | Calculs métier |
| ui | Composants graphiques |






---

# Dépendances

```
Descriptor
      │
      ▼
Resource
      │
      ▼
Instance
      │
      ▼
SceneDescriptor
      │
      ▼
SceneWorkbench
      │
      ▼
Runtime
      │
      ▼
Three.js
```

---

# Règles d'architecture

- Les Descriptors sont indépendants de Three.js.
- Une Resource est créée à partir d'un Descriptor.
- Une Instance référence une Resource.
- Une Scene manipule uniquement des Instances.
- Les Workbench créent et modifient les Descriptors, Resources et Instances.
- Les Providers alimentent les Resources.
- Les Builders produisent les objets techniques.
- Le Runtime est le seul à manipuler Three.js.
- Les Renderers PHP ne contiennent aucune logique métier.

---

# Roadmap

- [ ] Phase 1 — Descriptors
- [ ] Phase 2 — Resources
- [ ] Phase 3 — Instances
- [ ] Phase 4 — WorkbenchBase
- [ ] Phase 5 — Workbench spécialisés
- [ ] Phase 6 — Dialogs
- [ ] Phase 7 — Providers
- [ ] Phase 8 — Builders
- [ ] Phase 9 — Runtime
- [ ] Phase 10 — Intégration CMS

---

# Resources

documentation/THREEJS/ARCHITECTURE/resources/INDEX.md
documentation/THREEJS/ARCHITECTURE/resources/ModelResource.md
documentation/THREEJS/ARCHITECTURE/resources/TerrainResource.md
documentation/THREEJS/ARCHITECTURE/resources/SkyboxResource.md
documentation/THREEJS/ARCHITECTURE/resources/LightResource.md

---
# Instances

documentation/THREEJS/ARCHITECTURE/instances/INDEX.md
documentation/THREEJS/ARCHITECTURE/instances/SceneModelInstance.md
documentation/THREEJS/ARCHITECTURE/instances/SceneLightInstance.md
documentation/THREEJS/ARCHITECTURE/instances/SceneTerrainInstance.md
documentation/THREEJS/ARCHITECTURE/instances/SceneSkyboxInstance.md

---
# Workbenches

documentation/THREEJS/ARCHITECTURE/workbenches/INDEX.md
documentation/THREEJS/ARCHITECTURE/workbenches/core/WorkbenchBase.md
documentation/THREEJS/ARCHITECTURE/workbenches/model/ModelWorkbench.md
documentation/THREEJS/ARCHITECTURE/workbenches/scene/SceneWorkbench.md
documentation/THREEJS/ARCHITECTURE/workbenches/terrain/TerrainWorkbench.md
documentation/THREEJS/ARCHITECTURE/workbenches/skybox/SkyboxWorkbench.md
documentation/THREEJS/ARCHITECTURE/workbenches/light/LightWorkbench.md

---
## Providers
En parallèle, les données externes s'intègrent sans modifier cette architecture :
```
Fichier OBJ ───────┐
API BAN ───────────┤
API SIRENE ────────┤
GeoTIFF / MNT ─────┤
IFC ───────────────┤
IoT ───────────────┘
        │
        ▼
     Provider
        │
        ▼
     Resource
        │
        ▼
     Instance
        │
        ▼
     Scene
```
les Workbench manipulent le métier et les interactions utilisateur, les Providers savent acquérir les données, les Resources les normalisent, les Instances les contextualisent dans une scène, et le moteur de rendu (Three.js aujourd'hui, un autre demain) n'est plus que la dernière étape de la chaîne.

documentation/THREEJS/ARCHITECTURE/providers/INDEX.md
documentation/THREEJS/ARCHITECTURE/providers/Provider.md
documentation/THREEJS/ARCHITECTURE/providers/AddressProvider.md
documentation/THREEJS/ARCHITECTURE/providers/SireneProvider.md
documentation/THREEJS/ARCHITECTURE/providers/GeoportailProvider.md
documentation/THREEJS/ARCHITECTURE/providers/ElevationProvider.md
documentation/THREEJS/ARCHITECTURE/providers/IfcProvider.md

---
# Dialogs

documentation/THREEJS/ARCHITECTURE/dialogs/INDEX.md
documentation/THREEJS/ARCHITECTURE/dialogs/ResourceBrowserDialog.md
documentation/THREEJS/ARCHITECTURE/dialogs/SelectModelDialog.md
documentation/THREEJS/ARCHITECTURE/dialogs/SelectLightDialog.md
documentation/THREEJS/ARCHITECTURE/dialogs/SelectTerrainDialog.md
documentation/THREEJS/ARCHITECTURE/dialogs/ImportApiDialog.md
documentation/THREEJS/ARCHITECTURE/dialogs/ImportFileDialog.md

--- 
# Runtime

documentation/THREEJS/ARCHITECTURE/runtime/INDEX.md
documentation/THREEJS/ARCHITECTURE/runtime/SceneRuntime.md
documentation/THREEJS/ARCHITECTURE/runtime/CameraRuntime.md
documentation/THREEJS/ARCHITECTURE/runtime/TerrainRuntime.md
documentation/THREEJS/ARCHITECTURE/runtime/LightRuntime.md

--- 
# Builders

documentation/THREEJS/ARCHITECTURE/builders/INDEX.md
documentation/THREEJS/ARCHITECTURE/builders/TerrainBuilder.md
documentation/THREEJS/ARCHITECTURE/builders/GridBuilder.md
documentation/THREEJS/ARCHITECTURE/builders/MeshBuilder.md
documentation/THREEJS/ARCHITECTURE/builders/SceneBuilder.md

---
# Registry

documentation/THREEJS/ARCHITECTURE/registry/INDEX.md
documentation/THREEJS/ARCHITECTURE/registry/ResourceRegistry.md
documentation/THREEJS/ARCHITECTURE/registry/LoaderRegistry.md
documentation/THREEJS/ARCHITECTURE/registry/ProviderRegistry.md
documentation/THREEJS/ARCHITECTURE/registry/BuilderRegistry.md
documentation/THREEJS/ARCHITECTURE/registry/WorkbenchRegistry.md

---
# Factory

documentation/THREEJS/ARCHITECTURE/factory/INDEX.md
documentation/THREEJS/ARCHITECTURE/factory/LoaderFactory.md
documentation/THREEJS/ARCHITECTURE/factory/ResourceFactory.md
documentation/THREEJS/ARCHITECTURE/factory/InstanceFactory.md

---
# Services

documentation/THREEJS/ARCHITECTURE/services/INDEX.md
documentation/THREEJS/ARCHITECTURE/services/GeometryAnalysis.md
documentation/THREEJS/ARCHITECTURE/services/BoundingBoxService.md
documentation/THREEJS/ARCHITECTURE/services/CoordinateService.md
documentation/THREEJS/ARCHITECTURE/services/TransformService.md
documentation/THREEJS/ARCHITECTURE/services/SceneAnalysis.md

---
# UI

documentation/THREEJS/ARCHITECTURE/ui/INDEX.md
documentation/THREEJS/ARCHITECTURE/ui/Toolbar.md
documentation/THREEJS/ARCHITECTURE/ui/TreeView.md
documentation/THREEJS/ARCHITECTURE/ui/ModelTreeView.md
documentation/THREEJS/ARCHITECTURE/ui/Inspector.md
documentation/THREEJS/ARCHITECTURE/ui/StatusBar.md
documentation/THREEJS/ARCHITECTURE/ui/PropertyGrid.md


