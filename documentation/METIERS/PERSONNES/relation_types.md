# relation_types
Référentiel normalisé des types de relations.

Couvre
- Personne    →    Personne
- Personne    →    Organisation
- Org         →    Org.


## Structure

- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/tables.md#relation_types

## Seeder

- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/API/Personne/seeders.md

## notes

explicite et extensible : elle permettra d'ajouter un troisième type d'entité (par exemple etablissement) sans remettre en cause la logique générale.
source_type ENUM('personne','organisation') NOT NULL,
target_type ENUM('personne','organisation') NOT NULL,
Exemples :
source	target
personne	personne
personne	organisation
organisation	organisation

3. inverse_code permet de n'enregistrer qu'un seul sens.
Exemple :parent -> inverse = enfant ou filiale_de ->inverse = maison_mere_de

5. Dates
CodeIgniter les gérera donc sans DEFAULT CURRENT_TIMESTAMP.
created_at DATETIME NULL,
updated_at DATETIME NULL,

un champ symetrique BOOLEAN DEFAULT FALSE
Cela évite de tester inverse_code == code pour savoir si la relation est symétrique.
Exemple
relation	symétrique
conjoint	oui
frère_soeur	oui
parent	non
filiale_de	non
partenaire	oui




















