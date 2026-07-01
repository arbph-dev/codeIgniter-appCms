
Je pense que l'audit commence à faire apparaître quelque chose d'important :

Tu n'as pas un problème technique unique.

Tu as **4 couches qui ont évolué à des vitesses différentes**.

```
Couche 1 : Données
Couche 2 : API
Couche 3 : Composants
Couche 4 : Applications
```

Les couches 1 et 2 sont déjà assez avancées.

Les couches 3 et 4 ont accumulé de la dette.







---

## Ce qui ressort de ton message

### 1. Absence d'aires de repos

C'est architecturalement important.

ThreeJS n'est pas un gadget.

C'est probablement ton laboratoire.

Je le sortirais complètement du projet métier.

```
Zealot├─ Core├─ Business└─ LabLab├─ ThreeJS├─ Vox├─ Expérimentations└─ IA
```

Ne jamais tester une nouvelle architecture ThreeJS dans le même espace mental que :

```
EntrepriseOrganisationAdresseNAF
```

Ce sont deux problèmes différents.

---

## 2. Python doit sortir de Zealot

Je pense que tu as parfaitement identifié le problème.

Aujourd'hui tu sembles utiliser Zealot pour :

```
CollecterTransformerStockerAfficher
```

C'est trop.

Je ferais :

```
Python    ↓SQLite    ↓Export    ↓Zealot
```

---

Exemple :

```
INSEE    ↓Python    ↓naf.sqlite    ↓naf.json    ↓Zealot
```

---

ou

```
API Marketing    ↓Python    ↓Enrichissement    ↓SQLite    ↓Export
```

---

Zealot devient :

```
consommateur de données
```

et non :

```
plateforme ETL
```

---

## 3. La documentation

Je pense que c'est probablement ton plus gros constat.

Tu as documenté :

```
comment
```

mais pas assez :

```
pourquoi
```

---

Je te conseille de limiter la documentation à :

```
Decision Record
```

Format :

```
YYYYMMDD-XXX
```

Exemple :

```
20260619-001SujetEntityRegistryDécisionCréation d'un registre central des entitésPourquoiÉviter duplication API/FormImpactToutes les futures features
```

---

## Ce que révèle la liste des fichiers

La liste des fichiers est extrêmement intéressante.

Je compte :

Backend :

```
10 modèles10 APIs
```

Frontend :

```
9 features
```

---

Et chaque feature possède :

```
controllerformrendererservicestore
```

---

Donc :

```
9 × 5 = 45 modules
```

minimum.

---

C'est là que se trouve la rigidité.

Pas dans le backend.

Dans la duplication frontend.

---

## Store

Je pense qu'il faut clarifier cela avant toute évolution.

Aujourd'hui j'imagine :

```
MotStoreEntrepriseStoreOrganisationStore...
```

---

Je ne ferais PAS :

```
GlobalStore gigantesque
```

---

Je ferais :

```
StoreRegistry
```

```
registry.register('entreprise', entrepriseStore)registry.register('mot', motStore)
```

---

Puis :

```
registry.get('entreprise')
```

---

Donc :

```
Stores spécialisés+Registry central
```

et non :

```
Méga Store
```

---

## EventBus

Je pense que tu dois distinguer deux niveaux.

### EventBus global

```
AUTH_CHANGEDENTITY_CREATEDENTITY_UPDATEDNAVIGATION_CHANGED
```

---

### EventBus local

Pour un composant.

Exemple :

```
Dialog
```

```
dialog.opendialog.closedialog.submit
```

---

Oui.

Je pense qu'un bus local est souhaitable.

Parce que sinon ton EventBus global devient :

```
dialog.open
dialog.close
dialog.cancel
carousel.next
carousel.prev...
```

et devient impossible à maintenir.

---

Je ferais :

```
Global Bus
↓
Application

Local Bus
↓
Composant
```

---

## Composants

Ton analyse est très bonne.

Chaque composant devrait avoir une fiche.

```
Nom
Structure
CSS
Scripts
Events
Ressources
Dépendances
```

---

Exemple :

```
Callout

Structure
cp_callout

CSS
callout.css

Events
aucun

Ressources
aucune

Dépendances
aucune
```

---

ou

```
Mermaid
Structure
div[data-mermaid]

CSS
mermaid.css

Events
rendered

Ressources
mermaid.js

Dépendances
domhelper
```

---

## DomHelper

C'est probablement le sujet le plus sous-estimé.

Tu écris :

> beaucoup génèrent du DOM sans centraliser dans domhelper

Je pense que c'est une dette majeure.

Aujourd'hui tu sembles avoir :

```
element.innerHTML = ...
```

partout.

---

Je créerais une règle :

```
Tout composant qui crée du DOM
passe par domhelper.
```

---

Parce que demain :

```
validation
traces
debug
instrumentation
```

pourront être ajoutés au même endroit.

---

## Génération automatique des features

Oui.

Je pense que c'est la direction.

Pas par IA.

Par métadonnées.

Exemple :

```
EntityDefinition
```

```php
[    
	'entity' => 'entreprise',
	'fields' => 
	[
		'siren',
		'raison_sociale',
		'naf_id'
	]
]
```

---

Puis génération :

```
API
Form
Table
Validation
Store
```

---

# Composants - Audit global
[[ARCHITECTURE/ComponentDefinition]]

Tes composants se répartissent déjà naturellement en 3 catégories :

|Type|Exemple|État|
|---|---|---|
|Composant simple|codeval, apex, mermaid|très proche du modèle cible|
|Composant interactif|vox|nécessite séparation renderer|
|Composant composite/moteur|threejs|quasiment déjà architecturé|

