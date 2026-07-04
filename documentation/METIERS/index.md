# METIERS

## Economie

### Organisation
Une Organisation est la classe principale elle 


### Entreprises

### Etablissements
Les **Etablissement**, dont le siège social, ont chacun :
- un **SIRET** différent
-  un code **NIC**
-  une **Adresse** propre et unique (le module adresse permet cette distinction)


```mermaid
classDiagram
    %% ====================
    %%     Etablissements
    %% ====================
    class Etablissement {
        +int id
        +string name
        +string siret
        +class address
        +string phone
        +string email
        +bool is_head_office
    }
    
    Entreprise --> Etablissement : "1..* établissements"
    address --> Etablissement : "1..1 établissements"
```
### Services (d'entreprise)
==a distinguer des prestations (de service)==

- un **service entreprise** est un **service** d'une **entreprise**
- Les **services** sont composés de **salariés** qui ont  des **fonctions**
- un **service** direction est présent dans plusieurs **Entreprise** 
- un **service entreprise** à un parent service d'entreprise (relation hiérarchique ), les relations hiérarchiques sont propre a chaque **entreprise**

## Evolutions
### activites_etablissement (pivot)
Les **activites_etablissement** (pivot)
- aeEtab_id -> ( etablissement->entreprise_id ) -> entreprise.id
- aeAct_id -> naf.id ->  activites du referentiel insee
- aeNom -> appellation interne de l'activité
  

---
## CMS

---
## Knowledge Management
