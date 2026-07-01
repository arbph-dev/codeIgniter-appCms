
# cmscategories

permet une gestion des catégories d'articles



## SQL


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
## Structure

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

## seeder
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

## Relation
1 categories -> 1 categories -:- categories.catp_id = categories.id

