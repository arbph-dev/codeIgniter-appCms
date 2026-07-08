
# unistés


## table : unites
- id
- dimension_id
- nom
- symbole
- facteur
- offset
- description

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
