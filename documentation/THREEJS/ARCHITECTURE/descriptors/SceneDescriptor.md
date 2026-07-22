# SceneDescriptor

Une Scene est un ensemble d'instances

l'impélementation retenue est ici :[/assets/js/components/modelworkbench/types/SceneDescriptor.js](/refactoring/assets/js/components/modelworkbench/types/SceneDescriptor.js)

```
SceneDescriptor
├── assets
├── instances
├── environment
└── metadata
```





## Instances
contiendra :
- ModelInstance
- LightInstance
- CameraInstance
- TerrainInstance
- SkyboxInstance

Toutes les instances partageant :
- id
- resourceId
- transform
- visible
- metadata


