/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 004
 * Objet          : constantes
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Référentiel des constantes utilisées par le moteur de calcul.
 *
 * Cette table contient les constantes physiques, thermiques, électriques,
 * hydrauliques ou mathématiques nécessaires aux formules.
 *
 * Les constantes sont indépendantes des objets métier.
 *
 * ----------------------------------------------------------------------------
 * Dépendances
 * ----------------------------------------------------------------------------
 *
 * 003_grandeurs_physiques.sql
 * 002_unites.sql
 *
 ******************************************************************************/

DROP TABLE IF EXISTS constantes;

CREATE TABLE constantes
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant technique',

    code VARCHAR(64) NOT NULL
        COMMENT 'Code fonctionnel stable',

    nom VARCHAR(100) NOT NULL
        COMMENT 'Nom de la constante',

    categorie VARCHAR(32) NOT NULL
        COMMENT 'Catégorie fonctionnelle',

    grandeur_physique_id BIGINT UNSIGNED NULL
        COMMENT 'Grandeur physique associée',

    unite_id BIGINT UNSIGNED NULL
        COMMENT 'Unité de référence',

    notation VARCHAR(32) NOT NULL
        COMMENT 'Notation scientifique',

    valeur DECIMAL(30,15) NOT NULL
        COMMENT 'Valeur numérique',

    description TEXT NULL
        COMMENT 'Description',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Ordre de présentation',

    created_at DATETIME NULL,

    updated_at DATETIME NULL,

    deleted_at DATETIME NULL,

    CONSTRAINT pk_constantes
        PRIMARY KEY (id),

    CONSTRAINT uk_constantes__code
        UNIQUE (code),

    CONSTRAINT uk_constantes__notation
        UNIQUE (notation),

    CONSTRAINT fk_constantes__grandeurs
        FOREIGN KEY (grandeur_physique_id)
        REFERENCES grandeurs_physiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_constantes__unites
        FOREIGN KEY (unite_id)
        REFERENCES unites(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des constantes';


/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_constantes__categorie
ON constantes_physiques(categorie);

CREATE INDEX idx_constantes__grandeur
ON constantes(grandeur_physique_id);

CREATE INDEX idx_constantes__unite
ON constantes(unite_id);

CREATE INDEX idx_constantes_physiques__ordre
ON constantes_physiques(ordre_affichage);
