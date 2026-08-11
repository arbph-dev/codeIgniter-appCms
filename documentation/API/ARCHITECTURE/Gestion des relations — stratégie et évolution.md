# Gestion des relations — stratégie et évolution

## Objectif

Les besoins des Workbenches font apparaître la nécessité de normaliser la gestion des relations côté backend.

L'objectif est de disposer d'un mécanisme commun permettant :

- de consulter les relations ;
- de rechercher les entités liées ;
- de charger les relations à la demande ;
- de créer ou supprimer une relation ;
- de gérer les relations N–N ;
- de préparer les futurs `RelationField`, `RelationPickerDialog` et Workbenches.

La stratégie consiste à commencer par une relation simple et bien définie :

```text
Image ↔ Mot
```

puis à généraliser progressivement le mécanisme.

---

# 1. Première relation de référence : Image ↔ Mot

La relation est de type **N–N** :

```text
Image
  │
  ├── Mot
  ├── Mot
  └── Mot
       ▲
       │
       │ table pivot
       │
       ▼
     Image
     Image
     Image
```

Une Image peut avoir plusieurs tags (`Mot`).

Un Mot peut être associé à plusieurs Images.

La relation est donc portée par une table pivot.

```text
Image ─────< image_mot >───── Mot
```

Cette relation constitue un excellent premier cas de normalisation car elle permet de tester :

- lecture d'une relation ;
- ajout ;
- suppression ;
- autocomplete ;
- batch ;
- lazy loading ;
- synchronisation d'un ensemble d'IDs.

---

# 2. API d'une relation

Le premier contrat peut être :

```text
GET    /api/image/:id/mots
POST   /api/image/:id/mots
DELETE /api/image/:id/mots/:motId
```

Pour l'autre sens :

```text
GET    /api/mot/:id/images
```

Le backend expose donc la relation depuis l'une ou l'autre des ressources.

---

# 3. Lecture

Pour une Image :

```text
GET /api/image/17/mots
```

retourne les tags associés.

Exemple :

```json
{
    "data": [
        {
            "mot_id": 3,
            "mot_lbl": "architecture"
        },
        {
            "mot_id": 8,
            "mot_lbl": "bretagne"
        }
    ],
    "meta": {
        "image_id": 17,
        "total": 2
    }
}
```

La réponse doit rester légère.

La relation ne doit pas provoquer automatiquement le chargement complet de chaque `Mot`.

---

# 4. Ajout d'une relation

```text
POST /api/image/17/mots
```

avec par exemple :

```json
{
    "mot_id": 8
}
```

Le backend crée l'enregistrement dans la table pivot.

La logique de relation doit vérifier :

- que l'Image existe ;
- que le Mot existe ;
- que la relation n'existe pas déjà ;
- que les contraintes de la table pivot sont respectées.

---

# 5. Suppression

```text
DELETE /api/image/17/mots/8
```

supprime la relation dans la table pivot.

La suppression de la relation ne supprime ni :

```text
Image #17
```

ni :

```text
Mot #8
```

Elle supprime uniquement :

```text
Image #17 ↔ Mot #8
```

---

# 6. Autocomplete

Le choix d'un tag utilise l'API standard de `Mot` :

```text
GET /api/mot/like?q=bret&len=10
```

Le `RelationField` n'a donc pas besoin de connaître la table pivot.

Il travaille en deux temps :

```text
recherche
   ↓
/api/mot/like
   ↓
sélection du Mot
   ↓
mot_id
   ↓
POST /api/image/:id/mots
```

Cette séparation est fondamentale.

> `Mot` est responsable de la recherche d'un Mot.  
> La relation Image ↔ Mot est responsable de l'association.

---

# 7. Batch et lazy loading

Le mécanisme `batch` reste celui de la ressource :

```text
GET /api/mot/batch?ids=3,8,12
```

Il permet de résoudre plusieurs IDs sans multiplier les requêtes.

La combinaison :

```text
relation
+
batch
```

permet notamment de gérer des relations dont seuls les IDs sont initialement connus.

---

# 8. RelationService

Une fois le comportement Image ↔ Mot stabilisé, la logique commune pourra être extraite dans un service.

Le service pourrait progressivement fournir des opérations conceptuelles telles que :

```text
getRelated()
attach()
detach()
sync()
```

Exemple conceptuel :

```php
$relationService->getRelated(
    'image',
    $imageId,
    'mot'
);

$relationService->attach(
    'image',
    $imageId,
    'mot',
    $motId
);

$relationService->detach(
    'image',
    $imageId,
    'mot',
    $motId
);
```

Mais cette abstraction ne doit être créée **qu'après validation du premier cas réel**.

L'objectif n'est pas de construire immédiatement un ORM de relations.

---

# 9. `sync()`

