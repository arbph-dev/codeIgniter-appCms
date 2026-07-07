*Résumé exécutif :** Nous proposons trois nouvelles migrations pour compléter le schéma existant (tables _dimensions_, _unites_, _grandeurs_physiques_, _constantes_, _formules_physiques_). L’objectif est d’introduire :

- **formules_physiques_entrees** (migration 006) : lie chaque variable d’une formule à sa grandeur physique, avec des règles de saisie (obligatoire, valeur par défaut…).
- **unites_preferences** (migration 007) : définit, pour chaque dimension physique et chaque contexte (SI, technique, etc.), l’unité d’affichage préférée.
- **caracteristiques** et **objet_caracteristiques** (migration 008) : catalogue les caractéristiques génériques (ex. « Pression nominale » → grandeur Pression) et associe des valeurs d’objet (équipement) à ces caractéristiques.

Ces tables sont normalisées (une entité métier = une table) et extensibles pour les évolutions futures (ajout de nouvelles variables, contextes d’unité ou types d’équipement). Nous détaillons ci-dessous les DDL (CREATE TABLE), les seeders minimaux, la justification architecturale et métier, ainsi que des exemples de données et les impacts sur le moteur de calcul. Les choix s’alignent sur les principes précédents (M-019 : les seeders ne réfèrent qu’aux données déjà présentes) et sur les bonnes pratiques de modélisation.

sql

Copier

```sql
/******************************************************************************
 * Migration 006 : formules_physiques_entrees
 * Dépendances : formules_physiques, grandeurs_physiques, unites
 ******************************************************************************/
DROP TABLE IF EXISTS formules_physiques_entrees;
CREATE TABLE formules_physiques_entrees
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant',
    formule_physique_id BIGINT UNSIGNED NOT NULL COMMENT 'Référence à formules_physiques',
    code VARCHAR(10) NOT NULL COMMENT 'Notation de la variable (ex. U, I, Q)',
    nom VARCHAR(100) NOT NULL COMMENT 'Libellé métier de la variable',
    grandeur_physique_id BIGINT UNSIGNED NOT NULL COMMENT 'Grandeur physique associée',
    unite_attendue_id BIGINT UNSIGNED NULL COMMENT 'Unité par défaut (facultative)',
    est_obligatoire TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = obligatoire, 0 = optionnel',
    valeur_defaut DECIMAL(30,15) NULL COMMENT 'Valeur par défaut si non fournie',
    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100 COMMENT 'Ordre d\'affichage',
    description TEXT NULL COMMENT 'Description de la variable',
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_formule_entrees__code (formule_physique_id, code),
    CONSTRAINT fk_formule_entrees__formule
      FOREIGN KEY (formule_physique_id)
      REFERENCES formules_physiques(id)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_formule_entrees__grandeur
      FOREIGN KEY (grandeur_physique_id)
      REFERENCES grandeurs_physiques(id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_formule_entrees__unite
      FOREIGN KEY (unite_attendue_id)
      REFERENCES unites(id)
      ON UPDATE CASCADE ON DELETE SET NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Variables (entrées) de chaque formule physique';
CREATE INDEX idx_formule_entrees__formule    ON formules_physiques_entrees(formule_physique_id);
CREATE INDEX idx_formule_entrees__grandeur   ON formules_physiques_entrees(grandeur_physique_id);
CREATE INDEX idx_formule_entrees__obligatoire ON formules_physiques_entrees(est_obligatoire);
```

**Seeder 006 (exemple minimal) :** nous insérons les variables des formules déjà définies. On suppose les formules **ELECTRICAL_POWER**, **THERMAL_POWER**, **CIRCLE_AREA**, **CYLINDER_VOLUME** existantes. Les unités de référence (ex. VOLT, AMPERE, METRE…) sont choisies parmi celles de la table _unites_.

sql

Copier

