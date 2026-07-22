
# cmsparts



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


## Seeder

```sql
INSERT INTO `cmsparts` (`id`, `section_id`, `type_id`, `title`, `aside`, `config`, `position`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 999, 1, 'But', '<a href=\"/technologies\">Rubrique</a>', '{\"content\": \"Ce portail me permet de partager des informations sur divers sujets dans des domaines variés.\"}', 2, 1, '2026-06-21 04:04:32', '2026-06-28 20:50:52'),
(2, 999, 1, 'Présentation', '<a href=\"/cv\">Parcours pro</a>', '{\"content\": \"Plutôt pragmatique, j\'ai une formation d\'électrotechnicien.\"}', 1, 1, '2026-06-21 04:04:32', '2026-06-28 20:50:52'),
(3, 999, 2, 'Volume normal selon ISO 2533', 'Déterminons le volume V1 normal (P1,T1) représentant V2 dans les conditions d\'exploitation (P2,T2)', '{\"id\": \"CVG5\", \"rows\": \"14\", \"script\": \"const P2_rel_bar = 0.3\\r\\nconst P2_abs_bar = P2_rel_bar + 1\\r\\nconst P2_abs_pa = P2_abs_bar * 101325\\r\\nconst P1_abs_pa = 101325\\r\\nconst T2_degc = 20\\r\\nconst T1_K = 288.15\\r\\nconst T2_K = T2_degc + 273.15\\r\\nconst IDX1 = 2500420\\r\\nconst IDX2 = 2500620\\r\\nconst V2 = IDX2 - IDX1\\r\\nconst F = ( P2_abs_pa / P1_abs_pa ) * ( T1_K / T2_K)\\r\\nconst V1 = V2 * F\\r\\nconst result = \\\"Volume corrigé = \\\" + V1 + \\\" Nm3 ; F = \\\" + F\"}', 3, 1, '2026-06-21 04:04:32', '2026-06-28 20:26:45'),
(4, 999, 3, 'Courbe couple / vitesse', 'Apex zone centrale', '{\"id\": \"APX_1\", \"chart\": \"bars\", \"height\": \"350\"}', 4, 1, '2026-06-21 04:04:32', '2026-07-10 02:45:04'),
(5, 999, 4, 'Diagramme de séquence', 'Mermaid zone centrale', '{\"id\": \"MM_1\", \"autorun\": \"1\", \"definition\": \"sequenceDiagram\\r\\nautonumber\\r\\nparticipant A\\r\\nparticipant B\\r\\nA->>B: Hello\\r\\nB-->>A: World\"}', 5, 1, '2026-06-21 04:04:32', '2026-06-28 21:57:40'),
(6, 999, 4, 'Test Mermaid 2', NULL, '{\"id\": \"MM_2\", \"definition\": \"graph TD\\r\\nA-->B\\r\\nB-->C\\r\\nC-->D\"}', 99, 1, '2026-06-21 04:55:15', NULL),
(7, 999, 5, 'Test Callout', 'Zone aside callout', '{\"id\": \"CO_1\", \"type\": \"warning\", \"title\": \"Attention\", \"content\": \"Ceci est un callout de test de type <strong>warning</strong>.2026-07-07 : Mise en production. Ajouter initCallout dans le bootstrap\"}', 6, 1, '2026-07-06 19:46:03', '2026-07-07 06:33:46'),
(8, 999, 6, 'map 1', 'essai composant leaflet', '{\"id\": \"MAP_1\", \"lat\": 47.82, \"lng\": -4.3, \"zoom\": 11}', 7, 1, '2026-07-12 04:41:47', NULL),
(9, 999, 6, 'map2', 'carte 2', '{\"id\": \"MAP_2\", \"lat\": 47.92, \"lng\": -4.15, \"zoom\": 12}', 8, 1, '2026-07-12 05:59:44', NULL),
(10, 999, 6, 'map3', 'carte map3', '{\"id\": \"MAP_3\", \"lat\": 48.82, \"lng\": 4.3, \"zoom\": 16}', 9, 1, '2026-07-12 06:00:54', NULL),
(11, 999, 7, 'Cube Three.js', 'Scène 3D — cube en rotation', '{\"id\": \"THREE_1\", \"options\": {\"type\": \"viewer\", \"resource\": \"cube\", \"background\": \"#202020\", \"resourceOptions\": {\"size\": 1, \"color\": \"#00aaee\", \"rotationSpeed\": 1}}}', 10, 1, '2026-07-13 01:28:58', NULL);
```




