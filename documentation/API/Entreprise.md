# Entreprise

## Vue d'ensemble

Une **Entreprise** est une extension (1:1) d'une **Organisation** spécifique au monde professionnel/commercial.

- Elle hérité des propriétés générales d'Organisation (nom, adresse, logo, etc.)
- Elle ajoute des spécificités métier : SIRET, forme juridique, code NAF, capital, effectifs
- Elle permet de gérer des **Établissements** (via SIREN/SIRET)
- Elle peut avoir plusieurs **Services** internes

**Relation :** 1 Entreprise = 1 Organisation + données spécifiques

## Routes API

```
GET    /api/entreprise                    Liste des entreprises (paginée, filtrable)
GET    /api/entreprise/like               Autocomplétion par nom
GET    /api/entreprise/:id                Détail d'une entreprise
POST   /api/entreprise                    Créer une entreprise
PUT    /api/entreprise/:id                Mettre à jour une entreprise
DELETE /api/entreprise/:id                Supprimer une entreprise (soft delete)
```

## Contrôleur

**Classe :** `App\Controllers\Api\Entreprise`  
**Namespace :** `App\Controllers\Api`  
**Trait :** `ApiResponse` (gestion des réponses JSON)

### Méthodes

#### `index()` – GET /api/entreprise

**Paramètres de requête :**
- `q` (string, optionnel) – Recherche par nom, SIRET ou SIREN
- `page` (int, défaut: 1) – Numéro de page
- `per_page` (int, défaut: 20, max: 100) – Éléments par page

**Réponse :**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "organisation_id": 5,
      "nom": "Entreprise ACME",
      "siret": "12345678901234",
      "siren": "123456789",
      "codenaf_id": "6201Z",
      "forme_juridique_id": "SARL",
      "capital": 50000.00,
      "effectif_min": 10,
      "effectif_max": 50,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "pager": { "currentPage": 1, "perPage": 20, "total": 85 }
}
```

#### `show($id)` – GET /api/entreprise/:id

**Paramètres :**
- `id` (int) – ID de l'entreprise

**Réponse :** Détail complet avec relations organisation, codes NAF, forme juridique

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "organisation_id": 5,
    "organisation": {
      "id": 5,
      "nom": "Entreprise ACME",
      "slug": "entreprise-acme",
      "description": "Leader du secteur innovation",
      "site_web": "https://acme.fr",
      "email": "contact@acme.fr",
      "telephone": "01 23 45 67 89",
      "siren": "123456789",
      "adresse_id": 5,
      "logo_id": 12,
      "cover_id": 13
    },
    "siret": "12345678901234",
    "codenaf_id": "6201Z",
    "codenaf": {
      "codenaf": "6201Z",
      "label": "Développement d'autres logiciels"
    },
    "forme_juridique_id": "SARL",
    "forme_juridique": {
      "id": "SARL",
      "label": "Société à responsabilité limitée"
    },
    "capital": 50000.00,
    "effectif_min": 10,
    "effectif_max": 50,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

#### `create()` – POST /api/entreprise

**Comportement spécial :** Crée automatiquement l'Organisation mère dans une transaction atomique.

**Body JSON :**
```json
{
  "nom": "Nouvelle Startup",
  "organisation_type_id": 1,
  "description": "Startup innovante",
  "site_web": "https://startup.fr",
  "email": "contact@startup.fr",
  "telephone": "01 23 45 67 89",
  "siren": "123456789",
  "siret": "12345678901234",
  "codenaf_id": "6201Z",
  "forme_juridique_id": "SARL",
  "capital": 50000.00,
  "effectif_min": 5,
  "effectif_max": 15,
  "adresse_id": 5,
  "logo_id": 12,
  "cover_id": 13
}
```

**Réponse :** `201 Created` + Objet entreprise avec organisation imbriquée

**Transaction :**
1. Crée l'enregistrement `organisations` avec les champs génériques
2. Crée l'enregistrement `entreprises` avec les champs métier
3. En cas d'erreur, rollback complet

#### `update($id)` – PUT /api/entreprise/:id

**Comportement :** Met à jour simultanément l'organisation mère et les données entreprise.

**Body JSON :** Mêmes champs que `create()`, tous optionnels

**Transaction :**
1. Extrait les champs organisation et les met à jour
2. Extrait les champs entreprise et les met à jour
3. En cas d'erreur, rollback complet

**Réponse :** `200 OK` + Objet mis à jour

#### `delete($id)` – DELETE /api/entreprise/:id

**Type :** Soft delete via l'organisation mère (cascade logique)

**Réponse :** `200 OK` avec message de confirmation

#### `like()` – GET /api/entreprise/like

**Paramètres :**
- `q` (string) – Recherche (min. 2 caractères)
- `len` (int, défaut: 10, max: 50) – Nombre de résultats

**Réponse :**
```json
{
  "status": 200,
  "data": [
    { "id": 1, "nom": "Entreprise ACME" },
    { "id": 3, "nom": "Entreprise Startup" }
  ]
}
```

---

## Modèle

**Classe :** `App\Models\EntrepriseModel`

### Propriétés principales
- `table` – `entreprises`
- `primaryKey` – `id`
- `allowedFields` – Champs modifiables via l'API
- `useTimestamps` – `true` (gère `created_at`, `updated_at`)

### Méthodes clés

#### `withRelations()`
Charges les relations :
- `organisations` → organisation mère avec tous ses champs
- `codesnaf` → libellé du code NAF
- `formesjuridiques` → libellé de la forme juridique

#### `suggest($q, $len)`
Retourne une liste d'autocomplétion sur nom/SIRET/SIREN

---

## Schéma de base de données

```sql
CREATE TABLE IF NOT EXISTS `entreprises` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organisation_id`    BIGINT UNSIGNED NOT NULL UNIQUE,
  `siret`              CHAR(14)        NULL UNIQUE,
  `codenaf_id`         VARCHAR(10)     NULL COMMENT 'FK → codesnaf.codenaf',
  `forme_juridique_id` CHAR(4)         NULL COMMENT 'FK → formesjuridiques.id',
  `capital`            DECIMAL(15,2)   NULL,
  `effectif_min`       INT UNSIGNED    NULL,
  `effectif_max`       INT UNSIGNED    NULL,
  `created_at`         DATETIME        NULL,
  `updated_at`         DATETIME        NULL,
  PRIMARY KEY (`id`),
  KEY `idx_siret`   (`siret`),
  KEY `idx_codenaf` (`codenaf_id`),
  CONSTRAINT `fk_ent_organisation`  FOREIGN KEY (`organisation_id`)    REFERENCES `organisations`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ent_codenaf`       FOREIGN KEY (`codenaf_id`)         REFERENCES `codesnaf`         (`codenaf`) ON DELETE SET NULL,
  CONSTRAINT `fk_ent_fj`            FOREIGN KEY (`forme_juridique_id`) REFERENCES `formesjuridiques` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Entreprises — extension de organisations';
