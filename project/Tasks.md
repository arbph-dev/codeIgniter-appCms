

priorité 
- [X] supprimer la route et le code controller pour profile ?
	- OUI a faire après vérification usage et ou migration ui.html -> portail
- [X] voir le besoin d'un model user avec relation personne_id ?
	- NON il faut passer par un profilclilent
- tester et valider register depuis ui.html / uiapp.js
	- [ ] nécessaire - #3
- préparer la gestion des rôles et permissions
	- [ ] priorité - #2 voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
- déterminer la structure des tasks . priorité - #4
	- utiliser json
 	- exploitation via systeme de task obsidian icon due, status etc..
  	- mermaid js
- construire un mini dashboard admin dans ui.html / uiapp.js priorité - #1 voir [`2026-09-26-005`](/project/daily/2026-09-26-005.md)
	- on commence par : GET /api/auth/me
 	- voir [app/Controllers/Api/AuthController.php](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Controllers/Api/AuthController.php)
  	- ajouter getUser si useradmin AuthController.php pour gérer liste des users
  		- [app/Controllers/Admin.php](old/app/Controllers/Admin.php)
  	 	- [app/Views/cms/admin.php](/old/app/Views/cms/admin.php)

Objectif :
- créer des users via register
	- voir config : action `app/Config/Auth.php`
	- créer des comptes mail - fait 1 sur protonmail
	- améliorer sécurité : tester ip ?
	- groupe : 
		- Groups are defined within the `Shield\Config\AuthGroups` config class.
	- faire un dash admin minimal dans ui.html
		- affectation des users au groupe et droits par domaine voir projets
- tasks
	- créer un projet avec des taches
	- visualisation, liste projets, liste taches par projet liste de toutes les taches / responsables, personne affectée,  gantt / mermaid
	- Edition modification détail, relation ( personne à terme pour le moment user )


Ressources
- ebauche du projet : 
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-002.md
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-001.md
- Note sur auth usage actuelle et futur : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-005.md
- Note sur auth / register :
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-005.md#post-apiauthregister
	- https://shield.codeigniter.com/latest/references/authorization/#user-activation
	- https://shield.codeigniter.com/latest/references/authentication/auth_actions/
- Note sur permissions :
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md
	- https://shield.codeigniter.com/latest/references/authorization/#managing-user-permissions
	- https://shield.codeigniter.com/latest/guides/api_tokens/#token-permissions
- Tasks
	- Definition des tasks https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-003.md
	- Note sur modèles de données pour task avec gestion des droits:
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#mod%C3%A8le-de-donn%C3%A9es-n%C3%A9cessaire
	- voir pour organisation dans Project members
- articles GMAO devront pouvoir bénéficier des droits comme Tasks : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-004.md

---

DESCRIBE users;

| Field          | Type         | Null | Key | Default | Extra          |
| -------------- | ------------ | ---- | --- | ------- | -------------- |
| id             | int unsigned | NO   | PRI | _NULL_  | auto_increment |
| username       | varchar(30)  | YES  | UNI | _NULL_  |                |
| status         | varchar(255) | YES  |     | _NULL_  |                |
| status_message | varchar(255) | YES  |     | _NULL_  |                |
| active         | tinyint(1)   | NO   |     | 0       |                |
| last_active    | datetime     | YES  |     | _NULL_  |                |
| created_at     | datetime     | YES  |     | _NULL_  |                |
| updated_at     | datetime     | YES  |     | _NULL_  |                |
| deleted_at     |  datetime     | YES  |     | _NULL_  |                |


# [`2026-09-26-003`](/project/daily/2026-09-26-003.md)
modèle de données
- [ ] Valider champ et index
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-003.md#111---tasks
 - [ ] Apres validation du model tasks supprimer Fichier : 2025-01-01-000001_create_taches.sql

# [`2026-09-26-005`](/project/daily/2026-09-26-005.md)
utilisation actuelle des user shield
- [ ] Valider me
- [ ] Supprimer profile route et controller

# [`2026-09-26-006`](/project/daily/2026-09-26-006.md)
- [ ] Valider ajout des tables : projects , project_members (necessaire pour ajuster les droits)
- [-] relation projets - Organisation/entreprise/Etablissement , user - personne
	- peu d'intérêt sans telephone
- [ ] ProfileClient  avec tel fixe, mobile, index user_id userrelation ou id personne  et organisation
- [ ] voir possibilité de trouver: user - Etablissement avec user - personne et personne - Organisation/entreprise/Etablissement

## tables a ajouter
- projects 
	- champs : id, name, created_at
- project_members
	- champs : project_id, user_id, role (ex : 'manager', 'editor', 'reader')
 	- recuperer ProfileClient avec user_id
- tasks
 	- ajout champs : project_id

## users
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
- [ ] Voir TaskPolicy et https://shield.codeigniter.com/latest/references/authorization/#addpermission

