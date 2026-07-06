

# Strucutre


## modules liés
- relation
	- relations
	- relation_types          (référentiel, pas de FK)
- adresse
- distinction

## module
- personnes               (auto-référentielle merge_into_id)
- personne_alias          (→ personnes)
- personne_parcours       (→ personnes, organisations, adresses)


voir [[Z/PROJETS/Akinator/a trier#Réflexion sur l'Intégration de l'API OMDB]]
- Film,  Auteur ,Réalisateur, Acteur

## Notes

`personnes` se lient à `organisations` 
elles peuvent donc être liées à une entreprise **ou** une association sans distinction
 
une personne peut être :
- **dirigeant** d'une entreprise => relation_type = administrateur
- **adhérent** d'une association =>	relation_type = membre


créer une VIEW : view_personne_timeline
qui fusionne :parcours,distinctions,publications,engagements.
Très utile pour générer automatiquement une biographie chronologique.

Une propriété vivant BOOLEAN DEFAULT TRUE,
se déduit automatiquement des dates
- si connues
- sinon BOOLEAN doit devenir tri state 0 non vivan, 1 oui vivant, -1 INCONNU vivant

## Structure

| Field                | Type                        | Null | Key | Default | Extra          |
| -------------------- | --------------------------- | ---- | --- | ------- | -------------- |
| id                   | bigint unsigned             | NO   | PRI | _NULL_  | auto_increment |
| nom                  | varchar(255)                | NO   | MUL | _NULL_  |                |
| prenoms              | varchar(255)                | NO   | MUL | _NULL_  |                |
| nom_complet          | varchar(512)                | NO   | MUL | _NULL_  |                |
| nom_naissance        | varchar(255)                | YES  |     | _NULL_  |                |
| civilite             | varchar(20)                 | YES  |     | _NULL_  |                |
| sexe                 | char(1)                     | YES  |     | _NULL_  |                |
| date_naissance       | date                        | YES  | MUL | _NULL_  |                |
| precision_naissance  | enum('annee','mois','jour') | YES  |     | _NULL_  |                |
| naissance_adresse_id | bigint unsigned             | YES  | MUL | _NULL_  |                |
| date_deces           | date                        | YES  |     | _NULL_  |                |
| precision_deces      | enum('annee','mois','jour') | YES  |     | _NULL_  |                |
| deces_adresse_id     | bigint unsigned             | YES  | MUL | _NULL_  |                |
| nationalite          | varchar(120)                | YES  |     | _NULL_  |                |
| bio                  | text                        | YES  |     | _NULL_  |                |
| detail               | longtext                    | YES  |     | _NULL_  |                |
| slug                 | varchar(255)                | YES  | UNI | _NULL_  |                |
| source               | varchar(100)                | YES  |     | _NULL_  |                |
| quality_score        | tinyint unsigned            | YES  |     | _NULL_  |                |
| verified_at          | datetime                    | YES  |     | _NULL_  |                |
| verified_by          | int unsigned                | YES  | MUL | _NULL_  |                |
| merge_into_id        | bigint unsigned             | YES  | MUL | _NULL_  |                |
| created_at           | datetime                    | YES  |     | _NULL_  |                |
| updated_at           | datetime                    | YES  |     | _NULL_  |                |
| deleted_at           | datetime                    | YES  |     | _NULL_  |                |


## SQL

```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `personnes` (
  `id` bigint UNSIGNED NOT NULL,

  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenoms` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_complet` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,

  `nom_naissance` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civilite` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexe` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `date_naissance` date DEFAULT NULL,
  `precision_naissance` enum('annee','mois','jour') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naissance_adresse_id` bigint UNSIGNED DEFAULT NULL,

  `date_deces` date DEFAULT NULL,
  `precision_deces` enum('annee','mois','jour') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deces_adresse_id` bigint UNSIGNED DEFAULT NULL,

  `nationalite` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `bio` text COLLATE utf8mb4_unicode_ci,
  `detail` longtext COLLATE utf8mb4_unicode_ci,

  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `quality_score` tinyint UNSIGNED DEFAULT NULL,

  `verified_at` datetime DEFAULT NULL,
  `verified_by` int UNSIGNED DEFAULT NULL,

  `merge_into_id` bigint UNSIGNED DEFAULT NULL,

  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `personnes`
  ADD PRIMARY KEY (`id`),

  ADD UNIQUE KEY `slug` (`slug`),

  ADD KEY `idx_nom` (`nom`),
  ADD KEY `idx_prenoms` (`prenoms`),
  ADD KEY `idx_nom_complet` (`nom_complet`),
  ADD KEY `idx_naissance` (`date_naissance`),

  ADD KEY `idx_naissance_adresse` (`naissance_adresse_id`),
  ADD KEY `idx_deces_adresse` (`deces_adresse_id`),

  ADD KEY `idx_verified_by` (`verified_by`),
  ADD KEY `idx_merge` (`merge_into_id`);

ALTER TABLE `personnes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `personnes`
  ADD CONSTRAINT `fk_personne_naissance_adresse`
    FOREIGN KEY (`naissance_adresse_id`)
    REFERENCES `adresses` (`id`)
    ON DELETE SET NULL,

  ADD CONSTRAINT `fk_personne_deces_adresse`
    FOREIGN KEY (`deces_adresse_id`)
    REFERENCES `adresses` (`id`)
    ON DELETE SET NULL,

  ADD CONSTRAINT `fk_personne_verified_by`
    FOREIGN KEY (`verified_by`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL,

  ADD CONSTRAINT `fk_personne_merge`
    FOREIGN KEY (`merge_into_id`)
    REFERENCES `personnes` (`id`)
    ON DELETE SET NULL;

COMMIT;
```


### seeder

```cs
id,prenoms,nom,nom_complet,surnom,nom_naissance,sexe,naissance_date,naissance_precision,naissance_lieu,deces_date,deces_precision,deces_lieu,nationalite,bio,detail,slug,confidence_score,verified_at,created_at,updated_at,deleted_at
1,"Mémona","Hintermann","Mémona Hintermann",,"Afféjee","femme","1952-01-19","jour","Le Tampon, La Réunion, France",,,,,"française","Mémona Hintermann est une journaliste et grand reporter française spécialisée dans les conflits internationaux.","<p>Mémona Hintermann, née Mémoona Afféjee le 19 janvier 1952 au Tampon à La Réunion, est une journaliste française connue pour son travail de grand reporter à France 3 et ses prises de position sur la diversité et l'audiovisuel public.</p>","memona-hintermann",95,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
2,"Lutz","Krusche","Lutz Krusche",,,"homme",,,,,"allemande","Lutz Krusche est un journaliste allemand et écrivain.","<p>Lutz Krusche est un journaliste allemand marié à Mémona Hintermann depuis 2001.</p>","lutz-krusche",70,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
3,"Éric","Hintermann","Éric Hintermann",,,"homme",,,,,"suisse","Éric Hintermann est un journaliste suisse.","<p>Éric Hintermann est un journaliste suisse connu notamment pour son mariage avec Mémona Hintermann.</p>","eric-hintermann",60,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
4,"Jean-Pierre","Bel","Jean-Pierre Bel",,,"homme","1951-01-01","annee","Lavaur, Tarn, France",,,,,"française","Jean-Pierre Bel est un homme politique français.","<p>Jean-Pierre Bel a été président du Sénat de 2011 à 2014.</p>","jean-pierre-bel",85,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
5,"Albert","Londres","Albert Londres",,,"homme","1884-11-01","jour","Vichy, Allier, France","1932-05-16","jour","Golfe d'Aden","française","Albert Londres est considéré comme l'un des grands reporters français du XXe siècle.","<p>Albert Londres a profondément marqué le journalisme d'investigation français.</p>","albert-londres",98,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
6,"Florence","Aubenas","Florence Aubenas",,,"femme","1961-02-06","jour","Bruxelles, Belgique",,,,,"française","Florence Aubenas est une journaliste et grand reporter française.","<p>Florence Aubenas travaille notamment pour Le Monde et a couvert plusieurs conflits internationaux.</p>","florence-aubenas",92,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
7,"Joseph","Kessel","Joseph Kessel",,,"homme","1898-02-10","jour","Villa Clara, Argentine","1979-07-23","jour","Avernes, Val-d'Oise, France","française","Joseph Kessel est un écrivain et journaliste français.","<p>Joseph Kessel fut membre de l'Académie française et auteur du Lion et de l'Armée des ombres.</p>","joseph-kessel",96,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
8,"Hubert","Beuve-Méry","Hubert Beuve-Méry","Sirius",,"homme","1902-01-05","jour","Paris, France","1989-08-06","jour","Fontainebleau, Seine-et-Marne, France","française","Hubert Beuve-Méry est le fondateur du journal Le Monde.","<p>Hubert Beuve-Méry a fondé Le Monde en 1944 à la demande du général de Gaulle.</p>","hubert-beuve-mery",90,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
9,"Anne","Nivat","Anne Nivat",,,"femme","1969-06-18","jour","Boulogne-Billancourt, Hauts-de-Seine, France",,,,,"française","Anne Nivat est une journaliste française spécialiste des zones de guerre.","<p>Anne Nivat est connue pour ses reportages en Afghanistan, Irak et Russie.</p>","anne-nivat",89,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00",
10,"Ryszard","Kapuscinski","Ryszard Kapuscinski",,,"homme","1932-03-04","jour","Pinsk, Pologne","2007-01-23","jour","Varsovie, Pologne","polonaise","Ryszard Kapuscinski est un journaliste et écrivain polonais.","<p>Ryszard Kapuscinski est considéré comme une figure majeure du grand reportage littéraire.</p>","ryszard-kapuscinski",94,"2026-05-27 00:00:00","2026-05-27 00:00:00","2026-05-27 00:00:00"
```



## Backend
app/Models/PersonneModel.php - a revoir


## Relations
[[Z/METIERS/identité/personne_alias]]
[[Z/METIERS/identité/personne_distinctions]]
[[Z/METIERS/identité/personne_organisation - OBSOLETE]]
[[Z/METIERS/identité/personne_parcours]]


