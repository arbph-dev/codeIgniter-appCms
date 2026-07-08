/******************************************************************************
 *
 * ARBPH-CMS
 * =============================================================================
 *
 * Migration      : 001
 * Objet          : dimensions
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * -----------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------
 *
 * Création du référentiel des dimensions physiques utilisées par le CMS.
 *
 * Une dimension représente une famille de grandeurs compatibles
 * (Longueur, Temps, Température, Masse, etc.).
 *
 * -----------------------------------------------------------------------------
 * Dépendances
 * -----------------------------------------------------------------------------
 *
 * Aucune.
 *
 * -----------------------------------------------------------------------------
 * Documentation
 * -----------------------------------------------------------------------------
 *
 * Dépôt GitHub
 * arbph-dev/codeIgniter-appCms
 *
 * Documentation
 * docs/database/001_dimensions.md
 *
 * -----------------------------------------------------------------------------
 * Auteur
 * -----------------------------------------------------------------------------
 *
 * Auteur      : Arnaud
 * Création    : 2026-07-06
 *
 * -----------------------------------------------------------------------------
 * Rollback
 * -----------------------------------------------------------------------------
 *
 * DROP TABLE IF EXISTS dimensions;
 *
 ******************************************************************************/

DROP TABLE IF EXISTS dimensions;

CREATE TABLE dimensions
(
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant unique',

    code            VARCHAR(32) NOT NULL
        COMMENT 'Code fonctionnel stable',

    nom             VARCHAR(100) NOT NULL
        COMMENT 'Nom affiché',

    symbole         VARCHAR(10) NOT NULL
        COMMENT 'Notation scientifique',

    description     TEXT NULL
        COMMENT 'Description libre',

    created_at      DATETIME NULL,

    updated_at      DATETIME NULL,

    deleted_at      DATETIME NULL,

    CONSTRAINT pk_dimensions
        PRIMARY KEY (id),

    CONSTRAINT uk_dimensions__code
        UNIQUE (code),

    CONSTRAINT uk_dimensions__nom
        UNIQUE (nom),

    CONSTRAINT uk_dimensions__symbole
        UNIQUE (symbole)

)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci
COMMENT = 'Référentiel des dimensions physiques';
