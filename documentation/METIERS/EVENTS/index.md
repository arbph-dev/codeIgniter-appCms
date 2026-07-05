# Evenements

## Tâches
- [ ] Compléter le document
- [X] liers les document
- [ ] ajouter created_at, updated_at (traçabilité)     
- [ ] gestion des sources (livre,site, vidéo, film, témoins)
- [ ] Décrire les données

## Tables

| table                   | champs  |     |                      |                       |                       |             |            |      |             |            |            |
| ----------------------- | ------- | --- | -------------------- | --------------------- | --------------------- | ----------- | ---------- | ---- | ----------- | ---------- | ---------- |
| evenements              | id (PK) | nom | description          | date                  | time (nullable)       |             |            |      |             | created_at | updated_at |
| lieux                   | id      | nom | description          |                       |                       |             |            | type |             |            |            |
| evenement_lieux         | id      | nom | evenement_id         | lieu_id (FK)          |                       |             |            |      |             |            |            |
| targets                 | id      | nom |                      |                       |                       |             |            | type |             |            |            |
| event_target            | id      |     | evenement_id (FK)    | target_id (FK)        |                       |             |            |      |             |            |            |
| casualties              | id      | nom | evenement_id (FK)    | age (nullable)        | birth_date (nullable) | birth_place | occupation | type | nationality | created_at | updated_at |
| aircraft                | id      |     | evenement_id (FK)    |                       | status                | crew_info   |            | type | nationality | created_at | updated_at |
| military_units          | id      | nom |                      |                       |                       |             |            | type | nationality | created_at | updated_at |
| event_military_unit     | id      |     | evenement_id (FK)    | military_unit_id (FK) | role                  |             |            |      |             |            |            |
| resistance_members      | id      | nom | description          |                       |                       |             |            |      |             | created_at | updated_at |
| event_resistance_member | id      |     | resistance_member_id |                       |                       |             |            |      |             |            |            |

### evenements

- [ ] datetime_text (texte descriptif de la date/heure) ?? date avant 1971...

---
### lieux

 Taches
- [ ] rapprocher de ADRESSE/LIEUX
- [ ] a créer les villes et adresse
- [ ] a réfléchir type de lieu, **typeLieux** créer table pivot ??

Les lieux ont  un type qui peut évoluer dans le temps.
Par exemple la carrière vers stockage v1 vers carrière. Par défaut c'est la date de l'event qui sera déterminant


---


### Table pivot : evenements_lieux
table pivot : evenement_lieux
un événement peut concerner plusieurs lieux

**Relation** : Many-to-Many entre **events** et **lieux** 

---
### Table : targets
table: **targets**
 - [ ] a réfléchir type de lieu, créer table pivot ??
id (clé primaire)
name (objectif : centre de triage, base aérienne, pont, usine, etc.)
type (militaire, civil, ferroviaire, industriel)
created_at, updated_at
  
### Table pivot : event_target

id (clé primaire)
evenement_id (clé étrangère vers events)
target_id (clé étrangère vers targets)

**Relation** : Many-to-Many entre **events** et **targets**

### Table : casualties

id (clé primaire)
event_id (clé étrangère vers events)
name (nom de la victime)
age (âge, nullable)
birth_date (date de naissance, nullable)
birth_place (lieu de naissance, nullable)
occupation (profession, nullable)
type (civil, militaire)
nationality (française, canadienne, anglaise, allemande, etc.)
created_at, updated_at

**Relation** : One-to-Many (events hasMany casualties)

### Table : aircraft

id (clé primaire)
event_id (clé étrangère vers events)
type (B17, Lancaster, Mosquito, etc.)
nationality (RAF, USAF, Luftwaffe)
status (abattu, endommagé)
crew_info (informations sur l'équipage, nullable)
created_at, updated_at


- serianlnumber string 25 pour identifer les appareils
a voir pour requete distinct B17-F;B17-G

**Relation** : One-to-Many (events hasMany aircraft)

### Table : military_units

id (clé primaire)
name (nom de l'unité : 120e régiment d'infanterie, 30e Division US, etc.)
type (régiment, division, escadrille)
nationality
created_at, updated_at

### Table pivot : event_military_unit

id (clé primaire)
event_id (clé étrangère vers events)
military_unit_id (clé étrangère vers military_units)
role (attaquant, défenseur, libérateur)

**Relation** : Many-to-Many entre events et military_units

### resistance_members
optionnelle

id (clé primaire)
name
role
description
created_at, updated_at

  
### event_resistance_member
Table pivot optionnelle

event_id
resistance_member_id


---

## Import de données

a créer 
- les lieux depuis villes et adresse
	- Saint-Leu-d'Esserent, Creil, Cramoisy
- **typeLieux** type de lieux
	- (ville, base aérienne, gare, carrière, etc.)


---



## Relations 
evenements ↔ lieux :
Many-to-Many (un bombardement touche plusieurs lieux)

evenements ↔ Targets : 
Many-to-Many (plusieurs objectifs par événement)

evenements → Casualties : 
One-to-Many (plusieurs victimes par événement)

evenements → Aircraft :
One-to-Many (plusieurs avions impliqués par événement)

evenements ↔ Military_units :
Many-to-Many (plusieurs unités par événement)

evenements ↔ Resistance_members :
Many-to-Many (optionnel)

Military_units , Resistance_members a rapprocher des organisations 
