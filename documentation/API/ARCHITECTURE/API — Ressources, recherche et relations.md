# API — Ressources, recherche et relations

## Objectif

Les travaux sur les Workbenches, `RelationField`, `RelationPickerDialog` et les formulaires mettent en évidence la nécessité d'un contrat API adapté à la gestion de données relationnelles.

L'objectif est de permettre :

- le chargement minimal des ressources ;
- le lazy fetch ;
- l'autocomplétion ;
- le chargement par lots ;
- le chargement explicite des relations ;
- la manipulation des relations ;
- l'évitement des graphes de données surchargés.

L'API doit permettre au frontend de charger progressivement les données dont il a réellement besoin.

---

# 1. Ressource API standard

Une ressource simple expose le CRUD classique :

```text
GET    /api/{resource}
GET    /api/{resource}/:id
POST   /api/{resource}
PUT    /api/{resource}/:id
DELETE /api/{resource}/:id
```

Exemple :

```text
GET    /api/mot
GET    /api/mot/12
POST   /api/mot
PUT    /api/mot/12
DELETE /api/mot/12
```

Le Controller CodeIgniter reste responsable de la ressource correspondante.

---

# 2. Sparse fields

Les ressources peuvent accepter :

```text
?fields=mot_id,mot_lbl
```

Le Controller applique une whitelist des colonnes autorisées.

Exemple :

```text
GET /api/mot?fields=mot_id,mot_lbl
```

Retourne uniquement les champs demandés.

Le mécanisme permet au frontend de demander une représentation minimale lorsqu'il n'a pas besoin de l'ensemble de la ressource.

## Contrat

```text
fields
    ↓
whitelist
    ↓
SELECT contrôlé
```

Les champs inconnus ou interdits ne doivent jamais être transmis directement à SQL.

Un jeu de champs par défaut est utilisé lorsque `fields` n'est pas fourni.

---

# 3. Recherche et autocomplétion

Une ressource peut exposer un endpoint spécialisé pour la recherche légère :

```text
GET /api/{resource}/like?q=...&len=...
```

Exemple :

```text
GET /api/mot/like?q=bre&len=10
```

Cet endpoint est destiné notamment à :

- `RelationField` ;
- `RelationPickerDialog` ;
- autocomplete ;
- recherche rapide dans un formulaire.

Il ne doit pas être assimilé à une liste paginée complète.

## Réponse

```json
{
    "status": 200,
    "data": [],
    "meta": {
        "q": "bre",
        "len": 10,
        "total": 27,
        "has_more": true
    }
}
```

Les données retournées doivent être volontairement légères.

Exemple :

```text
personne_id
nom
prenom
```

plutôt que l'ensemble de la fiche Personne.

> L'autocomplete sert à identifier une ressource, pas à charger son détail.

---

# 4. Chargement par lots

Une ressource peut exposer :

```text
GET /api/{resource}/batch?ids=1,2,3
```

Exemple :

```text
GET /api/mot/batch?ids=1,2,3
```

Ce mécanisme est destiné au lazy loading lorsque plusieurs identifiants sont déjà connus.

## Exemple

Une Organisation possède :

```json
{
    "org_id": 17,
    "mot_ids": [3, 8, 12]
}
```

Le frontend peut ensuite effectuer :

```text
GET /api/mot/batch?ids=3,8,12
```

au lieu de :

```text
GET /api/mot/3
GET /api/mot/8
GET /api/mot/12
```

Le `batch` constitue donc un mécanisme essentiel de réduction du nombre de requêtes.

## Contrat recommandé

La requête doit :

- accepter une liste d'identifiants ;
- supprimer les doublons ;
- ignorer ou rejeter les identifiants invalides ;
- appliquer une limite maximale ;
- appliquer `fields` ;
- retourner les identifiants effectivement trouvés.

Exemple :

```json
{
    "data": [
        {
            "mot_id": 1,
            "mot_lbl": "..."
        },
        {
            "mot_id": 3,
            "mot_lbl": "..."
        }
    ],
    "meta": {
        "ids": [1, 2, 3],
        "found_ids": [1, 3],
        "missing_ids": [2]
    }
}
```

---

# 5. `include`

Une ressource individuelle peut accepter :

```text
GET /api/{resource}/:id?include=...
```

Exemple :

```text
GET /api/mot/17?include=usages
```

`include` permet de demander explicitement une ou plusieurs sous-ressources.

## Principe

Sans `include` :

```text
GET /api/organisation/17
```

