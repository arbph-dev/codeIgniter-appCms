
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
