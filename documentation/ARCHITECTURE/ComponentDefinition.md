# BACKEND - PHP 

## Objectif

Un ComponentDefinition décrit un type de composant.

Il définit :
- sa vue PHP
- son module Javascript
- ses ressources
- ses évènements
- les descripteurs attendus


---

## Exemple

```php
[
    'type' => 'codeval',

    'view' => 'components/codeval',

    'script' => '/assets/js/components/codeval.js',

    'descriptors' => [
        'id',
        'title',
        'rows',
        'script',
        'aside'
    ]
]
```

---

## Responsabilités

Un ComponentDefinition décrit :

### Structure

```text
container
textarea
toolbar
canvas
dialog
```

### Ressources

```text
css
javascript
images
sons
vidéos
```

### Evènements

Publication :

```text
codeval:run
codeval:reset
```

Souscription :

```text
theme:change
page:load
```

---

## Composants atomiques

Exemples :

```text
codeval
apex
dialog
vox
mermaid
threejs
treeview
datagrid
```

Ces composants ne dépendent pas d'autres composants.

---

## Objectif

Permettre au CMS et au Registry de connaître les capacités d'un composant sans l'instancier.

---
---


# Frontend - Javascript
[assets/js/core/ComponentCatalog.js](/refactoring/assets/js/core/ComponentCatalog.js)





[assets/js/core/ComponentDefinition.js](/refactoring/assets/js/core/ComponentDefinition.js)  

## ComponentDefinitionRegistry

[assets/js/core/ComponentDefinitionRegistry.js](/refactoring/assets/js/core/ComponentDefinitionRegistry.js) Registre des ComponentDefinition. 
Ne contient AUCUNE logique métier.
Le ComponentCatalog constitue la façade publique.


### Responsabilités :
- enregistrer une définition
- récupérer une définition
- lister les définitions
- supprimer une définition
- vider le registre




