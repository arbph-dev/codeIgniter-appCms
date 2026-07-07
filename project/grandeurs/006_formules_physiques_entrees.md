
# 006_formules_physiques_entrees – Note de synthèse

**Version :** 1.0.0 (Projet)  
**Contexte :** Base MySQL 8.x, référentiels existants : _dimensions_, _unites_, _grandeurs_physiques_, _constantes_ (table **constantes**), _formules_physiques_ (table **formules_physiques** créée en migration 005).  
**Dépendances :** 005_formules_physiques, 003_grandeurs_physiques, 002_unites.

## Résumé exécutif

La migration 006 introduit la table **`formules_physiques_entrees`**, destinée à modéliser les **variables d’entrée de chaque formule physique**. Chaque formule (issue de **formules_physiques**) peut avoir plusieurs variables (par exemple, la formule de la puissance électrique _P = U × I_ a deux variables _U_ et _I_). L’objectif est de décrire, pour chaque variable de formule : son code, son nom, sa notation dans l’expression, sa grandeur physique associée, l’unité attendue, son caractère obligatoire et une valeur par défaut éventuelle.

Le schéma retenu suit les principes validés précédemment : chaque table référentielle est indépendante du métier métier, et les conventions de nommage sont cohérentes avec les migrations antérieures. On utilise des clés étrangères (**`formule_id`**, **`grandeur_physique_id`**, **`unite_attendue_id`**) vers les tables pertinentes, avec **ON UPDATE CASCADE, ON DELETE RESTRICT** pour préserver l’intégrité (cf. le conseil : « _my default is: ON DELETE RESTRICT, ON UPDATE CASCADE_»). Des contraintes **UNIQUE** sur (formule_id, variable_code) et (formule_id, notation) empêchent les doublons de variable dans une même formule. Le champ **`valeur_defaut`** utilise le type **DECIMAL(30,15)** (plutôt qu’un texte) pour stocker des valeurs numériques fiables, évitant les données invalides.

Le seeder d’exemples illustre l’insertion de variables pour les formules _Puissance électrique_, _Puissance thermique_ et _Surface de cercle_. Conformément à la règle M-019, chaque donnée référencée (code de formule, code de grandeur, code d’unité) existe déjà dans les référentiels. Par exemple, la formule **ELECTRICAL_POWER** (code de formule) a pour variables _U_ et _I_, respectivement liées aux grandeurs de tension et d’intensité (codes **VOLTAGE**, **CURRENT**) et aux unités _VOLT_, _AMPERE_, qui doivent préexister.

Enfin, on recommande que le moteur applicatif vérifie la cohérence dimensionnelle des unités. Une pratique courante est d’avoir, pour chaque dimension physique, une « unité de base » de référence et de convertir toute unité via cette base. Par exemple, on convertit d’abord l’unité d’entrée en unité de base, puis de l’unité de base vers l’unité cible. Cette approche simplifie les conversions et prévient les incompatibilités d’unités.

---

## 1. Champs de la table

La table **`formules_physiques_entrees`** comporte les colonnes suivantes :

