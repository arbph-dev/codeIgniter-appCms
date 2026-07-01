

[[Phase 0 - Stabilisation]]
[[Phase 1 - Audit Backend]]
[[Phase 2 - Recherche]]
[[Phase 3 - Composants PHP]]
[[Phase 4 - Simplification Front]]
[[Phase 5 - Modèle de données]]
[[Phase 6 - Interface]]
[[Phase 7 - Système Expert]]

---
# Méthode de travail

Pour chaque évolution

## 1 Backup

Créer branche

```
git checkout -b feature/xxx
```

## 2 Analyse

- objectif
- impact
- dépendances

## 3 Modification

Modifier uniquement :

- backend  
    ou
- frontend

Jamais les deux simultanément.

## 4 Validation

Tests :

- fonctionnels
- API
- interface

## 5 Documentation

Ajouter :
- note
- décision
- résultat

Format :
YYYYMMDD-XXX

Exemple :
20260619-001

Création registry composants PHP

Statut :

- done
- rejected
- postponed

---
```
# Séance de conception — Synthèse## 1. Ce qui est acquis### Vision généraleLe projet n'est plus considéré comme une SPA orientée CRUD.L'objectif devient :- construire un noyau de gestion de données générique ;- construire un système de composants réutilisables ;- construire progressivement un CMS headless ;- permettre à terme la génération d'interfaces métier à partir de définitions.Le backend CodeIgniter reste un backend REST simple.Pas de transformation massive vers :- Entities CodeIgniter- Repositories- Domain Driven DesignLe gain serait faible à ce stade.---## Modèle de donnéesLes concepts suivants sont validés :### EntityDefinitionDécrit une entité métier.Exemples :- Adresse- Entreprise- Article- Section- CodePostalContient :- nom- table- champs- relations---### FieldDefinitionDécrit un champ.Un champ peut être :- scalaire- objet JSON- tableau JSONExemples :```json{  "name":"title",  "type":"string"}
```

```
{  "name":"config",  "type":"json"}
```

```
{  "name":"voices",  "type":"json"}
```

Le SPA doit considérer les objets JSON comme des citoyens de première classe.

---

### RelationDefinition

Décrit une relation.

Exemples :

- Article → Sections
- Section → Parts
- Entreprise → Adresse
- Adresse → CodePostal

Types :

- oneToOne
- oneToMany
- manyToOne
- manyToMany

---

---
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

## Vue PHP

Principe validé :

```
$type = $part['type'] ?? 'raw';if ($type === 'raw') {    echo $part['content'];} else {    echo view(        "components/{$type}",        $part    );}
```

Le CMS devient un moteur de rendu basé sur les descripteurs.

---

# Difficultés identifiées

## 1. Explosion du nombre de composants

Le projet contient :

```
ihm/components/plugins/features/
```

Plusieurs versions coexistent :

- apex
- codeval
- mermaid

Certaines sont :

- copiées
- partiellement réécrites
- incompatibles

Un audit complet reste nécessaire.

---

## 2. DOM non centralisé

Beaucoup de composants :

```
document.createElement(...)
```

ou

```
innerHTML
```

sans passer par :

```
domHelper.js
```

Conséquences :

- incohérences
- maintenance difficile

---

## 3. EventBus

Questions ouvertes :

### Bus global

```
window.eventBus
```

utile pour : vox , auth , notifications

---
### Bus local

utile pour :  composants composites
Question : faut-il autoriser un bus local ? Probablement oui.

---

## 4. Store

Question encore ouverte : `Store global ?ouStores spécialisés ?`

Tendance actuelle :`Store global léger+Stores métier`

Exemple :
```
AuthStore
ArticleStore
AdresseStore
```

agrégés par un RootStore.

---

## 5. ThreeJS
Sujet important.
Actuellement : ThreeManager3js.js existent mais ne s'intègrent pas proprement au système.
Objectif futur : ThreeComponent piloté par des descripteurs.

Exemple :
```
[    'type' => 'threejs',    'scene' => 'galaxy']
```

---

## 6. Documentation

Constat : documentation trop abondante.

Conséquences :
- dilution
- dispersion
- fatigue

Principe adopté : documentation minimale.

---
# Préparation de la prochaine séance
## Documentation à produire
### Backend
```
EntityDefinition.md
FieldDefinition.md
RelationDefinition.md
```
---
### SPA
```
DescriptorDefinition.md
ComponentDefinition.md
ComponentRegistry.md
CompositeComponentDefinition.md
```
---
## Audit fichiers
Priorité :
```
core/components/ihm/
```
Lister :
- rôle
- dépendances
- statut

---
## Fichiers à analyser

### Core

```
componentRegistry.js
eventBus.js
domhelper.js
apiFetch.js
```

---
### Composants prometteurs
```
wysedit.jsvox.jsapex.jscodeval.jsmermaid.js
```

---
### ThreeJS
```
3js.jsThreeManager.js
```

---
# Axes directeurs de la prochaine séance
## Axe 1
Finaliser les définitions SPA.
Documents :
```
DescriptorDefinition
ComponentDefinition
ComponentRegistry
CompositeComponentDefinition
```

---
## Axe 2
Définir le cycle de vie standard d'un composant.
Exemple :
```
constructor
init
render
bindEvents
destroy
```

---
## Axe 3
Définir le format officiel des descripteurs.

Objectif : un format unique pour :
- PHP
- JSON
- API

---
## Axe 4

Définir l'architecture Component → Composite → Feature.
Objectif :
éviter que les futures features recréent du code.

---
## Axe 5
Préparer l'intégration future :
- CMS Headless
- génération automatique CRUD
- composants ThreeJS
- extraction d'entités
- système expert marketing

sans les implémenter immédiatement.

---
# Décision stratégique

Le prochain travail n'est plus de produire des fonctionnalités.
Le prochain travail consiste à stabiliser :
1. les définitions ;
2. le registre ;
3. les composants ;
4. le cycle de vie.

Une fois cette fondation posée, les CRUD, les écrans CMS, ThreeJS, Vox et les futurs systèmes experts pourront être construits beaucoup plus vite et avec beaucoup moins de duplication.


---

├── FieldDefinition.md  
├── RelationDefinition.md  
├── EntityDefinition.md  
├── DescriptorDefinition.md  
├── ComponentDefinition.md  
├── CompositeComponentDefinition.md  
└── ComponentRegistry.md


---
# Ce qui manque réellement

## 1. ViewRegistry

Très court.

Même niveau que :

```
StoreRegistry
ComponentRegistry
```

Probablement 1 page.

```
register()
get()
has()
all()
```

---
[[ARCHITECTURE/ApplicationDefinition]]
## 2. ApplicationDefinition

Probablement le dernier gros document.

Il décrira :

```
Application    
├── Features    
├── Stores
├── Views    
└── Components
```

et le cycle de vie :

```
bootload
route
shutdown
```

---

# Ce qui pourrait être ajouté plus tard

Pas indispensable aujourd'hui.

## ApiDefinition

Pour formaliser :

```
Feature
    ↓
