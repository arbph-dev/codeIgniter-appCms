# Organisation

## Vue d'ensemble

Une **Organisation** est l'entité mère du module Entreprise. Elle représente toute structure (entreprise, association, établissement scolaire, etc.).

- Chaque organisation possède un type (`organisation_types`)
- Elle peut avoir une adresse, un logo, une couverture
- Elle supporte SIREN/RNA pour les structures légales
- Les informations de contact et de présence digitale sont centralisées

## Routes API

```
GET    /api/organisation                    Liste des organisations (paginée, filtrable)
GET    /api/organisation/like               Autocomplétion par nom
GET    /api/organisation/:id                Détail d'une organisation
POST   /api/organisation                    Créer une organisation
PUT    /api/organisation/:id                Mettre à jour une organisation
DELETE /api/organisation/:id                Supprimer une organisation (soft delete)
```

## Contrôleur

**Classe :** `App\Controllers\Api\Organisation`  
**Namespace :** `App\Controllers\Api`  
**Trait :** `ApiResponse` (gestion des réponses JSON)

### Méthodes

#### `index()` – GET /api/organisation

**Paramètres de requête :**
- `q` (string, optionnel) – Recherche par nom ou SIREN
- `type` (int, optionnel) – Filtre par type d'organisation
- `page` (int, défaut: 1) – Numéro de page
- `per_page` (int, défaut: 20, max: 100) – Éléments par page