```

---

## Validations

| Champ | Règle | Message |
|-------|-------|----------|
| `organisation_id` | Obligatoire, FK valide | Organisation inexistante |
| `siret` | Unique, CHAR(14) optionnel | SIRET invalide ou déjà utilisé |
| `codenaf_id` | FK valide optionnel | Code NAF inexistant |
| `forme_juridique_id` | FK valide optionnel | Forme juridique inexistante |
| `capital` | Decimal(15,2) optionnel | Capital invalide |
| `effectif_min`, `effectif_max` | INT optionnel | Effectifs invalides |

---

## Relations et dépendances

### Hiérarchie
```
Organisation (parent)
    ↓ 1:1
Entreprise
    ├── Établissements (1:N)
    └── Services (1:N)
```

### Champs transversaux
- **Adresse** : Gérée au niveau Organisation, mais disponible via JOIN
- **Logo/Cover** : Idem organisation
- **SIREN** : Stocké dans organisations (identifiant groupe)
- **SIRET** : Spécifique à entreprises (identifiant siège)

---

## Cas d'usage

1. **Créer une entreprise complète** → `POST /api/entreprise` (crée org + entreprise)
2. **Mettre à jour les deux niveaux** → `PUT /api/entreprise/1` (MAJ org + entreprise)
3. **Rechercher par SIRET** → `GET /api/entreprise?q=12345678901234`
4. **Autocomplétion** → `GET /api/entreprise/like?q=ac&len=5`
5. **Consulter détails complets** → `GET /api/entreprise/1` (org + données métier)
6. **Archiver une entreprise** → `DELETE /api/entreprise/1`

---

## Flux transactionnel (create)

```
POST /api/entreprise
  ├─ Extraction champs organisation
  ├─ Insertion organisations
  ├─ Extraction champs entreprise
  ├─ Insertion entreprises (FK → org créée)
  ├─ Erreur ? → ROLLBACK
  └─ Succès → Retour objet complet
```

---

## Flux transactionnel (update)

```
PUT /api/entreprise/:id
  ├─ Récupération entreprise existante
  ├─ Extraction champs organisation
  ├─ UPDATE organisations
  ├─ Extraction champs entreprise
  ├─ UPDATE entreprises
  ├─ Erreur ? → ROLLBACK
  └─ Succès → Retour objet mis à jour
```

---

## Notes

- **Création atomique** : Une entreprise ne peut pas exister sans organisation
- **Suppression en cascade** : Soft delete sur organisation affecte entreprise
- **Type d'organisation** : Défini à 1 (ENTREPRISE) si non fourni à la création
- **Slug** : Généré automatiquement à partir du nom si absent
- **Champs héritées** : Les informations adresse, logo, contact remontent de l'organisation