|Champ|Type|Null / Défaut|Contrainte / Clef|Commentaire|Alternatives / Remarques|
|---|---|---|---|---|---|
|**id**|BIGINT UNSIGNED|NOT NULL|PK, AUTO_INCREMENT|Identifiant unique de la variable|Identifiant technique, auto-incrémenté.|
|**formule_id**|BIGINT UNSIGNED|NOT NULL|FK → formules_physiques(id)|Formule associée (clé étrangère)|Relation 1-* : une formule peut avoir plusieurs variables.|
|**variable_code**|VARCHAR(64)|NOT NULL|UNIQUE (formule_id, code)|Code fonctionnel de la variable (par exemple "VOLTAGE", "CURRENT", "RADIUS")|Permet d’identifier stablement la variable dans la base. Optionnellement pourrait fusionner avec _notation_, mais on garde un champ distinct par convention.|
|**nom**|VARCHAR(100)|NOT NULL|–|Nom lisible (ex. "Tension", "Courant", "Rayon du cercle")|Doit être unique par formule ? (non requis).|
|**notation**|VARCHAR(32)|NOT NULL|UNIQUE (formule_id, notation)|Symbole scientifique dans l’expression (ex. 'U', 'I', 'R')|Longeur 32 pour autoriser des notations composées (ex. "cosφ", "ΔT").|
|**grandeur_physique_id**|BIGINT UNSIGNED|NOT NULL|FK → grandeurs_physiques(id)|Identifiant de la grandeur physique (dimension) attendue pour cette variable|Forçable via FK. On _pourrait_ se contenter de l’unité, mais on relie à la table des grandeurs pour cohérence.|
|**unite_attendue_id**|BIGINT UNSIGNED|NULL|FK → unites(id)|Unité par défaut attendue pour la variable|Peut être NULL si la variable est sans dimension (p. ex. facteur pur). Sinon choisir une unité compatible.|
|**obligatoire**|TINYINT(1)|NOT NULL DEFAULT 1|–|1=variable obligatoire, 0=facultative|BOOL clarifié. Si 0, la _valeur_par_défaut_ peut s’appliquer.|
|**valeur_defaut**|DECIMAL(30,15)|NULL|–|Valeur numérique par défaut si variable facultative|Type numérique conseillé pour stocker des valeurs précises (voir [16]). On pourrait envisager TEXT/VARCHAR si on voulait autoriser des expressions, mais DECIMAL évite les données invalides.|
|**description**|TEXT|NULL|–|Description libre de la variable|–|
|**ordre_affichage**|SMALLINT UNSIGNED|NOT NULL DEFAULT 100|–|Ordre de tri pour affichage|Indexable pour tri.|
|**created_at**|DATETIME|NULL|–|Date de création (Timestamp)|Permet gestion des historiques.|
|**updated_at**|DATETIME|NULL|–|Date de dernière modification||
|**deleted_at**|DATETIME|NULL|–|Date de suppression (soft-delete)||

**Choix principaux :**

- _Clés primaires et auto-incrément_ : un champ `id` standard (BIGINT UNSIGNED) est utilisé pour toutes les tables, comme vu précédemment.
- _Contraintes d’unicité_ : on impose `(formule_id, variable_code)` et `(formule_id, notation)` pour éviter qu’une même formule ait deux variables identifiées par le même code ou la même notation. Les codes de variable et notations doivent être uniques par formule.
- _Types et nullabilité_ : `obligatoire` est un booléen stocké en TINYINT(1). `valeur_defaut` est NULLABLE car on n’en a que si _obligatoire=0_. On choisit DECIMAL(30,15) pour la valeur par défaut afin d’assurer la précision numérique et éviter les saisies non numériques.
- _Unités compatibles_ : la colonne `unite_attendue_id` peut être NULL si la grandeur est sans unité (ex. fréquence relative, facteur). Sinon on prévoit l’ID d’une unité du référentiel **unites**. Le moteur applicatif devra vérifier la compatibilité dimensionnelle (voir §3 ci-dessous).
- _Évolution possible_ : on a préféré VARCHAR pour `notation` (au lieu de CHAR(1)) car certaines notations physiques sont longues (p.ex. "cosφ", "ΔT", ou composition de symboles), et pour `variable_code` (taille 64) pour qu’il soit stable et indépendant de la langue. En version ultérieure, on pourrait ajouter par exemple un champ _alias_ pour les synonymes de variable, mais ce n’est pas nécessaire en V1.

## 2. Contraintes d’intégrité et index

Les contraintes suivantes sont définies :

