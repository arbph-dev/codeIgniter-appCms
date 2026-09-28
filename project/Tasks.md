


- déterminer la structure des tasks . priorité - #4
	- utiliser json
 	- exploitation via systeme de task obsidian icon due, status etc..
  	- mermaid js

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


- tasks
	- créer un projet avec des taches
	- visualisation, liste projets, liste taches par projet liste de toutes les taches / responsables, personne affectée,  gantt / mermaid
	- Edition modification détail, relation ( personne à terme pour le moment user )


Ressources
- ebauche du projet : 
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-002.md
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-001.md

- Tasks
	- Definition des tasks https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-003.md
	- Note sur modèles de données pour task avec gestion des droits:
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#mod%C3%A8le-de-donn%C3%A9es-n%C3%A9cessaire
	- voir pour organisation dans Project members
- articles GMAO devront pouvoir bénéficier des droits comme Tasks : https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-004.md

---
## tables 

**à définir et ajouter**
- projects 
	- champs : id, name, created_at
- project_members
	- champs : project_id, user_id, role (ex : 'manager', 'editor', 'reader')
 	- recuperer ProfileClient avec user_id
- tasks
 	- ajout champs : project_id



[`2026-09-26-003`](/project/daily/2026-09-26-003.md) - modèle de données
- [ ] Valider champ et index
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-003.md#111---tasks
 - [ ] Apres validation du model tasks supprimer Fichier : 2025-01-01-000001_create_taches.sql



[`2026-09-26-006`](/project/daily/2026-09-26-006.md)
- [ ] Valider ajout des tables : projects , project_members (necessaire pour ajuster les droits)
- [ ] relation projets - Organisation/entreprise/Etablissement , user - personne
	- peu d'intérêt sans telephone
- [X] user_profils  avec tel fixe, mobile, index user_id user relation ou id personne  et organisation
- [ ] voir possibilité de trouver: user - Etablissement avec user - personne et personne - Organisation/entreprise/Etablissement



## 2026-09-27-001
Etape
- [X] migration user_profils
- Model + Route + Controller/Service (backend register minimal + stub profil)
- Formulaire register dans ui.html + gestion bus dans uiapp.js / auth.*
- Toolbar2AuthPanel (boutons + affichage panel board)
- Dashboards user / admin (contenu des panel-card)
- Activation mail + tests




 ----
## 2026-09-27-002




### [`ToolbarAuthPanel.js`](/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
ToolbarAuthPanel herite  de AuthPanelBase
- [`/assets/js/ui/workbench/auth/ToolbarAuthPanel.js`](/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
- [`ToolbarAuthPanel.js`](/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
- /assets/js/ui/workbench/auth/ToolbarAuthPanel.js



Les events souscrits et les callback sont déja définis et gérés  par exemple :
- appel de this._render('user') 

```js
	this._buildUserBar(this._user).forEach(el => this._target.appendChild(el))
    this._bindLogout()
```






## 2026-09-27-003

On branche le formulaire register dans #user-board-body plutôt que dans la toolbar
On place le formulaire register dans #user-board-body, la toolbar ne garde que le bouton « Inscription ».

```
Guest toolbar
  [Inscription] → _render('register')
       ├─ toolbar  : bouton « Retour connexion »
       └─ #user-board-body : formulaire register
            [Créer le compte] → auth:register
                 ├─ pending → message dans #user-board-body
                 └─ success → auth:success → UserBar + clear board
  [Retour] → _render('guest') + clear board + board:hide (via uiapp)
```


|Zone|Contenu|
|---|---|
|.header-auth (guest)|email + password + Connexion + **Inscription**|
|#user-board-body|formulaire register complet|
|.header-auth (register en cours)|bouton « Retour » minimal (optionnel)|

#### [`AuthPanelBase.js`](/refactoring/assets/js/ui/workbench/core/AuthPanelBase.js)
AuthPanelBase.js — ajustements dans _render(), Toolbar = login / retour / user bar
- remplacer le case 'register'
- remplacer le case 'register-pending'
- Nouvelles méthodes
	- _boardBody() reference au Conteneur du board user
	- _mountRegisterForm(error = null)
 	- _mountRegisterPending(message)
 	- _clearBoardBody()
- modifier
	- _bindRegister doit cibler le board root, pas seulement this._target
	- _emitRegister() const root = this._boardBody() ?? this._target
 - Et sur guest / success, nettoyer le board : this._clearBoardBody()
 
 
#### [`ToolbarAuthPanel.js`](/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
`_buildRegisterToolbar()`
- Mini barre affichée dans .header-auth pendant l'inscription 

Formulaire dans #user-board-body pour register + message pending
- suppresion bouton back

#### [`uiapp.js`](/WebUI/uiapp.js)
Afficher panel user , le formulaire est déjà monté par AuthPanelBase._mountRegisterForm.
bus.subscribe('board:register', () => showAuthBoard('user'))




 ----


## 2026-09-28-001
[`ui.html`](/WebUI/ui.html) :
- `#user-board-body` sert pour register et les infos users

On doit gérer les données du Endpoint `/api/auth/me` renvoyées par le controller dans boards user 

```php
return $this->response->setStatusCode(200)->setJSON([
	'id'          => $user->id,
	'username'    => $user->username,
	'email'       => $user->email,
	'groups'      => $user->getGroups(),
	'permissions' => $user->getPermissions(),
]);
```

#### Helper de rendu dans [`/assets/js/uiapp.js`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/WebUI/uiapp.js)
- function badgeGroups(groups)
- function badgePerms(permissions)
- function renderUserCard(user, { title = 'Mon profil' } = {})
	- Carte profil minimale des données endpoint /me { id, username, email, groups, permissions }

#### Montage dans les boards [`/assets/js/uiapp.js`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/WebUI/uiapp.js)
fait sentir la nécessité d'un panel user ou workbench
- function mountUserBoard(user) {
- function mountAdminBoard(user) {

####  Branchement bus [`/assets/js/uiapp.js`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/WebUI/uiapp.js)
- import '/assets/js/features/auth/auth.store.js'
- remplacer initAuthBoards

#### CSS minimal [`/assets/css/uistyle.css`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/WebUI/uistyle.css)
ligne 450

---

## 2026-09-28-002
Préparation du seeder `user_profils` . on réalise un jeu de donnés qui sera corrigés ensuite



## 2026-09-28-003
 Tests
- Register (API + form dans #user-board-body)
- Seeder 3 users (ex. user / admin / superadmin)
- Login → Board user → carte /me
- Login admin → bouton Admin → board admin
- Ensuite : enrichir /me (ou endpoint dédié) avec user_profils





 
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

### 2026-09-28-001-N000
documentation/ROADMAP/INVENTORY_index.md - SectionPanels

### 2026-09-28-001-N001
table `user_profils` et organisations : 0 interdit si FK RESTRICT sans ligne id=0 , utiliser un id réel ou assouplir le seed
- A revoir
```sql
organisation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
```

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
