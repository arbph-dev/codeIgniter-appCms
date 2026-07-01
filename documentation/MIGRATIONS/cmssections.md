
# cmssections

## Migration

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
KEY `idx_sections_article_published_position` (`article_id`,`is_published`,`position`),  
UNIQUE KEY `uq_sections_article_position`(`article_id`,`position`),  
UNIQUE KEY `uq_sections_article_slug` (`article_id`,`slug`),  

CONSTRAINT `fk_sections_article`  
FOREIGN KEY (`article_id`)  
REFERENCES `cmsarticles` (`id`)  
ON DELETE CASCADE  
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
| article_id   | bigint unsigned | NO   | MUL | _NULL_            |                             |
| slug         | varchar(140)    | YES  |     | _NULL_            |                             |
| title        | varchar(180)    | NO   |     | _NULL_            |                             |
| position     | int unsigned    | NO   |     | 1                 |                             |
| is_published | tinyint(1)      | NO   |     | 1                 |                             |
| created_at   | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED           |
| updated_at   | datetime        | YES  |     | _NULL_            | on update CURRENT_TIMESTAMP |

