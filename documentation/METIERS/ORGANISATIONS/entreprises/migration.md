# migration
commande SQL pour mysql

```sql
CREATE TABLE `entreprises` (
  `id` bigint UNSIGNED NOT NULL,
  `organisation_id` bigint UNSIGNED NOT NULL,
  `siret` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codenaf_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'FK → codesnaf.codenaf',
  `forme_juridique_id` char(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'FK → formesjuridiques.id',
  `capital` decimal(15,2) DEFAULT NULL,
  `effectif_min` int UNSIGNED DEFAULT NULL,
  `effectif_max` int UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Entreprises — extension de organisations';


ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `organisation_id` (`organisation_id`),
  ADD UNIQUE KEY `siret` (`siret`),
  ADD KEY `idx_siret` (`siret`),
  ADD KEY `idx_codenaf` (`codenaf_id`),
  ADD KEY `fk_ent_fj` (`forme_juridique_id`);


ALTER TABLE `entreprises`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE `entreprises`
  ADD CONSTRAINT `fk_ent_codenaf` FOREIGN KEY (`codenaf_id`) REFERENCES `codesnaf` (`codenaf`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ent_fj` FOREIGN KEY (`forme_juridique_id`) REFERENCES `formesjuridiques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ent_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations` (`id`) ON DELETE CASCADE;
COMMIT;
```
