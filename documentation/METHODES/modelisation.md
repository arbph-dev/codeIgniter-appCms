# charte de modélisation



| Cas|	Modèle|	Intégrité|	Exemple|
|---|---|---|---|
|1→N |	FK directe |	★★★★★	| personne → alias |
|N→N |	table pivot|	★★★★★	|article ↔ fournisseur|
|N→N avec attributs	|table métier	|★★★★★	|intervention_article|
|relation polymorphe|	objet_type + objet_id	| ★★★☆☆	| document_objet|
|graphe orienté	|source_type/id + cible_type/id|	★★★☆☆|	relations|

## Relation 1→N

**A privilégier dès que possible.**
Toujours une FK.

- entreprise
  - id PK
- etablissement 
  - id PK
  - organisation_id FK

## Table pivot
Lorsque la table ne contient que deux FK.
Préfèrer : PRIMARY KEY(article_id,fournisseur_id) plutôt qu'un id. Le couple est naturellement unique.

- article_fournisseur
  - article_id FK
  - fournisseur_id FK

## Table métier
un id devient justifié dès qu'il existe des attributs.

- intervention_article
- id
- intervention_id
- article_id
  - quantite
  - prix
  - remise

Même chose pour :
- equipement_caracteristique
- personne_parcours
- organisation_roles

## Liaison polymorphe

Très pratique pour les objets "annexes".
Garder toujours les mêmes noms, normaliser : **structure_type** et **structure_id**

- image
  - structure_type
  - structure_id

- commentaire
    - structure_type
    - structure_id

voir :
- Organisation
- Entreprise
- Etablissement

## Graphe de relations
Pour décrire une relation entre deux objets, employer le schamps et les normaliser :
- source_type / source_id
- relation_type
- target_type / target_id

Personne / Personne.id - administrateur - Organisation / Organisation.id

Entreprise / Entreprise.id - filiale - Entreprise / Entreprise.id

## Référentiels

Tous les référentiels devraient avoir exactement la même structure.
- id
- code
- label
- description
- created_at
- updated_at

Comme :

organisation_types
relation_types
parcours_types
intervention_types

Tous les référentiels utilisent un champ code.

Les codes sont :

uniques ;
stables ;
indépendants de la langue.

Ils sont utilisés par :

les seeders ;
les API ;
les services ;
les scripts SQL.




## Champs de qualité
Toujours les mêmes noms.
- source
- quality_score
- verified_by
- verified_at

exemple : 
- a retrouver dans les tables.

## Champs d'audit
Toujours et dans le même ordre.
created_at
updated_at
deleted_at


## Hiérarchie
Toujours  parent_id Jamais : eqpid , teid , catid
Le SQL devient immédiatement lisible.

Par exemple :
- equipement
  - id
  - parent_id
  - typeeqp

## Nommage des FK

Généraliser :
- organisation_id
- entreprise_id
- etablissement_id
- personne_id
- article_id
- equipement_id

éviter:
- orgid
- eqpid
- carid
- typid



Polymorphe	objet_type, objet_id
Graphe	source_type, source_id, relation_type_id, target_type, target_id
