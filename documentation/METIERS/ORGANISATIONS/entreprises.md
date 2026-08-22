
une entreprise est une forme d'[organisation](/documentation/METIERS/ORGANISATIONS/organisations.md)
- Relation 1-1 , Class Table inheritance voir [CTI](/documentation/METHODES/modelisation.md#class-table-inheritance) 

une entreprise à un **siren** porté par organisation
Le **siret** associé à entreprise doit correspondre à l'établissement siège social. 

le siège social est un établissement, il doit être précisé avec **is_siege**
son adresse doit être renseigné

## SIREN / SIRET / Établissements

```
entreprises (SIREN = identifiant siège)
  └── etablissements (SIRET = SIREN + NIC 5 chiffres)
```

Un SIREN → N établissements (SIRET). 
Le siège social est un établissement parmi d'autres, marqué `is_siege = true`. 
==C'est le modèle INSEE exact.==

```sql
entreprises
  siren CHAR(9) UNIQUE    -- identifiant entreprise

etablissements
  siret    CHAR(14) UNIQUE  -- = siren + nic
  siren    CHAR(9)  FK → entreprises.siren
  is_siege TINYINT(1)
  adresse_id FK → adresses.id
```


## Relations

[[Z/METIERS/economie/Services (d'entreprise)]]
[[Z/METIERS/economie/etablissements]]
[[Z/METIERS/economie/formesjuridiques]]
[[Z/METIERS/economie/organisation]]
[[Z/METIERS/economie/Plan Comptable General]]
[[Z/METIERS/economie/Services (d'entreprise)]]
## Backend
### app/Models/EntrepriseModel.php
```php
    protected $table      = 'entreprises';
    protected $primaryKey = 'id';
```
### app/Controllers/Api/Entreprise.php

## frontend
\assets\js\features\entreprise\entreprise.controller.js
\assets\js\features\entreprise\entreprise.form.js
\assets\js\features\entreprise\entreprise.renderer.js
\assets\js\features\entreprise\entreprise.service.js
\assets\js\features\entreprise\entreprise.store.js
\assets\js\features\entreprise\index.js



---





