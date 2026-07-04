

# Strucutre


 Ordre de création respectant les dépendances FK :

0. relation_types          (référentiel, pas de FK)
[[Z/METIERS/identité/relation_types]] 
1. personnes               (auto-référentielle merge_into_id)
2. personne_alias          (→ personnes)
3. personne_identifiants   (→ personnes)
4. personne_parcours       (→ personnes, organisations, adresses)
--   5. personne_relations      (→ personnes, relation_types)
[[Z/METIERS/identité/personne_relations]]


--   6. personne_distinctions   (→ personnes)
--   7. personne_mandats        (→ personnes, organisations)
--   8. personnages             (autonome)
--   9. personnes_role          (→ personnes, personnages)
--  10. view_personne_timeline  (vue)
--
-- FK vers oeuvres ajoutées en PHASE 2 (table oeuvres à venir) :
--   personne_parcours.oeuvre_id
--   personne_mandats.oeuvre_id
--   personnages.oeuvre_id
--   personnes_role.oeuvre_id
-- =========================================================















[[Z/METIERS/identité/personne]]
[[Z/METIERS/identité/personne_alias]]

Relations
- [[Z/METIERS/identité/personne_relations]]
- [[Z/METIERS/identité/relation_types]]

- [[Z/METIERS/identité/personne_distinctions]] vers [[Z/METIERS/distinction]]

voir [[Z/PROJETS/Akinator/a trier#Réflexion sur l'Intégration de l'API OMDB]]
- Film,  Auteur ,Réalisateur, Acteur

# Notes

Déduction automatique

Engagements vers organisation.

 Les `Personnes` se lient à `organisations.id` 
 — elles peuvent donc être liées à une entreprise **ou** une association sans distinction
 
une personne peut être **dirigeant** d'une entreprise
	relation_type = administrateur
ET 
**adhérent** d'une association
	relation_type = membre


créer une VIEW : view_personne_timeline
qui fusionne :parcours,distinctions,publications,engagements.
Très utile pour générer automatiquement une biographie chronologique.

Une propriété vivant BOOLEAN DEFAULT TRUE,
se déduit automatiquement des dates
- si connues
- sinon BOOLEAN doit devenir tri state 0 non vivan, 1 oui vivant, -1 INCONNU vivant
## Structure



```sql
CREATE TABLE personnes (  
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
  
prenoms VARCHAR(255) NOT NULL,  
nom VARCHAR(255) NOT NULL,  
  
nom_complet VARCHAR(255) NOT NULL,  
  
surnom VARCHAR(255) NULL,  
nom_naissance VARCHAR(255) NULL,  
  
sexe ENUM(  
'homme',  
'femme',  
'autre',  
'inconnu'  
) DEFAULT 'inconnu',  
  
naissance_date DATE NULL,  
  
naissance_precision ENUM(  
'annee',  
'mois',  
'jour'  
) NULL,  
  
naissance_lieu VARCHAR(255) NULL,  
  
deces_date DATE NULL,  
  
deces_precision ENUM(  
'annee',  
'mois',  
'jour'  
) NULL,  
  
deces_lieu VARCHAR(255) NULL,  
  
nationalite VARCHAR(255) NULL,  
  
bio TEXT NULL,  
detail LONGTEXT NULL,  
  
slug VARCHAR(255) NULL UNIQUE,  
  
confidence_score TINYINT UNSIGNED NULL,  
verified_at DATETIME NULL,  
  
created_at DATETIME NULL,  
updated_at DATETIME NULL,  
deleted_at DATETIME NULL,  
  
INDEX idx_nom (nom),  
INDEX idx_prenoms (prenoms),  
INDEX idx_nom_complet (nom_complet),  
INDEX idx_slug (slug),  
  
INDEX idx_naissance_date (naissance_date),  
  
FULLTEXT ft_personne (  
prenoms,  
nom,  
nom_complet,  
surnom,  
bio  
)  
)  
ENGINE=InnoDB  
DEFAULT CHARSET=utf8mb4  
COLLATE=utf8mb4_unicode_ci;
```


### Examples

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

---
### Versions

#### PERSONNE — structure enrichie

```sql
CREATE TABLE personnes (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
prenoms VARCHAR(255) NOT NULL,
nom VARCHAR(255) NOT NULL,
nom_complet VARCHAR(255) NOT NULL,
sexe ENUM('H','F','X') NULL,
date_naissance DATE NULL,
date_deces DATE NULL,
nationalite VARCHAR(120) NULL,
profession_principale VARCHAR(255) NULL, -- a eviter 
description_courte TEXT NULL,
niveau_notoriete TINYINT NULL,
vivant BOOLEAN DEFAULT TRUE,
created_at DATETIME NULL,
updated_at DATETIME NULL
);
```


## Backend
app/Models/PersonneModel.php


## Relations
[[Z/METIERS/identité/personne_alias]]
[[Z/METIERS/identité/personne_distinctions]]
[[Z/METIERS/identité/personne_organisation - OBSOLETE]]
[[Z/METIERS/identité/personne_parcours]]