**Réponse :**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "nom": "Entreprise ACME",
      "slug": "entreprise-acme",
      "organisation_type_id": 1,
      "siren": "123456789",
      "site_web": "https://acme.fr",
      "email": "contact@acme.fr",
      "telephone": "01 23 45 67 89",
      "adresse_id": 5,
      "logo_id": 12,
      "cover_id": 13,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "pager": { "currentPage": 1, "perPage": 20, "total": 150 }
}
```

#### `show($id)` – GET /api/organisation/:id

**Paramètres :**
- `id` (int) – ID de l'organisation

**Réponse :** Détail complet d'une organisation avec relations

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "nom": "Entreprise ACME",
    "slug": "entreprise-acme",
    "organisation_type_id": 1,
    "type": { "id": 1, "code": "ENTREPRISE", "label": "Entreprise" },
    "description": "Leader du secteur innovation",
    "detail": "Détails complets...",
    "site_web": "https://acme.fr",
    "urlreg": "https://annuaire.fr/acme",
    "email": "contact@acme.fr",
    "telephone": "01 23 45 67 89",
    "lien_facebook": "https://facebook.com/acme",
    "lien_instagram": "https://instagram.com/acme",
    "lien_linkedin": "https://linkedin.com/company/acme",
    "siren": "123456789",
    "rna": null,
    "date_creation": "2010-05-20",
    "date_dissolution": null,
    "adresse": { "id": 5, "rue": "123 Rue de Paris", "codepostal": "75001", "ville": "Paris" },
    "logo": { "id": 12, "nom": "logo.png", "chemin": "/uploads/images/12.png" },
    "cover": { "id": 13, "nom": "cover.jpg", "chemin": "/uploads/images/13.jpg" },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

#### `create()` – POST /api/organisation

**Body JSON :**
```json
{
  "nom": "Nouvelle Entreprise",
  "slug": "nouvelle-entreprise",
  "organisation_type_id": 1,
  "description": "Description courte",
  "detail": "Description longue avec détails",
  "site_web": "https://example.fr",
  "urlreg": "https://annuaire.fr/example",
  "email": "contact@example.fr",
  "telephone": "01 23 45 67 89",
  "lien_facebook": "https://facebook.com/example",
  "lien_instagram": "https://instagram.com/example",
  "lien_linkedin": "https://linkedin.com/company/example",
  "adresse_id": 5,
  "logo_id": 12,
  "cover_id": 13,
  "siren": "123456789",
  "rna": null,
  "date_creation": "2010-05-20"
}
```

**Réponse :** `201 Created` + Objet créé avec relations

#### `update($id)` – PUT /api/organisation/:id

**Body JSON :** Même structure que `create()`, tous les champs optionnels

**Réponse :** `200 OK` + Objet mis à jour

#### `delete($id)` – DELETE /api/organisation/:id

**Type :** Soft delete (marque `deleted_at`)

**Réponse :** `200 OK` avec message de confirmation

#### `like()` – GET /api/organisation/like

**Paramètres :**
- `q` (string) – Recherche (min. 2 caractères)
- `len` (int, défaut: 10, max: 50) – Nombre de résultats

**Réponse :**
```json
{
  "status": 200,
  "data": [
    { "id": 1, "nom": "Entreprise ACME" },
    { "id": 2, "nom": "Entreprise Dupont" }
  ]
}
```

---

## Modèle

**Classe :** `App\Models\OrganisationModel`

### Propriétés principales
- `table` – `organisations`
- `primaryKey` – `id`
- `allowedFields` – Champs modifiables via l'API
- `useTimestamps` – `true` (gère `created_at`, `updated_at`)
- `useSoftDeletes` – `true` (gère `deleted_at`)

### Méthodes clés

#### `withRelations()`
Charge les relations avec les tables associées :
- `organisation_types` → type
- `adresses` → adresse
- `images` (pour logo et cover)

#### `makeSlug($nom)`
Génère automatiquement un slug à partir du nom si absent

#### `suggest($q, $len)`
Retourne une liste d'autocomplétion

---

## Schéma de base de données

```sql
CREATE TABLE IF NOT EXISTS `organisations` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`                  VARCHAR(255)    NOT NULL,
  `slug`                 VARCHAR(255)    NULL UNIQUE,
  `organisation_type_id` BIGINT UNSIGNED NULL,
  `description`          TEXT            NULL,
  `detail`               LONGTEXT        NULL,
  `site_web`             VARCHAR(255)    NULL,
  `urlreg`               VARCHAR(255)    NULL COMMENT 'Lien annuaire institutionnel',
  `email`                VARCHAR(255)    NULL,
  `telephone`            VARCHAR(50)     NULL,
  `lien_facebook`        VARCHAR(255)    NULL,
  `lien_instagram`       VARCHAR(255)    NULL,
  `lien_linkedin`        VARCHAR(255)    NULL,
  `adresse_id`           INT UNSIGNED    NULL COMMENT 'FK → adresses.id',
  `logo_id`              INT UNSIGNED    NULL COMMENT 'FK → images.id',
  `cover_id`             INT UNSIGNED    NULL COMMENT 'FK → images.id',
  `siren`                CHAR(9)         NULL,
  `rna`                  VARCHAR(20)     NULL,
  `date_creation`        DATE            NULL,
  `date_dissolution`     DATE            NULL,
  `created_at`           DATETIME        NULL,
  `updated_at`           DATETIME        NULL,
  `deleted_at`           DATETIME        NULL,
  PRIMARY KEY (`id`),
  KEY `idx_nom`   (`nom`(100)),
  KEY `idx_slug`  (`slug`),
  KEY `idx_siren` (`siren`),
  KEY `idx_type`  (`organisation_type_id`),
  CONSTRAINT `fk_org_type`    FOREIGN KEY (`organisation_type_id`) REFERENCES `organisation_types` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_org_adresse` FOREIGN KEY (`adresse_id`)           REFERENCES `adresses`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_org_logo`    FOREIGN KEY (`logo_id`)              REFERENCES `images`              (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_org_cover`   FOREIGN KEY (`cover_id`)             REFERENCES `images`              (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Table mère — entreprises, associations, établissements…';
```

---

## Validations

| Champ | Règle | Message |
|-------|-------|---------|
| `nom` | Obligatoire, max 255 | Le nom est requis |
| `slug` | Unique, max 255 | Slug déjà utilisé |
| `organisation_type_id` | FK valide | Type inexistant |
| `siren` | Format CHAR(9) optionnel | SIREN invalide |
| `email` | Format email optionnel | Email invalide |

---

## Cas d'usage

1. **Liste et recherche** → `GET /api/organisation?q=acme&page=1`
2. **Autocomplétion** → `GET /api/organisation/like?q=ac&len=5`
3. **Créer une organisation** → `POST /api/organisation`
4. **Modifier les infos** → `PUT /api/organisation/1`
5. **Supprimer (archivage)** → `DELETE /api/organisation/1`

---

## Notes

- Le slug est généré automatiquement si non fourni
- La suppression est un soft delete pour conserver l'historique
- Les relations (adresse, logo, cover) sont optionnelles
- Le type d'organisation est optionnel mais recommandé
