
une entreprise est une forme d'organisation [[Z/METIERS/economie/organisation]]
[[#Entreprise = type d'Organisation ?]]

une entreprise à un **siren** porté par [[Z/METIERS/economie/organisation]]
Le **siret** associé à entreprise doit correspondre à l'établissement siège social

le siège social est un établissement, il doit être précisé avec **is_siege** dans [[Z/METIERS/economie/etablissements]]
## Structure

| Field              | Type            | Null | Key | Default | Extra          |
| ------------------ | --------------- | ---- | --- | ------- | -------------- |
| id                 | bigint unsigned | NO   | PRI | _NULL_  | auto_increment |
| organisation_id    | bigint unsigned | NO   | UNI | _NULL_  |                |
| **siret**          | char(14)        | YES  | UNI | _NULL_  |                |
| codenaf_id         | varchar(10)     | YES  | MUL | _NULL_  |                |
| forme_juridique_id | char(4)         | YES  | MUL | _NULL_  |                |
| capital            | decimal(15,2)   | YES  |     | _NULL_  |                |
| effectif_min       | int unsigned    | YES  |     | _NULL_  |                |
| effectif_max       | int unsigned    | YES  |     | _NULL_  |                |
| created_at         | datetime        | YES  |     | _NULL_  |                |
| updated_at         | datetime        | YES  |     | _NULL_  |                |


SHOW COLUMNS FROM entreprises;

|                    |                 |     |     |        |                |
| ------------------ | --------------- | --- | --- | ------ | -------------- |
| id                 | bigint unsigned | NO  | PRI | _NULL_ | auto_increment |
| organisation_id    | bigint unsigned | NO  | UNI | _NULL_ |                |
| siret              | char(14)        | YES | UNI | _NULL_ |                |
| codenaf_id         | varchar(10)     | YES | MUL | _NULL_ |                |
| forme_juridique_id | char(4)         | YES | MUL | _NULL_ |                |
| capital            | decimal(15,2)   | YES |     | _NULL_ |                |
| effectif_min       | int unsigned    | YES |     | _NULL_ |                |
| effectif_max       | int unsigned    | YES |     | _NULL_ |                |
| created_at         | datetime        | YES |     | _NULL_ |                |
| updated_at         | datetime        | YES |     | _NULL_ |                |

SHOW INDEX FROM entreprises;

| Table       | Non_unique | Key_name        | Seq_in_index | Column_name        | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
| ----------- | ---------- | --------------- | ------------ | ------------------ | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- | ---------- |
| entreprises | 0          | PRIMARY         | 1            | id                 | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 0          | organisation_id | 1            | organisation_id    | A         | 0           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 0          | siret           | 1            | siret              | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | idx_siret       | 1            | siret              | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | idx_codenaf     | 1            | codenaf_id         | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| entreprises | 1          | fk_ent_fj       | 1            | forme_juridique_id | A         | 0           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |




## Relations

[[Z/METIERS/economie/Services (d'entreprise)]]
[[Z/METIERS/economie/etablissements]]
[[Z/METIERS/economie/formesjuridiques]]
[[Z/METIERS/economie/organisation]]
[[Z/METIERS/economie/Plan Comptable General]]
[[Z/METIERS/economie/Services (d'entreprise)]]
## Backend
### app/Models/EntrepriseModel.php

### app/Controllers/Api/Entreprise.php

## frontend
\assets\js\features\entreprise\entreprise.controller.js
\assets\js\features\entreprise\entreprise.form.js
\assets\js\features\entreprise\entreprise.renderer.js
\assets\js\features\entreprise\entreprise.service.js
\assets\js\features\entreprise\entreprise.store.js
\assets\js\features\entreprise\index.js

```python
    protected $table      = 'entreprises';
    protected $primaryKey = 'id';
```

---


## Entreprise = type d'Organisation ?

**Recommandation : Class Table Inheritance**

```
organisations          ← table mère (commun à tous)
  └── entreprises      ← extension avec les champs métier spécifiques
  └── associations     ← future extension
```

`organisations` porte ce qui est universel : nom, type, adresse, contacts, liens sociaux, images. 
`entreprises` porte ce qui est strictement entreprise : SIREN, SIRET, CodeNAF, FormeJuridique.


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
