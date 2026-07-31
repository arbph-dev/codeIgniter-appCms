# Backend - PHP

## Objectif

Introduire `ComponentCatalog` comme point d'entrée unique des métadonnées des composants et supprimer les premiers mappings codés en dur.

## Réalisations

### ComponentTypeModel

- ajout de `is_active` dans `allowedFields`
- ajout de `findActive()`
- ajout de `findByName()`

### ComponentDefinition

Création de :

```
app/Libraries/Components/ComponentDefinition.php
```

Objet de transport des métadonnées d'un composant.

### ComponentCatalog

Création de :

```
app/Libraries/Components/ComponentCatalog.php
```

Fonctionnalités :

- `get()`
- `getById()`
- `has()`
- `all()`

Le catalogue utilise désormais `ComponentTypeModel`.

### DescriptorMapper

Suppression du tableau interne :

```php
protected array $types = [...]
```

Le mapping utilise désormais `ComponentTypeModel`.

### CmsService

`CmsService::enrichPart()` utilise maintenant `ComponentCatalog::getById()`.

La dépendance directe à `ComponentTypeModel` est supprimée.

## Tests réalisés

- ✅ ComponentTypeModel
- ✅ ComponentCatalog
- ✅ DescriptorMapper
- ✅ CmsService::enrichPart()
- ✅ `/admin/cmstree`

Aucune régression constatée.

## État

Le `switch` de `CmsService::enrichPart()` est conservé provisoirement.

Il sera supprimé lors de la migration des métadonnées (`label`, `icon`, `cssClass`) vers `ComponentDefinition`.

Référence : **D014**

---
---

# Frontend - Javascript

## ComponentCatalog

[assets/js/core/ComponentCatalog.js](/refactoring/assets/js/core/ComponentCatalog.js)










