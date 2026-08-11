# LayoutDescriptor

source : [`LayoutDescriptor.js`](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js)

## Rôle

`LayoutDescriptor` décrit la structure physique d'un Workbench.

Il définit :

- la classe CSS du conteneur principal ;
- les zones qui composent le Workbench ;
- le nom logique de chaque zone.

Il ne contient **aucun Panel et aucun HTML**.

## Structure

```js
const LAYOUT = createDescriptor({
    css   : 'wb_mot_layout',

    zones : [
        { name : 'left',  css : 'wb_mot_left'  },
        { name : 'right', css : 'wb_mot_right' },
    ],
})
```

Le descriptor sépare ainsi :

```text
structure
   │
   ├── layout CSS
   └── zones CSS + noms
```

des instances :

```text
comportement
   │
   ├── MotListPanel
   └── MotDetailPanel
```

## Immutabilité

`createDescriptor()` valide la structure puis retourne un objet gelé.

Le descriptor et ses zones ne doivent donc plus être modifiés après leur création.

## Responsabilités

`LayoutDescriptor` :

- décrit le layout ;
- valide la présence du conteneur CSS ;
- valide la présence de zones ;
- fournit une structure immuable.

Il ne :

- crée pas de DOM ;
- ne crée pas de Panel ;
- ne monte pas les Panels ;
- ne contient aucune logique métier.

## Relation avec WorkbenchView

Le descriptor est consommé par `WorkbenchView`.

```text
LayoutDescriptor
       │
       ▼
 WorkbenchView
       │
       ├── construit le layout
       ├── construit les zones
       └── monte les Panels
```

Cette séparation permet à chaque Workbench de définir son layout sans modifier l'infrastructure commune.