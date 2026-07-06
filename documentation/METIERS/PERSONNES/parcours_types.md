# parcours_types
Une personne peut avoir un parcours de : salarié, artisan, indépendant, ministre, militaire, journaliste freelance, artiste, retraité...

Le référentiel très générique peut évoluer avec des références aux métiers.

## SQL
On retrouve le même schéma que le reste du modèle :
- organisation_types
- relation_types
- intervention_types
- parcours_types


```
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `parcours_types` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `parcours_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`);

ALTER TABLE `parcours_types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

COMMIT;
```

Puis un seeder du style :
```
INSERT INTO parcours_types (code,label) VALUES
('naissance','Naissance'),
('formation','Formation'),
('activite','Activité'),
('fonction','Fonction'),
('mandat','Mandat'),
('adhesion','Adhésion'),
('publication','Publication'),
('distinction','Distinction'),
('mission','Mission'),
('evenement','Évènement'),
('deces','Décès');
```