```sql
/******************************************************************************
 * Variables pour P = U × I
 ******************************************************************************/
INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'U', 'Tension électrique', gp.id, u.id, 1, NULL, 10, 'Tension d\'entrée'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='VOLTAGE'
JOIN unites u ON u.code='VOLT'
WHERE fp.code='ELECTRICAL_POWER';

INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'I', 'Courant', gp.id, u.id, 1, NULL, 20, 'Courant d\'entrée'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='CURRENT'
JOIN unites u ON u.code='AMPERE'
WHERE fp.code='ELECTRICAL_POWER';

/******************************************************************************
 * Variables pour P = Q × Cp × ΔT
 ******************************************************************************/
INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'Q', 'Débit du fluide', gp.id, NULL, 1, NULL, 10, 'Débit volumique'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='FLOW'
WHERE fp.code='THERMAL_POWER';

INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'DT', 'Différence de température', gp.id, u.id, 1, NULL, 20, 'ΔT = T1 - T2'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='TEMPERATURE'
JOIN unites u ON u.code='KELVIN'
WHERE fp.code='THERMAL_POWER';

/******************************************************************************
 * Variables pour S = π × R²
 ******************************************************************************/
INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'R', 'Rayon', gp.id, u.id, 1, NULL, 10, 'Rayon du cercle'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='LENGTH'
JOIN unites u ON u.code='METRE'
WHERE fp.code='CIRCLE_AREA';

/******************************************************************************
 * Variables pour V = π × R² × H
 ******************************************************************************/
INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'R', 'Rayon', gp.id, u.id, 1, NULL, 10, 'Rayon du cylindre'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='LENGTH'
JOIN unites u ON u.code='METRE'
WHERE fp.code='CYLINDER_VOLUME';

INSERT INTO formules_physiques_entrees
(formule_physique_id, code, nom, grandeur_physique_id, unite_attendue_id, est_obligatoire, valeur_defaut, ordre_affichage, description)
SELECT 
    fp.id, 'H', 'Hauteur', gp.id, u.id, 1, NULL, 20, 'Hauteur du cylindre'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code='LENGTH'
JOIN unites u ON u.code='METRE'
WHERE fp.code='CYLINDER_VOLUME';
```

**Justification architecturale (formules_physiques_entrees) :** Cette table explicite la correspondance _notation → grandeur physique_ pour chaque variable d’une formule. Elle assure la cohérence dimensionnelle : on lie une variable à une grandeur connue (p.ex. U→Tension, I→Intensité) et à une unité par défaut. Selon les principes de la modélisation relationnelle, une colonne ne doit contenir qu’un seul type logique de données : ici chaque colonne est clairement typée (code notation, grandeur_id, valeur numérique). Les contraintes FK garantissent la validité (la grandeur existe). Les champs _est_obligatoire_ et _valeur_defaut_ cadrent les règles métier : seules les variables requises doivent être fournies (sinon on peut utiliser la valeur par défaut). À terme, on peut ajouter des champs (précision, multiplicateur de conversion, etc.) sans changer le schéma.

**Règles métier / Validation :**

- **Obligatoire** : _est_obligatoire=1_ indique qu’une variable doit être fournie pour évaluer la formule.
- **Unité attendue** : _unite_attendue_id_ propose l’unité de référence (ex. kW pour la puissance), mais le moteur convertit toujours dans l’unité canonique SI interne.
- **Valeur par défaut** : si _est_obligatoire=0_, _valeur_defaut_ donne la valeur utilisée par défaut.
- **Conversion** : toute valeur saisie est convertie en unité de base (SI) pour le calcul. Le champ _grandeur_physique_id_ permet cette conversion car il fixe la dimension physique (p.ex. toutes les longueurs sont converties en mètres).
- **Unicité** : pour une formule donnée, chaque _code_ de variable est unique (_UK_ sur formule+code).

**Exemples de données :** (formules_physiques_entrees)

|id|Formule|Code|Nom|Grandeur|Unité attendue|Obligatoire|Défaut|Description|
|---|---|---|---|---|---|---|---|---|
|1|ELECTRICAL_POWER|U|Tension électrique|Tension (V)|V (Volt)|Oui|–|Tension d'entrée|
|2|ELECTRICAL_POWER|I|Courant|Intensité (A)|A (Ampère)|Oui|–|Courant d'entrée|
|3|THERMAL_POWER|Q|Débit du fluide|Débit (m³/s)|–|Oui|–|Débit volumique|
|4|THERMAL_POWER|DT|Diff. de température|Température (K)|K (Kelvin)|Oui|–|ΔT = T1 – T2|
|5|CIRCLE_AREA|R|Rayon|Longueur (m)|m (Mètre)|Oui|–|Rayon du cercle|
|6|CYLINDER_VOLUME|R|Rayon|Longueur (m)|m (Mètre)|Oui|–|Rayon du cylindre|
|7|CYLINDER_VOLUME|H|Hauteur|Longueur (m)|m (Mètre)|Oui|–|Hauteur du cylindre|

