
-- =========================================================
-- 0. RELATION_TYPES
-- Référentiel normalisé des types de relations.
-- Couvre Personne→Personne, Personne→Organisation, Org→Org.
-- Relations vers Oeuvre gérées via personne_parcours (narratif).
-- =========================================================
```sql
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
```


```sql
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
```



---
Permet de normaliser les relations .
A améliorer pour les personnes (tableau 1)

Vérifier et lister les relations possibles

Relation
├── Personne -> Personne
├── Personne -> Organisation
├── Organisation -> Organisation
├── Organisation -> Entreprise
├── Entreprise -> Établissement

```sql
CREATE TABLE relation_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    inverse_code VARCHAR(100) NULL,
    cible_type ENUM( 'personne','organisation','mixte') DEFAULT 'mixte',
    description TEXT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


```

| code           | label          |
| -------------- | -------------- |
| parent         | Parent         |
| enfant         | Enfant         |
| conjoint       | Conjoint       |
| membre         | Membre         |
| administrateur | Administrateur |
| employe        | Employé        |
| auteur         | Auteur         |
**Nouveaux `relation_types` à ajouter :**

|code|label|inverse|cible_type|
|---|---|---|---|
|filiale_de|Filiale de|maison_mere_de|organisation|
|maison_mere_de|Maison mère de|filiale_de|organisation|
|membre_de|Membre de|—|organisation|
|finance_par|Financée par|financeur_de|organisation|
|financeur_de|Financeur de|finance_par|organisation|
|fusion_avec|Issue d'une fusion avec|—|organisation|



## evolutions

1. Supprimer idx_codeIl est redondant avec le UNIQUE.
code VARCHAR(100) NOT NULL UNIQUE
crée déjà un index.

2. Je remplacerais cible_type
Aujourd'hui : cible_type ENUM( 'personne', 'organisation', 'mixte' )

Je préfère quelque chose de plus explicite et extensible :

source_type ENUM('personne','organisation') NOT NULL,
target_type ENUM('personne','organisation') NOT NULL,

Exemples :

source	target
personne	personne
personne	organisation
organisation	organisation

Tu élimines ainsi la valeur "mixte", qui est un cas particulier.

3. inverse_code
Excellent choix.Cela permet de n'enregistrer qu'un seul sens.

Exemple :parent -> inverse = enfant
ou filiale_de ->inverse = maison_mere_de


5. Dates
Personnellement je laisserais CodeIgniter les gérer.
created_at DATETIME NULL,
updated_at DATETIME NULL,

sans

DEFAULT CURRENT_TIMESTAMP

car tous les modèles CI4 savent remplir ces champs.

Mais ce n'est pas bloquant.

Je proposerais surtout une petite évolution

Ajouter un champ :

symetrique BOOLEAN DEFAULT FALSE

Exemple

relation	symétrique
conjoint	oui
frère_soeur	oui
parent	non
filiale_de	non
partenaire	oui

Cela évite de tester

inverse_code == code

pour savoir si la relation est symétrique.

Version que je verrais
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

Je trouve cette version plus expressive et plus évolutive, tout en restant simple. Elle permettra plus tard d'ajouter un troisième type d'entité (par exemple etablissement) sans remettre en cause la logique générale.



Je passerais directement à la table relations, car elle concrétise toute la logique que nous venons de définir.

Je partirais sur quelque chose comme ceci.

CREATE TABLE relations (

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    relation_type_id BIGINT UNSIGNED NOT NULL,

    source_type ENUM('personne','organisation') NOT NULL,
    source_id BIGINT UNSIGNED NOT NULL,

    target_type ENUM('personne','organisation') NOT NULL,
    target_id BIGINT UNSIGNED NOT NULL,

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
Pourquoi j'aime cette structure

Elle permet immédiatement :

Relation	Source	Cible
Employé	Personne	Organisation
Parent	Personne	Personne
Filiale	Organisation	Organisation
Client	Organisation	Organisation
Fournisseur	Organisation	Organisation
Représentant légal	Personne	Organisation

sans changer le schéma.

Je rajouterais deux champs

Je pense qu'ils seront utiles très vite.

actif BOOLEAN DEFAULT TRUE,
ordre SMALLINT DEFAULT 0,

ordre permettra par exemple :

plusieurs mandats ;
plusieurs administrateurs ;
plusieurs dirigeants.
Une autre réflexion

On a aujourd'hui :

Organisation
    ↓
Etablissement

Mais demain tu auras probablement :

Organisation
    ↓
Etablissement
    ↓
Atelier
    ↓
Ligne
    ↓
Zone

Je ne créerais pas tout de suite ces tables.

En revanche, je réserverais dès maintenant le concept de localisation.

Il réapparaît déjà dans les équipements.

