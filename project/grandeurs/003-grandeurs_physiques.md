# grandeurs physiques


## Note

- unite_defaut_id
Evolution : supprimer **unite_defaut_id** et laisser ce choix à une future table : unites_preferences

- symbole : limité à 16 caractères, devrait suffire

- est_calculable : boolean
pourrait être remplacé une table de stratégies de production


## table : grandeurs_physiques
- id
- dimension_id
- unite_defaut_id *voir note
- nom
- description

### Index
- PK(id)
- FK(dimension_id)
- FK(unite_defaut_id)
- UNIQUE(nom)

## Seeder
Quelques grandeurs.
- Longueur
- Hauteur
- Largeur
- Diamètre
- Température
- Température entrée
- Température sortie
- Pression
- Débit
- Puissance électrique
- Puissance thermique
- Consommation
- Tension
- Intensité

