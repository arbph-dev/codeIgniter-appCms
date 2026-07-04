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
---

#  Authentification Token Shield/CodeIgniter 4.

## app/Config/Filters.php

```php
public array $globals = [
    'before' => [
        'session' => ['except' => [
            'login*',
            'register*',
            'auth/a/*',
            'api/*',          // ← exclure toutes les routes API
        ]],
    ],
    'after' => [
        'toolbar' => ['except' => ['api/*']],
    ],
];

public array $filters = [
    'tokens' => ['before' => ['api/*']],  // ← protéger api/* avec Bearer token
];
```

## app/Config/Routes.php
```php
// Routes Shield (login web, register web, etc.)
service('auth')->routes($routes);

// Routes API — pas de filtre session ici, géré dans Filters.php
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    $routes->post('login',    'AuthController::login');
    $routes->post('register', 'AuthController::register');

    // Routes protégées (filtre tokens appliqué globalement via Filters.php)
    $routes->get('profile',   'AuthController::profile');
    $routes->post('logout',   'AuthController::logout');
});
```
## app/Controllers/Api/AuthController.php
```php
<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\Shield\Entities\User;

class AuthController extends BaseController
{
    // ─── POST /api/login ─────────────────────────────────────────
    public function login()
    {
        // Si déjà connecté via session, on clean
        if (auth()->loggedIn()) {
            auth()->logout();
        }

        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[8]',
        ];

        if (! $this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $credentials = [
            'email'    => $this->request->getVar('email'),
            'password' => $this->request->getVar('password'),
        ];

        $result = auth()->attempt($credentials);

        if (! $result->isOK()) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON(['error' => 'Email ou mot de passe invalide']);
        }

        // Générer le token — le nom identifie l'appareil/client
        $token = auth()->user()->generateAccessToken('webapp');

        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'token' => $token->raw_token,   // ← stocker en localStorage
                'user'  => [
                    'id'    => auth()->id(),
                    'email' => auth()->user()->email,
                ],
            ]);
    }

    // ─── POST /api/register ──────────────────────────────────────
    public function register()
    {
        $rules = [
            'username' => 'required|min_length[3]|is_unique[users.username]',
            'email'    => 'required|valid_email|is_unique[auth_identities.secret]',
            'password' => 'required|min_length[8]',
        ];

        if (! $this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $userModel = model(UserModel::class);

        $user = new User([
            'username' => $this->request->getVar('username'),
            'email'    => $this->request->getVar('email'),
            'password' => $this->request->getVar('password'),
        ]);

        $userModel->save($user);
        $user = $userModel->findById($userModel->getInsertID());

        // Activer directement (ou laisser la vérification email selon config)
        $user->activate();

        // Ajouter au groupe par défaut
        $user->addGroup('user');

        // Retourner un token directement après register
        $token = $user->generateAccessToken('webapp');

        return $this->response
            ->setStatusCode(201)
            ->setJSON([
                'message' => 'Compte créé avec succès',
                'token'   => $token->raw_token,
                'user'    => [
                    'id'    => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    // ─── GET /api/profile (protégé) ──────────────────────────────
    public function profile()
    {
        $user = auth('tokens')->user();

        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'id'       => $user->id,
                'username' => $user->username,
                'email'    => $user->email,
                'groups'   => $user->getGroups(),
            ]);
    }

    // ─── POST /api/logout (protégé) ──────────────────────────────
    public function logout()
    {
        $user       = auth('tokens')->user();
        $rawToken   = $this->request->getHeaderLine('Authorization');
        $rawToken   = str_replace('Bearer ', '', $rawToken);

        $user->revokeAccessToken($rawToken); // supprime de la DB

        return $this->response
            ->setStatusCode(200)
            ->setJSON(['message' => 'Déconnecté avec succès']);
    }
}
```




```php

```

```js
const API_BASE = 'https://monsite.com/api';

// ─── Login ────────────────────────────────────────────────────────
async function login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.error || data.errors);
        return;
    }

    // Stocker le token
    localStorage.setItem('bearer_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('Connecté :', data.user);
}

// ─── Helper : requête authentifiée ───────────────────────────────
async function authFetch(url, options = {}) {
    const token = localStorage.getItem('bearer_token');

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
}

// ─── Profile ──────────────────────────────────────────────────────
async function getProfile() {
    const res = await authFetch(`${API_BASE}/profile`);
    const data = await res.json();
    console.log('Profil :', data);
}

// ─── Logout ───────────────────────────────────────────────────────
async function logout() {
    await authFetch(`${API_BASE}/logout`, { method: 'POST' });
    localStorage.removeItem('bearer_token');
    localStorage.removeItem('user');
}

// ─── Register ─────────────────────────────────────────────────────
async function register(username, email, password) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.errors);
        return;
    }

    localStorage.setItem('bearer_token', data.token);
    console.log('Inscrit et connecté :', data.user);
}
```


