[/assets/js/features/auth/auth.controller.js](/old/public/assets/js/features/auth/auth.controller.js)

# auth.controller.js


conserve le pattern existant (bus → service → store) et gère les deux cas renvoyés par l’API :
- email_verified: false → message « vérifiez votre email » (pas de token)
- email_verified: true → login immédiat (token + user)

ajout des events 
- auth:register
- auth:register:pending

## Events

Events publiés / consommés

| Event                 | Direction                    | Rôle                                     |
| --------------------- | ---------------------------- | ---------------------------------------- |
| auth:check         	| ← bus (application ) 		   | démarrage app , session OU token existe ?|
| auth:register         | ← bus (formulaire / Toolbar) | Déclenche l’inscription                  |
| auth:register:pending | → bus                        | Compte créé, email à valider             |
| auth:success          | → bus                        | Login immédiat (si pas d’EmailActivator) |
| auth:error            | → bus                        | Erreur validation / conflit / serveur    |
| auth:loading          | → bus                        | Spinner on/off                           |
