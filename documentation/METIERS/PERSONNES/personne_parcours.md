# personne_parcours

Très important : un parcours n’est PAS une relation.C’est un évènement temporel.

un parcours doit obligatoirement avoir un type

## SQL

```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `personne_parcours` (

  `id` bigint UNSIGNED NOT NULL,

  `personne_id` bigint UNSIGNED NOT NULL,

  -- nature de l'évènement
  `type` BIGINT UNSIGNED NOT NULL,

  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  -- période
  `date_debut` date DEFAULT NULL,
  `precision_debut` enum('annee','mois','jour') DEFAULT NULL,

  `date_fin` date DEFAULT NULL,
  `precision_fin` enum('annee','mois','jour') DEFAULT NULL,

  -- objet concerné
  `structure_objet`
      enum('organisation','entreprise','etablissement')
      COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `structure_id` bigint UNSIGNED DEFAULT NULL,

  `adresse_id` bigint UNSIGNED DEFAULT NULL,

  `source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,

  PRIMARY KEY (`id`),

  KEY `idx_personne` (`personne_id`),
  KEY `idx_type` (`type`),
  KEY `idx_debut` (`date_debut`),
  KEY `idx_fin` (`date_fin`),
  KEY `idx_structure` (`structure_objet`,`structure_id`),
  KEY `idx_adresse` (`adresse_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `personne_parcours`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `personne_parcours`
  ADD CONSTRAINT `fk_parcours_personne`
    FOREIGN KEY (`personne_id`)
    REFERENCES `personnes` (`id`)
    ON DELETE CASCADE,

  ADD CONSTRAINT `fk_parcours_adresse`
    FOREIGN KEY (`adresse_id`)
    REFERENCES `adresses` (`id`)
    ON DELETE SET NULL,

  ADD CONSTRAINT `fk_personne_parcours_type`
    FOREIGN KEY (`type`)
    REFERENCES `parcours_types` (`id`)
    ON DELETE RESTRICT;

COMMIT;


```

## Exemples :
titre
Grand reporter
Conseillère au CSA
Présentatrice Soir 3

## backend
### Model 
app/Models/PersonneParcoursModel.php

