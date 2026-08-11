# WorkbenchView

source : [`WorkbenchView.js`](/refactoring/assets/js/ui/workbench/core/WorkbenchView.js)

## Rôle

`WorkbenchView` est responsable de la matérialisation visuelle du layout d'un Workbench.

Il fait le lien entre :

- un `LayoutDescriptor` ;
- le conteneur du Workbench ;
- les Panels à monter.

## Responsabilités

`WorkbenchView` :

- construit le conteneur du layout ;
- construit les zones ;
- monte les Panels ;
- démonte les Panels ;
- permet d'accéder à une zone par son nom.

## API

| Méthode | Rôle |
|---|---|
| `build()` | Crée le layout et ses zones |
| `mountPanels(panels)` | Monte les Panels dans leurs zones |
| `unmountPanels()` | Retire les éléments DOM des zones |
| `getZone(name)` | Retourne une zone |
| `destroy()` | Libère les références internes |

## Montage

```js
this._view = new WorkbenchView(
    LAYOUT,
    this.getElement('.wb-content')
)

this._view.build()

this._view.mountPanels({
    left  : this.listPanel,
    right : this.detailPanel,
})
```

Lors du montage, `WorkbenchView` appelle `panel.render()` puis ajoute le résultat dans la zone correspondante.

## Ce que WorkbenchView ne fait pas

`WorkbenchView` ne :

- connaît pas les modèles métier ;
- appelle pas d'API ;
- valide pas les données ;
- crée pas les Panels ;
- ne détruit pas les Panels ;
- ne contient pas de logique métier ;
- ne gère pas les formulaires.

La destruction des Panels reste sous la responsabilité du Workbench.

## Découpage architectural

```text
Workbench
    │
    ├── orchestration
    │
    ├── WorkbenchView
    │       │
    │       ├── LayoutDescriptor
    │       └── zones DOM
    │
    └── Panels
            ├── ListPanel
            ├── DetailPanel
            └── ...
```

> **WorkbenchView construit la scène ; le Workbench orchestre ce qui s'y passe.**