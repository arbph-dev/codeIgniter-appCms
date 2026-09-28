Regroupe documentation

# Front

- tester et valider register depuis ui.html / uiapp.js
	- [X] https://zealot.fr/register affiche un formulaire via shield au niveau session




# Endpoints

|Endpoint|Fonction|Orbis|
|---|---|---|
|`POST /api/auth/login`|établir l'authentification|`AuthProvider`|
|`GET /api/auth/me`|connaître l'utilisateur courant|**`ProfileClient`**|
|`GET /api/auth/profile`|profil actuellement exposé par le contrôleur|à analyser|
|`POST /api/auth/logout`|invalider la session/token|`AuthProvider`|
|`POST /api/auth/register`|création de compte|futur|

### POST /api/auth/login
public 
    - renvoie : token et user initial

### GET /api/auth/me
**token obligatoire**
- renvoie : identité courante , groups , permissions. le contrat métier est là :
```php
$user = auth('tokens')->user();

if (!$user && auth()->loggedIn()) {
    $user = auth()->user();
}
```
puis :
```php
[
    'id'          => $user->id,
    'username'    => $user->username,
    'email'       => $user->email,
    'groups'      => $user->getGroups(),
    'permissions' => $user->getPermissions(),
]
```

### POST /api/auth/logout 
**token obligatoire** , logout est correctement placé derrière tokens
- renvoie : révocation token



###  GET /api/auth/profile
présent mais **non protégé**
- renvoie :informations incomplètes
- à **supprimer**

GET /api/auth/profile n'est pas protégé dans Filters.Legacy / doublon à traiter. il n'y a pas le contrôle explicite :
```php
if (!$user) { return 401; }
```
si la route était appelée sans utilisateur token valide, le comportement dépendrait ensuite de ce que retourne auth('tokens')->user() et de l'accès aux propriétés.

profile() renvoie seulement : id , username , email , groups. Il manque : permissions

profile() est incohérent avec me() /api/auth/me est actuellement la seule route Auth explicitement protégée par le filtre tokens dans cette configuration.

### `POST /api/auth/register`
actuellement désactivé
```
REGISTER
   │
   ├── qui a le droit de créer un compte ?
   ├── compte actif immédiatement ?
   ├── validation email ?
   ├── groupe initial ?
   ├── permissions initiales ?
   └── token immédiatement ou login obligatoire ?
```


# Backend

### [users](/documentation/MIGRATIONS/users.md)

### user_profils
### 2026-09-27-001
- [X] [migration user_profils](/documentation/MIGRATIONS/user_profils.md)
- [X] Model
	- [`app/Entities/UserProfil.php`](/app/Entities/UserProfil.php)
	- [`app/Models/UserProfilModel.php`](/refactoring/app/Models/UserProfilModel.php)
- [X] [app/Config/Routes.php](app/Config/Routes_php.md)
- [X] [`app/Controllers/Api/AuthController.php`](/refactoring/app/Controllers/Api/AuthController.php)




# Notes
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
- [ ] Voir TaskPolicy et https://shield.codeigniter.com/latest/references/authorization/#addpermission

- [ ] voir `app/Config/Auth.php`
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L50
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L106
- [ ] faut il employer une api publique pour pouvoir générer le profil et le user
	- [ ]  OUI valider avec des tests token différent de session
- préparer la gestion des rôles et permissions ( priorité - #2 )
	- [ ] voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