**Impacts sur le moteur de calcul :**

- Lors de l’évaluation, le moteur lit _formules_physiques_entrees_ pour connaître les variables nécessaires et leur dimension (p.ex. U→Tension). Il récupère ensuite les valeurs (souvent via la table _objet_caracteristiques_ ou saisie utilisateur) pour ces grandeurs.
- Les valeurs reçues sont converties dans l’unité de base (SI) avant le calcul. Puis l’expression (colonne _expression_ de _formules_physiques_) est évaluée en remplaçant chaque code (U, I, etc.) par sa valeur numérique. Les constantes (π, g, etc.) sont gérées à part par la table _constantes_.
- Si des variables sont manquantes mais non obligatoires, on utilise _valeur_defaut_.
- L’architecture permet de valider dimensionnellement l’expression : on peut vérifier que la combinaison de grandeurs en entrée est cohérente avec la grandeur de résultat (voir conversion des unités).
- Cette table sera utilisée lors du parsing de l’expression : chaque code est mappé à sa grandeur/constante, selon la logique métier.

sql

Copier

```sql
/******************************************************************************
 * Migration 007 : unites_preferences
 * Dépendances : dimensions, unites
 ******************************************************************************/
DROP TABLE IF EXISTS unites_preferences;
CREATE TABLE unites_preferences
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant',
    dimension_id BIGINT UNSIGNED NOT NULL COMMENT 'Référence à dimensions (physique de base)',
    contexte VARCHAR(20) NOT NULL COMMENT 'Contexte d\'affichage (ex. SI, TECHNIQUE, UTILISATEUR)',
    unite_id BIGINT UNSIGNED NOT NULL COMMENT 'Unité choisie pour ce contexte',
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_unites_pref__dim_ctx (dimension_id, contexte),
    CONSTRAINT fk_unites_pref__dimensions
      FOREIGN KEY (dimension_id)
      REFERENCES dimensions(id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_unites_pref__unites
      FOREIGN KEY (unite_id)
      REFERENCES unites(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Préférence d\'unité par dimension physique et contexte';
CREATE INDEX idx_unites_pref__dimension ON unites_preferences(dimension_id);
```

**Seeder 007 (exemple minimal) :** Nous préenregistrons quelques préférences pour le système SI et un contexte technique. On utilise le champ _dimension_id_ pour grouper les grandeurs (par exemple, LENGTH couvre toutes les distances). Les codes de dimensions (LENGTH, MASS, TEMPERATURE, etc.) et d’unités (METRE, KILOGRAM, KELVIN…) sont présumés présents.

sql

Copier

```sql
INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'SI', u.id
FROM dimensions d 
JOIN unites u ON u.code='METRE' 
WHERE d.code='LENGTH';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'TECHNIQUE', u.id
FROM dimensions d 
JOIN unites u ON u.code='MILLIMETER' 
WHERE d.code='LENGTH';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'SI', u.id
FROM dimensions d 
JOIN unites u ON u.code='KILOGRAM' 
WHERE d.code='MASS';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'TECHNIQUE', u.id
FROM dimensions d 
JOIN unites u ON u.code='GRAM' 
WHERE d.code='MASS';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'SI', u.id
FROM dimensions d 
JOIN unites u ON u.code='KELVIN' 
WHERE d.code='TEMPERATURE';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'TECHNIQUE', u.id
FROM dimensions d 
JOIN unites u ON u.code='DEGREE_CELSIUS' 
WHERE d.code='TEMPERATURE';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'SI', u.id
FROM dimensions d 
JOIN unites u ON u.code='PASCAL' 
WHERE d.code='PRESSURE';

INSERT INTO unites_preferences (dimension_id, contexte, unite_id)
SELECT d.id, 'TECHNIQUE', u.id
FROM dimensions d 
JOIN unites u ON u.code='BAR' 
WHERE d.code='PRESSURE';
```

**Justification architecturale (unites_preferences) :** Cette table fait le lien _Dimension → Unité_ pour différents contextes (SI, technique, utilisateur, etc.). Elle repose sur la table _dimensions_ afin d’appliquer la préférence à toutes les grandeurs physiques d’une même famille. On privilégie le système international (SI), qui est « le système de mesure le plus utilisé au monde » (par exemple, le mètre est l’unité SI de base pour la longueur). Le champ _contexte_ permet d’ajouter facilement d’autres modes (profil client, affichage technique, etc.) sans modifier le schéma. L’unicité sur _(dimension_id, contexte)_ empêche les doublons. Cette approche est évolutive : on pourra ultérieurement ajouter un champ utilisateur ou module pour personnaliser ces préférences.

