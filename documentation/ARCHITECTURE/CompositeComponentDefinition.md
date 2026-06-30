
## Objectif

Un CompositeComponentDefinition décrit un composant construit à partir d'autres composants.

---

## Exemple

ArticleEditor

```text
Toolbar
    +
WysEdit
    +
Dialog
    +
PanelButton
```

---

## Exemple

CodePostalBrowser

```text
Datagrid
    +
PanelButton
    +
Pagination
    +
Dialog
```

---

## Différence avec ComponentDefinition

### Composant atomique

```text
Datagrid
Dialog
Treeview
Codeval
ThreeJs
```

Composant autonome.

---

### Composant composite

```text
ArticleList
ArticleEditor
OrganisationCrud
EntrepriseCrud
CodePostalBrowser
```

Assemblage de composants.

---

## Structure

Exemple :

```php
[
    'type' => 'article-editor',

    'children' => [
        'toolbar',
        'wysedit',
        'dialog',
        'panelbutton'
    ]
]
```

---

## Objectif

Créer des interfaces complexes sans réécrire les composants de base.

---

## Vision Zealot

```text
Composants atomiques
        ↓

Composants composites
        ↓

Features
        ↓

Applications
```

Le composant composite constitue la brique de construction principale des futures interfaces SPA.