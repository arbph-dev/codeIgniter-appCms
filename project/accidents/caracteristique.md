fichier CARACTERISTIQUES - CSV

- `num_acc` (PK string), `an` (int), `mois`, `jour`, `hrmn`, `lum`, `agg`, `int`, `atm`, `col`, `com`, `adr`, `gps`, `lat` (decimal), `long` (decimal), `dep`
- index : (`an`), (`dep`), (`col`), (`mois`), (`lat`,`long`)


## Data
```
CARACTERISTIQUES
Num_Acc,an,mois,jour,hrmn,lum,agg,int,atm,col,com,adr,gps,lat,long,dep
201600000299,16,6,6,1700,1,2,1,1,6,767,place louis lebel,M,5038178,0233586,620
201600000300,16,7,8,1230,1,2,1,1,3,138,D 104 PR 25 + 400,M,5043041,0217241,620
201600000301,16,7,29,1300,1,2,1,1,1,717,RD8,M,5036494,0238799,620
201600000302,16,9,10,1045,1,1,1,1,6,835,,M,5043903,0237041,620
201600000303,16,9,13,2000,2,1,1,1,1,450,,M,5043790,0231791,620
```

## Champs
### Num_Acc
Numéro d'identifiant de l’accident

### Date
#### jour
Jour de l'accident
#### mois
Mois de l'accident
#### an
Année de l'accident
#### hrmn
Heure et minutes de l'accident

### lum
Lumière : conditions d’éclairage dans lesquelles l'accident s'est produit
1 – Plein jour
2 – Crépuscule ou aube
3 – Nuit sans éclairage public
4 - Nuit avec éclairage public non allumé
5 – Nuit avec éclairage public allumé

### dep
Département : 
Code INSEE du département suivi d'un 0 (201 Corse-du-Sud - 202 Haute-Corse)

### com
Commune : Le numéro de commune est un code donné par l‘INSEE. Le code comporte 3 chiffres calés à droite.

### agg
Localisation :
1 – Hors agglomération
2 – En agglomération

### int
Intersection :
1 – Hors intersection
2 – Intersection en X
3 – Intersection en T
4 – Intersection en Y
5 - Intersection à plus de 4 branches
6 - Giratoire
7 - Place
8 – Passage à niveau
9 – Autre intersection

### atm
Conditions atmosphériques :
1 – Normale
2 – Pluie légère
3 – Pluie forte
4 – Neige - grêle
5 – Brouillard - fumée
6 – Vent fort - tempête
7 – Temps éblouissant
8 – Temps couvert
9 – Autre

### col
Type de collision :
1 – Deux véhicules - frontale
2 – Deux véhicules – par l’arrière
3 – Deux véhicules – par le coté
4 – Trois véhicules et plus – en chaîne
5 – Trois véhicules et plus - collisions multiples
6 – Autre collision
7 – Sans collision

### adr
Adresse postale : variable renseignée pour les accidents survenus en agglomération

### gps
Codage GPS :1 caractère indicateur de provenance :
M = Métropole
A = Antilles (Martinique ou Guadeloupe)
G = Guyane
R = Réunion
Y = Mayotte

Coordonnées géographiques en degrés décimaux :
### lat 
Latitude

### long
Longitude
