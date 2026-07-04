-- =========================================================
-- MODULE PERSONNE — Migration complète
-- 2026-06 — Akinator / Zealot
-- =========================================================
-- Ordre de création respectant les dépendances FK :
--
--   0. relation_types          (référentiel, pas de FK)
--   1. personnes               (auto-référentielle merge_into_id)
--   2. personne_alias          (→ personnes)
--   3. personne_identifiants   (→ personnes)
--   4. personne_parcours       (→ personnes, organisations, adresses)
--   5. personne_relations      (→ personnes, relation_types)
--   6. personne_distinctions   (→ personnes)
--   7. personne_mandats        (→ personnes, organisations)
--   8. personnages             (autonome)
--   9. personnes_role          (→ personnes, personnages)
--  10. view_personne_timeline  (vue)
--
-- FK vers oeuvres ajoutées en PHASE 2 (table oeuvres à venir) :
--   personne_parcours.oeuvre_id
--   personne_mandats.oeuvre_id
--   personnages.oeuvre_id
--   personnes_role.oeuvre_id
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- =========================================================
-- 0. RELATION_TYPES
-- Référentiel normalisé des types de relations.
-- Couvre Personne→Personne, Personne→Organisation, Org→Org.
-- Relations vers Oeuvre gérées via personne_parcours (narratif).
-- =========================================================

