
## Objectif

Le ViewRegistry centralise l'enregistrement et l'accès aux vues de l'application.

Il joue pour les vues le même rôle que :

- ComponentRegistry pour les composants
- StoreRegistry pour les stores

Une vue n'est jamais instanciée directement par une Feature ou par l'Application.

Toute récupération passe par le ViewRegistry.

---

## Position dans l'architecture

```text
Application
    ↓
ViewRegistry
    ↓
ViewDefinition
    ↓
Descriptor
    ↓
Component
```

---

## Responsabilités

Le ViewRegistry :

- enregistre les vues
- fournit les vues
- vérifie leur existence
- liste les vues disponibles

Le ViewRegistry ne :

- contient aucune logique métier
- ne dialogue pas avec les APIs
- ne contient aucun composant
- ne contient aucune donnée métier

---

## Principe

Mauvais :

```js
const view = new ArticleListView()
```

Bon :

```js
const view =
    ViewRegistry.get('cms.article.list')
```

---

## Structure

```php
interface ViewRegistry
{
    public function register(
        ViewDefinition $view
    ): void;

    public function get(
        string $name
    ): ?ViewDefinition;

    public function has(
        string $name
    ): bool;

    public function all(): array;
}
```

---

## Version Javascript

```js
class ViewRegistry
{
    constructor()
    {
        this.views = new Map()
    }

    register(name, view)
    {
        this.views.set(name, view)
    }

    get(name)
    {
        return this.views.get(name)
    }

    has(name)
    {
        return this.views.has(name)
    }

    all()
    {
        return [...this.views.values()]
    }
}
```

---

## Exemple CMS

### Enregistrement

```js
ViewRegistry.register(
    'cms.article.list',
    articleListView
)

ViewRegistry.register(
    'cms.article.detail',
    articleDetailView
)

ViewRegistry.register(
    'cms.article.form',
    articleFormView
)
```

---

### Utilisation

```js
const view =
    ViewRegistry.get('cms.article.list')
```

---

## Organisation recommandée

```text
ViewRegistry
│
├── cms.article.list
├── cms.article.detail
├── cms.article.form
│
├── cms.category.list
├── cms.category.form
│
├── cp.search
├── cp.detail
│
├── adresse.list
└── adresse.form
```

---

## Vue simple

```php
[
    'name' => 'cms.article.list',

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

## Vue composite

```php
[
    'name' => 'cms.article.management',

    'stores' => [
        'article'
    ],

    'descriptors' => [

        [
            'type' => 'toolbar'
        ],

        [
            'type' => 'datagrid'
        ],

        [
            'type' => 'pagination'
        ]

    ]
]
```

---

## Cycle de vie

### Chargement

```text
Application
      ↓
ViewRegistry
      ↓
ViewDefinition
      ↓
Descriptors
      ↓
Components
```

---

### Mise à jour

```text
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

## Relation avec les Stores

Une vue peut observer un ou plusieurs stores.

```text
StoreArticle
      │
      └───────► ViewArticleList
```

---

```text
StoreAdresse
      │
      ├─────────────┐
      │             │
      ▼             ▼

StoreCodePostal

      ↓

ViewAdresseForm
```

---

## Relation avec les Components

Une vue ne construit jamais directement du HTML.

Elle produit des DescriptorDefinition.

```text
ViewDefinition
        ↓
DescriptorDefinition
        ↓
ComponentDefinition
```

---

## Relation avec le ComponentRegistry

Une vue ne connaît pas les composants concrets.

Elle produit simplement :

```php
[
    'type' => 'datagrid'
]
```

ou :

```php
[
    'type' => 'article-manager'
]
```

Puis :

```text
View
    ↓
Descriptor
    ↓
ComponentRegistry
    ↓
Component
```

---

## Utilisation dans le CMS

Une vue peut être utilisée directement dans un Part.

Exemple :

```php
[
    'type' => 'view',

    'view' => 'cms.article.list'
]
```

Le moteur effectue alors :

```text
ViewRegistry
        ↓
cms.article.list
        ↓
Descriptors
        ↓
Components
```

---

## Règle Zealot

> Le ViewRegistry connaît toutes les vues.
>
> Les Features utilisent les vues.
>
> Les vues observent les Stores.
>
> Les vues produisent des Descriptors.
>
> Les Components ignorent l'existence des vues.