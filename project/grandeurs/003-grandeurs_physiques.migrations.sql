/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 003
 * Objet          : grandeurs_physiques
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Référentiel des grandeurs physiques manipulées par le CMS.
 *
 * Une grandeur physique représente une propriété mesurable :
 *
 *      - Longueur
 *      - Température
 *      - Pression
 *      - Débit
 *      - Puissance
 *      - Énergie
 *
 * Elle appartient à une dimension physique et possède une unité par défaut.
 *
 * Cette table ne décrit pas les caractéristiques des équipements mais
 * uniquement le référentiel métrologique.
 *
 * ----------------------------------------------------------------------------
 * Dépendances
 * ----------------------------------------------------------------------------
 *
 * 001_dimensions.sql
 * 002_unites.sql
 *
 * ----------------------------------------------------------------------------
 * Documentation
 * ----------------------------------------------------------------------------
 *
 * Dépôt GitHub
 * arbph-dev/codeIgniter-appCms
 *
 * Documentation
 * docs/database/003_grandeurs_physiques.md
 *
 * ----------------------------------------------------------------------------
 * Rollback
 * ----------------------------------------------------------------------------
 *
 * DROP TABLE IF EXISTS grandeurs_physiques;
 *
 ******************************************************************************/

DROP TABLE IF EXISTS grandeurs_physiques;

CREATE TABLE grandeurs_physiques
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant unique',

    dimension_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Dimension physique',

    code VARCHAR(64) NOT NULL
        COMMENT 'Code fonctionnel stable',

    nom VARCHAR(100) NOT NULL
        COMMENT 'Nom de la grandeur',
 
    notation VARCHAR(32) NULL COMMENT 'Notation scientifique',

    est_calculable TINYINT(1) NOT NULL DEFAULT 1
        COMMENT '1 = peut être produite par une formule',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Ordre de présentation',

    description TEXT NULL
        COMMENT 'Description',

    created_at DATETIME NULL,

    updated_at DATETIME NULL,

    deleted_at DATETIME NULL,

    CONSTRAINT pk_grandeurs_physiques
        PRIMARY KEY (id),

    CONSTRAINT uk_grandeurs_physiques__code
        UNIQUE (code),

    CONSTRAINT uk_grandeurs_physiques__nom
        UNIQUE (nom),

    CONSTRAINT fk_grandeurs_physiques__dimensions
        FOREIGN KEY (dimension_id)
        REFERENCES dimensions(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci
COMMENT = 'Référentiel des grandeurs physiques';


/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_grandeurs_physiques__dimension
ON grandeurs_physiques(dimension_id);

CREATE INDEX idx_grandeurs_physiques__ordre
ON grandeurs_physiques(ordre_affichage);

CREATE INDEX idx_grandeurs_physiques__calculable
ON grandeurs_physiques(est_calculable);
