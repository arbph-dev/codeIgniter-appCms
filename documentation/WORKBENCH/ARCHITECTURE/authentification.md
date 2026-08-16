
# Authentification 




## historique

### 1. Localisation

L’auth n’existe **que dans old/**. Aucun équivalent dans refactoring/ (Workbenches actuels).

|Couche|Fichier|Rôle|
|---|---|---|
|Entrée feature|old/public/assets/js/features/auth/index.js|Export controller / renderer / store|
|Service|auth.service.js|Appels API /api/auth/*|
|Store|auth.store.js|État + persistence sessionStorage|
|Controller|auth.controller.js|Orchestration via bus auth:*|
|Renderer|auth.renderer.js|UI dans .header-auth|
|Backend|old/app/Controllers/Api/AuthController.php|Shield + Personal Access Tokens|
|Bootstrap page|old/public/index.php + layouts CMS|Form PHP éventuel + zone .header-auth|

Pattern historique des features old-portal :

```
index.js
  ├── auth.service.js   → HTTP
  ├── auth.store.js     → état
  ├── auth.controller.js → bus → store + service
  └── auth.renderer.js  → DOM
```

Ce n’est **pas** un Workbench : c’est une feature globale pilotée par l’EventBus.

---

### 2. Architecture front (Store / Controller / Renderer)

#### auth.store.js

- État : user, token, loggedIn, loading, error
- Persistence : sessionStorage (auth_token, auth_user)
- Helpers RBAC : inGroup(), can(), isAdmin()
- API claire : persist() / restore() / clear()

#### auth.service.js

|Endpoint|Comportement|
|---|---|
|POST /api/auth/login|Email + password → { token, user }|
|GET /api/auth/me|Token optionnel ; 401 → null (pas d’exception)|
|POST /api/auth/logout|Révocation Bearer|

Commentaire daté 2026-05-09-003 : ancienne version de fetchMe qui exigeait un token en sessionStorage a été assouplie pour accepter aussi la **session Shield** sans Bearer.

#### auth.controller.js

Bus events :

|Event|Sens|
|---|---|
|auth:check|Au démarrage → restore + fetchMe|
|auth:login|Credentials → login + persist|
|auth:logout|Révocation + clear|
|auth:success / auth:guest / auth:error / auth:loading / auth:changed|Sorties|

#### auth.renderer.js

- Cible unique : .header-auth
- États UI : guest (formulaire), loading, error, user (username + liens Admin/Board + logout)
- Intercepte aussi le form PHP Shield existant (action="/login") pour basculer en flux JS
- CSS injecté dynamiquement

**Force** : séparation nette service / store / controller / renderer, bus comme seul coupleur.