# Activer la vérification email 

Résumé du flux complet

| Config `Auth.actions['register']` | Register retourne        | Login si non activé |
| --------------------------------- | ------------------------ | ------------------- |
| `null` (désactivé)                | token immédiat           | — (toujours activé) |
| `EmailActivator`                  | message "vérifiez email" | 403 + message       |

Le lien dans l'email pointe vers **`/auth/a/email-activate`** (route Shield standard) — une fois cliqué, l'utilisateur est activé en base et peut se connecter via l'API normalement.

Views for all of these pages are defined in the Auth config file, with the $views array.
https://shield.codeigniter.com/references/authentication/auth_actions/
```
    /**
     * --------------------------------------------------------------------
     * View files
     * --------------------------------------------------------------------
     */
    public array $views = [
        'login'                       => '\CodeIgniter\Shield\Views\login',
        'register'                    => '\CodeIgniter\Shield\Views\register',
        'layout'                      => '\CodeIgniter\Shield\Views\layout',
        'action_email_2fa'            => '\CodeIgniter\Shield\Views\email_2fa_show',
        'action_email_2fa_verify'     => '\CodeIgniter\Shield\Views\email_2fa_verify',
        'action_email_2fa_email'      => '\CodeIgniter\Shield\Views\Email\email_2fa_email',
        'action_email_activate_show'  => '\CodeIgniter\Shield\Views\email_activate_show',
        'action_email_activate_email' => '\CodeIgniter\Shield\Views\Email\email_activate_email',
        'magic-link-login'            => '\CodeIgniter\Shield\Views\magic_link_form',
        'magic-link-message'          => '\CodeIgniter\Shield\Views\magic_link_message',
        'magic-link-email'            => '\CodeIgniter\Shield\Views\Email\magic_link_email',
    ];

```



1. Activer la vérification email — app/Config/Auth.php
**EmailActivator** confirme l'adresse email du nouvel utilisateur en lui envoyant un lien qu'il doit suivre pour activer son compte. 
CodeIgniter Shield On l'active ainsi :
Pour **désactiver** la vérification, remettre `null`. Le controller API détectera ça automatiquement.
app/Config/Auth.php

```php
public array $actions = [
    'register' => \CodeIgniter\Shield\Authentication\Actions\EmailActivator::class,
    'login'    => null,
];
```


Configurer l'envoi d'email — `app/Config/Email.php`

```php
public string $fromEmail  = 'noreply@monsite.com';
public string $fromName   = 'Mon App';
public string $protocol   = 'smtp';
public string $SMTPHost   = 'smtp.monsite.com';
public string $SMTPPort   = 587;
public string $SMTPUser   = 'user@monsite.com';
public string $SMTPPass   = 'motdepasse';
public string $SMTPCrypto = 'tls';
```

### Register API adapté 
app/Controllers/Api/AuthController.php
Le principe : on lit setting('Auth.actions')['register'] pour savoir si la vérif email est configurée, et on adapte la réponse.

```php
// ─── POST /api/register ──────────────────────────────────────
public function register()
{
    $rules = [
        'username' => 'required|min_length[3]|is_unique[users.username]',
        'email'    => 'required|valid_email|is_unique[auth_identities.secret]',
        'password' => 'required|min_length[8]',
    ];

    if (! $this->validate($rules)) {
        return $this->response
            ->setStatusCode(422)
            ->setJSON(['errors' => $this->validator->getErrors()]);
    }

    $userModel = model(\CodeIgniter\Shield\Models\UserModel::class);

    $user = new \CodeIgniter\Shield\Entities\User([
        'username' => $this->request->getVar('username'),
        'email'    => $this->request->getVar('email'),
        'password' => $this->request->getVar('password'),
    ]);

    $userModel->save($user);
    $user = $userModel->findById($userModel->getInsertID());
    $userModel->addToDefaultGroup($user);

    // ── Vérifier si EmailActivator est configuré ──────────────
    $hasEmailActivation = setting('Auth.actions')['register'] !== null;

    if ($hasEmailActivation) {
        // Déclencher l'envoi de l'email via le mécanisme Shield
        // On utilise le session authenticator uniquement pour déclencher l'action
        /** @var \CodeIgniter\Shield\Authentication\Authenticators\Session $authenticator */
        $authenticator = auth('session')->getAuthenticator();
        $authenticator->startLogin($user);
        $authenticator->startUpAction('register', $user);
        // Pas de token retourné : le compte n'est pas encore actif
        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'message'        => 'Compte créé. Vérifiez votre email pour activer votre compte.',
                'email_verified' => false,
            ]);
    }

    // Pas de vérification email → activer directement et retourner le token
    $user->activate();
    $token = $user->generateAccessToken('webapp');

    return $this->response
        ->setStatusCode(201)
        ->setJSON([
            'message'        => 'Compte créé avec succès.',
            'email_verified' => true,
            'token'          => $token->raw_token,
            'user'           => [
                'id'    => $user->id,
                'email' => $user->email,
            ],
        ]);
}
```