Pour un Tagger, une opération supplémentaire sera probablement nécessaire :

```text
PUT /api/image/17/mots
```

avec :

```json
{
    "ids": [3, 8, 12]
}
```

Le backend pourrait alors synchroniser la table pivot :

```text
avant :
[3, 8]

après :
[3, 8, 12]
```

puis :

```text
avant :
[3, 8, 12]

après :
[3, 12]
```

Cette opération est particulièrement adaptée à un **ImageTaggerWorkbench**.

Elle évite :

```text
DELETE relation
DELETE relation
POST relation
POST relation
...
```

et permet une synchronisation transactionnelle de l'ensemble.

Le contrat exact de `sync()` devra toutefois être validé avec le comportement attendu de `ImageTagger`.

---

# 10. ImageTaggerWorkbench

La relation Image ↔ Mot permet de construire un premier Workbench spécialisé :

```text
ImageTaggerWorkbench
│
├── Image
│
├── liste des tags
│
├── autocomplete Mot
│
└── ajout / suppression / synchronisation
```

Flux :

```text
Image sélectionnée
       │
       ▼
GET /api/image/:id/mots
       │
       ▼
Tags actuels
       │
       ├───────────────┐
       │               │
       ▼               ▼
autocomplete       suppression
       │               │
       ▼               ▼
/api/mot/like      DELETE relation
       │
       ▼
POST /api/image/:id/mots
```

Ce Workbench devient ainsi le **premier consommateur réel du contrat relationnel**.

---

# 11. Deuxième étape : Organisation ↔ Adresse

Une fois Image ↔ Mot stabilisé, la deuxième étape sera :

```text
Organisation ↔ Adresse
```

Cette relation permettra de tester un autre type de relation.

Contrairement au N–N Image ↔ Mot, il faudra déterminer précisément :

- cardinalité ;
- sens de la relation ;
- propriété de l'adresse ;
- possibilité de réutiliser une adresse ;
- attributs portés par la relation ;
- création / modification / suppression.

Cette étape permettra de vérifier que le `RelationService` n'est pas artificiellement spécialisé pour les pivots N–N.

---

# 12. Troisième étape : Personne ↔ Organisation

La relation :

```text
Personne ↔ Organisation
```

est plus riche.

Elle peut porter des informations propres à la relation, par exemple :

```text
personne
organisation
rôle
fonction
dates
statut
...
```

Elle permettra donc de tester une relation qui n'est pas simplement :

```text
entity_id
related_id
```

mais une véritable **relation métier porteuse d'attributs**.

C'est probablement le meilleur test de maturité du futur `RelationService`.

---

# 13. Quatrième étape : Organisation ↔ Organisation

Enfin :

```text
Organisation ↔ Organisation
```

permettra de tester les relations entre entités du même type.

Exemples possibles :

```text
Organisation A
      │
      ├── filiale de
      ├── partenaire de
      ├── membre de
      └── rattachée à
```

Ce cas introduira potentiellement :

- relation réflexive ;
- type de relation ;
- direction ;
- contraintes spécifiques.

Il constituera donc un test supplémentaire du modèle générique.

---

# 14. Ordre d'évolution

La progression recommandée est :

```text
1. Image ↔ Mot
       │
       ├── table pivot
       ├── autocomplete
       ├── batch
       ├── lazy fetch
       ├── attach
       ├── detach
       └── sync
       │
       ▼
2. Organisation ↔ Adresse
       │
       └── relation structurelle
       │
       ▼
3. Personne ↔ Organisation
       │
       └── relation porteuse d'attributs
       │
       ▼
4. Organisation ↔ Organisation
       │
       └── relation réflexive
```

À chaque étape, on enrichit le contrat uniquement lorsque le cas métier l'exige.

---

# 15. Principe d'architecture

La progression doit rester empirique :

```text
cas métier réel
      ↓
API spécifique minimale
      ↓
validation frontend
      ↓
identification du comportement commun
      ↓
RelationService
```

et non :

```text
abstraction générique
      ↓
10 types de relations théoriques
      ↓
implémentation
      ↓
recherche de cas d'utilisation
```

Le premier objectif est donc de **faire fonctionner parfaitement Image ↔ Mot**.

Une fois ce cas validé, nous pourrons extraire les invariants nécessaires au `RelationService` sans créer une abstraction prématurée.

---

## Statut

### À valider

```text
Image ↔ Mot
```

### À traiter ensuite

```text
Organisation ↔ Adresse
Personne ↔ Organisation
Organisation ↔ Organisation
```

### Composants frontend concernés

```text
RelationField
RelationPickerDialog
ImageTaggerWorkbench
Form
WorkbenchBase
```

Le backend doit être stabilisé en premier afin que ces composants consomment un contrat API homogène plutôt que chacun développe son propre mécanisme de relation.