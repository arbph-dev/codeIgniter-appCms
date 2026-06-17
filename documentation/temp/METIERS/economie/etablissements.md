---
MYSQL: En ligne
---
## Structure

| Field         | Type            | Null | Key | Default | Extra          |
| ------------- | --------------- | ---- | --- | ------- | -------------- |
| id            | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| entreprise_id | bigint unsigned | NO   | MUL | _NULL_  |                |
| siret         | char(14)        | NO   | UNI | _NULL_  |                |
| nic           | char(5)         | NO   |     | _NULL_  |                |
| nom           | varchar(255)    | YES  |     | _NULL_  |                |
| is_siege      | tinyint(1)      | NO   |     | 0       |                |
| actif         | tinyint(1)      | NO   |     | 1       |                |
| adresse_id    | bigint unsigned | YES  | MUL | _NULL_  |                |
| created_at    | datetime        | YES  |     | _NULL_  |                |
| updated_at    | datetime        | YES  |     | _NULL_  |                |
## migration mysql
```sql
CREATE TABLE `etablissements` (
  `id` bigint UNSIGNED NOT NULL,
  `entreprise_id` bigint UNSIGNED NOT NULL,
  `siret` char(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_siege` tinyint(1) NOT NULL DEFAULT '0',
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `adresse_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `etablissements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siret` (`siret`),
  ADD KEY `idx_siret` (`siret`),
  ADD KEY `idx_entreprise` (`entreprise_id`),
  ADD KEY `fk_etab_adresse` (`adresse_id`);


ALTER TABLE `etablissements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE `etablissements`
  ADD CONSTRAINT `fk_etab_adresse` FOREIGN KEY (`adresse_id`) REFERENCES `adresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_etab_entreprise` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;
COMMIT;
```

SHOW COLUMNS FROM etablissements;

| id            | bigint unsigned | NO  | PRI | _NULL_ | auto_increment |
| ------------- | --------------- | --- | --- | ------ | -------------- |
| entreprise_id | bigint unsigned | NO  | MUL | _NULL_ |                |
| siret         | char(14)        | NO  | UNI | _NULL_ |                |
| nic           | char(5)         | NO  |     | _NULL_ |                |
| nom           | varchar(255)    | YES |     | _NULL_ |                |
| is_siege      | tinyint(1)      | NO  |     | 0      |                |
| actif         | tinyint(1)      | NO  |     | 1      |                |
| adresse_id    | bigint unsigned | YES | MUL | _NULL_ |                |
| created_at    | datetime        | YES |     | _NULL_ |                |
| updated_at    | datetime        | YES |     | _NULL_ |                |

SHOW INDEX FROM etablissements;


| Table          | Non_unique | Key_name        | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
| -------------- | ---------- | --------------- | ------------ | ------------- | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- | ---------- |
| etablissements | 0          | PRIMARY         | 1            | id            | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| etablissements | 0          | siret           | 1            | siret         | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| etablissements | 1          | idx_siret       | 1            | siret         | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| etablissements | 1          | idx_entreprise  | 1            | entreprise_id | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| etablissements | 1          | fk_etab_adresse | 1            | adresse_id    | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |

## Relations

[[METIERS/economie/entreprise]]

[[METIERS/economie/Plan Comptable General]]