**Règles métier / Validation :**

- **Dimension non nulle** : la préférence s’applique à un type physique (dimension_id).
- **Contexte** : code court (ex. 'SI', 'TECHNIQUE', 'UTILISATEUR').
- **Unité compatible** : l’unité choisie doit appartenir à la dimension (contrôlé en amont ou par la jointure FK).
- **Unicité** : une dimension ne peut avoir qu’une préférence par contexte (_UK_ sur dimension_id+contexte).
- **Conversion des résultats** : en sortie de calcul, on convertira toujours la valeur SI vers l’unité _préférée_ (ex. de mètre vers millimètre si contexte « Technique »).

**Exemples de données :** (unites_preferences)

|id|Contexte|Dimension|Unité préférée|
|---|---|---|---|
|1|SI|LENGTH (Longueur)|METRE (m)|
|2|TECHNIQUE|LENGTH (Longueur)|MILLIMETER (mm)|
|3|SI|MASS (Masse)|KILOGRAM (kg)|
|4|TECHNIQUE|MASS (Masse)|GRAM (g)|
|5|SI|TEMPERATURE (Température)|KELVIN (K)|
|6|TECHNIQUE|TEMPERATURE|DEGREE_CELSIUS (°C)|
|7|SI|PRESSURE (Pression)|PASCAL (Pa)|
|8|TECHNIQUE|PRESSURE|BAR|

**Impacts sur le moteur de calcul :**

- Après avoir obtenu un résultat en unité SI, l’application consultera _unites_preferences_ pour convertir ce résultat dans l’unité d’affichage selon le contexte (utilisateur, client, outil technique). Cela permet d’adapter la sortie (par ex. afficher la longueur en millimètres ou mètres suivant le cas).
- Lors de la saisie de valeurs, le système peut aussi utiliser ces préférences pour présélectionner l’unité sur le formulaire (même si la conversion initiale se fait toujours vers l’unité canonique du calcul).
- Les conversions utilisent les facteurs de la table _unites_, en s’appuyant sur la dimension partagée. L’approche est cohérente avec l’idée de stocker en base SI puis convertir à la volée.
- L’architecture permet d’introduire facilement de nouveaux contextes ou de gérer ultérieurement des préférences spécifiques par utilisateur (ajout d’une colonne user_id).

sql

Copier

```sql
/******************************************************************************
 * Migration 008 : caracteristiques
 * Dépendances : grandeurs_physiques
 ******************************************************************************/
DROP TABLE IF EXISTS caracteristiques;
CREATE TABLE caracteristiques
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant',
    code VARCHAR(64) NOT NULL COMMENT 'Code fonctionnel unique',
    nom VARCHAR(150) NOT NULL COMMENT 'Nom de la caractéristique',
    grandeur_physique_id BIGINT UNSIGNED NOT NULL COMMENT 'Grandeur physique associée',
    description TEXT NULL COMMENT 'Description',
    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100 COMMENT 'Ordre de présentation',
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_caracteristiques__code (code),
    CONSTRAINT fk_caracteristiques__grandeur
      FOREIGN KEY (grandeur_physique_id)
      REFERENCES grandeurs_physiques(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catalogue des caractéristiques métier (sans valeur)';

/******************************************************************************
 * Migration 009 : objet_caracteristiques
 * Dépendances : caracteristiques, unites
 ******************************************************************************/
DROP TABLE IF EXISTS objet_caracteristiques;
CREATE TABLE objet_caracteristiques
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identifiant',
    objet_type VARCHAR(64) NOT NULL COMMENT 'Type d\'objet (classe métier)',
    objet_id BIGINT UNSIGNED NOT NULL COMMENT 'Référence à l\'objet',
    caracteristique_id BIGINT UNSIGNED NOT NULL COMMENT 'Référence à caracteristiques',
    valeur DECIMAL(30,15) NOT NULL COMMENT 'Valeur mesurée',
    unite_id BIGINT UNSIGNED NOT NULL COMMENT 'Unité de la valeur',
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_objet_caract__unique (objet_type, objet_id, caracteristique_id),
    CONSTRAINT fk_objet_caract__caracteristique
      FOREIGN KEY (caracteristique_id)
      REFERENCES caracteristiques(id)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_objet_caract__unite
      FOREIGN KEY (unite_id)
      REFERENCES unites(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Valeurs concrètes de caractéristiques pour des objets métier';
CREATE INDEX idx_objet_caract__objet ON objet_caracteristiques(objet_type, objet_id);
```

