 documenter


 ```mermaid
                sequenceDiagram
                  participant User as 👤 Utilisateur (navigateur)
                  participant Front as 🌐 Front-End (JS / HttpReq)
                  participant Laravel as 💻 Serveur Laravel (API / routes)
                  participant SumUp as 🏦 API SumUp

                  User->>Front: Clique "Connexion SumUp"
                  Front->>Laravel: GET /sumup/auth
                  Laravel->>SumUp: Redirect vers https://api.sumup.com/authorize?client_id=...
                  SumUp->>User: Page de connexion SumUp
                  User->>SumUp: S'identifie et autorise l'accès
                  SumUp->>Laravel: Redirige vers /sumup/callback?code=XYZ
                  Laravel->>SumUp: POST /token (avec client_id, secret, code)
                  SumUp-->>Laravel: { access_token, refresh_token }

                  note over Laravel: Le serveur stocke le token d'accès sécurisé<br>dans sa base ou cache


                  Front->>Laravel: GET /api/sumup/checkout
                  Laravel->>SumUp: POST /v0.1/checkouts (Authorization: Bearer access_token)
                  SumUp-->>Laravel: { checkout_id, checkout_url }
                  Laravel-->>Front: JSON { checkout_id }


                  Front->>SumUp: Charge le widget SumUp avec checkout_id
                  SumUp->>User: Affiche le formulaire de paiement sécurisé
                  User->>SumUp: Saisit carte et valide
                  SumUp-->>Laravel: Notifie via callback/return_url (optionnel)
                  SumUp-->>Front: Envoie statut du paiement (success / failed)
```
