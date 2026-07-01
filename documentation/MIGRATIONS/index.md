## ordre d'import
1. component_types 
2. cmscategories
3. cmsarticles
4. cmssections
5. cmsparts

## Tables

Les tables sont listée dans l'ordre de création, ordre imposé par les relations

[component_types](/documentation/MIGRATIONS/component_types.md)
[[#cmscategories]]
[[#cmsarticles]]
[[#cmssections]]
[[#cmsparts]]




## cmscategories
permet une gestion des catégories d'articles

### Structure

**table** : `categories`

**champs** : 
id
title
slug
description
catp_id : catégorie parente
created_at
updated_at



### SQL

```
-- ---------------------------------------------------------
-- TABLE: categories
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cmscategories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `description` TEXT NULL,
  `catp_id` BIGINT UNSIGNED NULL,  
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_catp_id` (`catp_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


```

**version migration**
```sql
CREATE TABLE IF NOT EXISTS `cmscategories` (  
  
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  
  
`title` VARCHAR(120) NOT NULL,  
`slug` VARCHAR(80) NOT NULL,  
`description` TEXT NULL,  
  
`catp_id` BIGINT UNSIGNED NULL,  
  
`position` INT UNSIGNED NOT NULL DEFAULT 1,  
  
`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
`updated_at` DATETIME NULL DEFAULT NULL  
ON UPDATE CURRENT_TIMESTAMP,  
  
PRIMARY KEY (`id`),  
  
UNIQUE KEY `uq_categories_slug` (`slug`),  
  
KEY `idx_catp_id` (`catp_id`),  
KEY `idx_catp_position` (`catp_id`, `position`),  
  
CONSTRAINT `fk_categories_parent`  
FOREIGN KEY (`catp_id`)  
REFERENCES `cmscategories` (`id`)  
ON DELETE SET NULL  
ON UPDATE CASCADE  
  
) ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;

```

| Field       | Type            | Null | Key | Default           | Extra                       |
| ----------- | --------------- | ---- | --- | ----------------- | --------------------------- |
| id          | bigint unsigned | NO   | PRI | _NULL_            | auto_increment              |
| title       | varchar(120)    | NO   |     | _NULL_            |                             |
| slug        | varchar(80)     | NO   | UNI | _NULL_            |                             |
| description | text            | YES  |     | _NULL_            |                             |
| catp_id     | bigint unsigned | YES  | MUL | _NULL_            |                             |
| position    | int unsigned    | NO   |     | 1                 |                             |
| created_at  | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at  | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |

Opérations sur les résultats de la requête


```

-- ---------------------------------------------------------
-- SEED MINIMAL (optionnel)
-- ---------------------------------------------------------
INSERT INTO categories (slug, name, description, position) VALUES
('home', 'Accueil', 'Page principale', 0),
('news', 'Actualités', 'Dernières mises à jour', 1),
('info', 'Infos', 'Références et documentation', 2),
('techno', 'Technologie', 'Chimie, électricité, etc.', 3);


-- =========================================================
-- SEED : données initiales issues de Cms.php
-- Catégories racines du portail.
-- =========================================================

INSERT INTO `categories` (`id`, `title`, `slug`, `description`, `catp_id`, `position`) VALUES
  (1,  'Accueil',      'accueil',      'Page principale du portail',                         NULL, 1),
  (2,  'Technologies', 'technologies', 'Articles relatifs aux technologies courantes',        NULL, 2),
  (3,  'Histoire',     'histoire',     'Événements et découvertes historiques',               NULL, 3),
  (4,  'Informatique', 'informatique', 'Stack web, composants, architecture',                 NULL, 4),
  (5,  'Composants',   'composants',   'Composants en cours d\'intégration CMS',             4,    1),
  -- Sous-catégories Technologies (catp_id = 2)
  (10, 'Électronique', 'eln',          'Notions d\'électronique',                            2,    1),
  (11, 'Chauffage',    'chf',          'Systèmes de chauffage',                              2,    2),
  (12, 'Gaz',         'gaz',          'Installations et réglementations gaz',               2,    3),
  (13, 'Eau',         'eau',          'Systèmes eau et ECS',                                2,    4);
```

id = 1 , title = technologie , slug = techno , description =  , ensemble d'articles relatifs à des technologies courantes , catp_id = null
id = 2 , title = electronique , slug = eln, description = quelques notions d'electronique , catp_id = 1

### Relation
1 categories -> 1 categories -:- categories.catp_id = categories.id


---
## cmsarticles
### Structure
**table** : `article`
**champs** :
id
title
slug
description
cat_id : catégorie
is_published
published_at
created_at
updated_at
### SQL
```
-- ---------------------------------------------------------
-- TABLE: articles
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cmsarticles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cat_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `description` TEXT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_articles_slug` (`slug`),
  KEY `idx_articles_category` (`cat_id`),
  KEY `idx_articles_published_at` (`published_at`),
  CONSTRAINT `fk_articles_subcategory`
    FOREIGN KEY (`cat_id`) REFERENCES `cmscategories` (`id`)
    ON DELETE NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**version migration**
```sql
CREATE TABLE IF NOT EXISTS `cmsarticles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cat_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `description` TEXT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),

  UNIQUE KEY `uq_articles_slug` (`slug`),

  KEY `idx_articles_category` (`cat_id`),
  KEY `idx_articles_published_at` (`published_at`),

  CONSTRAINT `fk_articles_category`
    FOREIGN KEY (`cat_id`)
    REFERENCES `cmscategories` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
```

| Field        | Type            | Null | Key | Default           | Extra                       |
| ------------ | --------------- | ---- | --- | ----------------- | --------------------------- |
| id           | bigint unsigned | NO   | PRI | _NULL_            | auto_increment              |
| cat_id       | bigint unsigned | NO   | MUL | _NULL_            |                             |
| slug         | varchar(120)    | NO   | UNI | _NULL_            |                             |
| title        | varchar(180)    | NO   |     | _NULL_            |                             |
| description  | text            | YES  |     | _NULL_            |                             |
| is_published | tinyint(1)      | NO   |     | 1                 |                             |
| published_at | datetime        | YES  | MUL | _NULL_            |                             |
| created_at   | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at   | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |


```sql
-- =========================================================
-- SEED : articles
-- =========================================================

INSERT INTO `articles` (`id`, `cat_id`, `slug`, `title`, `intro`, `position`) VALUES
  (1, 1, 'accueil-portail',    'Accueil du portail',    'Quand, qui, quoi, où, comment, pourquoi.',                      1),
  (2, 2, 'technologies',       'Technologies',           'Informations sur des solutions technologiques et procédés.',    1),
  (3, 3, 'histoire',           'Histoire',               'Passions et découvertes historiques.',                          1),
  (4, 4, 'informatique',       'Informatique',           'Maîtrise des technologies front et backend.',                   1),
  (5, 5, 'composants-cms',     'Composants',             'Composants en cours d\'intégration CMS.',                      1);



```
### Relation
1 article -> 1 categories -:- article.cat_id = categories.id


---
## cmssections

### Structure
**table** : cmssections
**champs** :
id
article_id
slug
title
content ==A voir==
position
is_published
created_at
updated_at


| Field        | Type            | Null | Key | Default           | Extra                       |
| ------------ | --------------- | ---- | --- | ----------------- | --------------------------- |
| id           | bigint unsigned | NO   | PRI | _NULL_            | auto_increment              |
| article_id   | bigint unsigned | NO   | MUL | _NULL_            |                             |
| slug         | varchar(140)    | YES  |     | _NULL_            |                             |
| title        | varchar(180)    | NO   |     | _NULL_            |                             |
| position     | int unsigned    | NO   |     | 1                 |                             |
| is_published | tinyint(1)      | NO   |     | 1                 |                             |
| created_at   | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at   | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |


### SQL
**version migration**
```sql
CREATE TABLE IF NOT EXISTS `cmssections` (  
  
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  
`article_id` BIGINT UNSIGNED NOT NULL,  
  
`slug` VARCHAR(140) NULL,  
`title` VARCHAR(180) NOT NULL,  
  
`position` INT UNSIGNED NOT NULL DEFAULT 1,  
`is_published` TINYINT(1) NOT NULL DEFAULT 1,  
  
`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
`updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,  
  
PRIMARY KEY (`id`),  
  
KEY `idx_sections_article` (`article_id`),  
KEY `idx_sections_article_position` (`article_id`,`position`),  
KEY `idx_sections_article_published_position`  
(`article_id`,`is_published`,`position`),  
  
UNIQUE KEY `uq_sections_article_position`  
(`article_id`,`position`),  
  
UNIQUE KEY `uq_sections_article_slug`  
(`article_id`,`slug`),  
  
CONSTRAINT `fk_sections_article`  
FOREIGN KEY (`article_id`)  
REFERENCES `cmsarticles` (`id`)  
ON DELETE CASCADE  
ON UPDATE CASCADE  
  
) ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;


```

---
## cmsparts

config JSON — exemples par type :
type = 'codeval'
```
{ "rows": 12, "script": "const P2_rel_bar = 0.3\n..." }
```
type = 'apex'
```
{ "chart": "moteurCouple", "height": 350, "payload": {} }
```
type = 'mermaid'
```
{ "definition": "gantt\n  dateFormat YYYY-MM-DD\n  ...", "autorun": false }
```
type = 'raw'
```
config NULL 
content et aside contiennent le HTML directement
```

### Structure
**table** : cmsparts
**champs** : 
id
section_id
title
content
aside
config
position
is_published
created_at
updated_at

| Field        | Type            | Null | Key | Default           | Extra                       |
| ------------ | --------------- | ---- | --- | ----------------- | --------------------------- |
| id           | bigint unsigned | NO   | PRI | _NULL_            | auto_increment              |
| section_id   | bigint unsigned | NO   | MUL | _NULL_            |                             |
| type_id      | bigint unsigned | NO   | MUL | _NULL_            |                             |
| title        | varchar(180)    | NO   |     | _NULL_            |                             |
| content      | longtext        | YES  |     | _NULL_            |                             |
| aside        | longtext        | YES  |     | _NULL_            |                             |
| config       | json            | YES  |     | _NULL_            |                             |
| position     | int unsigned    | NO   |     | 1                 |                             |
| is_published | tinyint(1)      | NO   |     | 1                 |                             |
| created_at   | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at   | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |


### SQL
**version migration**
```sql

CREATE TABLE IF NOT EXISTS `cmsparts` (  
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,  
`section_id` BIGINT UNSIGNED NOT NULL,  
`type_id` BIGINT UNSIGNED NOT NULL,  
`title` VARCHAR(180) NOT NULL,  
`content` LONGTEXT NULL,  
`aside` LONGTEXT NULL,  
`config` JSON NULL,  
`position` INT UNSIGNED NOT NULL DEFAULT 1,  
`is_published` TINYINT(1) NOT NULL DEFAULT 1,  
`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  
`updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,  
  
PRIMARY KEY (`id`),  
  
KEY `idx_parts_section` (`section_id`),  
KEY `idx_parts_section_position` (`section_id`,`position`),
KEY `idx_parts_type` (`type_id`),  

UNIQUE KEY `uq_parts_section_position`(`section_id`,`position`),
  
CONSTRAINT `fk_parts_section`  
FOREIGN KEY (`section_id`)  
REFERENCES `cmssections` (`id`)  
ON DELETE CASCADE  
ON UPDATE CASCADE,  
  
CONSTRAINT `fk_parts_type`  
FOREIGN KEY (`type_id`)  
REFERENCES `component_types` (`id`)  
ON DELETE RESTRICT  
ON UPDATE CASCADE  
  
) ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;

```





## SQL
```sql
-- =========================================================
-- Portail CMS : categories → articles → sections → parts
-- MySQL 8+ / MariaDB 10.5+ (InnoDB, utf8mb4)
-- Descripteurs de composants stockés en JSON sur parts.config
--
-- Ordre de création (respect des FK) :
--   1. component_types
--   2. categories
--   3. articles
--   4. sections
--   5. parts
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- TABLE: component_types
-- Catalogue des types de composants rendus par les vues PHP.
-- La colonne `view` est le chemin passé à view() dans CodeIgniter.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `component_types` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,     -- 'codeval' | 'apex' | 'mermaid' | 'raw'
  `view`        VARCHAR(120) NOT NULL,     -- 'components/codeval' etc.
  `description` TEXT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_component_types_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------
-- TABLE: categories
-- Auto-référencée via catp_id pour les sous-rubriques.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(120) NOT NULL,
  `slug`        VARCHAR(80)  NOT NULL,
  `description` TEXT NULL,
  `catp_id`     BIGINT UNSIGNED NULL,          -- NULL = catégorie racine
  `position`    INT UNSIGNED NOT NULL DEFAULT 1,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_categories_parent`    (`catp_id`),
  KEY `idx_categories_position`  (`catp_id`, `position`),
  CONSTRAINT `fk_categories_parent`
    FOREIGN KEY (`catp_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------
-- TABLE: articles
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cat_id`       BIGINT UNSIGNED NOT NULL,
  `slug`         VARCHAR(120) NOT NULL,
  `title`        VARCHAR(180) NOT NULL,
  `intro`        TEXT NULL,                    -- chapeau affiché sous le titre
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NULL DEFAULT NULL,
  `position`     INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_articles_slug` (`slug`),
  KEY `idx_articles_category`     (`cat_id`),
  KEY `idx_articles_published_at` (`published_at`),
  KEY `idx_articles_cat_position` (`cat_id`, `position`),
  CONSTRAINT `fk_articles_category`
    FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------
-- TABLE: sections
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sections` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id`   BIGINT UNSIGNED NOT NULL,
  `slug`         VARCHAR(140) NULL,            -- ancre stable : #dimensionnement-intro
  `title`        VARCHAR(180) NOT NULL,
  `position`     INT UNSIGNED NOT NULL DEFAULT 1,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sections_article_slug` (`article_id`, `slug`),
  KEY `idx_sections_article`                       (`article_id`),
  KEY `idx_sections_article_position`              (`article_id`, `position`),
  KEY `idx_sections_article_published_position`    (`article_id`, `is_published`, `position`),
  CONSTRAINT `fk_sections_article`
    FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
```

