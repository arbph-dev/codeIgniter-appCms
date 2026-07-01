
# component_types

Cette table va stocker les type de composants employer dans les [parts](/documentation/parts.md)

raw
codeval
apex
mermaid
callout


---

## Migration
```sql
CREATE TABLE IF NOT EXISTS `component_types` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,     -- 'codeval' | 'apex' | 'mermaid' | 'raw'
  `view`        VARCHAR(120) NOT NULL,     -- 'components/codeval' etc.
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_component_types_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
## Structure

| Field       | Type            | Null | Key | Default           | Extra             |
| ----------- | --------------- | ---- | --- | ----------------- | ----------------- |
| id          | bigint unsigned | NO   | PRI | _NULL_            | auto_increment    |
| name        | varchar(50)     | NO   | UNI | _NULL_            |                   |
| view        | varchar(120)    | NO   |     | _NULL_            |                   |
| description | text            | YES  |     | _NULL_            |                   |
| is_active   | tinyint(1)      | NO   |     | 1                 |                   |
| created_at  | datetime        | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |


```
-- =========================================================
-- SEED : component_types
-- À insérer une seule fois — référence stable.
-- =========================================================

INSERT INTO `component_types` (`name`, `view`, `description`) VALUES
  ('raw',     'components/raw',     'HTML brut — content et aside rendus directement'),
  ('codeval', 'components/codeval', 'Bloc de code évaluable avec résultat'),
  ('apex',    'components/apex',    'Graphique ApexCharts'),
  ('mermaid', 'components/mermaid', 'Diagramme Mermaid'),
  ('callout', 'components/callout', 'Bloc callout note / info / warning / danger')
  
  
ON DUPLICATE KEY UPDATE `view` = VALUES(`view`), `description` = VALUES(`description`);
```

---