# 2026-09-26-009

## modules liés
### relation
- relations
	- [`app/Models/RelationModel.php`](/refactoring/app/Models/RelationModel.php)
- relation_types (référentiel, pas de FK)

```json
/**
 * POST /api/relations
 *
 * Payload minimal :
 * "etablissement_id": 7   ← optionnel, bascule target sur etablissement
*/
 {
    "relation_type_id": 3,
    "source_type": "personne",
    "source_id": 12,
    "target_type": "organisation",
    "target_id": 5,
    "etablissement_id": 7
  }
 
```
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Controllers/Api/Relations.php
https://github.com/arbph-dev/codeIgniter-appCms/blob/c939bed9cd4d2e40fe044fb491af56e34362ba15/refactoring/app/Controllers/Api/Relations.php#L112

https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/METIERS/PERSONNES/relations.md

`personnes` se lient à `organisations` : elles peuvent donc être liées à une entreprise **ou** une association sans distinction
 
une personne peut être :
- **dirigeant** d'une entreprise => relation_type = administrateur
- **adhérent** d'une association =>	relation_type = membre

```
créer une VIEW : view_personne_timeline
qui fusionne :parcours,distinctions,publications,engagements.
Très utile pour générer automatiquement une biographie chronologique.
```

```
Une propriété vivant BOOLEAN DEFAULT TRUE,
se déduit automatiquement des dates
- si connues
- sinon BOOLEAN doit devenir tri state 0 non vivan, 1 oui vivant, -1 INCONNU vivant
```
---


# RELICS

+ role voir ci dessous
+ personne_id => register
	+  -> 2 création une personne et un user

### A définir
user distinguer rôle et décrire les relation selon les rôles
rôle
	planificateur
	responsable
	réalisateur

relations user affectées au tache 
	planificateur 1- 1 tache,
	responsable 1-1 tache, 
	réalisateur personnel affecté n-1 tache

relations taches mères/ filles

ouverture vers 
projet / réalisation ??
projets d'entreprise, établissement  / maintenance système / site , portail /  personnel / 
export vers obsidian
md 
```
- [x] Todo #Laravel #Hostinger 🔺 ➕ 2025-04-27 📅 2025-04-29 ✅ 2025-04-30
```
mermaid
	kanban
	gantt


exemple 
portail / projets / ajouter mots à la base mot
portail / projets / ajouter des prénoms à la base mot
portail / projets / liers des mots à une image (n mots -n images  )

entreprise établissement  / tache selon fonction et service alimente par un autre workflow

voir code obsidian
[[DOCUMENTATION/OUTILS/OBSIDIAN/PLUGINS/Dataview#Timeline]]


---



# Personne
La relation peut se faire avec un Profilclient
## Structure

| Field                | Type                        | Null | Key | Default | Extra          |
| -------------------- | --------------------------- | ---- | --- | ------- | -------------- |
| id                   | bigint unsigned             | NO   | PRI | _NULL_  | auto_increment |
| nom                  | varchar(255)                | NO   | MUL | _NULL_  |                |
| prenoms              | varchar(255)                | NO   | MUL | _NULL_  |                |
| nom_complet          | varchar(512)                | NO   | MUL | _NULL_  |                |
| nom_naissance        | varchar(255)                | YES  |     | _NULL_  |                |
| civilite             | varchar(20)                 | YES  |     | _NULL_  |                |
| sexe                 | char(1)                     | YES  |     | _NULL_  |                |
| date_naissance       | date                        | YES  | MUL | _NULL_  |                |
| precision_naissance  | enum('annee','mois','jour') | YES  |     | _NULL_  |                |
| naissance_adresse_id | bigint unsigned             | YES  | MUL | _NULL_  |                |
| date_deces           | date                        | YES  |     | _NULL_  |                |
| precision_deces      | enum('annee','mois','jour') | YES  |     | _NULL_  |                |
| deces_adresse_id     | bigint unsigned             | YES  | MUL | _NULL_  |                |
| nationalite          | varchar(120)                | YES  |     | _NULL_  |                |
| bio                  | text                        | YES  |     | _NULL_  |                |
| detail               | longtext                    | YES  |     | _NULL_  |                |
| slug                 | varchar(255)                | YES  | UNI | _NULL_  |                |
| source               | varchar(100)                | YES  |     | _NULL_  |                |
| quality_score        | tinyint unsigned            | YES  |     | _NULL_  |                |
| verified_at          | datetime                    | YES  |     | _NULL_  |                |
| verified_by          | int unsigned                | YES  | MUL | _NULL_  |                |
| merge_into_id        | bigint unsigned             | YES  | MUL | _NULL_  |                |
| created_at           | datetime                    | YES  |     | _NULL_  |                |
| updated_at           | datetime                    | YES  |     | _NULL_  |                |
| deleted_at           | datetime                    | YES  |     | _NULL_  |                |
