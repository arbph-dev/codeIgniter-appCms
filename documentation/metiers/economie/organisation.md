# Organisations

Table mère pour toutes les formes d'organisations (entreprises, associations, etc.).

---

## Concept

Une **organisation** est une entité collective dotée d'une identité propre, capable d'être titulaire de droits et obligations.

**Types d'organisations** :
- Entreprises (SA, SARL, SAS, EIRL, etc.)
- Associations
- Collectivités publiques
- Organismes de coopération internationale

---

## Hiérarchie : Class Table Inheritance

```
organisations (table mère)
├── entreprises (extension)
├── associations (extension future)
└── collectivites (extension future)
```

**Principe** :
- `organisations` : données universelles à toutes les organisations
- Tables filles : données spécifiques à chaque type

---

## Structure de la table

| Field          | Type            | Null | Key | Default | Description                  |
| -------------- | --------------- | ---- | --- | ------- | ---------------------------- |
| id             | bigint unsigned | NO   | PRI | AUTO    | Clé primaire                 |
| nom            | varchar(255)    | NO   | UNI |         | Nom complet de l'organisation |
| nom_court      | varchar(100)    | YES  |     |         | Abréviation/nom court        |
| type           | varchar(50)     | NO   |     |         | Type (entreprise, association, etc.) |
| description    | text            | YES  |     |         | Description générale         |
| adresse_id     | bigint unsigned | YES  | MUL |         | FK vers adresses (adresse principale) |
| telephone      | varchar(20)     | YES  |     |         | Numéro de téléphone          |
| email          | varchar(255)    | YES  |     |         | Adresse email                |
| site_web       | varchar(255)    | YES  |     |         | Site web                     |
| logo_url       | varchar(255)    | YES  |     |         | URL du logo                  |
| date_creation  | date            | YES  |     |         | Date de création/enregistrement |
| actif          | tinyint(1)      | NO   |     | 1       | État (actif/inactif)         |
| created_at     | datetime        | YES  |     |         | Date de création en BDD      |
| updated_at     | datetime        | YES  |     |         | Date de modification         |

---

## Migration MySQL

```sql
CREATE TABLE `organisations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `nom_court` varchar(100) COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `adresse_id` bigint UNSIGNED,
  `telephone` varchar(20),
  `email` varchar(255),
  `site_web` varchar(255),
  `logo_url` varchar(255),
  `date_creation` date,
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`),
  KEY `idx_type` (`type`),
  KEY `idx_actif` (`actif`),
  KEY `fk_org_adresse` (`adresse_id`),
  CONSTRAINT `fk_org_adresse` FOREIGN KEY (`adresse_id`) REFERENCES `adresses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Base de toutes les organisations';
```

---

## Index

| Key Name     | Type | Colonnes | Unique | Purpose                    |
| ------------ | ---- | -------- | ------ | -------------------------- |
| PRIMARY      | BTREE | id       | ✓      | Clé primaire               |
| nom          | BTREE | nom      | ✓      | Recherche par nom exact    |
| idx_type     | BTREE | type     |        | Filtrer par type           |
| idx_actif    | BTREE | actif    |        | Filtrer par statut         |
| fk_org_adresse | BTREE | adresse_id |      | Recherche par adresse      |

---

## Relations

- **adresses** (N:1) — Adresse principale de l'organisation
- **entreprises** (1:1) — Extension pour les entreprises
- **associations** (1:1) — Extension future pour les associations

---

## Requêtes courantes

### Trouver une organisation par nom
```sql
SELECT * FROM organisations WHERE nom LIKE '%searchterm%';
```

### Lister les organisations actives
```sql
SELECT * FROM organisations WHERE actif = 1 ORDER BY nom;
```

### Compter les entreprises
```sql
SELECT COUNT(*) FROM organisations WHERE type = 'entreprise';
```
