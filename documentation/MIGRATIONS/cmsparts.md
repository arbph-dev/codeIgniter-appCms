
# cmsparts

---
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

## Migration
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
  
)
ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;
```



## Structure
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