**Seeder 008 (exemple minimal) :** On crée quelques caractéristiques génériques, puis des valeurs pour des objets fictifs. Les _objet_type_ peuvent être arbitraires (ex. nom de table ou classe métier). Les unités choisies doivent être compatibles avec la _grandeur_physique_ de la caractéristique.

sql

Copier

```sql
/******************************************************************************
 * Caractéristiques génériques
 ******************************************************************************/
INSERT INTO caracteristiques (code, nom, grandeur_physique_id, description, ordre_affichage)
VALUES 
('PRESS_NOM', 'Pression nominale', (SELECT id FROM grandeurs_physiques WHERE code='PRESSURE'), 'Pression nominale de fonctionnement', 10),
('POWER_NOM', 'Puissance nominale', (SELECT id FROM grandeurs_physiques WHERE code='POWER'), 'Puissance absorbée nominale', 20),
('DIAMETRE', 'Diamètre', (SELECT id FROM grandeurs_physiques WHERE code='LENGTH'), 'Diamètre extérieur', 30),
('TEMPERATURE_MAX', 'Température max', (SELECT id FROM grandeurs_physiques WHERE code='TEMPERATURE'), 'Température maximale admissible', 40),
('FLOW_NOM', 'Débit nominal', (SELECT id FROM grandeurs_physiques WHERE code='FLOW'), 'Débit nominal', 50);

/******************************************************************************
 * Valeurs pour des objets
 ******************************************************************************/
INSERT INTO objet_caracteristiques (objet_type, objet_id, caracteristique_id, valeur, unite_id)
VALUES
('Pompe', 1, (SELECT id FROM caracteristiques WHERE code='PRESS_NOM'), 2.5, (SELECT id FROM unites WHERE code='BAR')),
('Pompe', 1, (SELECT id FROM caracteristiques WHERE code='POWER_NOM'), 3.0, (SELECT id FROM unites WHERE code='KILOWATT')),
('Pompe', 1, (SELECT id FROM caracteristiques WHERE code='FLOW_NOM'), 10.0, (SELECT id FROM unites WHERE code='CUBIC_METER_PER_HOUR')),
('Chauffage', 1, (SELECT id FROM caracteristiques WHERE code='POWER_NOM'), 15.0, (SELECT id FROM unites WHERE code='KILOWATT')),
('Reservoir', 1, (SELECT id FROM caracteristiques WHERE code='DIAMETRE'), 1.2, (SELECT id FROM unites WHERE code='METRE'));
```

**Justification architecturale (caractéristiques & objet_caractéristiques) :** La table `caracteristiques` définit les concepts métier (attributs mesurables) de façon générique, en les liant à une grandeur physique. Cette normalisation évite la redondance (p.ex. plusieurs équipements partagent « Pression nominale »). Le lien FK vers _grandeurs_physiques_ impose la cohérence dimensionnelle (une caractéristique “Pression nominale” doit bien avoir pour grandeur la pression). La table `objet_caracteristiques` instancie ces caractéristiques pour chaque objet métier (équipement, machine, etc.) via (_objet_type_, _objet_id_). C’est une table de jointure n-m entre objets et caractéristiques avec la valeur correspondante (et son unité). La contrainte UNIQUE sur (type,id,caractéristique) garantit qu’une même caractéristique n’est pas doublonnée pour un même objet. Les unités des valeurs sont stockées séparément pour conserver le type de donnée uniforme dans la colonne _valeur_ (on pourra toujours convertir la valeur en SI pour les calculs). En somme, ce modèle est stable : de nouvelles caractéristiques ou équipements peuvent être ajoutés sans changer la structure.

**Règles métier / Validation :**

