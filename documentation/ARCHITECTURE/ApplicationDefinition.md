## Objectif

ApplicationDefinition décrit une application SPA complète.

C'est le point d'entrée fonctionnel du système.

Une application ne contient pas directement des composants.

Elle orchestre :

- les Features
- les Stores
- les Views
- les Routes
- les Services

L'application représente le niveau métier le plus élevé.

---

## Position dans l'architecture

```
Application    
	↓
Feature
    ↓
View
    ↓
Descriptor
	↓
Component
```

Les composants ne connaissent pas l'application.

Les composants restent réutilisables.

Toute l'intelligence métier est portée par :

```
Application    
	↓
Features
    ↓
    Stores
```

---

## Responsabilités

Une ApplicationDefinition doit :

- déclarer les features disponibles
- déclarer les stores utilisés
- déclarer la vue de démarrage
- déclarer les routes
- déclarer les services externes
- définir la navigation globale

Elle ne contient jamais :

- de HTML
- de Javascript métier
- de composants

---

# Structure

Exemple :

```js
{    
	name: 'cms',
	title: 'CMS Zealot',
	startView: 'article-list',
	features: [
		'articles',
		'categories',
		'tags'
		],
    stores: [
	    'articleStore',
	    'categoryStore',
	    'tagStore'
    ],
    routes: [
	    { 
		    path: '/',
		    view: 'article-list'
        },
        {   
	        path: '/article/:id',
	        view: 'article-detail'
        }    
    ]
}
```

---

# Exemple minimal

Application de démonstration.

```js
{    
	name: 'demo',
	startView: 'home',
	features: [ 'demo' ]
}
```

---

# Exemple CMS

```js
{    
	name: 'cms',
	title: 'CMS Headless',
	startView: 'article-list',
	features: [
		'articles',
		'categories',
		'tags',
		'media'
	],
	stores: [
	     'articleStore',
	     'categoryStore',
	     'tagStore',
	     'mediaStore'
     ]
}
```

---

# Exemple Référentiel Entreprises

```js
{    
	name: 'entreprises',
	title: 'Référentiel Entreprises',
	startView: 'entreprise-list',
	features: [
		'entreprises',
		'adresses',
		'ape',
		'formesJuridiques'
	],
	stores: [
		'entrepriseStore',
		'adresseStore',
		'apeStore',
		'formeJuridiqueStore'
	]
}
```

---

# Exemple Scientifique

Application orientée calculs et simulations.

```js
{    
	name: 'engineering',
	startView: 'dashboard',
	features: [
		'thermodynamique',
		'mecanique',
		'simulation'
	],
	stores: [
		'physicsStore',
		'simulationStore'
	]
}
```

Les vues pourront utiliser :

- codeval
- apex
- mermaid
- threejs

sans que l'application ne connaisse ces composants.

---

# Cycle de vie

Au démarrage :

```
Application
    ↓
initialise Stores
    ↓
initialise Features
    ↓
enregistre Views
	↓
ouvre StartView
```

---

# ApplicationRegistry

Les applications sont enregistrées dans un registre.

```js
ApplicationRegistry.register(
    'cms',
     cmsApplication
)
```

```js
ApplicationRegistry.register(
    'engineering',
    engineeringApplication
)
```

---

# Exemple d'exécution

```js
const app = ApplicationRegistry.get('cms')app.start()
```

Ce qui produit :

```
CMS
    ↓
Feature Articles
    ↓
ArticleStore
    ↓
View ArticleList    
	↓
Datagrid
```

---

# Relations avec les autres définitions

```
ApplicationDefinition
    ├── FeatureDefinition
    ├── StoreDefinition
    ├── ViewDefinition
    └── ServiceDefinition
```

Une ApplicationDefinition ne connaît jamais :

```
ComponentDefinition
DescriptorDefinition
```

Ces niveaux sont manipulés par les Views.

---

# Rôle dans Zealot

ApplicationDefinition constitue le conteneur fonctionnel principal.

Elle permet d'exécuter plusieurs applications indépendantes dans la même plateforme :

```
CMS
Référentiel Entreprises
CRM
ERP
Simulateur Thermodynamique
Catalogue Technique
```

Toutes partagent :

```
ComponentRegistry
StoreRegistry
ViewRegistry
```

mais possèdent :

```
leurs propres Featuresleurs propres Storesleurs propres règles métier
```

---

## Architecture finale

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

C'est généralement à partir de ce niveau que l'architecture SPA devient complète et cohérente pour construire aussi bien un CMS headless qu'une application métier riche.




