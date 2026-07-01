Les migrations sont réalisés avec l'interface phpmyadmin de Mysql

Code Igniter intégre une gestion des migrations et des seeders tout comme Laravel.
Ces deux frameworks permettent d'exploiter des tables existantes

Privilégier le standard sql semble plus pertinent



## Tables

Les tables sont listée dans l'ordre de création, ordre imposé par les relations

[component_types](/documentation/MIGRATIONS/component_types.md)
[[#cmscategories]]
[[#cmsarticles]]
[[#cmssections]]
[[#cmsparts]]


## ordre d'import
1. component_types 
2. cmscategories
3. cmsarticles
4. cmssections
5. cmsparts



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

