# personne_alias

## Notes
Une personne peut avoir un nom de scène : Johny Halliday et Philipe SMET

Lorsqu'une personne possède plusieurs alias, on peut afficher un seul alias privilégié en utilisant `is_principal`.

Pour certains usages (nom marital, pseudonyme abandonné...)
- date_debut DATE NULL,
- date_fin DATE NULL,



## Structure

| Field        | Type                                                  | Null | Key | Default | Extra          |
| ------------ | ----------------------------------------------------- | ---- | --- | ------- | -------------- |
| id           | bigint unsigned                                       | NO   | PRI | _NULL_  | auto_increment |
| personne_id  | bigint unsigned                                       | NO   | MUL | _NULL_  |                |
| alias        | varchar(255)                                          | NO   | MUL | _NULL_  |                |
| alias_type   | enum('pseudonyme','nom_naissance','nom_usage','nom... | NO   | MUL | autre   |                |
| is_principal | tinyint(1)                                            | NO   |     | 0       |                |
| date_debut   | date                                                  | YES  |     | _NULL_  |                |
| date_fin     | date                                                  | YES  |     | _NULL_  |                |
| created_at   | datetime                                              | YES  |     | _NULL_  |                |
| updated_at   | datetime                                              | YES  |     | _NULL_  |                |

## SQL

```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Structure de la table `personne_alias`
--

CREATE TABLE `personne_alias` (
  `id` bigint UNSIGNED NOT NULL,

  `personne_id` bigint UNSIGNED NOT NULL,

  `alias` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,

  `alias_type` enum(
    'pseudonyme',
    'nom_naissance',
    'nom_usage',
    'nom_scene',
    'nom_plume',
    'translitteration',
    'autre'
  ) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'autre',

  `is_principal` tinyint(1) NOT NULL DEFAULT '0',

  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,

  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

--
-- Index
--

ALTER TABLE `personne_alias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_personne` (`personne_id`),
  ADD KEY `idx_alias` (`alias`),
  ADD KEY `idx_alias_type` (`alias_type`),
  ADD KEY `idx_personne_alias` (`personne_id`,`alias`);

--
-- AUTO_INCREMENT
--

ALTER TABLE `personne_alias`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes
--

ALTER TABLE `personne_alias`
  ADD CONSTRAINT `fk_personne_alias_personne`
    FOREIGN KEY (`personne_id`)
    REFERENCES `personnes` (`id`)
    ON DELETE CASCADE;

COMMIT;
```
