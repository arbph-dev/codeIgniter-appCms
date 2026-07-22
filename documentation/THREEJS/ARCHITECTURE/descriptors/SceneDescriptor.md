
SceneDescriptor
│
├── assets
│
├── instances
│
├── environment
│
└── metadata

où

instances

contiendrait :

ModelInstance
LightInstance
CameraInstance
TerrainInstance
SkyboxInstance

Tous partageant :

id
resourceId
transform
visible
metadata

Autrement dit :

Scene
    =
ensemble d'instances
