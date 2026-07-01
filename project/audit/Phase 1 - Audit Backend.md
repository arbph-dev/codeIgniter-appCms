
## Objectif

Comprendre le backend réel.

## Audit API

Lister :
- routes : fait
- controllers
- services
- models

Pour chaque API :
- objectif
- paramètres
- réponse
- authentification
- dépendances

## Audit Auth

Shield :
- login
- logout
- groupes
- permissions
- policies

Questions :

- où contrôler les accès ?
- controller ?
- service ?
- middleware ?

## Livrables

- auth.md
- api_inventory.md

---




# Audit API - Phase 1
Audits 1/3
- Routes - terminé
- Controllers
- Models

audit que je ferais est donc : 
**Routes → Controllers API → Models → Services**. 
C'est généralement là que se cache la rigidité d'une SPA mature.
## Diagnostic Routes

Tu n'as pas un problème de routes.

Tu as un problème de **standardisation**.

Je vois déjà apparaître un modèle implicite.

```
Référentiels
├─ codesnaf
├─ codepostal
├─ typevoie
├─ formejuridique

Entités métier
├─ mot
├─ adresse
├─ organisation
├─ entreprise

Médias
├─ image

Auth
├─ login
├─ logout
├─ profile

Infrastructure
├─ ping
├─ ping2
```

C'est déjà beaucoup plus structuré que je ne l'imaginais.

---

### Ce qui est bien

#### Les référentiels sont séparés

Exemple :

```
codesnafcodepostal
```

sont clairement :

```
Read Only
```

C'est exactement ce qu'il faut.

Tu ne dois jamais pouvoir modifier un code postal depuis l'application.

---

#### Les entités métier sont cohérentes

Je vois :

```
Mot
Adresse
Organisation
Entreprise
```

qui sont déjà des objets métier.

C'est probablement là que le futur système expert va se brancher.

---

#### Auth est isolé

```
api/auth/*
```

Très bon choix.

---

### Ce qui manque

un pattern répété sur presque toutes les entités.
Cela signifie qu'en réalité tu as déjà défini un contrat. Le problème ce contrat n'est pas explicite.

```
index
show
like
create
update
delete
```

---

Je créerais immédiatement :
```
EntityApiInterface
```

Documentation uniquement au début.

Exemple :

```
Entity

GET    /entity
GET    /entity/{id}
GET    /entity/like

POST   /entity

PUT    /entity/{id}

DELETE /entity/{id}
```

---

Puis chaque feature :

```
Entreprise
Organisation
Mot
Adresse
```

devient une implémentation de ce contrat.

---

### Ce qui manque encore plus

Je ne vois aucune notion de métadonnées.

Pour le système expert c'est pourtant fondamental.

Aujourd'hui tu as :

```
Entreprise
```

Mais demain il faudra :

```json
{  
	"entity": "entreprise",
	"label": "Entreprise",
	"readonly": false,
	"searchable": true,
	"fields": [...]
}
```

---

### Ce que je mettrais dans Zealot

#### Registry d'entités

Pas de système expert.

Pas encore.

D'abord :

```
EntityRegistry
```

---

Exemple :

```php
return [
	'entreprise' => [    
		'label' => 'Entreprise',
		'api' => '/api/entreprise',
		'fields' => [
			'siren',
		    'raison_sociale',
		    'naf_id'
		    ]
		],
	'organisation' => [    ...]];
```

---

À partir de là :

### Formulaire automatique

```
component('form', 'entreprise')
```

---

### Table automatique

```
component('table', 'entreprise')
```

---

### API automatique

```
api('entreprise')
```

---

Et là tu commences à sortir du code répétitif.

---

### Ce qui me préoccupe davantage

Je vois :

```
Entreprise
Organisation
Adresse
```

mais je ne vois pas encore :

```
Relations
```

Or pour un système expert : les entités sont secondaires. Les relations sont le vrai sujet.

---

Aujourd'hui :

```
Entreprise
```

Demain :

```
Entreprise 
├─ possède → Adresse 
├─ possède → NAF 
├─ appartient → Organisation 
└─ exploite → Etablissement
```

---

Je pense que ton prochain modèle n'est pas :

```
Marketing
```

mais :

```
Relation
```

---
## Audit Controllers API  

Ces deux contrôleurs montrent exactement la séparation que j'espérais trouver.

### Contrôleur Informatique

```
class Informatique extends BaseController
```

C'est un contrôleur de contenu.

Responsabilités :

```
Route↓Préparation des données↓Vue
```

Il est simple.

Même le système :

```
show($slug)
```

avec :

```
Views/pages/informatique/$slug.php
```

est cohérent.

Je ne toucherais quasiment à rien.

Au pire je créerais plus tard un :

```
ContentController
```

pour mutualiser :

```
show($slug)
```

mais ce n'est absolument pas prioritaire.

---

### Contrôleur Adresse

Celui-là est beaucoup plus intéressant.

Je vais être direct :

**c'est probablement ton meilleur candidat pour devenir le modèle des futures API.**

