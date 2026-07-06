# etablissements

## Modification

#### 2026-07-05
table : etablissements 
+ parent_id    BIGINT UNSIGNED NULL,
+ code         VARCHAR(25) NULL,
+ telephone    VARCHAR(50) NULL,
+ email        VARCHAR(255) NULL,

- parent_id	permet de gérer une hiérachie : direction régionale / agence locale
Autre avantage : le SIRET devient optionnel. En effet : entreprise, association , une mairie possède un SIRET mais certaines organisations peuvent ne jamais en avoir.

- code	 	pour reperer l'etablissement DNHF

- remplacer entreprise_id par organisation_id

---

1. supprimer l'ancienne FK avant de recréer la nouvelle.
	ALTER TABLE etablissements DROP FOREIGN KEY fk_etab_entreprise;

2. Puis :
	ALTER TABLE etablissements DROP INDEX idx_entreprise;

3. Puis renommer la colonne :
	ALTER TABLE etablissements CHANGE entreprise_id organisation_id BIGINT UNSIGNED NOT NULL;

4. Puis recréer l'index :
 ALTER TABLE etablissements  ADD INDEX idx_organisation (organisation_id);

5. Enfin recréer la FK :
ALTER TABLE etablissements ADD CONSTRAINT fk_etab_organisation FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE;

---

## SQL

```sql
CREATE TABLE `etablissements` (
  `id` bigint UNSIGNED NOT NULL,
  `organisation_id` bigint UNSIGNED NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `code` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `siret` char(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_siege` tinyint(1) NOT NULL DEFAULT '0',
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `adresse_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la table `etablissements`
ALTER TABLE `etablissements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siret` (`siret`),
  ADD KEY `idx_siret` (`siret`),
  ADD KEY `fk_etab_adresse` (`adresse_id`),
  ADD KEY `idx_organisation` (`organisation_id`);

-- AUTO_INCREMENT pour la table `etablissements`
ALTER TABLE `etablissements` MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

-- Contraintes pour la table `etablissements`
ALTER TABLE `etablissements`
  ADD CONSTRAINT `fk_etab_adresse` FOREIGN KEY (`adresse_id`) REFERENCES `adresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_etab_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations` (`id`) ON DELETE CASCADE;
COMMIT;
```

## Structure


| Field           | Type            | Null | Key | Default | Extra          |
| --------------- | --------------- | ---- | --- | ------- | -------------- |
| id              | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| organisation_id | bigint unsigned | NO   | MUL | _NULL_  |                |
| parent_id       | bigint unsigned | YES  |     | _NULL_  |                |
| code            | varchar(25)     | YES  |     | _NULL_  |                |
| telephone       | varchar(50)     | YES  |     | _NULL_  |                |
| email           | varchar(255)    | YES  |     | _NULL_  |                |
| siret           | char(14)        | NO   | UNI | _NULL_  |                |
| nic             | char(5)         | NO   |     | _NULL_  |                |
| nom             | varchar(255)    | YES  |     | _NULL_  |                |
| is_siege        | tinyint(1)      | NO   |     | 0       |                |
| actif           | tinyint(1)      | NO   |     | 1       |                |
| adresse_id      | bigint unsigned | YES  | MUL | _NULL_  |                |
| created_at      | datetime        | YES  |     | _NULL_  |                |
| updated_at      | datetime        | YES  |     | _NULL_  |                |