- **Clé primaire** : `PRIMARY KEY (id)`.
- **Clés étrangères** :
    - `formule_id` référence `formules_physiques(id)` avec _ON UPDATE CASCADE, ON DELETE RESTRICT_. Cela garantit l’intégrité : on ne peut pas supprimer une formule si des variables lui sont liées. On utilise CASCADE à l’update pour que renommer une formule répercute sur les variables.
    - `grandeur_physique_id` référence `grandeurs_physiques(id)` (ON UPDATE CASCADE, ON DELETE RESTRICT).
    - `unite_attendue_id` référence `unites(id)` (ON UPDATE CASCADE, ON DELETE RESTRICT).
- **Contraintes d’unicité** :
    - UNIQUE `(formule_id, variable_code)`.
    - UNIQUE `(formule_id, notation)`.  
        Cela empêche par exemple d’avoir deux variables "U" dans la même formule, ou deux variables avec le même code.
- **Index** : Pour optimiser les requêtes, on ajoute des index sur :
    - `formule_id` (liaison sur la table de formule).
    - `grandeur_physique_id` (pour accéder aux dimensions).
    - `unite_attendue_id`.
    - `ordre_affichage` (pour tri).
    - _Optionnel_ : on peut indexer `obligatoire` si on doit filtrer les variables facultatives/voulues, ou `variable_code`/`notation` pour des recherches rapides par symbole.

La stratégie de migration suit le modèle existant : on commence par **DROP TABLE IF EXISTS formules_physiques_entrees** pour pouvoir réinitialiser, puis on crée la table avec la structure ci-dessus et tous les commentaires (`COMMENT`) explicites sur chaque colonne. Enfin on crée les index nommés de manière cohérente (par exemple, `idx_formules_physiques_entrees__formule` sur `formule_id`, etc.).

## 3. Règles métier et conversions d’unités

- **Correspondance expression/variables** : la notation de chaque variable (colonne `notation`) doit apparaître dans la colonne `expression` de la formule correspondante (table `formules_physiques`). Cette cohérence est vérifiée par le code métier. Par exemple, pour la formule _ELECTRICAL_POWER_ dont l’expression est _"U * I"_, on attend les variables avec `notation='U'` et `notation='I'`.
- **Compatibilité des unités** : chaque variable ayant une grandeur physique attendue doit être saisie avec une unité compatible. Le schéma ne force pas cela (c’est géré au niveau applicatif), mais on recommande de suivre un processus classique de conversion via unité de référence. Par exemple, on peut définir pour chaque dimension physique une _unité de base_, et convertir toute unité en passant d’abord par cette base. Concrètement : pour une grandeur donnée, on stocke un facteur de conversion vers l’unité de base. Pour convertir de l’unité d’entrée à l’unité attendue, on convertit d’abord en unité de base, puis de base à cible. Cette méthode (utilisée par exemple dans IBM TRIRIGA) simplifie la gestion des conversions et évite de maintenir une matrice de conversion complète.

## 4. Exemple de données (Seeder)

Les exemples ci-dessous montrent l’insertion de variables pour quelques formules. On suppose que les formules **ELECTRICAL_POWER**, **THERMAL_POWER** et **CIRCLE_AREA** existent déjà (elles ont été créées en migration 005), ainsi que les grandeurs et unités référencées. Par règle M-019, seuls les codes préexistants sont utilisés. Par exemple :

- **Puissance électrique (P = U × I)** : deux variables. Pour _U_ (tension) on utilisera la grandeur `VOLTAGE` et l’unité `VOLT`; pour _I_ (courant) la grandeur `CURRENT` et l’unité `AMPERE`.
- **Puissance thermique (P = Q × Cp × ΔT)** : trois variables. _Q_ (débit volumique) utilise la grandeur `FLOW` et unité `CUBIC_METER_PER_HOUR` (à supposer dans les unités); _Cp_ utilise `SPECIFIC_HEAT` et unité `JOULE_PER_KILOGRAM_KELVIN`; _ΔT_ utilise `TEMPERATURE` et unité `KELVIN`.
- **Surface de cercle (S = π × R²)** : une variable. _R_ (rayon) utilise la grandeur `LENGTH` et unité `METER`. (La constante π est dans la table _constantes_, pas dans cette table d’entrées.)

