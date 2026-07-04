# METIERS

## Economie

### Interaction
```mermaid
  flowchart LR
    %% ================================
    %%        COMPTABILITE
    %% ================================
    subgraph COMPTA[Module : Comptabilité]
        PLANPCG[Plan Comptable]
        ECRITURES[Ecritures comptables]
        REGLEMENT[Reglements]
        ANALYTIQUE[Analytique]
    end
	
    subgraph CRM[Module : Commercial]
        FACTURATION[Facturation]
    end

    subgraph PAIE[Module : Paie]
        CHARGES[Charges sociales/patronales]
    end
    
    subgraph MAINT[Module : Maintenance]
        GMAO[Ordres de travail]
    end
    
    
    subgraph CORE[Module : Core Système]
        USERS[Gestion des Utilisateurs]
    end

    subgraph PROD[Production]
        EQP[Équipements énergie]
        PRODREP[Rapports de production]
    end

	A@{ shape: doc, label: "Factures" }

    USERS --> COMPTA
    FACTURATION --> ECRITURES
    CHARGES --> ECRITURES
    EQP --> A
    A --> ECRITURES
    GMAO --> ANALYTIQUE
    PRODREP --> ANALYTIQUE
    
```
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
