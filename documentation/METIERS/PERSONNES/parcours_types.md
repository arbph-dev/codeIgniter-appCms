# parcours_types
Une personne peut avoir un parcours de : salarié, artisan, indépendant, ministre, militaire, journaliste freelance, artiste, retraité...

Le référentiel très générique peut évoluer avec des références aux métiers.

## SQL
On retrouve le même schéma que le reste du modèle :
- organisation_types
- relation_types
- intervention_types
- parcours_types


```sql
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

### seeder
```
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

INSERT INTO parcours_types (code,label,description,created_at,updated_at) VALUES
('naissance','Naissance','Naissance de la personne',NOW(),NOW()),
('formation','Formation','Études et formations',NOW(),NOW()),
('activite','Activité','Activité professionnelle générale',NOW(),NOW()),
('fonction','Fonction','Fonctions occupées (ex : ministre, directeur)',NOW(),NOW()),
('mandat','Mandat','Mandats électifs ou institutionnels',NOW(),NOW()),
('adhesion','Adhésion','Adhésions à des organisations, partis, associations',NOW(),NOW()),
('publication','Publication','Livres, articles, rapports',NOW(),NOW()),
('distinction','Distinction','Prix, décorations, médailles',NOW(),NOW()),
('mission','Mission','Missions spécifiques, opérations militaires, reportages',NOW(),NOW()),
('evenement','Évènement','Évènements marquants divers',NOW(),NOW()),
('deces','Décès','Décès de la personne',NOW(),NOW());
COMMIT;
```

