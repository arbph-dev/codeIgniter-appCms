[/assets/js/features/auth/auth.controller.js](/assets/js/features/auth/auth.controller.js)

# auth.controller.js


conserve le pattern existant (bus → service → store) et gère les deux cas renvoyés par l’API :
- email_verified: false → message « vérifiez votre email » (pas de token)
- email_verified: true → login immédiat (token + user)

ajout des events 
- auth:register
- auth:register:pending

