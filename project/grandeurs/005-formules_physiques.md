On doit distinguer la définition d'une formule de ses variables d'entrée.

Les variables d'entrée seront décrites dans **formules_physiques_entrees**

## table formules_physiques

la table **formules_physiques** décrit une formule.
champs :
- id
- code
- nom
- grandeur_physique_id      (résultat)
- notation
- expression
- description
- ordre_affichage
- actif
- created_at
- updated_at
- deleted_at


### Exemple

| Champ	| Valeur |
| code	| THERMAL_POWER |
| nom	| Puissance thermique |
| grandeur	| Puissance |
| notation	| P |
| expression	| Q * Cp * DT |

- Q * Cp * DT
- U * I
- PI * D * N


On stocke une expression métier que le moteur se chargera ensuite de remplacer les variables.
Si demain on remplaces PHP par Python, Les formules restent valides.
Elles deviennent indépendantes du langage.

### Notes

- ajouter **categorie** pour simplifier les interfaces.

|Catégorie|
|---|
|THERMIQUE|
|ELECTRICITE|
|HYDRAULIQUE|
|MECANIQUE|

- ajouter **version** pour simplifier les interfaces.

Puissance thermique version 1 : Q × Cp × ΔT

Puissance thermique version 2 : Q × Cp(T) × ΔT

- remplacer **actif** par un champ **etat** VARCHAR(20) qui permet de gérer :
  - BROUILLON
  - VALIDEE
  - OBSOLETE
  - ARCHIVEE

- ajouter **decimales** SMALLINT , Certaines formules produisent naturellement :
  - un entier ;
  - deux décimales ;
  - six décimales.

## seeder

ATTENTION le seeder des formules_physiques fait référence à : SPEED
Il n'existe probablement pas dans **grandeurs_physiques** voir grandeurs_physiques.seed.sql.

Le référentiel des grandeurs doit être enrichi avant de finaliser ce seeder. 
Ajouter des grandeurs dérivées courantes comme :
- SPEED
- ACCELERATION
- FORCE
- TORQUE
- FREQUENCY
- SPECIFIC_HEAT


