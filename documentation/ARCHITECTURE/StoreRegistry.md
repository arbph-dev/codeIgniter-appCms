


Une fois les Stores définis, dans [[ARCHITECTURE/StoreDefinition]], on peut introduire :
```
StoreRegistry
```

qui devient l'équivalent de :

```
ComponentRegistry
```

pour les données.

StoreRegistry - [[ARCHITECTURE/StoreRegistry]]   
├── StoreArticle
├── StoreCategorie
├── StoreCodePostal
├── StoreAdresse
└── StoreAuth


==Une Feature ne crée jamais un Store.==
Elle demande toujours :
```
StoreRegistry.get('article')
```

---
Il nous manque donc la branche métier :

```
StoreDefinition
StoreRegistry
FeatureDefinition
ViewDefinition
ApplicationDefinition
```
[[ARCHITECTURE/FeatureDefinition]]
[[ARCHITECTURE/ViewDefinition]]
[[ARCHITECTURE/ApplicationDefinition]]


---

## Objectif

Le StoreRegistry centralise l'accès aux Stores de l'application.

Il évite :

- les variables globales
- les dépendances circulaires
- la création multiple d'un même Store

Il garantit qu'une entité métier possède une source de vérité unique.

---

## Position dans l'architecture

```
Application    ↓Feature    ↓StoreRegistry    ↓Store
```

Les Features n'instancient jamais directement un Store.

Elles demandent le Store au Registry.

---

# Principe

Mauvais :

```
const store = new ArticleStore()
```

Bon :

```
const store = StoreRegistry.get('article')
```

---

# Exemple

```
StoreRegistry    ├── article    ├── categorie    ├── codepostal    ├── adresse    ├── auth    └── dialog
```

---

# Responsabilités

Le StoreRegistry :

- enregistre les stores
- fournit les stores
- liste les stores
- vérifie leur existence

Il ne contient aucune logique métier.

---

# Interface

```
interface StoreRegistry{    public function register(        StoreDefinition $store    ): void;    public function get(        string $name    ): ?StoreDefinition;    public function has(        string $name    ): bool;    public function all(): array;}
```

---

# Version Javascript

```
class StoreRegistry{    constructor()    {        this.stores = new Map()    }    register(name, store)    {        this.stores.set(name, store)    }    get(name)    {        return this.stores.get(name)    }    has(name)    {        return this.stores.has(name)    }    all()    {        return [...this.stores.values()]    }}
```

---

# Exemple CMS

## Enregistrement

```
StoreRegistry.register(    'article',    new ArticleStore())StoreRegistry.register(    'categorie',    new CategorieStore())StoreRegistry.register(    'codepostal',    new CodePostalStore())
```

---

## Utilisation

Feature :

```
const store =    StoreRegistry.get('article')
```

View :

```
const store =    StoreRegistry.get('article')
```

---

# Store partagé

Une seule instance.

```
FeatureArticle       │       │       ▼StoreArticle       ▲       │       │ViewArticleGridViewArticleDetailViewArticleForm
```

Toutes les vues observent le même état.

---

# Types de stores enregistrés

## Stores métier

```
articlecategorietagutilisateuradressecodepostal
```

---

## Stores référentiels

```
apeformejuridiquecivilitepays
```

---

## Stores système

```
authsessionpreferences
```

---

## Stores UI

```
dialognavigationtabs
```

---

# Notification

À terme le StoreRegistry permettra également :

```
Store    ↓notification    ↓View
```

par exemple :

```
store.subscribe(    callback)
```

ou

```
bus.publish(    'store:article:changed')
```

Mais cela appartient davantage au contrat du Store qu'au Registry.

---

# Règle Zealot

> Le StoreRegistry connaît tous les Stores.
> 
> Les Features utilisent les Stores.
> 
> Les Views observent les Stores.
> 
> Les Components ignorent les Stores.

---

Après ce document, je pense qu'il faudra attaquer **FeatureDefinition**, car c'est lui qui va répondre à une question que nous avons plusieurs fois rencontrée avec CodePostal, Adresse, APE, Forme Juridique ou les futurs CRUD CMS :

```
Qui charge les données ?Qui appelle l'API ?Qui remplit le Store ?Qui déclenche les vues ?
```

La réponse architecturale est :

```
Feature    ↓API    ↓Store    ↓View
```

et non l'inverse. C'est probablement la pièce la plus importante du SPA après les composants.