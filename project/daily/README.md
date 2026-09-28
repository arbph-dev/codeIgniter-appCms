# DAILY
Le refactoring touche à sa fin 

On reprendra en documentation toutes les ressources frontend , web et python, backend php codeigniter dans 3 dossiers "application"
- assets
- app
- python

chaque fichier **frontend - web** employé est listé dans le fichier et associé à une note dans l'arborescence annexe : 
- [/assets/ressources.md](/assets/ressources.md)
  - chaque fonction importée doit être répertorié et expliqué si besoin


## [project/Tasks.md](/project/Tasks.md)
Mobilise beaucoup de ressources
- Frontend ui
  - construire un mini dashboard admin dans ui.html / uiapp.js priorité - #1 voir [`2026-09-26-005`](/project/daily/2026-09-26-005.md) et [uiapp.js](/WebUI/uiapp.js) 
- Backend
  - Authentification -> TEST Register à faire
  - Administration
  - Métier
    -  Tasks 


# PROJETS
On doit lister les projets et les ressources, front, backend, notes

- Authentification
- Administration
- CMS
- Métiers
  - Adresse
  - Tasks
- Frontend
  - Python
  - Web


## [Authentification](/documentation/authentification.md)





# Dossier
les dossiers importants
- [documentation/MIGRATIONS](/documentation/MIGRATIONS)



# Endpoint
les Endpoint sont associés a des projets, route, controller, service models et entities

on doit détailler les usages et les réponses


# Notes et taches

### 2026-09-27-001-N001
- [ ] Dans admin exploiter SELECT * FROM `auth_logins` pour voir log ou recherche


### 2026-09-27-001-N002
organisation_id : is_natural (accepte 0) car la migration a DEFAULT 0.
defaut casté en boolean (comme actif dans Relation).
Méthodes utilitaires prêtes pour le register et le select multi-profils de la toolbar.
Pas de soft-delete (conforme à la table)

### 2026-09-28-001-N000
documentation/ROADMAP/INVENTORY_index.md - SectionPanels

### 2026-09-28-001-N001
table `user_profils` et organisations : 0 interdit si FK RESTRICT sans ligne id=0 , utiliser un id réel ou assouplir le seed
- A revoir
```sql
organisation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
```