Chaque INSERT relie via un `SELECT` la table _formules_physiques_ (pour trouver l’ID de la formule par son code) et les tables _grandeurs_physiques_ et _unites_ pour retrouver les IDs requis. On fixe par exemple `obligatoire=1` par défaut, `valeur_defaut=NULL` si pas de valeur par défaut. L’`ordre_affichage` est arbitraire (10,20,30…).

---

## 5. Tableau comparatif des champs

|Champ|Type SQL|Null/Défaut|Contraintes/Clés|Commentaire|Alternatives envisagées|
|---|---|---|---|---|---|
|id|BIGINT UNSIGNED|NOT NULL|PK, AUTO_INCREMENT|Identifiant unique|_(–)_|
|formule_id|BIGINT UNSIGNED|NOT NULL|FK→formules_physiques(id)|Référence à la formule||
|variable_code|VARCHAR(64)|NOT NULL|UNIQUE(formule_id, variable_code)|Code de la variable|Pourrait être omis si on utilisait uniquement _notation_, mais ce champ assure un identifiant stable.|
|nom|VARCHAR(100)|NOT NULL|–|Nom humain de la variable||
|notation|VARCHAR(32)|NOT NULL|UNIQUE(formule_id, notation)|Symbole dans l’expression|Taille 32 choisie (pouvant contenir "ΔT", "cosφ", etc.)|
|grandeur_physique_id|BIGINT UNSIGNED|NOT NULL|FK→grandeurs_physiques(id)|Grandeur physique liée||
|unite_attendue_id|BIGINT UNSIGNED|NULL|FK→unites(id)|Unité par défaut attendue|Permettre NULL si sans dimension.|
|obligatoire|TINYINT(1)|NOT NULL DEFAULT 1|–|1=obligatoire, 0=facultatif||
|valeur_defaut|DECIMAL(30,15)|NULL|–|Valeur numérique par défaut|_DECIMAL_ choisi pour les nombres (cf. avantages du type numérique). _VARCHAR_ aurait autorisé du texte, mais introduit des risques (données invalides, conversions nécessaires).|
|description|TEXT|NULL|–|Description libre||
|ordre_affichage|SMALLINT UNSIGNED|NOT NULL DEFAULT 100|–|Ordre de tri||
|created_at|DATETIME|NULL|–|Horodatage de création||
|updated_at|DATETIME|NULL|–|Horodatage de mise à jour||
|deleted_at|DATETIME|NULL|–|Horodatage de suppression|(soft delete)|

---

## 6. Relations entre tables

Afficher le code

- **FORMULES_PHYSIQUES** —< **FORMULES_PHYSIQUES_ENTREES** : une formule peut avoir plusieurs variables (1,n).
- **FORMULES_PHYSIQUES_ENTREES** —> **GRANDEURS_PHYSIQUES** : chaque variable se réfère à une grandeur (n,1).
- **FORMULES_PHYSIQUES_ENTREES** —> **UNITES** : unité attendue (n,1, possibilité NULL).
- **FORMULES_PHYSIQUES** —> **GRANDEURS_PHYSIQUES** : chaque formule produit une grandeur physique (1,1).
- **CONSTANTES** —> **GRANDEURS_PHYSIQUES**, **UNITES** : chaque constante a aussi une grandeur et une unité de référence.

Ce schéma met en évidence que les références métrologiques (dimensions, unités, grandeurs, constantes) sont distinctes de la logique métier (équipements, valeurs mesurées). La table **formules_physiques_entrees** relie une formule à ses paramètres, dans un modèle générique et réutilisable pour tous modules du CMS.

---

## 7. Code SQL (Migration et Seeder)

sql

Copier