CREATE TABLE IF NOT EXISTS relation_types (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code         VARCHAR(100)    NOT NULL UNIQUE,
    label        VARCHAR(255)    NOT NULL,
    inverse_code VARCHAR(100)    NULL,
    cible_type   ENUM('personne','organisation','mixte') DEFAULT 'mixte',
    description  TEXT            NULL,
    created_at   DATETIME        NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_code       (code),
    INDEX idx_cible_type (cible_type)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Données initiales
INSERT IGNORE INTO relation_types (code, label, inverse_code, cible_type) VALUES
-- ── Famille ───────────────────────────────────────────────────────────────
('parent',            'Parent',             'enfant',           'personne'),
('enfant',            'Enfant',             'parent',           'personne'),
('conjoint',          'Conjoint',           'conjoint',         'personne'),
('frere_soeur',       'Frère / Sœur',       'frere_soeur',      'personne'),
-- ── Institution / Entreprise ──────────────────────────────────────────────
('membre',            'Membre',              NULL,              'organisation'),
('administrateur',    'Administrateur',      NULL,              'organisation'),
('employe',           'Employé',             NULL,              'organisation'),
('dirige',            'Dirige',              NULL,              'organisation'),
('represente_legal',  'Représentant légal',  NULL,              'organisation'),
-- ── Poligraph ─────────────────────────────────────────────────────────────
('elu_de',            'Élu de',              NULL,              'organisation'),
('preside',           'Préside',             NULL,              'organisation'),
('appartient_a',      'Appartient à',        NULL,              'mixte'),
-- ── Organisation → Organisation ───────────────────────────────────────────
('filiale_de',        'Filiale de',          'maison_mere_de',  'organisation'),
('maison_mere_de',    'Maison mère de',      'filiale_de',      'organisation'),
('finance_par',       'Financée par',        'financeur_de',    'organisation'),
('financeur_de',      'Financeur de',        'finance_par',     'organisation'),
('fusion_avec',       'Issue d\'une fusion', NULL,              'organisation');


-- =========================================================
-- 1. PERSONNES
-- Table principale — personnes physiques réelles ou fictives.
-- Personnes morales → table organisations (déjà existante).
-- =========================================================

CREATE TABLE IF NOT EXISTS personnes (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- ── Identité ──────────────────────────────────────────
    nom              VARCHAR(255) NOT NULL,
    prenoms          VARCHAR(255) NOT NULL,
    autres_prenoms   VARCHAR(255) NULL,       -- "Louise" dans "Sarah Louise Connor"
    nom_complet      VARCHAR(255) NOT NULL,   -- calculé : prenoms + nom
    surnom           VARCHAR(255) NULL,       -- "Sirius" pour Beuve-Méry
    nom_naissance    VARCHAR(255) NULL,       -- nom de jeune fille / nom d'origine

    -- ── Genre ─────────────────────────────────────────────
    sexe             ENUM('homme','femme','autre','inconnu') DEFAULT 'inconnu',

    -- ── Naissance ─────────────────────────────────────────
    naissance_date       DATE    NULL,
    naissance_precision  ENUM('annee','mois','jour') DEFAULT 'jour',
    naissance_lieu       VARCHAR(255) NULL,

    -- ── Décès ─────────────────────────────────────────────
    deces_date           DATE    NULL,
    deces_precision      ENUM('annee','mois','jour') DEFAULT 'jour',
    deces_lieu           VARCHAR(255) NULL,

    -- Tri-state : 1=vivant  0=décédé  -1=inconnu
    vivant               TINYINT DEFAULT -1,

    -- ── Identité civile ───────────────────────────────────
    nationalite          VARCHAR(120) NULL,

    -- ── Contenu éditorial ─────────────────────────────────
    bio                  TEXT     NULL,       -- biographie courte (plain text)
    detail               LONGTEXT NULL,       -- biographie longue (HTML)
    slug                 VARCHAR(255) NULL UNIQUE,

    -- ── Qualité / Déduplication ───────────────────────────
    -- partial   : données incomplètes, à enrichir
    -- confirmed : validé par opérateur
    -- merged    : fusionné → voir merge_into_id
    -- duplicate : doublon détecté → voir merge_into_id
    statut_identite      ENUM('confirmed','partial','merged','duplicate') DEFAULT 'partial',
    merge_into_id        BIGINT UNSIGNED NULL,   -- FK vers la personne maître

    confidence_score     TINYINT UNSIGNED NULL,  -- 0-100 calculé automatiquement
    confidence_validated BOOLEAN DEFAULT FALSE,  -- TRUE = validé par opérateur
    verified_at          DATETIME NULL,

    -- ── Traçabilité source ────────────────────────────────
    source               VARCHAR(50)  NULL,      -- inpi / poligraph / omdb / saisie
    source_id            VARCHAR(100) NULL,      -- id dans la source d'origine

    -- ── Timestamps + soft delete ──────────────────────────
    created_at           DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at           DATETIME NULL,

    -- ── Contraintes ───────────────────────────────────────
    CONSTRAINT fk_personne_merge
        FOREIGN KEY (merge_into_id)
        REFERENCES personnes(id)
        ON DELETE SET NULL,

    -- ── Index ─────────────────────────────────────────────
    INDEX idx_nom            (nom),
    INDEX idx_prenoms        (prenoms),
    INDEX idx_nom_complet    (nom_complet),
    INDEX idx_slug           (slug),
    INDEX idx_naissance_date (naissance_date),
    INDEX idx_statut         (statut_identite),
    INDEX idx_source         (source, source_id),
    INDEX idx_deleted        (deleted_at),

    FULLTEXT ft_personne (prenoms, nom, nom_complet, surnom, bio)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 2. PERSONNE_ALIAS
-- Pseudonymes, noms d'usage, translittérations.
-- Ex : Johnny Hallyday / Philippe Smet
--      Voltaire / François-Marie Arouet
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_alias (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    personne_id  BIGINT UNSIGNED NOT NULL,
    alias        VARCHAR(255) NOT NULL,
    type         ENUM(
                   'pseudonyme',
                   'nom_naissance',
                   'nom_usage',
                   'translitteration',
                   'autre'
                 ) DEFAULT 'autre',
    created_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_alias_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    INDEX idx_alias      (alias),
    INDEX idx_alias_type (type)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 3. PERSONNE_IDENTIFIANTS
-- IDs externes stables — extensible sans ALTER TABLE.
-- Une ligne par (personne, source).
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_identifiants (
    personne_id  BIGINT UNSIGNED NOT NULL,
    source       VARCHAR(30)     NOT NULL,
    -- Exemples source : poligraph / wikidata / inpi / omdb / insee / imdb
    valeur       VARCHAR(100)    NOT NULL,
    -- Exemples valeur : PG-000123 / Q12345 / nm0000158

    created_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (personne_id, source),

    CONSTRAINT fk_identifiant_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    INDEX idx_source_valeur (source, valeur)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 4. PERSONNE_PARCOURS
-- Événements temporels du parcours d'une personne.
-- NB : un parcours N'EST PAS une relation — c'est narratif.
-- Couvre : emplois, mandats électifs, formations, œuvres.
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_parcours (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id      BIGINT UNSIGNED NOT NULL,
    organisation_id  BIGINT UNSIGNED NULL,    -- organisation liée si connue
    oeuvre_id        BIGINT UNSIGNED NULL,    -- FK oeuvres — ajoutée en PHASE 2
    adresse_id       BIGINT UNSIGNED NULL,    -- lieu précis si connu

    type             ENUM(
                       'emploi',
                       'mandat',
                       'formation',
                       'benevole',
                       'oeuvre',
                       'autre'
                     ) DEFAULT 'autre',

    titre            VARCHAR(255) NOT NULL,   -- "Grand reporter", "Conseillère CSA"
    resume           TEXT         NULL,
    detail           LONGTEXT     NULL,
    lieu             VARCHAR(255) NULL,       -- lieu textuel libre si pas adresse_id

    date_debut       DATE NULL,
    date_fin         DATE NULL,               -- NULL = en cours

    source           VARCHAR(100) NULL,
    source_id        VARCHAR(255) NULL,

    created_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_parcours_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_parcours_organisation
        FOREIGN KEY (organisation_id)
        REFERENCES organisations(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_parcours_adresse
        FOREIGN KEY (adresse_id)
        REFERENCES adresses(id)
        ON DELETE SET NULL,

    INDEX idx_pp_personne     (personne_id),
    INDEX idx_pp_organisation (organisation_id),
    INDEX idx_pp_dates        (date_debut, date_fin),
    INDEX idx_pp_type         (type),

    FULLTEXT ft_parcours (titre, resume)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 5. PERSONNE_RELATIONS
-- Liens structurels entre entités — famille, réseaux.
-- Polymorphique : cible = personne OU organisation.
-- Liens vers oeuvres → via personne_parcours (type='oeuvre').
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_relations (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id      BIGINT UNSIGNED NOT NULL,
    relation_type_id BIGINT UNSIGNED NOT NULL,

    cible_type       ENUM('personne','organisation') NOT NULL,
    cible_id         BIGINT UNSIGNED NOT NULL,

    -- Arbre familial
    hierarchie       SMALLINT NULL,  -- génération : 0=ego  1=parent  -1=enfant
    ordre            SMALLINT NULL,  -- ordre de naissance dans la fratrie

    titre            VARCHAR(255) NULL,
    resume           TEXT         NULL,

    date_debut       DATE NULL,
    date_fin         DATE NULL,

    source           VARCHAR(100) NULL,
    source_id        VARCHAR(255) NULL,

    created_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_relation_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_relation_type
        FOREIGN KEY (relation_type_id)
        REFERENCES relation_types(id),

    INDEX idx_pr_personne      (personne_id),
    INDEX idx_pr_relation_type (relation_type_id),
    INDEX idx_pr_cible         (cible_type, cible_id),
    INDEX idx_pr_dates         (date_debut, date_fin)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 6. PERSONNE_DISTINCTIONS
-- Prix, décorations, reconnaissances.
-- FK vers distinctions (référentiel à créer séparément).
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_distinctions (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id      BIGINT UNSIGNED NOT NULL,
    distinction_id   BIGINT UNSIGNED NOT NULL,   -- FK ajoutée en PHASE 2

    date_remise      DATE      NULL,
    annee            YEAR      NULL,
    grade            VARCHAR(100) NULL,           -- Commandeur / Officier / Chevalier
    resume           TEXT      NULL,

    source           VARCHAR(100) NULL,
    source_id        VARCHAR(255) NULL,

    created_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pd_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    INDEX idx_pd_personne    (personne_id),
    INDEX idx_pd_distinction (distinction_id),
    INDEX idx_pd_annee       (annee)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 7. PERSONNE_MANDATS
-- Mandats institutionnels formels.
-- Distinct de parcours (narratif) et relations (structurel).
-- Cible principale : Poligraph (élus) et INPI (dirigeants).
-- =========================================================

CREATE TABLE IF NOT EXISTS personne_mandats (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id      BIGINT UNSIGNED NOT NULL,
    organisation_id  BIGINT UNSIGNED NULL,
    oeuvre_id        BIGINT UNSIGNED NULL,       -- FK oeuvres — ajoutée en PHASE 2

    -- Type normalisé — valeurs Poligraph + INPI + extensions
    type             VARCHAR(50)  NOT NULL,
    -- Ex Poligraph : DEPUTE / SENATEUR / MAIRE / MINISTRE / PRESIDENT_REGION...
    -- Ex INPI      : PRESIDENT / DIRECTEUR_GENERAL / GERANT...
    -- Ex Oeuvre    : REALISATEUR / AUTEUR / ACTEUR / COMPOSITEUR...

    role             VARCHAR(100) NULL,           -- libellé libre complémentaire
    circonscription  VARCHAR(255) NULL,           -- département / région / commune

    date_debut       DATE    NULL,
    date_fin         DATE    NULL,               -- NULL = mandat en cours
    actif            BOOLEAN DEFAULT FALSE,

    source           VARCHAR(50)  NULL,           -- poligraph / inpi / saisie
    source_id        VARCHAR(100) NULL,           -- MA-000456

    created_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_mandat_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_mandat_organisation
        FOREIGN KEY (organisation_id)
        REFERENCES organisations(id)
        ON DELETE SET NULL,

    INDEX idx_pm_personne      (personne_id),
    INDEX idx_pm_organisation  (organisation_id),
    INDEX idx_pm_type          (type),
    INDEX idx_pm_dates         (date_debut, date_fin),
    INDEX idx_pm_actif         (actif),
    INDEX idx_pm_source        (source, source_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 8. PERSONNAGES
-- Personnages fictifs (Sarah Connor, Sherlock Holmes...).
-- Distincts des personnes physiques réelles.
-- oeuvre_id → oeuvre d'origine (FK ajoutée en PHASE 2).
-- =========================================================

CREATE TABLE IF NOT EXISTS personnages (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nom          VARCHAR(255) NOT NULL,
    description  TEXT         NULL,
    oeuvre_id    BIGINT UNSIGNED NULL,           -- FK oeuvres — ajoutée en PHASE 2

    created_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_personnage_nom (nom)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 9. PERSONNES_ROLE
-- Pivot Personne ↔ Personnage dans une Oeuvre.
-- Une personne peut incarner un personnage dans plusieurs oeuvres.
-- Ex : Linda Hamilton → Sarah Connor dans Terminator 1 ET 2.
-- oeuvre_id : PK composite — FK ajoutée en PHASE 2.
-- =========================================================

CREATE TABLE IF NOT EXISTS personnes_role (
    personne_id    BIGINT UNSIGNED NOT NULL,
    personnage_id  BIGINT UNSIGNED NOT NULL,
    oeuvre_id      BIGINT UNSIGNED NOT NULL,     -- dans quelle oeuvre spécifique

    PRIMARY KEY (personne_id, personnage_id, oeuvre_id),

    CONSTRAINT fk_role_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_personnage
        FOREIGN KEY (personnage_id)
        REFERENCES personnages(id)
        ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- 10. VIEW PERSONNE TIMELINE
-- Fusionne parcours + mandats + distinctions sur axe temporel.
-- Utilisée pour biographies chronologiques et Poligraph.
-- =========================================================

CREATE OR REPLACE VIEW view_personne_timeline AS

SELECT
    p.id            AS personne_id,
    p.nom_complet,
    'parcours'      AS type_event,
    pp.type         AS sous_type,
    pp.titre        AS label,
    pp.resume,
    pp.date_debut,
    pp.date_fin,
    pp.organisation_id,
    NULL            AS source_id_event,
    pp.source,
    pp.source_id
FROM personnes p
JOIN personne_parcours pp ON pp.personne_id = p.id

UNION ALL

SELECT
    p.id,
    p.nom_complet,
    'mandat'        AS type_event,
    pm.type         AS sous_type,
    COALESCE(pm.role, pm.type) AS label,
    pm.circonscription AS resume,
    pm.date_debut,
    pm.date_fin,
    pm.organisation_id,
    pm.id           AS source_id_event,
    pm.source,
    pm.source_id
FROM personnes p
JOIN personne_mandats pm ON pm.personne_id = p.id

UNION ALL

SELECT
    p.id,
    p.nom_complet,
    'distinction'   AS type_event,
    NULL            AS sous_type,
    pd.resume       AS label,
    NULL            AS resume,
    pd.date_remise  AS date_debut,
    NULL            AS date_fin,
    NULL            AS organisation_id,
    pd.distinction_id AS source_id_event,
    pd.source,
    pd.source_id
FROM personnes p
JOIN personne_distinctions pd ON pd.personne_id = p.id

ORDER BY personne_id, date_debut ASC;


-- =========================================================
-- PHASE 2 — FK vers oeuvres (à exécuter après CREATE TABLE oeuvres)
-- =========================================================
/*
ALTER TABLE personne_parcours
    ADD CONSTRAINT fk_parcours_oeuvre
        FOREIGN KEY (oeuvre_id) REFERENCES oeuvres(id) ON DELETE SET NULL;

ALTER TABLE personne_mandats
    ADD CONSTRAINT fk_mandat_oeuvre
        FOREIGN KEY (oeuvre_id) REFERENCES oeuvres(id) ON DELETE SET NULL;

ALTER TABLE personnages
    ADD CONSTRAINT fk_personnage_oeuvre
        FOREIGN KEY (oeuvre_id) REFERENCES oeuvres(id) ON DELETE SET NULL;

ALTER TABLE personnes_role
    ADD CONSTRAINT fk_role_oeuvre
        FOREIGN KEY (oeuvre_id) REFERENCES oeuvres(id) ON DELETE CASCADE;
*/


-- =========================================================
-- PHASE 2 — FK vers distinctions (à exécuter après CREATE TABLE distinctions)
-- =========================================================
/*
ALTER TABLE personne_distinctions
    ADD CONSTRAINT fk_pd_distinction
        FOREIGN KEY (distinction_id) REFERENCES distinctions(id) ON DELETE CASCADE;
*/

SET FOREIGN_KEY_CHECKS = 1;
