# Validation — validator

source : [`validator.js`](/refactoring/assets/js/ui/shared/validation/validator.js)

## Rôle

`validator.js` orchestre l'exécution des règles de validation.

Il est volontairement indépendant du DOM.

Il fournit deux niveaux de validation :

- `validate()` pour une valeur / un champ ;
- `validateAll()` pour un ensemble de champs.

## `validate()`

Valide une valeur contre une liste de règles.

```js
validate(value, rules)
```

Le traitement s'arrête à la première règle en échec.

Retour :

```js
{
    valid : true | false,
    error : string | null,
}
```

Exemple :

```js
validate('abc', [
    required,
    minLength(3),
])
```

résultat :

```js
{
    valid : true,
    error : null,
}
```

## `validateAll()`

Valide l'ensemble des valeurs d'un formulaire à partir de sa configuration de règles.

Le résultat permet à `Form.js` de déterminer si le formulaire est valide et quelles erreurs doivent être associées aux champs.

## Séparation des responsabilités

```text
rules.js
    │
    │ règles unitaires
    ▼
validator.js
    │
    │ résultat de validation
    ▼
Form.js
    │
    ├── binding DOM
    ├── validation temps réel
    ├── affichage des erreurs
    └── validation au submit
```

## Ce que validator.js ne fait pas

`validator.js` ne :

- recherche pas d'input dans le DOM ;
- ajoute pas de classe CSS ;
- affiche pas de message ;
- écoute pas les événements `input` / `change` ;
- gère pas le submit ;
- connaît pas `Form.js`.

## Règle d'architecture

> `validator.js` répond à la question « cette valeur est-elle valide ? ».
>
> `Form.js` décide quand poser cette question et comment présenter le résultat à l'utilisateur.

Cette séparation permet d'utiliser le moteur de validation indépendamment de l'interface.