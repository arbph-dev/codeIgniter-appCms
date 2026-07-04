## personne_parcours
### backend
#### Model 
app/Models/PersonneParcoursModel.php

Très important : un parcours n’est PAS une relation.

C’est un évènement temporel.
```sql
CREATE TABLE personne_parcours (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id BIGINT UNSIGNED NOT NULL,

    organisation_id BIGINT UNSIGNED NULL,

    titre VARCHAR(255) NOT NULL,

    resume TEXT NULL,
    detail LONGTEXT NULL,

    date_debut DATE NULL,
    date_fin DATE NULL,

    lieu VARCHAR(255) NULL,

    created_at DATETIME NULL,
    updated_at DATETIME NULL,

    CONSTRAINT fk_parcours_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id),

    CONSTRAINT fk_parcours_organisation
        FOREIGN KEY (organisation_id)
        REFERENCES organisations(id)
);

-- =========================================================
-- PERSONNE PARCOURS
-- =========================================================

CREATE TABLE personne_parcours (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    personne_id BIGINT UNSIGNED NOT NULL,

    organisation_id BIGINT UNSIGNED NULL,

    titre VARCHAR(255) NOT NULL,

    resume TEXT NULL,
    detail LONGTEXT NULL,

    lieu VARCHAR(255) NULL,

    date_debut DATE NULL,
    date_fin DATE NULL,

    source VARCHAR(100) NULL,
    source_id VARCHAR(255) NULL,

    created_at DATETIME NULL,
    updated_at DATETIME NULL,

    CONSTRAINT fk_parcours_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_parcours_organisation
        FOREIGN KEY (organisation_id)
        REFERENCES organisations(id)
        ON DELETE SET NULL,

    INDEX idx_personne (personne_id),
    INDEX idx_organisation (organisation_id),

    INDEX idx_dates (date_debut, date_fin),

    FULLTEXT ft_parcours (
        titre,
        resume
    )
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


```
Exemples :

titre
Grand reporter
Conseillère au CSA
Présentatrice Soir 3
