

priorité 
- [X] supprimer la route et le code controller pour profile ? [app/Controllers/Api/AuthController.php](/old/app/Controllers/Api/AuthController.php)
	- OUI a faire après vérification usage et ou migration ui.html -> portail
- [X] voir le besoin d'un model user avec relation personne_id ?
	- NON il faut passer par un profilclilent
- tester et valider register depuis ui.html / uiapp.js
	- [ ] nécessaire - priorité #3
 		- [X] https://zealot.fr/register affiche un formulaire
   			- [ ] voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L50 et https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L106
   		- [ ] faut il employer une api publique pour pouvoir générer le profil et le user 
- préparer la gestion des rôles et permissions
	- [ ] priorité - #2 voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
- déterminer la structure des tasks . priorité - #4
	- utiliser json
 	- exploitation via systeme de task obsidian icon due, status etc..
  	- mermaid js
- construire un mini dashboard admin dans ui.html / uiapp.js priorité - #1 voir [`2026-09-26-005`](/project/daily/2026-09-26-005.md) et [uiapp.js](/WebUI/uiapp.js)
	- on commence par : GET /api/auth/me
 		- version actuelle dans uiapp.js
   			- lors de login pas de fetchme car login renvoie les mêmes infos que fetchme
      		- le login api est vérifié au chargement ToolbarAuthPanel affiche bien le nom et les liens , clic sur lien admin affiche fenetre de login (session shield)
        		- a modifier 
    		- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js#L70
      		- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Controllers/Api/AuthController.php#L60
      		- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Controllers/Api/AuthController.php#L138
 	- voir [app/Controllers/Api/AuthController.php](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Controllers/Api/AuthController.php)
  	- ajouter getUser si useradmin AuthController.php pour gérer liste des users
  		- [app/Controllers/Admin.php](/old/app/Controllers/Admin.php)
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
- Note sur auth usage actuelle et futur
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-005.md
 	- Frontend - [Workbench](/documentation/WORKBENCH/ARCHITECTURE/authentification.md)
  		- [auth.renderer.js](/old/public/assets/js/features/auth/auth.renderer.js)
		- [auth.store.js](/old/public/assets/js/features/auth/auth.store.js)
		- [Workbench - ToolbarAuthPanel](/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
  		- version actuelle dans uiapp.js - https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js#L70
  			
 		
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
- [ ] ProfileClient  avec tel fixe, mobile, index user_id user relation ou id personne  et organisation
- [ ] voir possibilité de trouver: user - Etablissement avec user - personne et personne - Organisation/entreprise/Etablissement

## tables a ajouter
- projects 
	- champs : id, name, created_at
- project_members
	- champs : project_id, user_id, role (ex : 'manager', 'editor', 'reader')
 	- recuperer ProfileClient avec user_id
- tasks
 	- ajout champs : project_id
- user_profils

### user_profils
migration user_profils à construire depuis client_profil ci dessous
```sql
CREATE TABLE user_profils (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED NOT NULL,
    tel_fixe        VARCHAR(20) NULL,
    tel_mobile      VARCHAR(20) NULL,
    personne_id     BIGINT UNSIGNED NULL,
	adresse_id      BIGINT UNSIGNED NULL,
    organisation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
    defaut          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NULL,
    updated_at      DATETIME NULL,

    PRIMARY KEY (id),

    UNIQUE KEY uk_user_profils_user_org (user_id, organisation_id),

    CONSTRAINT fk_user_profils_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_user_profils_personne
        FOREIGN KEY (personne_id) REFERENCES personnes(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

	CONSTRAINT fk_user_profils_adresse
        FOREIGN KEY (adresse_id) REFERENCES adresses(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    CONSTRAINT fk_user_profils_organisation
        FOREIGN KEY (organisation_id) REFERENCES organisations(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
- renommer client_profil en user_profils
- UNIQUE KEY uk_client_profil_user (user_id) doit evoluer
	- 1 profil par user par organisation
  		user.id shield et user_profils_persid peuvent être associé a plusieurs user_profils
 		user_profils peut avoir les mêmes  user.id shield , user_profils_persid si et seulement si  user_profils_orgid est différent (consultant pour deux entreprises distincts)
   		il faudra permettre la sélection apres login si on trouve plusieurs profil
   		un select dans Toolbar2AuthPanel sera affiché ou masque selon qu'il y est plusieurs profils
- on peut ajouter une valeur default true dans user_profils
	- 	le dashboard user permettra de modifier le profil par defaut


## 2026-09-27-002

migration user_profils : fait

Etape
- Model + Route + Controller/Service (backend register minimal + stub profil)
- Formulaire register dans ui.html + gestion bus dans uiapp.js / auth.*
- Toolbar2AuthPanel (boutons + affichage panel board)
- Dashboards user / admin (contenu des panel-card)
- Activation mail + tests

1.1 Model
GROK +1 : code aligné sur les conventions du projet Models + Entities


app/Entities/UserProfil.php - G:\WWW\OVH\BETA\refactoring\app\Entities\UserProfil.php
- [X] uploader [`app/Entities/UserProfil.php`](/refactoring/app/Entities/UserProfil.php)

- [X] copier dans /refactoring/app/Entities/

app/Models/UserProfilModel.php - G:\WWW\OVH\BETA\refactoring\app\Models\UserProfilModel.php
- [X] uploader [`app/Models/UserProfilModel.php`](/refactoring/app/Models/UserProfilModel.php)
- [X] copier dans /refactoring/app/Models/ 



 ----

# Notes
### 2026-09-27-001-N000

TABLE user_profils / champ organisation_id , actuellement nullable.

Contexte : En MySQL, un UNIQUE(user_id, organisation_id) autorise plusieurs lignes avec organisation_id = NULL. C'est peut-être souhaité pour les profils sans organisation, mais il faut le décider avant la migration

Choix organisation_id :
- devient `organisation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,`
- Par defaut le champ organisation sera mis a 0 (usage personnel)
- Par la suite on ajoutera un dialog pour la selection de organisation
- choix actuel 0 = personnel => ON DELETE RESTRICT une contrainte de clé étrangère qui empêche la suppression d'une ligne parente si des lignes enfants y font référence, garantissant ainsi l'intégrité référentielle.


### 2026-09-27-001-N001
- [ ] Dans admin exploiter SELECT * FROM `auth_logins` pour voir log ou recherche


### 2026-09-27-001-N002
organisation_id : is_natural (accepte 0) car la migration a DEFAULT 0.
defaut casté en boolean (comme actif dans Relation).
Méthodes utilitaires prêtes pour le register et le select multi-profils de la toolbar.
Pas de soft-delete (conforme à la table)




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
