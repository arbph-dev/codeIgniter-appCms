## Système de composants

### DescriptorDefinition
Décrit une instance.
Exemple :
```php
[    
	'type' => 'codeval',
	'id'   => 'CVG5'
]
```

Le descripteur contient :

- le type
- l'identifiant
- la configuration

Il ne contient aucun code métier.

---


### ComponentDefinition

Décrit une classe de composant.

Exemple :

```
codeval
apex
vox
dialog
treeview
datagrid
threejs
```

Décrit :

- structure
- paramètres
- ressources
- événements

---

### ComponentRegistry

Catalogue des composants disponibles.

Responsabilités :

- enregistrer les constructeurs
- retrouver un composant par type
- créer les instances

Exemple :

```
registry.register(    "codeval",    CodeValComponent);
```

---

### CompositeComponentDefinition

Décrit un composant contenant d'autres composants.

Exemples :

- ArticleList
- ArticleEditor
- AddressEditor
- RomeoJulietteScene

Un composant composite ne contient aucune logique spéciale.

Il orchestre simplement plusieurs composants simples.

---