---

## 1. Apex

Aujourd'hui :

```
<div    id="APEX_1"    class="cp_apex"    data-chart="moteurCouple"></div>
```

et

```
const CHARTS = {    moteurCouple(payload){}}
```

---

### Ce que voit le CMS

Aujourd'hui :

```
[    'type'   => 'apex',    'id'     => 'APEX_1',    'chart'  => 'moteurCouple',    'height' => 350]
```

---

### Descriptor cible

```
{    "type":"apex",    "id":"APEX_1",    "config":{        "chart":"moteurCouple",        "height":350    }}
```

---

### ComponentDefinition

```
ComponentDefinition::make(    'apex',    ApexComponent::class)
```

---

### Verdict

Excellent candidat.

Apex devient pratiquement :

```
Descriptor    ↓Renderer PHP    ↓div cp_apex    ↓Apex JS
```

Aucune difficulté.

---

## 2. CodeVal

Le plus intéressant.

Aujourd'hui :

```
[    'type'=>'codeval',    'id'=>'CVG5',    'title'=>'Volume normal ISO 2533',    'rows'=>12,    'script'=>'...']
```

---

### Ce qu'il est réellement

CodeVal est déjà un mini DSL.

Tu stockes :

```
script
```

mais demain tu peux stocker :

```
api
```

```
fields
```

```
examples
```

```
chartTarget
```

etc.

---

### Descriptor cible

```
{  "type":"codeval",  "id":"CVG5",  "config":{      "title":"Volume normal ISO 2533",      "rows":12,      "script":"...",      "chartTarget":"APEX_1"  }}
```

---

### Verdict

Très bon candidat.

Je pense même que CodeVal sera le premier composant à utiliser massivement :

```
DescriptorDefinition
```

car tout est configurable.

---

## 3. Mermaid

Très proche d'Apex.

Aujourd'hui :

```
const DIAGRAMS = {   sequenceMinimal(){},   ganttEmpty(){}}
```

---

### problème

Tu as deux sources possibles :

#### mode preset

```
{   "type":"mermaid",   "config":{      "preset":"sequenceMinimal"   }}
```

---

#### mode libre

```
{   "type":"mermaid",   "config":{      "definition":"graph TD ..."   }}
```

---

### verdict

Excellent candidat.

---

## 4. Vox

C'est celui qui nécessite le plus de réflexion.

Pourquoi ?

Parce qu'il mélange :

```
ENGINE+DOM+Renderer+Dialogue
```

---

Aujourd'hui un Romeo/Juliette est stocké dans :

```
<textarea>Juliette: ...Romeo: ...</textarea>
```

---

Or côté CMS on voudra plutôt :

```
{    "type":"vox",    "config":{        "script":[            {                "actor":"Juliette",                "text":"Bonjour"            },            {                "actor":"Romeo",                "text":"Bonjour Juliette"            }        ]    }}
```

---

Donc Vox devient :

```
Descriptor    ↓Renderer    ↓Textarea générée    ↓Engine Vox
```

---

### difficulté

Vox est aussi candidat à devenir :

```
CompositeComponent
```

car il embarque :

- acteurs
- voix
- sous-titres
- boutons

---

## 5. ThreeJs

Le plus mature architecturalement.

Tu as déjà :

```
ThreeManager    ↓ThreeScene
```

---

C'est pratiquement un ComponentRegistry.

---

Aujourd'hui :

```
<div    class="cp_threejs"    data-scene="cube"></div>
```

---

Descriptor cible :

```
{   "type":"threejs",   "config":{      "scene":"cube",      "width":800,      "height":600   }}
```

---

ou

```
{   "type":"threejs",   "config":{      "scene":"model",      "model":"/assets/model.obj"   }}
```

---

### Verdict

Excellent candidat.

---

## Vision CMS finale

On commence à voir apparaître le modèle général :

```
Part
```

contient :

```
content
```

ou

```
aside
```

qui contiennent :

```
DescriptorDefinition[]
```

---

Exemple :

```
part.content
```

```
[   {      "type":"apex",      "config":{         "chart":"moteurCouple"      }   },   {      "type":"codeval",      "config":{         "script":"..."      }   }]
```

---

Le renderer PHP :

```
foreach ($descriptors as $descriptor){    $registry->render($descriptor);}
```

---

Et le SPA utilisera exactement les mêmes descripteurs :

```
BDD ↓DescriptorDefinition ↓API JSON ↓SPA ↓ComponentRegistry ↓Component JS
```

---

Conclusion de l'audit :

|composant|maturité CMS|
|---|---|
|apex|95%|
|codeval|90%|
|mermaid|95%|
|vox|75%|
|threejs|95%|

Le prochain document logique n'est plus `ComponentDefinition.md` (déjà clair), mais **DescriptorDefinition.md**, car c'est lui qui va fixer le format unique que tous ces composants devront accepter, que le rendu soit PHP ou SPA.


# Application

Une application :
- possède un état
- possède des routes
- possède des vues
- possède des actions
- orchestre les composants

Qui décide quoi afficher ?

Exemple :
```
Liste Articles
    ↓ clic
Article Detail
    ↓ modifier
Article Form
    ↓ enregistrer
Retour Liste
```

Ce n'est plus un problème de composant. C'est un problème d'application.

[[ARCHITECTURE/ApplicationDefinition]]
[[ARCHITECTURE/CmsApplication]]
[[ARCHITECTURE/AdminApplication]]
[[ARCHITECTURE/PublicApplication]]


