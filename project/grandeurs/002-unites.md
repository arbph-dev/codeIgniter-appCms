
# unités




## table : unites
- id
- dimension_id
- code
- nom
- symbole
- facteur
- offset
- est_reference
- ordre_affichage
- description
- created_at
- updated_at
- deleted_at

### note 
- symbole a faire évoluer vers VARCHAR(32)
- champ **code** comme pour les dimensions , a faire évoluer vers VARCHAR(64)


- champ **est_reference** indique  quelle unité est la référence. Une seule unité de référence doit exister par dimension.
Vérification réalisé dans le service métier ou une procédure d'administration
|Dimension|Unité|Référence|
|---|---|---|
|Longueur|mm|non|
|Longueur|cm|non|
|Longueur|m|oui|
|Longueur|km|non|

- éviter FLOAT ou DOUBLE, DECIMAL conserve une précision déterministe, ce qui est préférable pour des calculs techniques et des conversions répétées.

- champ : **ordre_affichage** (SMALLINT UNSIGNED)
on affiche très souvent les unités dans des listes déroulantes ce champ permet d emettre le sunités prtiques ou légales en avant. 

-ajouter plus tard une table de préférences d'affichage.
unites_preferences
- id
- dimension_id
- contexte
- unite_id

un champ systeme dans unites

|Valeur|Exemple|
|---|---|
|SI|m, kg, K, Pa|
|TECHNIQUE|mm, bar, kWh|
|IMPERIAL|inch, ft, psi, °F|
|US|gallon, BTU|




### Index
- PK(id)
- FK(dimension_id)
- INDEX(symbole)
- UNIQUE(dimension_id,symbole)

note : UNIQUE(dimension_id,symbole) est une clef basé sur 2 champs

## Seeder
Prévoir une trentaine d'unités.

### Longueur
- mm
- cm
- m
- km
### Température
- °C
- K
### Pression
- Pa
- kPa
- bar
### Puissance
- W
- kW
- MW
### Énergie
- Wh
- kWh
- J
- MJ
### Débit
- m³/s
- m³/h
- L/s
- L/min
