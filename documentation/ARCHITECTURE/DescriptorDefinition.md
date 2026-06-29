
## Objectif

Un DescriptorDefinition décrit une instance de composant.

Il représente les données nécessaires à la construction et à la configuration d'un composant.

Le descripteur est indépendant du moteur de rendu.

Il peut être produit :
- par un contrôleur PHP
- par une API
- par une base de données
- par un fichier JSON
- par un système expert

---

## Règle Zealot n°1

Un DescriptorDefinition décrit exactement un composant.

Un composant ne contient jamais directement un autre composant.

Les assemblages sont réalisés par des composants composites enregistrés dans le ComponentRegistry.

---

## Règle Zealot n°2

Le descripteur constitue le contrat de données unique entre :

```text
Base de données
        ↓
Contrôleur / API
        ↓
DescriptorDefinition
        ↓
ComponentRegistry
        ↓
ComponentDefinition
        ↓
Renderer PHP ou SPA
```

Le même descripteur doit pouvoir être utilisé :
- côté PHP   
- côté API
- côté SPA

sans modification de structure.

---

## Structure minimale

Exemple :

```php
[
    'type'   => 'codeval',
    'id'     => 'CVG5',

    'config' => [
        'title'  => 'Volume normal ISO 2533',
        'rows'   => 12,
        'script' => '...'
    ]
]
```

---

## Structure recommandée

```php
[
    'type'   => 'apex',
    'id'     => 'APEX_1',

    'config' => [
        'chart'  => 'moteurCouple',
        'height' => 350,
        'payload' => []
    ]
]
```

---

## Propriétés standard

### type

Type logique du composant.

```php
'type' => 'apex'
```

Correspond à une définition enregistrée dans le ComponentRegistry.

---

### id

Identifiant unique de l'instance.

```php
'id' => 'APEX_1'
```

Utilisable pour :

- le DOM
    
- les événements
    
- le débogage
    
- la persistance d'état
    

---

### config

Contient tous les paramètres métier du composant.

```php
'config' => [
    'height' => 350
]
```

Le contenu dépend du type de composant.

---

## Types de valeurs

Les propriétés d'un descripteur peuvent être :

### Scalaire

```php
'title' => 'Courbe moteur'
```

### Tableau

```php
'columns' => [
    'id',
    'nom',
    'email'
]
```

### Objet

```php
'chart' => [
    'title' => 'Couple moteur',
    'height' => 350
]
```

### Objet métier

```php
'organisation' => [
    'id' => 12,
    'raison_sociale' => 'Zealot'
]
```

### Collection d'objets

```php
'series' => [
    [
        'name' => 'Couple',
        'data' => []
    ]
]
```

---

## Descriptor simple

Exemple Apex :

```php
[
    'type' => 'apex',
    'id'   => 'APEX_1',

    'config' => [
        'chart' => 'moteurCouple'
    ]
]
```

---

## Descriptor composite

Exemple ArticleList :

```php
[
    'type' => 'articleList',
    'id'   => 'ARTICLES_1',

    'config' => [
        'categoryId' => 5,
        'mode'       => 'tree'
    ]
]
```

Le descripteur reste unique.

C'est le composant composite qui décide quels sous-composants construire.

---

## Content et Aside

Part.content et Part.aside peuvent recevoir :

- du texte
    
- du HTML
    
- un DescriptorDefinition
    
- une collection de DescriptorDefinition
    

Exemple :

```php
[
    'content' => [
        [
            'type' => 'apex',
            'id'   => 'APEX_1'
        ],

        [
            'type' => 'codeval',
            'id'   => 'CVG5'
        ]
    ]
]
```

---

## Sources possibles

Un DescriptorDefinition peut être :

- stocké en base
    
- généré dynamiquement
    
- produit par une API
    
- produit par un système expert
    
- chargé depuis un fichier JSON
    

---

## Relation avec ComponentDefinition

Le DescriptorDefinition décrit une instance.

Le ComponentDefinition décrit un type.

Exemple :

```text
DescriptorDefinition
        ↓
type = apex
        ↓
ComponentRegistry
        ↓
ApexComponentDefinition
        ↓
Rendu
```

Plusieurs descriptors peuvent utiliser la même définition de composant.

---

## Principe fondamental

Le DescriptorDefinition contient uniquement des données.

Il ne contient :

- aucun code de rendu
    
- aucune référence DOM
    
- aucune dépendance Javascript
    
- aucune logique d'affichage
    

Toute logique de rendu appartient au composant enregistré dans le ComponentRegistry.