retourne l'Organisation.

Avec :

```text
GET /api/organisation/17?include=adresse
```

l'Adresse est également chargée.

Les valeurs de `include` doivent être whitelistées.

L'API ne doit jamais reconstruire automatiquement l'intégralité du graphe relationnel.

---

# 6. `fields` et `include` sont différents

Ces deux mécanismes doivent rester distincts.

```text
fields
    → quelles colonnes de cette ressource ?

include
    → quelles relations supplémentaires ?
```

Exemple :

```text
GET /api/organisation/17
    ?fields=org_id,org_lbl
    &include=adresse
```

signifie :

```text
Organisation
├── org_id
├── org_lbl
└── adresse
```

et non :

```text
Organisation
└── toutes ses relations
```

---

# 7. Ressource et relation sont deux concepts différents

Une relation ne doit pas être confondue avec l'entité qu'elle relie.

Exemple :

```text
Personne #12
      │
      └── Organisation #7
```

Le chargement de l'Organisation :

```text
GET /api/organisation/7
```

est différent du chargement de la relation :

```text
GET /api/personne/12/organisations
```

La relation peut posséder ses propres attributs :

```json
{
    "personne_id": 12,
    "organisation_id": 7,
    "role": "directeur",
    "date_debut": "2024-01-01",
    "date_fin": null
}
```

Le `batch` charge des **entités**.

L'API de relation charge des **relations**.

---

# 8. Relations

Pour une ressource possédant des relations, une API spécialisée peut être exposée.

Exemple :

```text
GET /api/personne/:id/organisations
```

ou :

```text
GET /api/personne/:id/personnes
```

Lorsque la relation est manipulable :

```text
POST   /api/personne/:id/organisations
PUT    /api/personne/:id/organisations/:organisationId
DELETE /api/personne/:id/organisations/:organisationId
```

Ces routes ne doivent être créées que lorsque la relation constitue réellement une ressource manipulable.

La forme définitive des routes doit respecter les relations définies dans :

- `relation_types.md`
- `personne_relations.md`

---

# 9. Exemple : Personne

Une fiche Personne ne doit pas charger automatiquement tout son graphe relationnel.

Chargement initial :

```text
GET /api/personne/12
```

Puis, selon les besoins de l'interface :

```text
GET /api/personne/12/organisations
GET /api/personne/12/personnes
```

Les entités liées peuvent ensuite être récupérées par lots :

```text
GET /api/organisation/batch?ids=3,7,11
```

ou :

```text
GET /api/personne/batch?ids=21,32,45
```

---

# 10. Exemple : Organisation / Entreprise / Établissement / Service

Le même principe s'applique à la hiérarchie organisationnelle.

```text
Organisation
    │
    ├── Entreprises
    │       │
    │       └── Établissements
    │                │
    │                └── Services
    │
    └── Personnes
```

L'API ne doit pas retourner systématiquement cette hiérarchie complète.

Le Workbench peut commencer par :

```text
GET /api/organisation/12
```

Puis charger à la demande :

```text
GET /api/organisation/12/entreprises
```

puis :

```text
GET /api/entreprise/4/etablissements
```

puis :

```text
GET /api/etablissement/8/services
```

Chaque niveau est chargé uniquement lorsqu'il devient nécessaire.

---

# 11. Lazy fetch

Le lazy fetch devient donc une propriété fondamentale de l'architecture.

Le frontend ne demande pas :

```text
Organisation
 + entreprises
 + établissements
 + services
 + personnes
 + adresses
 + mots
 + ...
```

Il demande progressivement :

```text
Organisation
     ↓
Entreprises
     ↓
Entreprise
     ↓
Établissements
     ↓
Services
```

Le graphe est parcouru à la demande.

Cela permet :

- de réduire le volume des réponses ;
- de réduire le temps initial de chargement ;
- d'éviter les requêtes SQL inutiles ;
- de contrôler la profondeur du graphe ;
- de rendre les Workbenches plus réactifs.

---

# 12. Niveaux de chargement

On peut considérer quatre niveaux de coût :

```text
                coût
                 ↑
                 │
       relations│
                 │
          détail│
                 │
         batch  │
                 │
 autocomplete   │
                 └────────────────→ quantité de données
```

Concrètement :

```text
autocomplete
    ↓
identification légère

batch
    ↓
plusieurs entités connues

show
    ↓
détail d'une entité

include / relation
    ↓
graphe relationnel ciblé
```

Le frontend choisit le niveau dont il a réellement besoin.

