# Workflows 
## création pour le domaine Organisation

### Préalables & Points clés
- Aspect	Règle
  - Relation 1-1	1 organisation ↔ 0..1 entreprise (organisation_id UNIQUE)
  - SIREN	Porté par organisations.siren
  - SIRET	Uniquement sur etablissements (colonne propre)
  - Siège	is_siege = 1 garantit un seul siège par organisation
  - NIC	Dérivé du SIRET (derniers 5 chiffres)
  - Cohérence	SIRET = SIREN (9 premiers chiffres) + NIC (5 derniers chiffres)

### Résumé : Matrice de décision
Scénario	Route	Logique	Service
1. Org=❌ / Ent=❌ / Adr=❌	POST /api/entreprise	Créer org + ent	createWithOrganisation()
2. Org=✅ / Ent=❌ / Adr=❌	POST /org/:id/entreprise	Attacher ent	attachToOrganisation()
3. Org=❌ / Ent=❌ / Etab=❌	N/A (non recommandé)	—	—
4. Org=✅ / Ent=❌ / Etab=❌	POST /org/:id/entreprise	Créer ent + siège	attachToOrganisation() + ensureSiege()
5. Org=✅ / Ent=✅ / Etab=❌	POST /api/etablissement	Créer étab sec.	Model insert
6. Org=❌ / Ent=❌ / Adr=✅	POST /api/entreprise	Créer org+ent+adr	createWithOrganisation()
7. Org=✅ / Ent=❌ / Adr=✅	POST /org/:id/entreprise	Attacher ent+adr	attachToOrganisation()
8. Org=❌ / Ent=❌ / Etab=❌ / Adr=✅	N/A (non recommandé)	—	—
9. Org=✅ / Ent=❌ / Etab=❌ / Adr=✅	POST /org/:id/entreprise	Créer ent + siège + adr	attachToOrganisation() + ensureSiege()
10. Org=✅ / Ent=✅ / Siège / Adr=✅	POST /org/:id/etablissement	Upsert siège + adr	ensureSiege()
Votre code implémente déjà la plupart de ces workflows. Les cas problématiques (3, 8) nécessitent une organisation existante — la logique métier est cohérente.

### WORKFLOWS SANS ADRESSE

#### 1. Ajouter une entreprise sans organisation existante (pas d'adresse)
Endpoint : POST /api/entreprise

```json
{
  "nom": "Acme Corp",
  "organisation_type_id": 1,
  "siren": "123456789",
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS"
}
```
Processus (dans EntrepriseService::createWithOrganisation) :

✅ Créer la organisation (sans adresse_id)
✅ Créer l'entreprise rattachée
⏭️ Pas d'établissement (SIRET absent)
Réponse (201 Created) :

```json
{
  "id": 1,
  "organisation_id": 1,
  "nom": "Acme Corp",
  "siren": "123456789",
  "siege": null,
  "...": "autres champs"
}
```

#### 2. Ajouter une entreprise avec organisation existante (pas d'adresse)
Endpoint : POST /api/organisation/{id}/entreprise

```json
{
  "siren": "123456789",
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS",
  "capital": 50000
}
```
Processus (dans EntrepriseService::attachToOrganisation) :

✅ Vérifier que l'organisation existe → exception si non trouvée
✅ Vérifier qu'aucune entreprise n'y est déjà rattachée → exception si existe
✅ Enrichir l'organisation (optionnel : siren, etc.)
✅ Créer l'entreprise
⏭️ Pas d'établissement (SIRET absent)
Réponse (201 Created) : Idem scénario 1

#### 3. Ajouter un établissement sans entreprise existante + sans organisation existante (pas d'adresse)
Endpoint : POST /api/etablissement

```json
{
  "organisation_id": null,
  "siret": "12345678901234",
  "nom": "Succursale Marseille",
  "is_siege": 0
}
```
⚠️ Problème identifié : L'EtablissementModel requiert organisation_id (NOT NULL). → Solution recommandée :

