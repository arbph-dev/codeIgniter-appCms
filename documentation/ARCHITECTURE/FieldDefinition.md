

## Objectif

Décrire un champ métier indépendamment :
- du stockage SQL
- de l'API
- du framework
- de l'interface utilisateur   

FieldDefinition constitue l'unité fondamentale d'une EntityDefinition.
Une entité est composée d'un ensemble de FieldDefinition.

FieldDefinition ne décrit pas uniquement  une colonne SQL. Il décrit également les objets manipulés  par le SPA.


---

# Structure minimale

```php
[
    'name'  => 'raison_sociale',
    'label' => 'Raison sociale',
    'type'  => 'string'
]
```

---

# Champs standards
## Types supportés  
  
- string  
- int  
- float  
- bool  
- date  
- datetime  
- enum  
- relation  
- object  
- array  
- json
## String

```php
[
    'name'  => 'siren',
    'label' => 'SIREN',
    'type'  => 'string'
]
```

## Text

```php
[
    'name'  => 'description',
    'label' => 'Description',
    'type'  => 'text'
]
```

## Number

```php
[
    'name'  => 'montant',
    'label' => 'Montant',
    'type'  => 'number'
]
```

## Boolean

```php
[
    'name'  => 'is_active',
    'label' => 'Actif',
    'type'  => 'boolean'
]
```

## Date

```php
[
    'name'  => 'created_at',
    'label' => 'Création',
    'type'  => 'date'
]
```

## Datetime  
## Enum  
## Relation  
## Object  
## Array  
## Json





---

# Relations

Une relation référence une autre entité.

```php
[
    'name'   => 'naf_id',
    'label'  => 'Code NAF',
    'type'   => 'relation',
    'target' => 'codesnaf'
]
```

Le moteur pourra :

- afficher un sélecteur
    
- effectuer une recherche
    
- récupérer l'objet lié
    

---

# Objet

Un champ peut représenter un objet complet.

```php
[
    'name'   => 'adresse',
    'label'  => 'Adresse',
    'type'   => 'object',
    'target' => 'adresse'
]
```

Exemple :

```json
{
  "id": 12,
  "ligne4": "12 rue des Lilas",
  "commune": "Brest"
}
```

L'objet est manipulé directement par le SPA.

---

# Collection

Une collection représente plusieurs objets.

```php
[
    'name'   => 'images',
    'label'  => 'Images',
    'type'   => 'collection',
    'target' => 'image'
]
```

Exemple :

```json
[
  {
    "id": 1,
    "url": "photo1.jpg"
  },
  {
    "id": 2,
    "url": "photo2.jpg"
  }
]
```

---

# JSON

Certains champs contiennent une structure libre.

```php
[
    'name'  => 'config',
    'label' => 'Configuration',
    'type'  => 'json'
]
```

Exemple :

```json
{
  "height": 350,
  "theme": "dark",
  "chart": "moteurCouple"
}
```

Utilisation typique :

- composants
    
- graphiques
    
- ThreeJS
    
- Mermaid
    
- Vox
    
- paramètres applicatifs
    

---

# Types supportés

```text
string
text
number
boolean
date

relation

object
collection

json
```

---

# Contraintes

```php
[
    'name'      => 'siren',
    'type'      => 'string',

    'required'  => true,
    'readonly'  => false,
    'nullable'  => false,

    'min'       => 9,
    'max'       => 9
]
```

---

# Affichage

Le champ peut suggérer un composant d'édition.

```php
[
    'name'      => 'description',
    'type'      => 'text',

    'component' => 'textarea'
]
```

Exemples :

```text
input
textarea
select
checkbox
date
autocomplete
codeeditor
wysiwyg
imagepicker
```

---

# Utilisation

## Génération de formulaire

```php
$form = FormBuilder::build(
    EntityRegistry::get('entreprise')
);
```

## Génération de tableau

```php
$table = TableBuilder::build(
    EntityRegistry::get('entreprise')
);
```

## Génération d'API cliente

```js
const api = EntityApiFactory.create('entreprise');
```

## Génération de store

```js
const store = EntityStoreFactory.create('entreprise');
```

---

# Philosophie

FieldDefinition décrit une donnée métier.

Il ne décrit pas :

- une colonne SQL
    
- un champ HTML
    
- un composant JavaScript
    

Ces représentations sont générées à partir du FieldDefinition.

Le même champ doit pouvoir être utilisé :

- dans une API
    
- dans un formulaire
    
- dans un tableau
    
- dans un store
    
- dans un système expert
    
- dans un composant SPA