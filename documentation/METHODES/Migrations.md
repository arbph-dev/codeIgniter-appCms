# MÉTHODES

## Migrations

### M-000 - Le modèle avant le code.

Un modèle de données bien conçu réduit la complexité des services, des interfaces et des tests. Le temps consacré à la conception est un investissement qui diminue le coût global de développement et de maintenance.

Je trouve que cette règle reflète parfaitement la manière dont nous avons travaillé aujourd'hui. Elle pourrait devenir la devise du référentiel SQL du projet.

### M-001 - Source de vérité

Le schéma SQL MySQL constitue la référence unique (Single Source of Truth).

Les frameworks (CodeIgniter, Laravel, Symfony, etc.) ne définissent pas la structure de la base de données ; ils utilisent le référentiel SQL.

### M-002 — Vanilla SQL

Toutes les migrations sont écrites en SQL standard compatible MySQL 8.x.

Les migrations ne doivent contenir aucun code spécifique à un framework.

### M-003 — Une migration = une responsabilité

Chaque migration crée un seul objet logique :

une table ;
une vue ;
une fonction ;
une procédure.

Une migration ne doit pas créer plusieurs objets métier distincts.

### M-004 — Séparation des livrables

Chaque objet du référentiel est constitué de fichiers distincts.

001_objet.sql
001_objet.seed.sql
001_objet.md

Le fichier SQL décrit la structure.

Le seeder contient uniquement les données de référence.

Le document Markdown décrit les règles métier.

### M-005 — Documentation

Chaque table possède une documentation contenant au minimum :

objectif ;
diagramme Mermaid ;
description des colonnes ;
contraintes ;
index ;
relations ;
règles métier ;
exemples d'utilisation ;
historique ;
évolutions prévues.

### M-006 — Conventions de nommage

Les objets SQL suivent une convention homogène.

Clés primaires
pk_<table>
Clés étrangères
fk_<table_source>__<table_cible>
Index
idx_<table>__<colonnes>
Contraintes d'unicité
uk_<table>__<colonnes>

### M-007 — Référencement des données

Les seeders ne doivent jamais dépendre des identifiants numériques.

Les références utilisent exclusivement les codes fonctionnels.

Exemple :

SELECT id
FROM dimensions
WHERE code = 'LENGTH';

Cette règle garantit la portabilité des données.

### M-008 — Codes fonctionnels

Chaque référentiel possède un champ code.

Le code :

est stable ;
n'est jamais traduit ;
est utilisé par les API ;
est utilisé par les seeders ;
est utilisé dans les règles métier.

Le code ne doit jamais être modifié après publication.

### M-009 — Évolution du modèle

Une amélioration identifiée pendant la conception n'est pas intégrée immédiatement.

Elle est documentée dans la section :

Évolutions prévues

Le schéma reste aussi simple que possible.

### M-010 — Référentiel avant développement

Le développement PHP ne commence qu'après validation :

du modèle de données ;
des règles métier ;
des migrations SQL ;
des jeux de données de référence.

Le code applicatif est construit au-dessus d'un modèle stable.

### M-011 — Cycle de conception

Chaque objet suit systématiquement le cycle suivant :

Analyse métier.
Spécification fonctionnelle.
Révision critique.
Migration SQL.
Seeder SQL.
Documentation.
Tests.
Validation.
Commit Git.

### M-012 — Séparation des responsabilités

Le référentiel distingue clairement :

les référentiels (dimensions, unités, constantes) ;
les données métier (équipements, caractéristiques) ;
les services (conversion, calcul) ;
les interfaces utilisateur.

Chaque composant possède une responsabilité unique.

### M-013 — Simplicité

La solution la plus simple répondant correctement au besoin est privilégiée.

Les évolutions futures sont documentées mais ne doivent pas complexifier inutilement la version courante.

### M-014 — Qualité

Une migration est considérée comme terminée lorsqu'elle satisfait au minimum les critères suivants :

SQL MySQL 8.x ;
UTF-8 (utf8mb4) ;
InnoDB ;
contraintes nommées ;
index nommés ;
commentaires SQL ;
rollback documenté ;
seeder séparé ;
documentation associée.

### M-015 — Pérennité

Les choix de conception privilégient :

la lisibilité ;
la stabilité ;
la réutilisabilité ;
l'indépendance vis-à-vis des frameworks ;
la facilité de maintenance.

Le référentiel constitue un patrimoine logiciel destiné à évoluer sur le long terme.


# convention pour les seeders

Au début de chaque seeder, on résout les identifiants par leur code (ou on utilise des sous-requêtes SELECT id ... WHERE code = ...). Ainsi, les scripts restent robustes même si l'ordre ou les identifiants changent.

Par exemple :
```sql
INSERT INTO unites
(
    dimension_id,
    code,
    nom,
    symbole,
    facteur,
    offset,
    est_reference,
    ordre_affichage
)
SELECT
    d.id,
    'METER',
    'Mètre',
    'm',
    1,
    0,
    1,
    30
FROM dimensions d
WHERE d.code = 'LENGTH';
```

C'est un peu plus verbeux, mais c'est beaucoup plus fiable. On ne dépend plus de la valeur numérique des clés, uniquement de leur code fonctionnel, qui est précisément là pour ça.

Je propose donc une règle de projet

Interdiction d'utiliser des identifiants numériques "en dur" dans les seeders du référentiel.


### M-016 — Les référentiels sont indépendants du métier

Les tables :
- dimensions
- unites
- grandeurs_physiques

ne doivent jamais contenir d'information propre à un équipement, un bâtiment ou un client.

Elles constituent un socle métrologique universel, partagé par l'ensemble des modules du CMS.

On référence toujours les données par leur code. C'est une règle simple, mais elle rendra les migrations et les jeux de données beaucoup plus portables et résistants aux évolutions. C'est le genre de convention qui paie sur le long terme.


