## Définition des taches

### champs
```
id 	int 	PK
planif_user_id 	int 	Lié au créateur/planificateur
resp_user_id 	int 	Lié au responsable
titre 	string 	Nom de la tâche
description 	text 	Détails
statut 	enum(todo, doing, done) 	Pour le kanban
date_debut 	date 	Pour Gantt
date_fin 	date 	Pour Gantt
priorite 	enum(basse, moyenne, haute) 	Optionnel
progression 	int (0-100) 	Pour Gantt, tableau liste
```

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

priorité 
- supprimer la route et le code controller pour profile ?
- voir le besoin d'un model user avec relation personne_id ?
- tester et valider register depuis ui.html / uiapp.js
- préparer la gestion des rôles et permissions
- déterminer la structure des tasks, utiliser json et exploitation viaa systeme de task obsidian icon due, status etc..

Objectif :
- créer des users via register
	- voir config : action `app/Config/Auth.php`
	- créer des comptes mail
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