```sql
/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Migration      : 006
 * Objet          : formules_physiques_entrees
 * Domaine        : Métrologie
 * Version        : 1.0.0
 * Compatibilité  : MySQL 8.x
 *
 * ----------------------------------------------------------------------------
 * Description
 * ----------------------------------------------------------------------------
 *
 * Référentiel des variables d'entrée de formules physiques. Chaque variable a :
 * - un code et un nom,
 * - une notation scientifique apparaissant dans l'expression de la formule,
 * - une grandeur physique associée et une unité attendue,
 * - un indicateur obligatoire/facultatif et une valeur par défaut possible,
 * - un ordre d'affichage et une description.
 *
 * ----------------------------------------------------------------------------
 * Dépendances
 * ----------------------------------------------------------------------------
 *
 * 002_unites.sql
 * 003_grandeurs_physiques.sql
 * 005_formules_physiques.sql
 *
 ******************************************************************************/

DROP TABLE IF EXISTS formules_physiques_entrees;

CREATE TABLE formules_physiques_entrees
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Identifiant unique de la variable',

    formule_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Formule associée (clé étrangère)',

    variable_code VARCHAR(64) NOT NULL
        COMMENT 'Code fonctionnel de la variable',

    nom VARCHAR(100) NOT NULL
        COMMENT 'Nom de la variable',

    notation VARCHAR(32) NOT NULL
        COMMENT 'Symbole dans l\'expression (notation scientifique)',

    grandeur_physique_id BIGINT UNSIGNED NOT NULL
        COMMENT 'Grandeur physique attendue (ID de grandeurs_physiques)',

    unite_attendue_id BIGINT UNSIGNED NULL
        COMMENT 'Unité attendue (ID de unites)',

    obligatoire TINYINT(1) NOT NULL DEFAULT 1
        COMMENT '1 = variable obligatoire, 0 = facultative',

    valeur_defaut DECIMAL(30,15) NULL
        COMMENT 'Valeur numérique par défaut (si facultative)',

    description TEXT NULL
        COMMENT 'Description de la variable',

    ordre_affichage SMALLINT UNSIGNED NOT NULL DEFAULT 100
        COMMENT 'Ordre de tri',

    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,

    CONSTRAINT pk_formules_physiques_entrees
        PRIMARY KEY (id),

    CONSTRAINT uk_formules_physiques_entrees__code
        UNIQUE (formule_id, variable_code),

    CONSTRAINT uk_formules_physiques_entrees__notation
        UNIQUE (formule_id, notation),

    CONSTRAINT fk_formules_physiques_entrees__formules
        FOREIGN KEY (formule_id)
        REFERENCES formules_physiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_formules_physiques_entrees__grandeurs
        FOREIGN KEY (grandeur_physique_id)
        REFERENCES grandeurs_physiques(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_formules_physiques_entrees__unites
        FOREIGN KEY (unite_attendue_id)
        REFERENCES unites(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Variables d\u00e9clar\u00e9es pour les formules physiques.';


/******************************************************************************
 * Index
 ******************************************************************************/

CREATE INDEX idx_formules_physiques_entrees__formule
    ON formules_physiques_entrees(formule_id);

CREATE INDEX idx_formules_physiques_entrees__grandeur
    ON formules_physiques_entrees(grandeur_physique_id);

CREATE INDEX idx_formules_physiques_entrees__unite
    ON formules_physiques_entrees(unite_attendue_id);

CREATE INDEX idx_formules_physiques_entrees__ordre
    ON formules_physiques_entrees(ordre_affichage);

CREATE INDEX idx_formules_physiques_entrees__obligatoire
    ON formules_physiques_entrees(obligatoire);
```

sql

Copier

