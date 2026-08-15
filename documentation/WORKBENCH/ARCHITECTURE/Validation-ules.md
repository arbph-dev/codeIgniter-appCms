# Validation — rules

source : [`rules.js`](/refactoring/assets/js/ui/shared/validation/rules.js)

## Rôle

`rules.js` contient les règles unitaires de validation utilisées par `Form.js` et `validator.js`.

Chaque règle est une fonction pure :

```js
(value) => true | string
```

Le contrat est :

- `true` → valeur valide ;
- `string` → message d'erreur.

## Exemple

```js
required('Jean')
// true

required('')
// 'Ce champ est requis'
```

## Règles paramétrées

Certaines règles sont des fabriques.

```js
minLength(3)
```

retourne une fonction de validation :

```js
(value) => true | string
```

Exemple :

```js
validate('ab', [
    required,
    minLength(3),
])
```

produit :

```js
{
    valid : false,
    error : 'Minimum 3 caractères requis',
}
```

## Règles actuellement définies

| Règle | Type |
|---|---|
| `required` | règle directe |
| `minLength(min)` | fabrique |
| `maxLength(max)` | fabrique |
| `pattern(regex, message)` | fabrique |

## Principes

Les règles doivent rester :

- pures ;
- indépendantes du DOM ;
- indépendantes de `Form` ;
- indépendantes du backend ;
- indépendantes de l'affichage des erreurs.

Elles ne doivent pas modifier un élément HTML.

## Extension

Ne pas ajouter une règle « par anticipation ».

Une nouvelle règle doit répondre à un besoin réel d'un formulaire.

> `rules.js` décrit **ce qui est valide** ; il ne décide pas **quand** ni **comment** la validation est affichée.
