/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 005
 * Objet          : formules_physiques
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 ******************************************************************************/

DROP TABLE IF EXISTS formules_physiques;

CREATE TABLE formules_physiques
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant technique',

    code VARCHAR(64) NOT NULL
        COMMENT 'Code fonctionnel stable',

    nom VARCHAR(150) NOT NULL
        COMMENT 'Nom de la formule',

    categorie VARCHAR(32) NOT NULL
        COMMENT 'Catégorie fonctionnelle',

    grandeur_physique_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Grandeur physique produite',

    notation VARCHAR(32) NULL
        COMMENT 'Notation scientifique',

    expression VARCHAR(1000) NOT NULL
        COMMENT 'Expression mathématique indépendante du langage',

    version VARCHAR(16) NOT NULL DEFAULT '1.0'
        COMMENT 'Version de la formule',

    etat VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        COMMENT 'BROUILLON, ACTIVE, OBSOLETE, ARCHIVEE',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Ordre de présentation',

    description TEXT NULL
        COMMENT 'Description',

    created_at DATETIME NULL,

    updated_at DATETIME NULL,

    deleted_at DATETIME NULL,

    CONSTRAINT pk_formules_physiques
        PRIMARY KEY (id),

    CONSTRAINT uk_formules_physiques__code
        UNIQUE (code),

    CONSTRAINT fk_formules_physiques__grandeurs
        FOREIGN KEY (grandeur_physique_id)
        REFERENCES grandeurs_physiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des formules physiques';


/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_formules_physiques__categorie
ON formules_physiques(categorie);

CREATE INDEX idx_formules_physiques__grandeur
ON formules_physiques(grandeur_physique_id);

CREATE INDEX idx_formules_physiques__etat
ON formules_physiques(etat);

CREATE INDEX idx_formules_physiques__ordre
ON formules_physiques(ordre_affichage);
