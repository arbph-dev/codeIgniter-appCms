# relation_types
Référentiel normalisé des types de relations.

Couvre
    Personne    →    Personne
    Personne    →    Organisation
    Org         →    Org.



```sql
CREATE TABLE relation_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    inverse_code VARCHAR(100) NULL,
    source_type ENUM('personne','organisation') NOT NULL,
    target_type ENUM('personne','organisation') NOT NULL,
    symetrique BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    INDEX idx_source(source_type),
    INDEX idx_target(target_type)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
```

```
INSERT IGNORE INTO relation_types (code, label, inverse_code, source_type , target_type , symetrique , description ) VALUES
-- ── Famille ───────────────────────────────────────────────────────────────
('parent'        ,'Parent'      ,'enfant'    ,'personne'    ,'personne'    , false   , 'relation personne à personne  : famille / parent'),
('conjoint'      ,'Conjoint'    ,'conjoint'  ,'personne'    ,'personne'    , true    , 'relation personne à personne  : famille / conjoint'),
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
```

|code|label|inverse|cible_type|
|---|---|---|---|
|filiale_de|Filiale de|maison_mere_de|organisation|
|maison_mere_de|Maison mère de|filiale_de|organisation|
|membre_de|Membre de|—|organisation|
|finance_par|Financée par|financeur_de|organisation|
|financeur_de|Financeur de|finance_par|organisation|
|fusion_avec|Issue d'une fusion avec|—|organisation|



## notes

explicite et extensible : elle permettra d'ajouter un troisième type d'entité (par exemple etablissement) sans remettre en cause la logique générale.
source_type ENUM('personne','organisation') NOT NULL,
target_type ENUM('personne','organisation') NOT NULL,
Exemples :
source	target
personne	personne
personne	organisation
organisation	organisation

3. inverse_code permet de n'enregistrer qu'un seul sens.
Exemple :parent -> inverse = enfant ou filiale_de ->inverse = maison_mere_de

5. Dates
CodeIgniter les gérera donc sans DEFAULT CURRENT_TIMESTAMP.
created_at DATETIME NULL,
updated_at DATETIME NULL,

un champ symetrique BOOLEAN DEFAULT FALSE
Cela évite de tester inverse_code == code pour savoir si la relation est symétrique.
Exemple
relation	symétrique
conjoint	oui
frère_soeur	oui
parent	non
filiale_de	non
partenaire	oui




# relations
elle concrétise toute la logique que nous venons de définir.

```sql
CREATE TABLE relations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    relation_type_id BIGINT UNSIGNED NOT NULL,
    source_type ENUM('personne','organisation') NOT NULL,
    source_id BIGINT UNSIGNED NOT NULL,
    target_type ENUM('personne','organisation') NOT NULL,
    target_id BIGINT UNSIGNED NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    ordre SMALLINT DEFAULT 0,
    date_debut DATE NULL,
    date_fin DATE NULL,
    commentaire TEXT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,

    CONSTRAINT fk_relation_type
        FOREIGN KEY (relation_type_id)
        REFERENCES relation_types(id),

    INDEX idx_source (source_type, source_id),
    INDEX idx_target (target_type, target_id),
    INDEX idx_relation (relation_type_id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
```

cette structure permet
Relation	Source	Cible
Employé	Personne	Organisation
Parent	Personne	Personne
Filiale	Organisation	Organisation
Client	Organisation	Organisation
Fournisseur	Organisation	Organisation
Représentant légal	Personne	Organisation

ordre permettra par exemple :
plusieurs mandats ;
plusieurs administrateurs ;
plusieurs dirigeants.
Une autre réflexion