ApiDefinition
    ↓
REST
```

Exemple :

```
ApiArticleApiCategorieApiCodePostal
```

Mais ce n'est pas bloquant.

---

## RouteDefinition

Pour le SPA.

```
/techno/cms/article/12/admin/articles
```

mais aujourd'hui CodeIgniter assure déjà ce travail.

---

## EventDefinition

Pour formaliser le bus.

Aujourd'hui on a déjà :

```
bus.publish(...)
bus.subscribe(...)
```

et beaucoup d'événements :

```
apex:render
vox:speak
article:create
threejs:start
```

Une documentation pourrait être utile plus tard.

---

## SecurityDefinition

Pour :

```
roles
permissions
claims
policies
```

mais c'est lié à Auth.

---

# Ce que je ferais

Je clôturerais la documentation "socle" avec :

```
✓ FieldDefinition
✓ RelationDefinition
✓ EntityDefinition
✓ DescriptorDefinition
✓ ComponentDefinition
✓ CompositeComponentDefinition
✓ ComponentRegistry
✓ StoreDefinition
✓ StoreRegistry
✓ FeatureDefinition
✓ ViewDefinition
	→ ViewRegistry
	→ ApplicationDefinition
```

Puis j'ouvrirais un nouveau chantier :

```
ARCHITECTURE-CMS
```

où l'on ferait les audits :

```
Article
Categorie
Tag
Media
Part
Section
FeatureArticle
FeatureCategorie
FeatureTag
FeatureMedia
StoreArticle
StoreCategorie
StoreTag
StoreMedia
```

car à ce stade l'architecture générique commence à être suffisamment stable pour être confrontée au vrai CMS.

Ma recommandation serait donc :

```
1. ViewRegistry.md
2. ApplicationDefinition.md
3. Audit du CMS
4. Audit Auth
5. Audit des composants
```

et seulement après revenir sur d'éventuels documents secondaires comme `EventDefinition` ou `ApiDefinition`. Cela évite de sur-documenter des parties qui risquent encore d'évoluer.
