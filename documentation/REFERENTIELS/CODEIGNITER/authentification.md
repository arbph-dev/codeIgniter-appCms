# Authentification

## installer shield

suivre scrupuleusement : https://shield.codeigniter.com/getting_started/install/

```
php composer.phar require codeigniter4/shield

./composer.json has been updated
Running composer update codeigniter4/shield
Loading composer repositories with package information
Updating dependencies
Lock file operations: 2 installs, 0 updates, 0 removals
  - Locking codeigniter4/settings (v2.3.0)
  - Locking codeigniter4/shield (v1.3.0)
Writing lock file
Installing dependencies from lock file (including require-dev)
Package operations: 2 installs, 0 updates, 0 removals
  - Downloading codeigniter4/settings (v2.3.0)
  - Downloading codeigniter4/shield (v1.3.0)
  - Installing codeigniter4/settings (v2.3.0): Extracting archive
  - Installing codeigniter4/shield (v1.3.0): Extracting archive
Generating optimized autoload files
26 packages you are using are looking for funding.
Use the `composer fund` command to find out more!
No security vulnerability advisories found.

Using version ^1.3 for codeigniter4/shield
```


## Méthode  REVUE

### shield:setup
```
php spark shield:setup
```
#### resultat
```
CodeIgniter v4.7.0 Command Line Tool - Server Time: 2026-04-09 15:45:45 UTC+00:00

  Created: APPPATH/Config/Auth.php
  Created: APPPATH/Config/AuthGroups.php
  Created: APPPATH/Config/AuthToken.php
  Updated: APPPATH/Config/Autoload.php
  Updated: APPPATH/Config/Routes.php
  Updated: We have updated file 'APPPATH/Config/Security.php' for security reasons.
  Email Setup: Everything is fine.
  Run `spark migrate --all` now? [y, n]: y
Running all new migrations...
PCNTL extension not available. Signal handling disabled.
        Running: (CodeIgniter\Shield) 2020-12-28-223112_CodeIgniter\Shield\Database\Migrations\CreateAuthTables
        Running: (CodeIgniter\Settings) 2021-07-04-041948_CodeIgniter\Settings\Database\Migrations\CreateSettingsTable
        Running: (CodeIgniter\Settings) 2021-11-14-143905_CodeIgniter\Settings\Database\Migrations\AddContextColumn
Migrations complete.
```

==La doc est en retard le soft a fait lui même les updates==

Config Setup: 
Copy **from** vendor/codeigniter4/shield/src/Config/  **to** your project's config folder public_html/api/app/Config/ 
- Auth.php
- AuthGroups.php
- AuthToken.php 



On vérifie en ftp
```
/home/rxrhgiw/www/app/Config/Autoload.php
    public $helpers = ['auth', 'setting']; => ok
    
/home/rxrhgiw/www/app/Config/Auth.php
/home/rxrhgiw/www/app/Config/AuthGroups.php
/home/rxrhgiw/www/app/Config/AuthToken.php
	Namespace Config => ok

```

Dans mysql 
des table sont été créé dont user

```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `username` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status_message` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `last_active` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);


ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

```



##### Security Setup: 

Set Config\Security::$csrfProtection to 'session' for security reasons, if you use Session Authenticator.
==doc en retard==
```
  Updated: We have updated file 'APPPATH/Config/Security.php' for security reasons.
```

##### Email Setup: 
Configure app/Config/Email.php to allow Shield to send emails.
```
<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    public string $fromEmail  = '[email protected]';
    public string $fromName   = 'your name';
    // ...
}
```
==doc en retard==
```
  Email Setup: Everything is fine.
```

##### Migration: 
Run the migrations.
Attention il faut configurer la db
```
php spark migrate --all
```
==doc en retard==
```
  Run `spark migrate --all` now? [y, n]: y
Running all new migrations...
PCNTL extension not available. Signal handling disabled.
        Running: (CodeIgniter\Shield) 2020-12-28-223112_CodeIgniter\Shield\Database\Migrations\CreateAuthTables
        Running: (CodeIgniter\Settings) 2021-07-04-041948_CodeIgniter\Settings\Database\Migrations\CreateSettingsTable
        Running: (CodeIgniter\Settings) 2021-11-14-143905_CodeIgniter\Settings\Database\Migrations\AddContextColumn
Migrations complete.
```

##### Routes
```
service('auth')->routes($routes);

```


## Gérer les utilisateurs

https://shield.codeigniter.com/user_management/managing_users/#managing-users-via-cli
```

php spark shield:user --help


rxrhgiw@ssh02.cluster100.gra.hosting.ovh.net (php/8.2/production/stable64) ~/www $ php spark shield:user --help

CodeIgniter v4.7.0 Command Line Tool - Server Time: 2026-04-09 16:41:24 UTC+00:00

Usage:
  shield:user <action> options

    shield:user create -n newusername -e newuser@example.com
    shield:user create -n newusername -e newuser@example.com -g mygroup

    shield:user activate -n username
    shield:user activate -e user@example.com

    shield:user deactivate -n username
    shield:user deactivate -e user@example.com

    shield:user changename -n username --new-name newusername
    shield:user changename -e user@example.com --new-name newusername

    shield:user changeemail -n username --new-email newuseremail@example.com
    shield:user changeemail -e user@example.com --new-email newuseremail@example.com

    shield:user delete -i 123
    shield:user delete -n username
    shield:user delete -e user@example.com

    shield:user password -n username
    shield:user password -e user@example.com

    shield:user list
    shield:user list -n username -e user@example.com

    shield:user addgroup -n username -g mygroup
    shield:user addgroup -e user@example.com -g mygroup

    shield:user removegroup -n username -g mygroup
    shield:user removegroup -e user@example.com -g mygroup