### Login API adapté
Si aucun activator n'est configuré dans Auth.actions['register'], isActivated() retourne toujours true. CodeIgniter Shield Donc ce check est safe dans les deux cas :

```php
// ─── POST /api/login ─────────────────────────────────────────
public function login()
{
    if (auth()->loggedIn()) {
        auth()->logout();
    }

    $rules = [
        'email'    => 'required|valid_email',
        'password' => 'required',
    ];

    if (! $this->validate($rules)) {
        return $this->response
            ->setStatusCode(422)
            ->setJSON(['errors' => $this->validator->getErrors()]);
    }

    $result = auth()->attempt([
        'email'    => $this->request->getVar('email'),
        'password' => $this->request->getVar('password'),
    ]);

    if (! $result->isOK()) {
        return $this->response
            ->setStatusCode(401)
            ->setJSON(['error' => 'Email ou mot de passe invalide']);
    }

    $user = auth()->user();

    // ── Vérifier l'activation email si configurée ─────────────
    if ($user->isNotActivated()) {
        // Déconnecter la session créée par attempt()
        auth()->logout();

        return $this->response
            ->setStatusCode(403)
            ->setJSON([
                'error'          => 'Compte non activé. Vérifiez votre email.',
                'email_verified' => false,
            ]);
    }

    $token = $user->generateAccessToken('webapp');

    return $this->response
        ->setStatusCode(200)
        ->setJSON([
            'token'          => $token->raw_token,
            'email_verified' => true,
            'user'           => [
                'id'    => $user->id,
                'email' => $user->email,
            ],
        ]);
}
```

### Côté JS — gérer les deux cas
```js
async function register(username, email, password) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) { console.error(data.errors); return; }

    if (!data.email_verified) {
        // Afficher un message "consultez vos emails"
        showMessage(data.message);
        return;
    }

    // Vérif désactivée → connecté directement
    localStorage.setItem('bearer_token', data.token);
}

async function login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 403 && !data.email_verified) {
        showMessage('Compte non activé — vérifiez votre email.');
        return;
    }

    if (!res.ok) { console.error(data.error); return; }
```

# Authentification  JS / API 
L'idée est de créer un module auth dédié qui parle uniquement via le bus, comme les autres modules (sidebar, carousel, etc.).
Le point clé : **aucun module ne connaît les autres**. L'auth publie `app:ready`, l'app réagit. 

Si demain vous ajoutez un spinner ou un log analytics, vous abonnez juste un nouveau subscriber à `auth:success` — sans toucher au reste.

```
js/
├── core/
│   └── eventBus.js          (existant)
├── features/
│   └── auth/
│       ├── auth.service.js   ← appels fetch / localStorage
│       ├── auth.controller.js ← écoute le bus, orchestre
│       └── auth.ui.js        ← affiche/cache le formulaire
```


```
window:load
    │
    └─► bus.publish('auth:check')
            │
    ┌───────┴────────┐
    │ token valide   │ pas de token / expiré
    │                │
    ▼                ▼
apiGetProfile()   bus.publish('auth:required')
    │                │
    ▼                ▼
bus.publish       showLoginForm()
('auth:success')      │
    │             submit ──► bus.publish('auth:login:submit')
    │                              │
    │                         apiLogin()
    │                              │
    └──────────────────────────────┘
                   │
            bus.publish('auth:success')
                   │
            bus.publish('app:ready')  ──► initArticleLoader(), etc.
```




    localStorage.setItem('bearer_token', data.token);
}
```