Passer par l'API Entreprise (scénarios 1 ou 2) pour créer d'abord l'org+entreprise
Puis créer les établissements secondaires via POST /api/etablissement
Cas non recommandé : Les établissements ne doivent jamais exister sans entreprise.

#### 4. Ajouter un établissement sans entreprise existante + avec organisation existante (pas d'adresse)
Endpoint : POST /api/entreprise (créer d'abord l'entreprise)

```json
{
  "organisation_id": 42,
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS",
  "siret": "12345678901234"
}
```
Processus :

✅ attachToOrganisation(42, {...}) crée l'entreprise
✅ ensureSiege() crée l'etablissement avec is_siege = 1
Réponse (201) : Entreprise + siège

#### 5. Ajouter un établissement avec entreprise existante + avec organisation existante (pas d'adresse)
Endpoint : POST /api/etablissement

```json
{
  "organisation_id": 42,
  "siret": "12345678901235",
  "nom": "Succursale Paris",
  "is_siege": 0
}
```
Processus :

✅ Insérer directement l'etablissement (validation : organisation_id existe)
✅ NIC auto-dérivé du SIRET
Réponse (201) : Établissement secondaire créé

### WORKFLOWS AVEC ADRESSE
#### 6. Ajouter une entreprise sans organisation existante (avec adresse)
Endpoint : POST /api/entreprise

```json
{
  "nom": "Acme Corp",
  "organisation_type_id": 1,
  "siren": "123456789",
  "adresse_id": 10,
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS"
}
```
Processus (dans EntrepriseService::createWithOrganisation) :

✅ Créer la organisation (avec adresse_id)
✅ Créer l'entreprise rattachée
⏭️ Pas d'établissement (SIRET absent)
Réponse (201) :

```json
{
  "id": 1,
  "organisation_id": 1,
  "nom": "Acme Corp",
  "siren": "123456789",
  "adresse_id": 10,
  "ligne4": "123 Rue de Paris, 75001 PARIS",
  "siege": null
}
```
#### 7. Ajouter une entreprise avec organisation existante (avec adresse)
Endpoint : POST /api/organisation/{id}/entreprise

```json
{
  "siren": "123456789",
  "adresse_id": 10,
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS"
}
```
Processus :

✅ Vérifier l'organisation existante
✅ Optionnel : enrichir l'organisation (notamment adresse_id)
✅ Créer l'entreprise
Réponse (201) : Idem scénario 6

#### 8. Ajouter un établissement sans entreprise existante + sans organisation existante (avec adresse)
⚠️ Idem scénario 3 : Non recommandé. Passer par l'API Entreprise d'abord.

#### 9. Ajouter un établissement sans entreprise existante + avec organisation existante (avec adresse)
Endpoint : POST /api/organisation/{id}/entreprise

```json
{
  "codenaf_id": "6202A",
  "forme_juridique_id": "SAS",
  "siret": "12345678901234",
  "adresse_id": 10
}
```
Processus :

✅ attachToOrganisation() crée l'entreprise
✅ ensureSiege() crée l'etablissement avec adresse_id
Réponse (201) :

```json
{
  "id": 1,
  "organisation_id": 42,
  "siret": "12345678901234",
  "adresse_id": 10,
  "ligne4": "123 Rue de Paris, 75001 PARIS",
  "siege": {
    "id": 100,
    "siret": "12345678901234",
    "is_siege": 1,
    "adresse_id": 10
  }
}
```
#### 10. Ajouter un établissement avec entreprise existante + avec organisation existante (avec adresse)
Endpoint : POST /api/organisation/{id}/etablissement (spécifique siège)

```json
{
  "siret": "12345678901234",
  "adresse_id": 10,
  "nom": "Siège social"
}
```
Processus (dans EntrepriseService::ensureSiege) :

✅ Désactiver les autres sièges (is_siege = 0)
✅ Créer/mettre à jour le siège (upsert sur SIRET)
✅ Vérifier cohérence SIRET/SIREN
✅ Relier l'adresse
Réponse (201) : Siège créé/mis à jour avec ligne4 enrichie


---

# Audit du module "entreprise"

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
