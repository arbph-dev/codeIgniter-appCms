# Evenements

## Tâches
- [ ] Compléter le document
- [X] liers les document
- [ ] ajouter created_at, updated_at (traçabilité)     
- [ ] gestion des sources (livre,site, vidéo, film, témoins)
- [ ] Décrire les données



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



## Relations récapitulatives

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
