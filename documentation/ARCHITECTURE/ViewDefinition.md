## Objectif

Un ViewDefinition décrit une vue métier de l'application.

Une vue observe un ou plusieurs Stores et produit un ou plusieurs Descriptors destinés aux composants.

Une vue ne contient aucune logique métier.

Une vue ne dialogue jamais directement avec les APIs.

---
## Position dans l'architecture

```
Application
    ↓
Feature
    ↓
Store
    ↓
View    
	↓
Descriptor
	↓
Component
```

---
## Responsabilités

Une vue :
- observe les Stores
- sélectionne les données utiles
- prépare les Descriptors
- compose les composants

Une vue ne :
- modifie pas les données métier
- n'appelle pas les APIs
- n'exécute pas les règles métier
- ne manipule pas directement le DOM

---
# Exemple simple
## Store
```json
StoreArticle{    items : [...]}
```
## Vue
```php
[    
	'name' => 'article.list',
	'store' => 'article',
	'component' => 'datagrid'
]
```

## Résultat

```
StoreArticle
      ↓
ViewArticleList
      ↓
Descriptor Datagrid
      ↓
Datagrid Component
```

---
# Structure
```php
interface ViewDefinition{
    public function getName(): string;
    public function getStoreNames(): array;
    public function buildDescriptors(): array;
}
```

---

# Version déclarative

Une vue peut être entièrement décrite par un tableau.

```php
[    
	'name' => 'article.list',
	'stores' => [
		'article'    
	],
	'descriptors' => [
		[
		'type' => 'datagrid'
        ]    
    ]
]
```

---

# Vue détail

```php
[    
	'name' => 'article.detail',
	'stores' => [
		'article'    
	],
	'descriptors' => [
		[
		    'type' => 'panel'
		]
	]
]
```

---

# Vue formulaire

```php
[    
	'name' => 'article.form',
	'stores' => [
		'article'    
	],
	'descriptors' => [
		[
	        'type' => 'form'
	    ]    
	]
]
```

---

# Plusieurs Stores

Une vue peut agréger plusieurs sources.
Exemple :

```
StoreAdresse
StoreCodePostal
```

---

```php
[    
	'name' => 'adresse.form',
	'stores' => [ 'adresse' , 'codepostal' ]
]
```

---

## Exemple

```
StoreAdresse
       │
       ├────────┐
       │        │
       ▼        ▼
StoreCodePostal       ↓ViewAdresseForm       ↓Descriptor Form       ↓Component Form
```

---

# Vue composite

Une vue peut produire plusieurs descripteurs.

Exemple :

```php
[    
	'name' => 'article.management',
	'stores' => [
        'article'
    ],
    'descriptors' => [
	    [ 'type' => 'toolbar'],
        [ 'type' => 'datagrid'],
        [ 'type' => 'pagination' ]
    ]
]
```

---
Résultat :
```
Toolbar
Datagrid
Pagination
```
sont générés à partir d'une seule vue.

---

# Vue et composants composites

Une vue peut produire :

```php
[    'type' => 'article-manager']
```

où :

```
article-manager    
	├── toolbar    
	├── datagrid    
	├── paginator
```

est enregistré dans le ComponentRegistry.

La vue ne connaît alors qu'un seul composant composite.

---

# Vue CMS

## Liste des articles

```php
[    
	'name' => 'cms.article.list',
	'stores' => [ 'article' ],
	'descriptors' => [
		[
        'type' => 'datagrid',
        'id'   => 'ARTICLES_GRID'        
	    ]
    ]
]
```

---

## Edition article

```
[    'name' => 'cms.article.edit',    'stores' => [        'article',        'categorie',        'tag'    ],    'descriptors' => [        [            'type' => 'article-editor'        ]    ]]
```

---

# ViewRegistry

Comme pour les autres couches :

```
ComponentRegistry
StoreRegistry
ViewRegistry
```

---

Exemple :

```
ViewRegistry    
├── cms.article.list
├── cms.article.edit
├── cms.category.list
├── cp.search
└── adresse.form
```

---
# Cycle de vie

## Chargement

```
FeatureArticle
    ↓
StoreArticle
    ↓
ViewArticleList
	↓
Descriptors
	↓
Datagrid
```

---

## Mise à jour

```
FeatureArticle.update()
	↓
StoreArticle
	↓
ViewArticleList
	↓
Datagrid refresh
```

La vue réagit aux changements du Store.

---

# Règle Zealot

> Une View transforme des données métier en Descriptors.
> 
> Une View observe les Stores.
> 
> Une View ne connaît pas les APIs.
> 
> Une View ne contient pas de logique métier.
> 
> Une View est le pont entre les Stores et les Components.

---

## Remarque importante

Avec l'orientation que nous avons prise, une vue ressemble beaucoup à un **Descriptor métier de haut niveau**.

On peut même imaginer demain :

```php
[    'view' => 'cms.article.list']
```

dans :

```
part.content
```

ou :

```
part.aside
```

et laisser le moteur :

```
ViewRegistry      
	↓
ViewDefinition
	↓
Descriptors
	↓
ComponentRegistry
    ↓
Components
```

construire automatiquement toute l'interface.

C'est précisément ce qui rapproche ton CMS d'une architecture **SPA pilotée par des descripteurs** plutôt que par des vues PHP codées à la main.

on va clorurer la documentation apres ? que reste t'il ?

Oui, on approche d'un point de fermeture cohérent de la documentation d'architecture.

Si je reprends ce que nous avons construit durant les dernières séances :

# Couche Métamodèle

```
FieldDefinition
RelationDefinition
EntityDefinition
```

Décrit les données métier.

---

# Couche UI

```
DescriptorDefinition
ComponentDefinition
CompositeComponentDefinition
ComponentRegistry
```

Décrit les composants et leur assemblage.

---

# Couche SPA

```
StoreDefinition
StoreRegistry
FeatureDefinition
ViewDefinition
ViewRegistry
ApplicationDefinition
```

Décrit le fonctionnement du SPA.

---

