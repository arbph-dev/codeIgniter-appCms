Le refactoring du projet touche a sa fin. 

Séparer les parties frontend et backend
- les pages html, ressources : js images
- les apis
- [Orbis](/Orbis/index.md) reste en utilitaire pour réaliser des jeux de données via d'autres sources

Documenter dans [/assets/](/assets/readme.md) 
- on integre
  - on liste les composants dont les workbench
  - les endpoints API

# Application
Trois fichiers sont les piliers de l'évolution 
- [/WebUI/ui.html](/WebUI/ui.html) - [documentation](/assets/ui_html.md)
- [/WebUI/uiapp.js](/WebUI/uiapp.js) - [documentation](/assets/js/uiapp_js.md)
- [/WebUI/uistyle.css](/WebUI/uistyle.css) - [documentation](/assets/css/uistyle_css.md)



**Important**
On va préparer la version final du repository pour un backup serveur et un nettoyage avant publication


# Historique

Projet / tasks induit des évolutions pour authentification et administration





---


[documentation](/assets/js/features/auth/auth.controller_js.md)
/assets/js/features/auth/auth.controller.js

suite a evolution de 
[`app/Controllers/Api/AuthController.php`](/refactoring/app/Controllers/Api/AuthController.php)
2026-09-27-001

### 2.1 auth.controller.js
[/assets/js/features/auth/auth.controller.js](/old/public/assets/js/features/auth/auth.controller.js)
conserve le pattern existant (bus → service → store) et gère les deux cas renvoyés par l’API :
- email_verified: false → message « vérifiez votre email » (pas de token)
- email_verified: true → login immédiat (token + user)

ajout des events 
- auth:register
- auth:register:pending

#### Events

Events publiés / consommés

| Event                 | Direction                    | Rôle                                     |
| --------------------- | ---------------------------- | ---------------------------------------- |
| auth:check         	| ← bus (application ) 		   | démarrage app , session OU token existe ?|
| auth:register         | ← bus (formulaire / Toolbar) | Déclenche l’inscription                  |
| auth:register:pending | → bus                        | Compte créé, email à valider             |
| auth:success          | → bus                        | Login immédiat (si pas d’EmailActivator) |
| auth:error            | → bus                        | Erreur validation / conflit / serveur    |
| auth:loading          | → bus                        | Spinner on/off                           |

### 2.2 auth.service.js
[/assets/js/features/auth/auth.service.js](/old/public/assets/js/features/auth/auth.service.js)
modification
- suppression version me commentée
- ajout fetchRegister ligne 33

