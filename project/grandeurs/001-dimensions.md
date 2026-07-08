# Migration 001 - dimensions

## Objectif
Cette table décrit les dimensions physiques fondamentales. Elle ne contient aucune information de conversion ni de métier.

Une dimension représente une famille d'unités compatibles.

Amélioration
- ajouter un champ **code**
il n'est pas destiné à être affiché mais à servir d'identifiant fonctionnel dans le code, les seeders, les exports et les API. il évite de dépendre de libellés localisables et facilite les évolutions futures (internationalisation, API, import/export, règles métier). C'est le genre de bonne pratique que nous avons commencé à généraliser dans le CMS.
---

dimensions
- id
- nom
- code
- symbole
- description
- created_at
- updated_at
- deleted_at


Exemple :

|code|nom|symbole|
|---|---|---|
|LENGTH|Longueur|L|
|AREA|Surface|S|
|VOLUME|Volume|V|
|TIME|Temps|T|
|MASS|Masse|M|
|TEMPERATURE|Température|Θ|
|VOLTAGE|Tension électrique|U|
|CURRENT|Courant électrique|I|
|POWER|Puissance|P|
|ENERGY|Énergie|E|
|PRESSURE|Pression|Pr|
|FLOW|Débit|Q|



## Migration SQL
```sql
/***************************************************************************
 * TABLE : dimensions
 *
 * Référentiel des dimensions physiques.
 * Une dimension représente une famille d'unités compatibles
 * (Longueur, Temps, Masse, Température, etc.).
 ***************************************************************************/

CREATE TABLE dimensions
(
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    code            VARCHAR(32)  NOT NULL,
    nom             VARCHAR(100) NOT NULL,
    symbole         VARCHAR(10)  NOT NULL,
    description     TEXT NULL,

    created_at      DATETIME NULL,
    updated_at      DATETIME NULL,
    deleted_at      DATETIME NULL,

    CONSTRAINT pk_dimensions
        PRIMARY KEY (id),

    CONSTRAINT uk_dimensions_code
        UNIQUE (code),

    CONSTRAINT uk_dimensions_nom
        UNIQUE (nom),

    CONSTRAINT uk_dimensions_symbole
        UNIQUE (symbole)

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des dimensions physiques';
```

## Seeder SQL
```sql
INSERT INTO dimensions
(code, nom, symbole, description)
VALUES
('LENGTH',      'Longueur',             'L',  'Dimension des longueurs'),
('AREA',        'Surface',              'S',  'Dimension des surfaces'),
('VOLUME',      'Volume',               'V',  'Dimension des volumes'),
('TIME',        'Temps',                'T',  'Dimension temporelle'),
('MASS',        'Masse',                'M',  'Dimension des masses'),
('TEMPERATURE', 'Température',          'Θ',  'Dimension thermique'),
('CURRENT',     'Courant électrique',   'I',  'Intensité électrique'),
('VOLTAGE',     'Tension électrique',   'U',  'Différence de potentiel'),
('POWER',       'Puissance',            'P',  'Puissance'),
('ENERGY',      'Énergie',              'E',  'Énergie'),
('PRESSURE',    'Pression',             'Pr', 'Pression'),
('FLOW',        'Débit',                'Q',  'Débit volumique ou massique');
```
