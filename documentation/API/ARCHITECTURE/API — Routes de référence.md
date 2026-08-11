# API — Routes de référence

## 1. Ressource standard

Chaque ressource peut exposer :

```text
GET    /api/{resource}
GET    /api/{resource}/like
GET    /api/{resource}/batch
GET    /api/{resource}/:id
POST   /api/{resource}
PUT    /api/{resource}/:id
DELETE /api/{resource}/:id
```

Exemple `Mot` :

```text
GET    /api/mot
GET    /api/mot/like?q=bre&len=10
GET    /api/mot/batch?ids=1,2,3
GET    /api/mot/12
POST   /api/mot
PUT    /api/mot/12
DELETE /api/mot/12
```

---

## 2. Paramètres communs

### Liste

```text
GET /api/{resource}
    ?fields=id,label
    &q=...
    &page=1
    &per_page=20
    &sort=label
    &order=asc
```

### Autocomplete

```text
GET /api/{resource}/like
    ?q=...
    &len=10
    &fields=id,label
```

Réponse :

```json
{
    "data": [],
    "meta": {
        "q": "...",
        "len": 10,
        "total": 25,
        "has_more": true
    }
}
```

### Batch / lazy loading

```text
GET /api/{resource}/batch
    ?ids=1,2,3
    &fields=id,label
```

Le `batch` permet de résoudre plusieurs IDs en une seule requête.

---

## 3. Détail et `include`

```text
GET /api/{resource}/:id
```

Retourne uniquement la ressource.

Une ou plusieurs relations peuvent être demandées explicitement :

```text
GET /api/{resource}/:id?include=relation
```

ou :

```text
GET /api/{resource}/:id?include=relation1,relation2
```

Exemples :

```text
GET /api/mot/12?include=usages

GET /api/organisation/12?include=adresse,entreprises

GET /api/personne/15?include=organisations,personnes
```

Les valeurs de `include` sont **whitelistées**.

> Une relation n'est jamais chargée implicitement simplement parce qu'elle existe.

---

## 4. Relations

Une relation peut également être exposée comme sous-ressource :

```text
GET /api/{resource}/:id/{relation}
```

Exemples :

```text
GET /api/personne/15/organisations
GET /api/personne/15/personnes

GET /api/organisation/12/entreprises
GET /api/organisation/12/personnes

GET /api/entreprise/4/etablissements

GET /api/etablissement/8/services
```

### Différence importante

```text
GET /api/organisation/4
```

→ charge **l'Organisation**.

```text
GET /api/organisation/4/entreprises
```

→ charge **la relation / collection d'Entreprises**.

```text
GET /api/entreprise/batch?ids=3,7,9
```

→ charge **les entités Entreprise** dont les IDs sont connus.

---

## 5. Lazy fetch

Le parcours du graphe se fait progressivement :

```text
Organisation
     │
     └── GET /organisation/:id
             │
             ▼
        Entreprises
             │
             └── GET /organisation/:id/entreprises
                     │
                     ▼
                 Entreprise
                     │
                     └── GET /entreprise/:id/etablissements
                             │
                             ▼
                        Établissements
                             │
                             └── GET /etablissement/:id/services
```

Le backend ne reconstruit donc pas automatiquement tout le graphe.

---

## 6. Routes métier prévues

```text
# Personne
GET /api/personne
GET /api/personne/like
GET /api/personne/batch
GET /api/personne/:id
GET /api/personne/:id/organisations
GET /api/personne/:id/personnes

# Organisation
GET /api/organisation
GET /api/organisation/like
GET /api/organisation/batch
GET /api/organisation/:id
GET /api/organisation/:id/entreprises
GET /api/organisation/:id/personnes

# Entreprise
GET /api/entreprise
GET /api/entreprise/like
GET /api/entreprise/batch
GET /api/entreprise/:id
GET /api/entreprise/:id/etablissements

# Établissement
GET /api/etablissement
GET /api/etablissement/like
GET /api/etablissement/batch
GET /api/etablissement/:id
GET /api/etablissement/:id/services

# Service
GET /api/service
GET /api/service/like
GET /api/service/batch
GET /api/service/:id
```

Les routes `POST`, `PUT` et `DELETE` des **relations elles-mêmes** restent à définir selon le modèle de relation métier.

---

## 7. Principes

```text
fields   → champs de la ressource
like     → recherche / autocomplete
batch    → résolution de plusieurs IDs
include  → relations incluses dans le détail
relation → accès explicite à une collection liée
```

Principes fondamentaux :

- pas de graphe chargé automatiquement ;
- pas de `JOIN` massif imposé par défaut ;
- `fields` et `include` sont whitelistés ;
- `batch` sert au lazy loading ;
- une entité et sa relation sont deux concepts distincts ;
- les routes de relation doivent respecter les relations métier définies dans `relation_types.md` et `personne_relations.md`.