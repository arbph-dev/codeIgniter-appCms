/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 002
 * Objet          : unites
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Référentiel des unités physiques.
 *
 * Cette table décrit toutes les unités manipulées par le CMS.
 * Une unité appartient obligatoirement à une dimension physique.
 *
 * Les conversions simples utilisent la formule :
 *
 *      valeur_reference = valeur × facteur + offset
 *
 * où :
 *      facteur : coefficient multiplicateur vers l'unité de référence
 *      offset  : décalage éventuel (ex. °C → K)
 *
 * Une seule unité par dimension peut être marquée comme unité de référence.
 * Cette règle est contrôlée par les services métier.
 *
 * ----------------------------------------------------------------------------
 * Dépendances
 * ----------------------------------------------------------------------------
 *
 * 001_dimensions.sql
 *
 * ----------------------------------------------------------------------------
 * Documentation
 * ----------------------------------------------------------------------------
 *
 * Dépôt GitHub
 * arbph-dev/codeIgniter-appCms
 *
 * Documentation
 * docs/database/002_unites.md
 *
 * ----------------------------------------------------------------------------
 * Rollback
 * ----------------------------------------------------------------------------
 *
 * DROP TABLE IF EXISTS unites;
 *
 ******************************************************************************/

DROP TABLE IF EXISTS unites;

CREATE TABLE unites
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant unique',

    dimension_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Dimension physique',

    code VARCHAR(64) NOT NULL COMMENT 'Code fonctionnel revisé 32-64 char',
    nom VARCHAR(100) NOT NULL COMMENT 'Nom complet',
    symbole VARCHAR(32) NOT NULL COMMENT 'Symbole scientifique révisé 20-32',

    facteur DECIMAL(30,15) NOT NULL DEFAULT 1.000000000000000
        COMMENT 'Coefficient vers l''unité de référence',

    offset DECIMAL(30,15) NOT NULL DEFAULT 0.000000000000000
        COMMENT 'Décalage éventuel',

    est_reference TINYINT(1) NOT NULL DEFAULT 0
        COMMENT '1 = unité de référence de la dimension',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Ordre de présentation',

    description TEXT NULL
        COMMENT 'Description libre',

    created_at DATETIME NULL,

    updated_at DATETIME NULL,

    deleted_at DATETIME NULL,

    CONSTRAINT pk_unites
        PRIMARY KEY (id),

    CONSTRAINT uk_unites__code
        UNIQUE (code),

    CONSTRAINT uk_unites__dimension_symbole
        UNIQUE (dimension_id, symbole),

    CONSTRAINT fk_unites__dimensions
        FOREIGN KEY (dimension_id)
        REFERENCES dimensions(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci
COMMENT = 'Référentiel des unités physiques';


/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_unites__dimension
    ON unites(dimension_id);

CREATE INDEX idx_unites__symbole
    ON unites(symbole);

CREATE INDEX idx_unites__ordre
    ON unites(ordre_affichage);

CREATE INDEX idx_unites__reference
    ON unites(est_reference);
