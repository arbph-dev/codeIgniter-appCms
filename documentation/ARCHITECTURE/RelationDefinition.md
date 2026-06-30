# RelationDefinition

## Objectif

Décrire une relation métier entre deux entités.

Une RelationDefinition permet :
- de comprendre le modèle métier
- de générer des interfaces
- de générer des formulaires liés
- de générer des arbres de données
- de générer des API enrichies

Elle ne décrit pas directement la structure SQL.

---

# Structure minimale

```php
[
    'name'   => 'adresse',
    'source' => 'entreprise',
    'target' => 'adresse',
    'type'   => 'belongsTo'
]
```

---

# Types fondamentaux

## belongsTo

L'entité source possède une référence vers une autre entité.

```php
[
    'name'   => 'adresse',
    'source' => 'entreprise',
    'target' => 'adresse',
    'type'   => 'belongsTo'
]
```

Exemple :

```text
Entreprise
    └── Adresse
```

---

## hasOne

L'entité cible dépend directement de l'entité source.

```php
[
    'name'   => 'siege',
    'source' => 'entreprise',
    'target' => 'adresse',
    'type'   => 'hasOne'
]
```

---

## hasMany

Une entité possède plusieurs éléments.

```php
[
    'name'   => 'images',
    'source' => 'entreprise',
    'target' => 'image',
    'type'   => 'hasMany'
]
```

Exemple :

```text
Entreprise
    ├── Image
    ├── Image
    └── Image
```

---

## manyToMany

Relation multiple.

```php
[
    'name'   => 'motscles',
    'source' => 'article',
    'target' => 'mot',
    'type'   => 'manyToMany'
]
```

Exemple :

```text
Article
    ↔
Mot
```

---

# Composition

Certaines entités ne vivent pas seules.

```php
[
    'name'        => 'sections',
    'source'      => 'article',
    'target'      => 'section',
    'type'        => 'hasMany',
    'composition' => true
]
```

---

Exemple :

```text
Article
    └── Section
```

Si l'article disparaît :

```text
Section
```

disparaît également.

---

# Agrégation

L'entité peut exister indépendamment.

```php
[
    'name'        => 'images',
    'source'      => 'article',
    'target'      => 'image',
    'type'        => 'hasMany',
    'composition' => false
]
```

---

Exemple :

```text
Article
    └── Image
```

Une image peut être réutilisée ailleurs.

---

# Cardinalité

Option facultative.

```php
[
    'name'      => 'images',
    'source'    => 'entreprise',
    'target'    => 'image',

    'min'       => 0,
    'max'       => null
]
```

---

Exemples

```text
0..1
1..1
0..N
1..N
```

---

# Chargement

Permet d'indiquer si la relation doit être chargée automatiquement.

```php
[
    'name' => 'adresse',
    'lazy' => false
]
```

ou

```php
[
    'name' => 'images',
    'lazy' => true
]
```

---

# Navigation

```
Entreprise 
	└── Adresse
		└── CodePostal
```

Dans le SPA :
```
entreprise.adresse.codepostal
```

Le système de composants aura besoin de comprendre les chemins de navigation.

RelationDefinition doit donc probablement documenter :

```
path
owner
inverse
lazy
cascade
```

mais sans implémentation.

# Exemple Entreprise

```php
[
    [
        'name'   => 'naf',
        'source' => 'entreprise',
        'target' => 'codesnaf',
        'type'   => 'belongsTo'
    ],

    [
        'name'   => 'adresse',
        'source' => 'entreprise',
        'target' => 'adresse',
        'type'   => 'belongsTo'
    ]
]
```

---

# Exemple CMS

```php
[
    [
        'name'        => 'articles',
        'source'      => 'categorie',
        'target'      => 'article',
        'type'        => 'hasMany',
        'composition' => true
    ],

    [
        'name'        => 'sections',
        'source'      => 'article',
        'target'      => 'section',
        'type'        => 'hasMany',
        'composition' => true
    ],

    [
        'name'        => 'parts',
        'source'      => 'section',
        'target'      => 'part',
        'type'        => 'hasMany',
        'composition' => true
    ]
]
```

---

# Philosophie

RelationDefinition décrit le sens métier d'un lien.

Il ne décrit pas :

- une clé étrangère SQL
    
- une jointure
    
- une implémentation ORM
    

Ces éléments pourront être générés ou mappés ultérieurement.

La relation constitue l'ossature du graphe de données manipulé par Zealot.