[](/documentation/METIERS/)


# [ADRESSE](/documentation/METIERS/ORGANISATIONS/Adresse.md)

# [ORGANISATIONS/](/documentation/METIERS/ORGANISATIONS/)

## Classes
- [entreprises](/documentation/METIERS/ORGANISATIONS/entreprises.md)
- [etablissements](/documentation/METIERS/ORGANISATIONS/entreprises.md) VOIR

## Règles 
- une organisation est l'unité principale
- une entreprise est une organisation 
- une entreprise possèdes des établissemnts

## relation
 organisation - entreprise 1-1 + polymorphisme => CTI

| table | champ | type de champ | table et champ liée |
| --- | --- | --- |--- |
| entreprises | organisation_id | bigint unsigned | organisation / id |
| entreprises | codenaf_id| varchar(10) | --- / --- | 
 
## tag
**polymorphisme**

## voir
- relation entreprise établissement prévue doit se généraliser : une association secours populaire a un siège et des établissements




