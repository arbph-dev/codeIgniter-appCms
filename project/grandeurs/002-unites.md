
# unités




## table : unites
- id
- dimension_id
- code
- nom
- symbole
- facteur
- offset
- est_reference
- ordre_affichage
- description
- created_at
- updated_at
- deleted_at

### note 
- symbole a faire évoluer vers VARCHAR(32)
- champ **code** comme pour les dimensions , a faire évoluer vers VARCHAR(64)


- champ **est_reference** indique  quelle unité est la référence. Une seule unité de référence doit exister par dimension.
Vérification réalisé dans le service métier ou une procédure d'administration
|Dimension|Unité|Référence|
|---|---|---|
|Longueur|mm|non|
|Longueur|cm|non|
|Longueur|m|oui|
|Longueur|km|non|

- éviter FLOAT ou DOUBLE, DECIMAL conserve une précision déterministe, ce qui est préférable pour des calculs techniques et des conversions répétées.

- champ : **ordre_affichage** (SMALLINT UNSIGNED)
on affiche très souvent les unités dans des listes déroulantes ce champ permet d emettre le sunités prtiques ou légales en avant. 

- ajouter plus tard une table de préférences d'affichage.
unites_preferences
- id
- dimension_id
- contexte
- unite_id

un champ systeme dans unites

|Valeur|Exemple|
|---|---|
|SI|m, kg, K, Pa|
|TECHNIQUE|mm, bar, kWh|
|IMPERIAL|inch, ft, psi, °F|
|US|gallon, BTU|

- amélioration
  ajouter precision_affichage TINYINT UNSIGNED

|unité|précision|
|---|---|
|mm|0|
|m|3|
|°C|1|
|bar|2|
|kWh|2|



## Migration


```sql
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
```


### Index
- PK(id)
- FK(dimension_id)
- INDEX(symbole)
- UNIQUE(dimension_id,symbole)

note : UNIQUE(dimension_id,symbole) est une clef basé sur 2 champs

## Seeder
Prévoir une trentaine d'unités.
```sql
/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Seeder         : 002
 * Objet          : unites
 * Domaine        : Métrologie
 *
 * Description
 * -----------
 * Référentiel initial des unités physiques.
 *
 ******************************************************************************/

INSERT INTO unites
(
    dimension_id,
    code,
    nom,
    symbole,
    facteur,
    offset,
    est_reference,
    ordre_affichage,
    description
)

VALUES

/******************************************************************************
 * LONGUEUR (référence SI : m)
 ******************************************************************************/

(1,'MILLIMETER','Millimètre','mm',0.001,0,0,10,NULL),
(1,'CENTIMETER','Centimètre','cm',0.01,0,0,20,NULL),
(1,'METER','Mètre','m',1,0,1,30,'Unité SI'),
(1,'KILOMETER','Kilomètre','km',1000,0,0,40,NULL),

/******************************************************************************
 * SURFACE (référence SI : m²)
 ******************************************************************************/

(2,'SQUARE_METER','Mètre carré','m²',1,0,1,10,NULL),
(2,'HECTARE','Hectare','ha',10000,0,0,20,NULL),

/******************************************************************************
 * VOLUME (référence SI : m³)
 ******************************************************************************/

(3,'LITER','Litre','L',0.001,0,0,10,NULL),
(3,'CUBIC_METER','Mètre cube','m³',1,0,1,20,NULL),

/******************************************************************************
 * TEMPS
 ******************************************************************************/

(4,'SECOND','Seconde','s',1,0,1,10,'Unité SI'),
(4,'MINUTE','Minute','min',60,0,0,20,NULL),
(4,'HOUR','Heure','h',3600,0,0,30,NULL),

/******************************************************************************
 * MASSE
 ******************************************************************************/

(5,'GRAM','Gramme','g',0.001,0,0,10,NULL),
(5,'KILOGRAM','Kilogramme','kg',1,0,1,20,'Unité SI'),
(5,'TONNE','Tonne','t',1000,0,0,30,NULL),

/******************************************************************************
 * TEMPERATURE
 ******************************************************************************/

(6,'CELSIUS','Degré Celsius','°C',1,273.15,0,10,'Usage technique'),
(6,'KELVIN','Kelvin','K',1,0,1,20,'Unité SI'),

/******************************************************************************
 * COURANT
 ******************************************************************************/

(7,'AMPERE','Ampère','A',1,0,1,10,'Unité SI'),
(7,'MILLIAMPERE','Milliampère','mA',0.001,0,0,20,NULL),

/******************************************************************************
 * TENSION
 ******************************************************************************/

(8,'MILLIVOLT','Millivolt','mV',0.001,0,0,10,NULL),
(8,'VOLT','Volt','V',1,0,1,20,'Unité SI'),
(8,'KILOVOLT','Kilovolt','kV',1000,0,0,30,NULL),

/******************************************************************************
 * PUISSANCE
 ******************************************************************************/

(9,'WATT','Watt','W',1,0,1,10,'Unité SI'),
(9,'KILOWATT','Kilowatt','kW',1000,0,0,20,NULL),
(9,'MEGAWATT','Mégawatt','MW',1000000,0,0,30,NULL),

/******************************************************************************
 * ENERGIE
 ******************************************************************************/

(10,'JOULE','Joule','J',1,0,1,10,'Unité SI'),
(10,'KILOJOULE','Kilojoule','kJ',1000,0,0,20,NULL),
(10,'WATT_HOUR','Wattheure','Wh',3600,0,0,30,NULL),
(10,'KILOWATT_HOUR','Kilowattheure','kWh',3600000,0,0,40,NULL),

/******************************************************************************
 * PRESSION
 ******************************************************************************/

(11,'PASCAL','Pascal','Pa',1,0,1,10,'Unité SI'),
(11,'KILOPASCAL','Kilopascal','kPa',1000,0,0,20,NULL),
(11,'BAR','Bar','bar',100000,0,0,30,'Usage industriel'),

/******************************************************************************
 * DEBIT
 ******************************************************************************/

(12,'CUBIC_METER_PER_SECOND','Mètre cube par seconde','m³/s',1,0,1,10,NULL),
(12,'CUBIC_METER_PER_HOUR','Mètre cube par heure','m³/h',0.000277777778,0,0,20,NULL),
(12,'LITER_PER_MINUTE','Litre par minute','L/min',0.000016666667,0,0,30,NULL);

```
### Longueur
- mm
- cm
- m
- km
### Température
- °C
- K
### Pression
- Pa
- kPa
- bar
### Puissance
- W
- kW
- MW
### Énergie
- Wh
- kWh
- J
- MJ
### Débit
- m³/s
- m³/h
- L/s
- L/min
