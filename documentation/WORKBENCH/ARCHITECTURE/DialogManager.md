# DialogManager

source : [`DialogManager.js`](/refactoring/assets/js/ui/shared/DialogManager.js)

## Rôle

`DialogManager` est l'infrastructure commune de gestion des éléments HTML natifs `<dialog>`.

Il fournit un registre centralisé des dialogs et leur ouverture / fermeture via l'EventBus.

Le module exporte un singleton :

```js
dialogManager
```

## Principe

Les dialogs ne sont pas recherchés dans le DOM au démarrage.

Ils sont :

1. construits programmatiquement ;
2. enregistrés auprès du `DialogManager` ;
3. insérés dans `document.body` ;
4. contrôlés par leur identifiant.

Cette stratégie évite notamment les problèmes de `stacking context` liés aux parents possédant `overflow: hidden`.

## Registre

Le manager maintient :

```js
Map<string, HTMLDialogElement>
```

L'identifiant du dialog constitue donc son identité technique.

## Communication EventBus

### Entrées

```text
dialog:show
dialog:close
```

avec l'identifiant du dialog.

### Sortie

```text
dialog:select
```

avec :

```js
{
    sourceId,
    item,
}
```

Le composant qui utilise le dialog n'a donc pas besoin de connaître directement le `DialogManager` pour recevoir une sélection.

## API

Le manager fournit notamment :

- `register(id, dialog)`
- `unregister(id)`
- `show(id)`
- `close(id)`
- `select(id, item)`

## Relation avec RelationPickerDialog

`RelationPickerDialog` construit son propre `<dialog>` puis le transmet au manager :

```text
RelationPickerDialog
        │
        │ render()
        ▼
   <dialog>
        │
        ▼
 DialogManager
        │
        ├── document.body
        └── EventBus
```

## Règle d'architecture

> Le `DialogManager` gère le cycle de vie des dialogs ; il ne connaît pas leur contenu métier.

Un dialog spécialisé comme `RelationPickerDialog` reste responsable de son contenu et de son comportement fonctionnel.