---

# 13. Pagination, tri et meta

Les listes peuvent accepter :

```text
?page=1
&per_page=20
&sort=mot_lbl
&order=asc
```

Les paramètres de tri doivent être whitelistés.

La réponse utilise `meta` pour exposer les informations de pagination et les paramètres utiles :

```json
{
    "data": [],
    "meta": {
        "page": 1,
        "per_page": 20,
        "total": 125,
        "pages": 7,
        "sort": "mot_lbl",
        "order": "asc"
    }
}
```

`meta` constitue le contrat stable entre l'API et les composants frontend.

---

# 14. Séparation des responsabilités

L'architecture backend doit conserver les frontières suivantes :

```text
Controller
    │
    ├── HTTP
    ├── paramètres
    ├── validation superficielle
    └── réponse API
         │
         ▼
Model / Service
    │
    ├── accès aux données
    ├── règles métier
    └── relations
```

Le Controller ne doit pas devenir un agrégateur de tout le graphe métier.

En particulier, éviter :

```php
OrganisationController
    → fetch entreprise
    → fetch établissements
    → fetch services
    → fetch personnes
    → fetch adresses
```

Les relations doivent être chargées explicitement.

---

# 15. Relation avec le frontend

Ces contrats permettent aux composants frontend de rester génériques.

## `RelationField`

```text
saisie
   ↓
/api/{resource}/like
   ↓
sélection
   ↓
identifiant
```

## Lazy relation

```text
ids connus
   ↓
/api/{resource}/batch
   ↓
entités
```

## Relation complète

```text
entity
   ↓
/api/entity/:id/relation
   ↓
relations
```

## Détail

```text
id
   ↓
/api/entity/:id
   ↓
entity
```

Ainsi `RelationField`, `RelationPickerDialog` et les futurs Workbenches ne dépendent pas de la structure interne des Models CodeIgniter.

---

# 16. Pattern de référence

Le pattern minimal d'une ressource est donc :

```text
GET    /api/{resource}
GET    /api/{resource}/like
GET    /api/{resource}/batch
GET    /api/{resource}/:id
POST   /api/{resource}
PUT    /api/{resource}/:id
DELETE /api/{resource}/:id
```

Auquel peuvent s'ajouter :

```text
GET /api/{resource}/:id?include={relation}
```

et les endpoints de relation :

```text
GET    /api/{resource}/:id/{relation}
POST   /api/{resource}/:id/{relation}
PUT    /api/{resource}/:id/{relation}/:relatedId
DELETE /api/{resource}/:id/{relation}/:relatedId
```

Ces derniers ne sont pas automatiques : ils doivent découler du modèle métier.

---

# 17. Principes à retenir

### P001 — Une ressource n'embarque pas son graphe

Une ressource retourne par défaut ses propres données.

### P002 — `fields` contrôle les colonnes

```text
fields → ressource courante
```

### P003 — `include` contrôle les relations demandées

```text
include → relations explicites
```

### P004 — `like` sert à l'identification rapide

Il est destiné notamment à l'autocomplétion.

### P005 — `batch` sert au lazy loading

Il permet de résoudre plusieurs IDs en une seule requête.

### P006 — Une entité et sa relation sont différentes

```text
Organisation
≠
relation Personne ↔ Organisation
```

### P007 — Le lazy fetch est explicite

Une relation n'est chargée que lorsque le frontend la demande.

### P008 — Les relations sont définies par le métier

Les routes de relation doivent être dérivées des relations définies dans la documentation métier.

### P009 — Pas d'agrégation massive

Les Controllers ne doivent pas reconstruire automatiquement tout le graphe d'une entité.

### P010 — L'API doit servir les Workbenches

Le contrat API doit permettre au frontend de choisir précisément :

```text
quoi charger
quand le charger
combien charger
et jusqu'à quelle profondeur
```

---

## Statut

Ce document définit le **pattern d'architecture API cible**.

Le Controller `Mot` constitue actuellement un prototype permettant de valider :

- `fields` ;
- pagination ;
- tri ;
- autocomplete ;
- `batch` ;
- `include` ;
- CRUD ;
- structure `data` / `meta`.

La prochaine étape consiste à confronter ce pattern aux relations métier réellement définies pour :

- Personne ↔ Personne ;
- Personne ↔ Organisation ;
- Organisation ↔ Entreprise ;
- Entreprise ↔ Établissement ;
- Établissement ↔ Service ;

avant de créer une abstraction générique de gestion des relations côté backend.