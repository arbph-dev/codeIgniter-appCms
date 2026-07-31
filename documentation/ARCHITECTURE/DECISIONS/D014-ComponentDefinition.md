La connaissance des composants est maintenant centralisée. Un composant est décrit par une ComponentDefinition enregistrée dans le ComponentCatalog. 

Les prochaines intégrations (Carousel, Vox, PDF, Timeline, etc.) n'auront plus à modifier CmsService, ce qui était précisément l'objectif de D014.

Toutes les autres couches (CMS, rendu, administration, Workbench, Features et Connectors) doivent s'appuyer exclusivement sur cette définition et ne jamais maintenir leurs propres correspondances de types.


## Validations

### ✅ ComponentDefinition
label
icon
cssClass

### ✅ ComponentCatalog
get()
getById()
has()
all()

### ✅ DescriptorMapper
plus de mapping codé en dur

### ✅ CmsService::enrichPart()
plus de switch
délégation complète au ComponentCatalog

### Tests
✅ https://zealot.fr/cmptest
✅ https://zealot.fr/admin/cmstree


## Architecture
```
ComponentTypeModel
        │
        ▼
ComponentCatalog
        │
        ▼
ComponentDefinition
        │
        ├── DescriptorMapper
        └── CmsService
```

