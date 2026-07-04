
`personne_relations` est polymorphique, elle gère déjà `cible_type ENUM('personne','organisation')`
Donc une personne → organisation est déjà prévu.
### backend
#### Model 
app/Models/PersonneRelationModel.php
#### Vue
sans 
#### Controller
#### Route


Le meilleur modèle est un modèle polymorphique :
Famille
relation_type = parent
relation_type = enfant
relation_type = conjoint
Réseaux

| Cas                | cible_type   | cible_id        |
| ------------------ | ------------ | --------------- |
| conjoint           | personne     | personne.id     |
| enfant             | personne     | personne.id     |
| membre de          | organisation | organisation.id |
| administratrice de | organisation | organisation.id |
### Gestion de la famille

|personne|type|cible|
|---|---|---|
|Mémona|conjoint|Lutz Krusche|
|Mémona|enfant|enfant_1|
|enfant_1|parent|Mémona|
on peut reconstruire :
arbre familial,fratrie,conjoints,enfants,parents.

Pour gérer les générations.ajouter :hierarchie SMALLINT NULL,ordre SMALLINT NULL



---
    source VARCHAR(100) NULL,
    source_id VARCHAR(255) NULL,

```sql
-- =========================================================
-- PERSONNE RELATIONS
-- =========================================================

CREATE TABLE personne_relations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    personne_id BIGINT UNSIGNED NOT NULL,
    relation_type_id BIGINT UNSIGNED NOT NULL,
    cible_type ENUM( 'personne', 'organisation') NOT NULL,
    cible_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NULL,
    resume TEXT NULL,
    date_debut DATE NULL,
    date_fin DATE NULL,
    source VARCHAR(100) NULL,
    source_id VARCHAR(255) NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,

    CONSTRAINT fk_relation_personne
        FOREIGN KEY (personne_id)
        REFERENCES personnes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_relation_type
        FOREIGN KEY (relation_type_id)
        REFERENCES relation_types(id),

    INDEX idx_personne (personne_id),
    INDEX idx_relation_type (relation_type_id),

    INDEX idx_cible (cible_type, cible_id),

    INDEX idx_dates (date_debut, date_fin)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;




```