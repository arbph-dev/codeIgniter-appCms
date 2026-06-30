brique centrale du SPA.

Jusqu'ici nous avons défini :

```
Entity    ↓Store    ↓StoreRegistry
```

mais aucune couche n'a encore la responsabilité de :

- appeler une API
- charger des données
- sauvegarder des données
- synchroniser plusieurs stores
- déclencher des vues

Cette responsabilité appartient à la **Feature**.

---

# FeatureDefinition

## Objectif

Une FeatureDefinition décrit une fonctionnalité métier de l'application.

Elle encapsule :

- les cas d'usage
- les règles métier
- les appels API
- les interactions avec les Stores

Une Feature ne contient aucun rendu.

Une Feature ne manipule jamais directement le DOM.

---

# Position dans l'architecture

```
Application    ↓Feature    ↓Store    ↓View    ↓Descriptor    ↓Component
```

---

# Exemples

## CMS

```
FeatureArticleFeatureCategorieFeatureTagFeatureMedia
```

---

## Référentiels

```
FeatureCodePostalFeatureAdresseFeatureAPEFeatureFormeJuridique
```

---

## Sécurité

```
FeatureAuthFeatureSessionFeatureUtilisateur
```

---

# Responsabilités

Une Feature :

✔ appelle les API

✔ transforme les données

✔ met à jour les Stores

✔ applique les règles métier

✔ orchestre plusieurs Stores

---

Une Feature ne :

✘ génère pas de HTML

✘ ne construit pas de composants

✘ ne manipule pas le DOM

✘ ne connaît pas les détails d'affichage

---

# Exemple

## Mauvais

```
button.onclick = async () => {    const data =        await fetch('/api/article')    renderGrid(data)}
```

Le composant fait le travail métier.

---

## Bon

```
FeatureArticle.load()
```

Puis :

```
FeatureArticle        ↓ApiArticle        ↓StoreArticle        ↓ViewArticleGrid
```

---

# Interface

```
interface FeatureDefinition{    public function getName(): string;    public function initialize(): void;}
```

---

# Version Javascript

```
class FeatureDefinition{    constructor(        name,        registry    ) {        this.name = name        this.registry = registry    }    init()    {    }}
```

---

# Cas d'usage

Une Feature expose des opérations métier.

## FeatureArticle

```
FeatureArticle.load()FeatureArticle.create(data)FeatureArticle.update(id,data)FeatureArticle.delete(id)
```

---

## FeatureCodePostal

```
FeatureCodePostal.search(q)FeatureCodePostal.loadPage(page)FeatureCodePostal.select(id)
```

---

## FeatureAuth

```
FeatureAuth.login()FeatureAuth.logout()FeatureAuth.refreshToken()
```

---

# Relation avec les Stores

Une Feature possède généralement un Store principal.

```
FeatureArticle        │        ▼StoreArticle
```

---

Mais elle peut en manipuler plusieurs.

```
FeatureAdresse        │        ├── StoreAdresse        │        └── StoreCodePostal
```

---

# Exemple Adresse

Création d'une adresse :

```
FeatureAdresse.create(data)
```

Workflow :

```
FeatureAdresse        ↓ApiAdresse.create()        ↓StoreAdresse.add()        ↓ViewAdresseGrid refresh
```

---

# Exemple CMS

## Chargement d'un article

```
FeatureArticle.load(id)
```

Workflow :

```
FeatureArticle        ↓ApiArticle.get(id)        ↓StoreArticle.current        ↓ViewArticleDetail
```

---

# Relation avec les vues

Une Feature ne connaît pas les composants.

Elle connaît éventuellement les vues qu'elle pilote.

```
FeatureArticle        ↓StoreArticle        ↓ViewArticleListViewArticleDetailViewArticleForm
```

---

# Relation avec les événements

Une Feature peut s'abonner au bus.

```
bus.subscribe(    'article:create',    data => this.create(data))
```

---

Mais elle ne doit pas écouter des événements purement visuels.

Mauvais :

```
tabs:switch
dialog:resize
panel:collapse
```

Bon :

```
article:create
article:update
auth:login
adresse:search
```

---

# Familles de Features

## CRUD

```
FeatureArticleFeatureCategorieFeatureTagFeatureMedia
```

---

## Référentiels

```
FeatureCodePostalFeatureAPEFeaturePaysFeatureCivilite
```

---

## Authentification

```
FeatureAuthFeatureSession
```

---

## CMS

```
FeatureCmsFeatureNavigationFeatureRecherche
```

---

# Feature composite

Une Feature peut orchestrer plusieurs autres Features.

Exemple :

```
FeatureCms        │        ├── FeatureArticle        ├── FeatureCategorie        ├── FeatureTag        └── FeatureMedia
```

---

# Règle Zealot

> Une Feature implémente un cas d'usage métier.
> 
> Une Feature lit et modifie les Stores.
> 
> Une Feature appelle les APIs.
> 
> Une Feature ne produit jamais de rendu.


---

[[ARCHITECTURE/ViewDefinition]]
# ViewDefinition

comme un équivalent de :

```
DescriptorDefinition
```

mais spécialisé pour les données métier.

---

Exemple :

```php
[    
	'name' => 'article.grid',
	'store' => 'article',
	'component' => 'datagrid',
	'columns' => [
		'id',
		'title',
		'slug'
	]
]
```

---

Autre exemple :

```
[    'name' => 'article.form',    'store' => 'article',    'component' => 'form',    'fields' => [        'title',        'slug',        'description'    ]]
```

---

Ensuite un moteur de vue générique peut faire :

```
ViewDefinition        ↓StoreRegistry        ↓Descriptor        ↓ComponentRegistry        ↓Component
```

---

On obtient alors :

```
Application    ↓Feature    ↓Store    ↓ViewDefinition    ↓Descriptor    ↓Component
```

qui est exactement le schéma que tu avais proposé.

---

Ce qui me fait préférer cette solution est surtout un point que tu évoques souvent :

> "construire aujourd'hui pour demain"

Avec des classes :

```
ArticleGridView
ArticleDetailView
ArticleFormView
CodePostalGridView
CodePostalFormView
AdresseGridView...
```

tu finis rapidement avec des dizaines de classes très similaires.

Avec des ViewDefinition :

```
[    'store' => 'article',    'component' => 'datagrid']
```

ou

```
[    'store' => 'codepostal',    'component' => 'datagrid']
```

tu mutualises quasiment tout.

---

Je te proposerais donc pour la suite :

```
StoreDefinition          ✓StoreRegistry           ✓FeatureDefinition       ✓ViewDefinition          ← prochaine étapeViewRegistryApplicationDefinition
```

et **ViewDefinition sera un descripteur de vue**, pas une classe Javascript. C'est plus cohérent avec le reste de l'architecture Zealot et avec ton objectif CMS/SPA piloté par des descripteurs.
[[ARCHITECTURE/ViewDefinition]]