Pourquoi ?

Parce qu'il contient déjà les briques importantes.

---

#### Ce qui est bien

##### ApiResponse

```
use ApiResponse;
```

Excellent.

Ça impose déjà :

```
apiOk()apiCreated()apiDeleted()apiNotFound()apiValidationError()
```

C'est un vrai contrat.

---

##### Enrichissement

```
enrich()
```

Très bien.

Tu distingues :

```
donnée stockée
```

de

```
donnée exposée
```

---

Exemple :

```
ligne4
```

n'existe pas forcément en base.

---

##### BuildPayload

```
buildPayload()
```

Très intéressant.

Parce qu'on découvre un concept caché :

```
Hydratation métier
```

---

L'adresse n'est pas un CRUD simple.

Quand tu changes :

```
codepostal_id
```

tu recalcules :

```
acheminementlatitudelongitudeprecision
```

---

Donc :

```
Adresse
```

possède déjà de la logique métier.

---

#### Ce que révèle ce contrôleur

Je vois apparaître une architecture qui n'est pas encore formalisée.

Aujourd'hui :

```
Controller├─ Validation├─ Hydratation├─ CRUD├─ Enrichissement└─ Réponse API
```

---

Demain j'aimerais voir :

```
Controller↓Service↓Model
```

---

Exemple :

```
AdresseController
```

↓

```
AdresseService
```

↓

```
AdresseModel
```

---

Car actuellement :

```
buildPayload()
```

est du métier.

---

Et :

```
enrich()
```

est du métier.

---

Je ne les laisserais pas éternellement dans le contrôleur.

---

### Ce que cela implique pour les stubs

L'audit me fait ajouter un objet.

Tu proposais :

```
EntityApiInterfaceEntityRegistryFieldDefinitionEntityDefinitionRelationRelationDefinition
```

Je rajoute :

```
EntityService
```

---

Parce que je vois déjà son besoin.

---

Exemple :

```
AdresseService
```

```
create()update()buildPayload()enrich()
```

---

Puis :

```
EntrepriseService
```

---

```
OrganisationService
```

---

### Concernant la génération automatique

L'audit répond aussi à une question.

Tu demandais :

> le code feature CRUD peut-il être écrit par PHP ou Python ?

Oui.

Mais pas totalement.

---

Je vois maintenant deux catégories.

#### CRUD simple

Exemple :

```
MotTypeVoieFormeJuridique
```

Probablement générables à 90%.

---

#### CRUD enrichi

Exemple :

```
AdresseEntrepriseOrganisation
```

---

Ceux-là ont du métier.

Donc :

```
génération du squelette+complément manuel
```

---

### Ce que j'écrirais maintenant

Avant même de continuer l'audit.

```
docs/architecture/
```

#### Documents à créer

- EntityDefinition.md : [[ARCHITECTURE/EntityDefinition]]
- FieldDefinition.md : [[ARCHITECTURE/FieldDefinition]]
- RelationDefinition.md : [[ARCHITECTURE/RelationDefinition]]

- DescriptorDefinition.md : [[ARCHITECTURE/DescriptorDefinition]]
- ComponentDefinition.md : [[ARCHITECTURE/ComponentDefinition]]
- ComponentRegistry.md : [[ARCHITECTURE/ComponentRegistry]]
- CompositeComponentDefinition.md : [[ARCHITECTURE/CompositeComponentDefinition]]

- EntityApiInterface.md : [[ARCHITECTURE/EntityApiInterface]]
- EntityService.md : [[ARCHITECTURE/EntityService]]



---
## Audit Models  





---
# Audit API - Roadmap backend

1 Audit Controllers API  
2 Audit Models  
3 EntityDefinition  
4 FieldDefinition  
5 RelationDefinition  
6 Component Registry PHP  
7 Refactor Components  
8 Store Registry  
9 Documentation ADR  
10 Système Expert



### Phase 2

Créer :

```
EntityRegistry
```

---

### Phase 3

Créer :

```
FieldDefinition
```

Exemple :

```php
[    'name' => 'naf_id',    'type' => 'relation',    'entity' => 'codesnaf']
```

---

### Phase 4

Créer :

```
RelationDefinition
```

Exemple :

```php
[    'source' => 'entreprise',    'target' => 'adresse',    'type'   => 'possede']
```

---

### Phase 5

Génération automatique

- API
- Form
- Table
- Validation

---

### Phase 6

Système expert

Qui ne manipulera plus :

```
tables SQL
```

mais :

```
EntityDefinition
FieldDefinition
RelationDefinition
```

---

Après lecture des routes, je pense que le pivot architectural de Zealot n'est ni le CMS, ni le SPA, ni même l'EventBus.

Le pivot est probablement :

```
EntityFieldRelation
```

Si tu stabilises ces trois concepts, le reste (API, composants PHP, formulaires, moteur expert) peut être construit au-dessus de manière beaucoup plus systématique.

---

[[Phase 1 - Audit Frontend]]