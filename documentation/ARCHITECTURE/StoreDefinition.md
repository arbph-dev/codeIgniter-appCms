## Objectif

Un StoreDefinition décrit un conteneur de données métier.

Il représente une source de vérité unique (Single Source of Truth) pour une partie du domaine fonctionnel.

Un Store est indépendant :

- du DOM
- des composants
- des vues
- du backend

Il ne contient que des données et leur cycle de vie.

---

## Position dans l'architecture

```
Application    ↓Feature    ↓Store    ↓View    ↓Descriptor    ↓Component
```

Le Store constitue la frontière entre :

```
Métier    ↓Présentation
```

---

# Exemple

## Store Code Postal

```php
[    
	'name' => 'codepostal',
	'entity' => 'CodePostal',
	'state' => [
		'items' => [],
		'current' => null,
		'page' => 1,
		'perPage' => 20,
		'total' => 0,
		'loading' => false
	]
]
```

---

# Responsabilités

Un Store :

- conserve les données
- notifie les changements
- centralise les accès
- évite les doublons

Un Store ne :

- construit pas de HTML
- ne manipule pas le DOM
- ne connaît pas les composants

---

# Exemple concret

## Feature CodePostal

```
FeatureCodePostal    ↓StoreCodePostal
```

Le store contient :

```
{    items : [],    current : null}
```

La feature :

```
load()create()update()delete()
```

agit sur ce store.

---

# Plusieurs vues

Un même Store peut alimenter plusieurs vues.

```
StoreCodePostal        │        ├── ViewCodePostalGrid        │        ├── ViewCodePostalForm        │        └── ViewCodePostalDetail
```

Toutes lisent les mêmes données.

---

# Exemple CMS

## StoreArticle

```
{    items : [],    current : null}
```

utilisé par :

```
ViewArticleListViewArticleDetailViewArticleForm
```

---

# Types de Store

## Entity Store

Une entité métier.

```
StoreArticleStoreCategorieStoreUtilisateurStoreAdresseStoreCodePostal
```

---

## Reference Store

Données de référence.

```
StorePaysStoreApeStoreFormeJuridiqueStoreCivilite
```

---

## Session Store

Etat utilisateur.

```
StoreAuthStoreSessionStorePreferences
```

---

## UI Store

Etat d'interface.

```
StoreDialogStoreTabsStoreNavigation
```

---

# Structure proposée

```
interface StoreDefinition{    public function getName(): string;    public function getEntity(): ?string;    public function getState(): array;    public function setState(array $state): void;    public function reset(): void;}
```

---


# Règle Zealot

> Un Store contient les données.
> 
> Une Feature manipule les données.
> 
> Une View observe les données.
> 
> Un Component affiche les données.

C'est probablement la prochaine brique structurante à documenter avant :

```
StoreDefinition    
	↓
StoreRegistry
    ↓
FeatureDefinition
	↓
ApplicationDefinition
```

car ensuite les Features pourront être définies proprement autour des Stores.