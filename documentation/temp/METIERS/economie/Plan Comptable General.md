
### Structure

| Field      | Type             | Null | Key | Default           | Extra                                         | [![Textes partiels](https://phpmyadmin-gra.hosting.ovh.net/themes/pmahomme/img/s_partialtext.png "Textes partiels")](https://phpmyadmin-gra.hosting.ovh.net/index.php) |
| ---------- | ---------------- | ---- | --- | ----------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| numpcg     | varchar(20)      | NO   | PRI | _NULL_            |                                               |                                                                                                                                                                        |
| nom        | varchar(255)     | NO   | MUL | _NULL_            |                                               |                                                                                                                                                                        |
| parentnum  | varchar(20)      | YES  | MUL | _NULL_            |                                               |                                                                                                                                                                        |
| classe     | tinyint unsigned | NO   | MUL | _NULL_            |                                               |                                                                                                                                                                        |
| created_at | datetime         | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |                                                                                                                                                                        |
| updated_at | datetime         | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |                                                                                                                                                                        |

## migration mysql

```sql

CREATE TABLE `comptespcg` (
  `numpcg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentnum` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classe` tinyint UNSIGNED NOT NULL COMMENT 'Classe comptable (1-8)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comptespcg`
--
ALTER TABLE `comptespcg`
  ADD PRIMARY KEY (`numpcg`),
  ADD KEY `parentnum` (`parentnum`),
  ADD KEY `classe` (`classe`),
  ADD KEY `idx_parent_classe` (`parentnum`,`classe`);
ALTER TABLE `comptespcg` ADD FULLTEXT KEY `nom` (`nom`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comptespcg`
--
ALTER TABLE `comptespcg`
  ADD CONSTRAINT `comptespcg_parentnum_foreign` FOREIGN KEY (`parentnum`) REFERENCES `comptespcg` (`numpcg`) ON DELETE SET NULL;
COMMIT;


```
### backend
#### app\Controllers\Api\Comptespcg.php

### frontend

\assets\js\features\pcg\index.js
\assets\js\features\pcg\pcg.controller.js
\assets\js\features\pcg\pcg.renderer.js
\assets\js\features\pcg\pcg.service.js
\assets\js\features\pcg\pcg.store.js

