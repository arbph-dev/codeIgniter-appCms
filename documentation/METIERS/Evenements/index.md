# Evenements

## Tâches
- [ ] Compléter le document
- [X] liers les document
- [ ] ajouter created_at, updated_at (traçabilité)     
- [ ] gestion des sources (livre,site, vidéo, film, témoins)
- [ ] Décrire les données

## Relations récapitulatives
Events ↔ Locations : Many-to-Many (un bombardement touche plusieurs lieux)
Events ↔ Targets : Many-to-Many (plusieurs objectifs par événement)
Events → Casualties : One-to-Many (plusieurs victimes par événement)
Events → Aircraft : One-to-Many (plusieurs avions impliqués par événement)
Events ↔ Military_units : Many-to-Many (plusieurs unités par événement)
Events ↔ Resistance_members : Many-to-Many (optionnel)

