
## Objectif

Décrire une entité métier indépendamment :
- du stockage  
- de l'API    
- de l'interface    
- du framework
    
Une EntityDefinition représente la connaissance minimale nécessaire pour manipuler une entité dans Zealot.

---
## Exemple

```php
[
    'name'        => 'entreprise',
    'label'       => 'Entreprise',
    'description' => 'Entreprise ou établissement',

    'readonly'    => false,

    'api' => [
        'list'   => '/api/entreprise',
        'show'   => '/api/entreprise/{id}',
        'create' => '/api/entreprise',
        'update' => '/api/entreprise/{id}',
        'delete' => '/api/entreprise/{id}',
        'like'   => '/api/entreprise/like'
    ],

    'fields' => [
        'siren',
        'raison_sociale',
        'naf_id',
        'adresse_id'
    ]
]
```

---

## Rôle

Une EntityDefinition doit permettre :
- génération d'un formulaire    
- génération d'un tableau    
- génération d'une recherche    
- génération d'une API cliente    
- génération d'un store    

---

## Ce qu'elle ne doit pas contenir

Pas de :
- SQL    
- HTML    
- CSS    
- JavaScript    
- logique métier    

---

## Utilisation future

```php
$entity = EntityRegistry::get('entreprise');
```

```php
component('form', [
    'entity' => 'entreprise'
]);
```

```js
createStore('entreprise');
```

---

## Entités identifiées

Référentiels :
- codesnaf    
- codepostal    
- typevoie    
- formejuridique    
- comptespcg    

Métier :
- mot    
- adresse    
- entreprise    
- organisation    

Ressources :
- image    

Authentification :
- utilisateur    
- groupe    
- permission


# Descripteur de vue - ViewDefinition
---
Le descripteur de vue est davantage lié au métier qu'au composant.

Une vue décrit :
```
- quels champs afficher
- dans quel ordre
- quels composants employer
- quelles relations charger
```

Cela reste donc une préoccupation de l'EntityDefinition.

Je ferais quelque chose comme :

```
EntityDefinition
├── Fields
├── Relations
└── Views
```

---

## Vue liste

```
[    
	'name' => 'ArticleList',
	'type' => 'list',
	'fields' => [
		'id', 'title', 'slug','published_at'
	]
]
```

---

## Vue détail

```
[    
	'name' => 'ArticleDetail',
	'type' => 'detail',
	'fields' => [
		'title', 'content', 'published_at'
    ],
    'relations' => [
	    'category', 'tags'
	]
]
```

---

## Vue formulaire

```
[    
	'name' => 'ArticleForm',
	'type' => 'form',
	'fields' => [
		'title', 'slug', 'content', 'category_id'
	]
]
```

---
## ViewDefinition
Une vue définit une représentation d'une entité.
Une même entité peut posséder plusieurs vues.

Exemples :
- List
- Detail
- Form
- Tree
- Selector
- Dashboard

Lorsque vous aurez implémenté :
```
ArticleList
ArticleForm
CodePostalSelector
OrganisationTree
ComptePcgTree
```

vous verrez naturellement si : `ViewDefinition` mérite son propre document.

