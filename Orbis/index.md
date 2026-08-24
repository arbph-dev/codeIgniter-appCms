# Orbis

client/agrégateur Python multi-API, avec authentification factorisée, credentials locaux SQLAlchemy, puis interface PySide6.

## structure

- [main.py](/Orbis/main.py).py
- [main2.py](/Orbis/main2.py).py
- services\
  - services\api\
    - [__init__.py](/Orbis/services/api/__init__.py) 
    - [inpi_client.py](/Orbis/services/api/inpi_client.py)
    - [insee_client.py](/Orbis/services/api/insee_client.py)
    - [personne_client.py](/Orbis/services/api/personne_client.py)
  - services\auth\
    - [__init__.py](/Orbis/services/auth/__init__.py) 
    - [ApiKeyAuth.py](/Orbis/services/auth/ApiKeyAuth.py)
    - [AuthProvider.py](/Orbis/services/auth/AuthProvider.py)
    - [BearerAuth.py](/Orbis/services/auth/BearerAuth.py)
    - [CredentialsStore.py](/Orbis/services/auth/CredentialsStore.py)

----
## Travaux
- simplification des fichiers
- harmonisation credentials et auth



## services\api\

### INSEE / SIREN 
Recherche parmi les unités légales (SIREN).


#### 1- requetes par SIREN
```
GET https://api.insee.fr/api-sirene/3.11/siren/{siren}
```
#### 2- requetes avec paramètres
```
GET https://api.insee.fr/api-sirene/3.11/siren
```
paramètres
- q : siren:xxxxxx, periode(....)
- nombre
- debut

---
Attention autres champs: => api siret pas siren
- etablissementSiege: true
- departementEtablissement:29
- codePostalEtablissement [296000 TO 29999]

#### siren

siren
periode
    denominationUniteLegale
    activitePrincipaleUniteLegale
    categorieJuridiqueUniteLegale
    economieSocialeSolidaireUniteLegale


siren:448451484 =>  OK
- https://api.insee.fr/api-sirene/3.11/siren?q=siren:448451484&nombre=10&debut=0

#### periode

Tous les champs ici ne fonctionne qu'ave periode
- denominationUniteLegale : nom de l'entreprise en majuscule
- activitePrincipaleUniteLegale : code APE NAF

```
periode(denominationUniteLegale:"AQUASUD") =>  OK
https://api.insee.fr/api-sirene/3.11/siren?q=periode(denominationUniteLegale:"AQUASUD")&nombre=10&debut=0
```
- requetes conformes 
```
periode(denominationUniteLegale:GAZ) => ok
periode(denominationUniteLegale:"THERMES MARINS") =>  OK
```
- erreur sans période
```
denominationUniteLegale:GAZ   => 400
denominationUniteLegale:"GAZ" => 400
```

##### denominationUniteLegale
ne fonctionne pas sans periode

```
periode(denominationUniteLegale:GAZ) => ok
periode(denominationUniteLegale:THERMES) => ok
periode(denominationUniteLegale:"GAZ") => ok
periode(denominationUniteLegale:"THERMES MARINS") =>  OK
```

Requête Lucene: periode(denominationUniteLegale:THERMES MARINS) => erreur a cause de espace ? => guillemets

a voir
- denominationUsuelle1UniteLegale
- denominationUsuelle2UniteLegale
- denominationUsuelle3UniteLegale


##### activitePrincipaleUniteLegale
ne fonctionne pas sans periode
```
periode(denominationUniteLegale:THERMES AND activitePrincipaleUniteLegale:96.04Z) =>  OK
```


##### categorieJuridiqueUniteLegale
```
periode(categorieJuridiqueUniteLegale:5710 AND economieSocialeSolidaireUniteLegale:O) => ok
```

##### economieSocialeSolidaireUniteLegale
valeur de champ: O/N  => ok O oui N non

```
periode(activitePrincipaleUniteLegale:96.04Z AND economieSocialeSolidaireUniteLegale:O)
periode(activitePrincipaleUniteLegale:96.04Z AND economieSocialeSolidaireUniteLegale:N)
```

##### A tester
```
periode(activitePrincipaleUniteLegale:68.10Z) AND categorieEntreprise:PME
denominationUniteLegale:BOUYGUES AND etatAdministratifUniteLegale:A
```

à tester
- 0 ou 1
- True /False
- Oui Ou Non
```
periode(activitePrincipaleUniteLegale:96.04Z AND economieSocialeSolidaireUniteLegale:O)
periode(activitePrincipaleUniteLegale:96.04Z AND economieSocialeSolidaireUniteLegale:N)
```

-----


### INSEE / SIRET

GET /siret?q=denominationUsuelleEtablissement:"BURGER KING"

siret
- q : siret:xxxxxx, nombre , debut


- q : periode(), nombre , debut
periode() ??

#### codePostalEtablissement
codePostalEtablissement:[29000 TO 29999]

departementEtablissement:29

codePostalEtablissement:75001 AND departementEtablissement:75
