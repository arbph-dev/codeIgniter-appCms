Ce document servira a répertoirer les elements du modules personnes et de note principale durant la phase de conception.


Priorité
1. Réviser la documentation
2. Déterminer les relations
3. Définir les taches



# Révision

| fichier | staut | Notes |
| --- | --- | --- |
| [personne](/project/PERSONNES/personne.md) | à réviser | element principal. Contrainte :  prenom a créér |
| [personne_alias](/project/PERSONNES/personne_alias.md) | à réviser | Une personne peut avoir un nom de scène : Johny Halliday et Philipe SMET |
| [personne_distinctions](/project/PERSONNES/personne_distinctions.md) | à réviser | element principal. Contrainte : prenom a créér |
| [personne_ideologies](/project/PERSONNES/personne_ideologies.md) | à réviser | table réductrice pour certains, luxueuse pour d'autres |
| [personne_migration.sql](/project/PERSONNES/personne_migration.sql) | à réviser | Migration des tables a compléter avec un seeder |
| [personne_parcours](/project/PERSONNES/personne_parcours.md) | à réviser | un parcours n’est PAS une relation c’est un évènement temporel. |
| [personne_relations](/project/PERSONNES/personne_relations.md) | à réviser | relations d'une personne, voir [relation_types](/project/PERSONNES/relation_types.md) |
| [prenom](/project/PERSONNES/prenom.md) | à réviser | prenom a créér depuis la table mot |
| [relation_types](/project/PERSONNES/relation_types.md) | à réviser | définit le srelations entre personnes et organisations |

# Déterminer les relations

on a définit des relations a pousser.

### relation de la personne aux organisations
La relation de la personne à l'organisation de type entreprise sera limité au strict minimum. 

Une organisation peut évoluer vers une entreprise, en gérant la relation de la personne à l'organisation au niveau de l'organisation plutôt que de l'entreprise on ne serait pas déranger

La relation de la personne à l'organisation sera gérée dans le module organisations avec des compétences dans une table  **organisations_employes**, une clef estrangère optionnel  liera une Personne à un employé d'une organisation


Les services d'entreprises ont des employées stockées dans organisations_employes qui pourront etre personnes. Cependant pour des raisons de protection des données on va séparer les données des personnes et des employés

Les relations employés et organisations seront détaillées pour permettre de suivre un parcours professionnel:  fonction ( techniciens , cadre )  , date ( début et fin dans la fonction) , service ( logisitque, achat) . Il faudra gérer ces relations dans le temps sur le modèle de **personne_parcours**. Comme pour les informations d'un salarié le parcours est a réservé au module entreprise

La gestion des compétences est à détailler et sera géré après recherche de référentiels exploitables dans le module entreprise avec les tables **competences** et **competences_employes**
Ceci sera revu lors de la revue du projet de module gmao qui sera lié au module entreprise
Comme pour les informations d'un salarié, de son parcours; ses compétences seront réservés au module entreprise

**Depuis personne ou pourra pas  créer un profil employé MAIS pas créer une personne depuis un employé**


Une entreprise gère des employés mais elle n'a accès aux parcours intégrale d'une personne qui est employés que si elle dispose du CV et de détail. Ces éléments pouvant être mis a disposition avec l'accord d'une personne

Une personne réalise des activités durant un parcours dans les organisations , chaque activité du parcours d'une personne pourra être visible ou non. Cette visibilité est automatique pour les personnes publiques ou selon le choix de la personne qui peut être un profil utilisateurs


### gestion des compétences
à détailler:
La gestion des compétences est à rapprocher des services
ex : logistique : maitrise  de l'informatique , niveau requis utilisateur bureautique







