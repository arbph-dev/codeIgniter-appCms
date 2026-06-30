
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