```sql
/******************************************************************************
 *
 * ARBPH-CMS
 * ============================================================================
 *
 * Seeder         : 006
 * Objet          : formules_physiques_entrees
 * Domaine        : Métrologie
 *
 * Exemple : Ajout de variables pour quelques formules existantes.
 * (N.B. On suppose que les formules et grandeurs référencées existent déjà.)
 *
 ******************************************************************************/

-- PUISSANCE ELECTRIQUE (P = U * I) : variables U et I

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'VOLTAGE',
    'Tension',
    'U',
    gp.id,
    u.id,
    1,
    NULL,
    10,
    'Tension appliqu\u00e9e en volts'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'VOLTAGE'
JOIN unites u ON u.code = 'VOLT'
WHERE fp.code = 'ELECTRICAL_POWER';

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'CURRENT',
    'Courant',
    'I',
    gp.id,
    u.id,
    1,
    NULL,
    20,
    'Intensit\u00e9 du courant en amp\u00e8res'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'CURRENT'
JOIN unites u ON u.code = 'AMPERE'
WHERE fp.code = 'ELECTRICAL_POWER';


/******************************************************************************
 * PUISSANCE THERMIQUE (P = Q * Cp * ΔT) : variables Q, Cp, DT
 ******************************************************************************/

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'FLOW',
    'D\u00e9bit volumique',
    'Q',
    gp.id,
    u.id,
    1,
    NULL,
    10,
    'D\u00e9bit volumique (par exemple en m\u00b3/h)'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'FLOW'
JOIN unites u ON u.code = 'CUBIC_METER_PER_HOUR'
WHERE fp.code = 'THERMAL_POWER';

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'SPECIFIC_HEAT',
    'Capacit\u00e9 therm. massique',
    'Cp',
    gp.id,
    u.id,
    1,
    NULL,
    20,
    'Capacit\u00e9 thermique massique (par exemple en J/(kg·K))'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'SPECIFIC_HEAT'
JOIN unites u ON u.code = 'JOULE_PER_KILOGRAM_KELVIN'
WHERE fp.code = 'THERMAL_POWER';

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'TEMPERATURE_DIFF',
    'Diff\u00e9rence de temp\u00e9rature',
    'DT',
    gp.id,
    u.id,
    1,
    NULL,
    30,
    'Diff\u00e9rence de temp\u00e9rature (en kelvins)'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'TEMPERATURE'
JOIN unites u ON u.code = 'KELVIN'
WHERE fp.code = 'THERMAL_POWER';


/******************************************************************************
 * SURFACE DE CERCLE (S = \u03c0 * R\u00b2) : variable R
 ******************************************************************************/

INSERT INTO formules_physiques_entrees
(
    formule_id,
    variable_code,
    nom,
    notation,
    grandeur_physique_id,
    unite_attendue_id,
    obligatoire,
    valeur_defaut,
    ordre_affichage,
    description
)
SELECT
    fp.id,
    'RADIUS',
    'Rayon du cercle',
    'R',
    gp.id,
    u.id,
    1,
    NULL,
    10,
    'Rayon du cercle en m\u00e8tres'
FROM formules_physiques fp
JOIN grandeurs_physiques gp ON gp.code = 'LENGTH'
JOIN unites u ON u.code = 'METER'
WHERE fp.code = 'CIRCLE_AREA';
```

**Remarque sur le seeder :** les codes d’unité (`'VOLT'`, `'AMPERE'`, `'CUBIC_METER_PER_HOUR'`, `'JOULE_PER_KILOGRAM_KELVIN'`, `'KELVIN'`, `'METER'`) sont supposés exister dans la table `unites`. Si nécessaire, on adaptera ces codes aux identifiants réels du référentiel. L’important est de n’insérer que des références valides (règle M-019).

---

**Sources et bonnes pratiques :** Ce schéma suit les conventions établies (clés primaires numériques, noms de colonnes clairs, contraintes FK avec ON UPDATE CASCADE/ON DELETE RESTRICT, champs _created_at/updated_at/deleted_at_ pour l’audit) et les recommandations de gestion de données numériques (privilégier _DECIMAL_ pour les montants/valeurs). La conception met en œuvre la règle générale d’indépendance des référentiels (pas de dépendance à un équipement client particulier) et offre un modèle stable, extensible (ajout futur d’alias, modes de production, etc.) sans modifier les tables existantes.
