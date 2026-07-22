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
# [Descriptors](/documentation/THREEJS/ARCHITECTURE/descriptors/INDEX.md)
- [ModelDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/ModelDescriptor.md)
- [SceneDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/SceneDescriptor.md)
- [TerrainDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/TerrainDescriptor.md)
- [SkyboxDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/SkyboxDescriptor.md)
- [LightDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/LightDescriptor.md)
- [ModelInstanceDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/ModelInstanceDescriptor.md)
- [TerrainInstanceDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/TerrainInstanceDescriptor.md)
- [SkyboxInstanceDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/SkyboxInstanceDescriptor.md)
- [LightInstanceDescriptor.js](/documentation/THREEJS/ARCHITECTURE/descriptors/LightInstanceDescriptor.md)

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
# Providers

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


