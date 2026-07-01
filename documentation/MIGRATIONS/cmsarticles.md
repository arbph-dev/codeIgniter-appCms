
# cmsarticles


## Migrations
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

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
```

## Structure

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

## Seeder
```sql
INSERT INTO `articles` (`id`, `cat_id`, `slug`, `title`, `intro`, `position`) VALUES
  (1, 1, 'accueil-portail',    'Accueil du portail',    'Quand, qui, quoi, où, comment, pourquoi.',                      1),
  (2, 2, 'technologies',       'Technologies',           'Informations sur des solutions technologiques et procédés.',    1),
  (3, 3, 'histoire',           'Histoire',               'Passions et découvertes historiques.',                          1),
  (4, 4, 'informatique',       'Informatique',           'Maîtrise des technologies front et backend.',                   1),
  (5, 5, 'composants-cms',     'Composants',             'Composants en cours d\'intégration CMS.',                      1);
```
## Relation
1 article -> 1 categories -:- article.cat_id = categories.id

