Regroupe documentation

# Front

- [features](/documentation/WORKBENCH/ARCHITECTURE/authentification.md)
	- [auth.renderer.js](/assets/js/features/auth/auth.renderer.js)
	- [auth.store.js](/assets/js/features/auth/auth.store.js)

- [Workbench - ToolbarAuthPanel](/assets/js/ui/workbench/auth/ToolbarAuthPanel.js)
		
- tester et valider register depuis ui.html / uiapp.js
	- [X] https://zealot.fr/register affiche un formulaire via shield au niveau session




# Endpoints

|Endpoint|Fonction|Orbis|
|---|---|---|
|`POST /api/auth/login`|établir l'authentification|`AuthProvider`|
|`GET /api/auth/me`|connaître l'utilisateur courant|**`ProfileClient`**|
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


### `POST /api/auth/register`
activé, à tester
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
2026-09-27-001
- [X] [migration user_profils](/documentation/MIGRATIONS/user_profils.md)
- [X] Model
	- [`app/Entities/UserProfil.php`](/app/Entities/UserProfil.php)
	- [`app/Models/UserProfilModel.php`](/app/Models/UserProfilModel.php)
- [X] [app/Config/Routes.php](app/Config/Routes_php.md)
- [X] [`app/Controllers/Api/AuthController.php`](/app/Controllers/Api/AuthController.php)




# Notes
- [`2026-09-26-005`](/project/daily/2026-09-26-005.md) - utilisation actuelle des user shield
	- [X] Valider `auth / me`
https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield
- [ ] Voir TaskPolicy et https://shield.codeigniter.com/latest/references/authorization/#addpermission

- [ ] voir `app/Config/Auth.php`
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L50
	- [ ] https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/app/Config/Auth.php#L106
- [ ] faut il employer une api publique pour pouvoir générer le profil et le user
	- [ ]  OUI valider avec des tests token différent de session
- préparer la gestion des rôles et permissions ( priorité - #2 )
	- [ ] voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md#permissions_shield

 - auth usage actuelle et futur
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-005.md

  		- version actuelle dans uiapp.js - https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/auth/ToolbarAuthPanel.js#L70
- `auth / register` :
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-005.md#post-apiauthregister
	- https://shield.codeigniter.com/latest/references/authorization/#user-activation
	- https://shield.codeigniter.com/latest/references/authentication/auth_actions/
- permissions :
	- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-09-26-006.md
	- https://shield.codeigniter.com/latest/references/authorization/#managing-user-permissions
	- https://shield.codeigniter.com/latest/guides/api_tokens/#token-permissions
