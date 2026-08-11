# Formatters

## Rôle

Les Workbenches utilisent différents formatters pour présenter des valeurs métier dans l'interface.

Exemples :

- `formatDate`
- `formatPhone`
- `formatSiret`
- autres fonctions de présentation spécialisées

Ces fonctions existent déjà dans différentes parties du projet.

## Centralisation

Lors de la construction de `Form.js`, les formatters réellement nécessaires seront centralisés dans :

```text
/assets/js/ui/shared/format.js
```

L'objectif est d'éviter :

- la duplication ;
- les implémentations concurrentes ;
- les imports vers des modules métier uniquement pour obtenir une fonction de formatage.

## Principe

Un formatter transforme une valeur en représentation destinée à l'affichage.

```text
valeur métier
      │
      ▼
  formatter
      │
      ▼
valeur affichée
```

Un formatter ne doit pas :

- modifier le modèle ;
- effectuer un appel API ;
- accéder au DOM ;
- gérer un événement ;
- contenir de logique métier.

## Statut

`shared/format.js` est une **centralisation prévue**, déclenchée par les besoins réels de `Form.js`.

Il ne s'agit pas de recopier immédiatement tous les helpers existants.

> On centralise lorsque le besoin est démontré, comme pour les autres briques `shared`.