- **Caractéristique** : chaque caractéristique a un _code_ unique et une grandeur physique fixe (_grandeur_physique_id_).
- **Objet** : _objet_type_ et _objet_id_ réfèrent de façon générique à un enregistrement métier. En l’absence de table objet spécifique, cette clé composite est laissée libre.
- **Valeur et unité** : la _valeur_ (DECIMAL) avec son _unite_id_ correspond à la grandeur de la caractéristique. On s’assure en pratique que l’unité appartient à la même dimension que _grandeur_physique_id_.
- **Unicité** : on ne peut associer qu’une valeur d’une caractéristique à un objet (_UK_ sur objet_type+objet_id+caractéristique_id).
- **Intégrité référentielle** : suppression en cascade si la caractéristique est effacée.

**Exemples de données :**

- _caracteristiques_ :

|id|Code|Nom|Grandeur|Description|
|---|---|---|---|---|
|1|PRESS_NOM|Pression nominale|Pression (Pa)|Pression nominale de service|
|2|POWER_NOM|Puissance nominale|Puissance (W)|Puissance absorbée nominale|
|3|DIAMETRE|Diamètre|Longueur (m)|Diamètre extérieur|
|4|TEMPERATURE_MAX|Température max|Température (K)|Température maximale admissible|
|5|FLOW_NOM|Débit nominal|Débit (m³/s)|Débit nominal|

- _objet_caracteristiques_ :

|id|Objet|Caractéristique|Valeur|Unité|
|---|---|---|---|---|
|1|Pompe (ID 1)|Pression nominale|2.5|Bar|
|2|Pompe (ID 1)|Puissance nominale|3.0|kW|
|3|Pompe (ID 1)|Débit nominal|10.0|m³/h|
|4|Chauffage (ID 1)|Puissance nominale|15.0|kW|
|5|Reservoir (ID 1)|Diamètre|1.2|m|

**Impacts sur le moteur de calcul :**

- Les valeurs des caractéristiques d’un équipement pourront servir d’entrées aux formules. Par exemple, la puissance nominale d’une pompe (stockée dans _objet_caracteristiques_) pourra être référencée comme variable dans une formule d’énergie.
- L’unité de la valeur est connue et stockée, mais le moteur utilisera la conversion si nécessaire (stockage en SI selon l’approche recommandée).
- Cette séparation (table de définition _caracteristiques_ + table de valeurs) simplifie la maintenance : on peut ajouter des caractéristiques sans dupliquer de colonnes, et associer dynamiquement plusieurs caractéristiques à n’importe quelle entité.
- Lors du calcul, on peut facilement chercher les valeurs requises : on identifie l’_objet_type_ et _objet_id_ (par exemple la pompe en question), puis récupérer toutes ses caractéristiques pertinentes.
- L’architecture offre une flexibilité pour les évolutions (ajout d’un préfixe par client, conversions spécifiques, etc.) sans casser les liaisons existantes.

```mermaid
flowchart LR
    A[Sélection de la formule] --> B[Lire variables de la table formules_physiques_entrees]
    B --> C[Récupérer valeurs des variables; caractéristiques ou saisies]
    C --> D[Convertir chaque valeur en unité de base SI]
    D --> E[Évaluer l'expression mathématique ;remplacer constantes et variables]
    E --> F[Résultat en unité de base]
    F --> G[Convertir en unité préférée selon unites_preferences]
    G --> H[Afficher le résultat final]
```

```
flowchart LR
    A[Sélection de la formule] --> B[Lire variables de la table formules_physiques_entrees]
    B --> C[Récupérer valeurs des variables (caractéristiques ou saisies)]
    C --> D[Convertir chaque valeur en unité de base (SI)]
    D --> E[Évaluer l'expression mathématique (remplacer constantes et variables)]
    E --> F[Résultat en unité de base]
    F --> G[Convertir en unité préférée selon unites_preferences]
    G --> H[Afficher le résultat final]
```

**Notes de migration :** Les migrations 006, 007 et 008 doivent être appliquées dans l’ordre indiqué, car chaque table dépend des tables existantes ou des tables créées dans les migrations précédentes. Le seeder associé à chaque migration doit être exécuté immédiatement après celle-ci afin d’insérer les données de référence (toujours en respectant la contrainte M-019).

**Sources :** Les principes de conception cités s’appuient sur la théorie relationnelle (une colonne = un type de donnée unique) et sur les pratiques de gestion d’unités (stocker en unités SI canoniques puis convertir). Le SI (mètre, seconde, kilogramme…) étant la norme mondiale, nous l’utilisons par défaut dans _unites_preferences_. Ces choix architecturaux garantissent un modèle simple, cohérent et évolutif.