Description:
  Manage Shield users.

Arguments:
  action
    create:      Create a new user
    activate:    Activate a user
    deactivate:  Deactivate a user
    changename:  Change user name
    changeemail: Change user email
    delete:      Delete a user
    password:    Change a user password
    list:        List users
    addgroup:    Add a user to a group
    removegroup: Remove a user from a group

Options:
  -i           User id
  -n           User name
  -e           User email
  --new-name   New username
  --new-email  New email
  -g           Group name
```


### Créer un utilisateur :
```
php spark shield:user create -n USERALIAS -e USER@DOMAIN.MIL 
```

```
hosting.ovh.net (php/8.2/production/stable64) ~/www $ php spark shield:user create -n codster -e admin@zealot.fr

CodeIgniter v4.7.0 Command Line Tool - Server Time: 2026-04-09 16:42:22 UTC+00:00

Password : PASSWORD
Password confirmation : PASSWORD
User "USERALIAS" created
The user is added to the default group.
hosting.ovh.net (php/8.2/production/stable64) ~/www $
```



---
### Activer l’utilisateur :

```
php spark shield:user activate -n USERALIAS 

CodeIgniter v4.6.4 Command Line Tool - Server Time: 2026-01-23 03:38:18 UTC+01:00 
Activate the user USERALIAS ? [y, n]: y 
User "USERALIAS" activated
```

---
### L’ajouter au groupe admin :
(Si le groupe n’existe pas encore, on le crée d’abord.)

```
php spark shield:user addgroup -n USERALIAS -g admin
 
CodeIgniter v4.6.4 Command Line Tool - Server Time: 2026-01-23 03:38:40 UTC+01:00 
Add the user "USERALIAS" to the group "admin" ? [y, n]: y 
User "USERALIAS" added to group "admin"
```

---

### Vérifier en base

```
php spark shield:user list
 
CodeIgniter v4.6.4 Command Line Tool - Server Time: 2026-01-23 03:39:14 UTC+01:00 
Id User 5 USERALIAS (admin@elfennel.fr)

hosting.ovh.net (php/8.2/production/stable64) ~/www $ php spark shield:user list

CodeIgniter v4.7.0 Command Line Tool - Server Time: 2026-04-09 16:44:47 UTC+00:00

Id      User
1       USERALIAS (USER@DOMAIN.MIL)
hosting.ovh.net (php/8.2/production/stable64) ~/www $
```


## Exploitation
### Authentication
https://shield.codeigniter.com/references/authentication/authentication/

https://shield.codeigniter.com/references/authentication/authentication/#available-authenticators

```
The `auth_helper` is autoloaded by CodeIgniter's autoloader if you follow the installation instruction. If you want to _override_ the functions, create **app/Helpers/auth_helper.php**.
```

## A TERMINER

voir [[DAILY/2026-04-21-shield_suite|2026-04-21-shield_suite]]

----

[[DAILY/2026-04-21-shield_suite]]

pour mettre en place l'authentification API Bearer Token avec Shield dans CodeIgniter 4.

Vue d'ensemble du flux
JS (localStorage) ──POST /api/login──► CI4 Controller
                  ◄── { token: "xxx" } ──
JS ──GET /api/profile (Authorization: Bearer xxx)──► filtre tokens ► Controller

Configuration des filtres — **app/Config/Filters.php**
C'est l'étape critique : il faut exclure les routes API du filtre session et appliquer le filtre tokens sur api/*.


https://shield.codeigniter.com/guides/api_tokens/?h=filters#protecting-routes

Points clés à retenir
**Token** : le raw_token n'est disponible qu'au moment de la génération après, impossible de le récupérer. Shield stocke uniquement le hash SHA-256 en base. 
C'est pour ça qu'on le renvoie immédiatement au login/register pour que le client le stocke.

**Filtre tokens** : quand le filtre s'exécute, il vérifie le header Authorization pour une valeur Bearer, hash le token et le recherche en base.
Une fois trouvé, l'utilisateur est disponible via auth()->user(). 

**Logout** : les tokens peuvent être révoqués avec 
- `revokeAccessToken($rawToken)`
- ` revokeAccessTokenBySecret($secret)` 
- `revokeAllAccessTokens()`

ce qui les supprime simplement de la base. 

**Durée de vie** : les tokens expirent après un délai configurable depuis leur dernière utilisation — 1 an par défaut, 
modifiable via `$unusedTokenLifetime` dans **app/Config/AuthToken.php**.

### Protecting Routes
The first way to specify which routes are protected is to use the tokens controller filter.

For example, to ensure it protects all routes under the /api route group, you would use the $filters setting on **app/Config/Filters.php.**
```php
public $filters = [
    'tokens' => ['before' => ['api/*']],
];
```

[[DAILY/2026-04-07/filters.php]]

