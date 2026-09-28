Regroupe documentation

# Front

- tester et valider register depuis ui.html / uiapp.js
	- [X] https://zealot.fr/register affiche un formulaire


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
