
Audit du module "entreprise"

Ce document servira de ressource 

Requis module "Adresse"

Evolution 
intégrer INPI et INSEE via CURL

Priorité 
1. Documenter les élements du serveur Code Igniter
- routes
- controleurs
- modèles
- vues
- service
- endpoint api

2. Valider les relations

2.1. Relations entre modèle du meme module
- Organistion et Entreprise
- Entreprise et Etablissement


2.2. Relations entre modèle de modules distincts, existants ou a créer
- Organisation et Adresse, existe
- services (d'entreprise) et Personne (à créer)
  ce sont les points les plus délicats , prévoir un triplet : id, label,datajson pour les devellopements futures (Personne) 

3. Définir les règles et workflows


4. implémenter
Réaliser l'interface si possible directment en API, 
le serveur ne fournit que la strucure (html + css), le javascript gère le reste
On peut recourir aux vues pour valider les dévellopements et illustrer la documentation API




# entreprise et organisation - relations


```
organisation_types
organisations  ──────── organisation_types.id
  ├── logo_id  ────────── images.id
  ├── cover_id ────────── images.id
  └── adresse_id ──────── adresses.id (optionnel sur la mère)

entreprises ────────────── organisations.id  (1-1)
  ├── forme_juridique_id ── formesjuridiques.id
  ├── codenaf_id ─────────── codesnaf.id
  └── (pas d'adresse ici → via etablissements)

etablissements ─────────── entreprises.siren
  └── adresse_id ──────────── adresses.id

personne_organisation ── personnes.id + organisations.id + role
```

## Migrations (MySQL)


```
-- ============================================================
-- MODULE ENTREPRISE — schéma complet (6 tables)
-- Exécuter dans cet ordre (FK)
-- ============================================================

-- ── 1. organisation_types ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `organisation_types` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`        VARCHAR(50)     NOT NULL UNIQUE,
  `label`       VARCHAR(100)    NOT NULL,
  `description` TEXT            NULL,
  `created_at`  DATETIME        NULL,
  `updated_at`  DATETIME        NULL,
  PRIMARY KEY (`id`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. organisations ─────────────────────────────────────────
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
  `logo_id`              INT UNSIGNED    NULL COMMENT 'FK → images.id (picl)',
  `cover_id`             INT UNSIGNED    NULL COMMENT 'FK → images.id (pich)',
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
  COMMENT='Table mère — entreprises, associations, établissements scolaires…';

-- ── 3. entreprises (extension 1-1) ───────────────────────────
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

-- ── 4. etablissements (SIRET) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS `etablissements` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entreprise_id` BIGINT UNSIGNED NOT NULL,
  `siret`         CHAR(14)        NOT NULL UNIQUE,
  `nic`           CHAR(5)         NOT NULL,
  `nom`           VARCHAR(255)    NULL,
  `is_siege`      TINYINT(1)      NOT NULL DEFAULT 0,
  `actif`         TINYINT(1)      NOT NULL DEFAULT 1,
  `adresse_id`    INT UNSIGNED    NULL,
  `created_at`    DATETIME        NULL,
  `updated_at`    DATETIME        NULL,
  PRIMARY KEY (`id`),
  KEY `idx_siret`      (`siret`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_etab_entreprise` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_etab_adresse`    FOREIGN KEY (`adresse_id`)    REFERENCES `adresses`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. service_types ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `service_types` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`        VARCHAR(50)     NOT NULL UNIQUE,
  `label`       VARCHAR(100)    NOT NULL,
  `description` TEXT            NULL,
  `created_at`  DATETIME        NULL,
  `updated_at`  DATETIME        NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 6. services ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `services` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entreprise_id`   BIGINT UNSIGNED NOT NULL,
  `service_type_id` BIGINT UNSIGNED NOT NULL,
  `nom`             VARCHAR(100)    NULL,
  `responsable_id`  BIGINT UNSIGNED NULL COMMENT 'FK → personnes.id (futur)',
  `actif`           TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NULL,
  `updated_at`      DATETIME        NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_svc_entreprise` FOREIGN KEY (`entreprise_id`)   REFERENCES `entreprises`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_svc_type`       FOREIGN KEY (`service_type_id`) REFERENCES `service_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
