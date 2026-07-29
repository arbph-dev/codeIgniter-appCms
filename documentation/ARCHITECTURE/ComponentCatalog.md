

# Phase 1 — Création de `ComponentCatalog`

## Objectifs

- Introduire `ComponentCatalog` sans casser l'architecture existante.
- Aucune modification fonctionnelle.
- Aucune régression.
- Les composants existants (`raw`, `codeval`, `apex`, `mermaid`, `three`, puis `carousel`) doivent continuer à fonctionner.

Cette première étape consiste uniquement à **centraliser les métadonnées**, sans modifier les consommateurs.

---

## Étape 1 — Créer les nouvelles classes

Proposition de structure :

```
app/
└── Libraries/
    └── Components/
        ├── Catalog/
        │   ├── ComponentCatalog.php
        │   ├── ComponentDefinition.php
        │   └── ComponentCatalogInterface.php   (optionnel)
        │
        └── ...
```

Responsabilités :

### `ComponentDefinition`

Objet métier décrivant un composant.

Aucune logique CMS.

Aucune logique SQL.

Uniquement des métadonnées.

---

### `ComponentCatalog`

Responsabilités :

- enregistrer les composants ;
- retrouver une définition par type logique ;
- retrouver une définition par type SQL ;
- fournir la liste des composants disponibles ;
- préparer les futures extensions (Workbench, Features, Connectors).

À ce stade, le catalogue peut être alimenté statiquement. Une évolution ultérieure pourra le rendre déclaratif (configuration, découverte automatique, etc.).

---

## Étape 2 — Alimenter le catalogue

Créer une définition pour chacun des composants existants :

```
raw
codeval
apex
mermaid
three
```

Le composant `carousel` sera ajouté une fois son implémentation démarrée.

---

## Étape 3 — Aucun consommateur modifié

À la fin de cette première étape :

```
ComponentCatalog
```

existe,

mais

```
DescriptorMapper
CmsService
ComponentRenderer
```

continuent d'utiliser leur fonctionnement actuel.

Cette approche permet de valider le catalogue indépendamment du reste.

---

# Phase 2 — Refactorisation de `DescriptorMapper`

Objectif :

Le mapper ne connaît plus les classes concrètes.

Au lieu de cela :

```
type
    │
ComponentCatalog
    │
ComponentDefinition
    │
Descriptor
```

Le `DescriptorMapper` devient un simple consommateur du catalogue.

---

# Phase 3 — Refactorisation de `CmsService::enrichPart()`

Une fois le `DescriptorMapper` indépendant, `CmsService` ne doit plus connaître les types de composants.

Le flux devient :

```
Part
   │
ComponentCatalog
   │
ComponentDefinition
   │
DescriptorMapper
   │
Descriptor
```

`CmsService` orchestre le processus sans contenir de logique spécifique aux composants.

---

# Critère de validation

À l'issue de cette troisième phase, l'ajout d'un nouveau composant ne doit plus nécessiter de modification de :

- `CmsService`
- `DescriptorMapper`

Ces deux classes deviennent stables et respectent le principe d'ouverture/fermeture (Open/Closed Principle).
