
### Structure

| Field       | Type         | Null | Key | Default | Extra |
| ----------- | ------------ | ---- | --- | ------- | ----- |
| id          | char(4)      | NO   | PRI | _NULL_  |       |
| description | varchar(200) | NO   | MUL | _NULL_  |       |
| created_at  | timestamp    | YES  |     | _NULL_  |       |
| updated_at  | timestamp    | YES  |     | _NULL_  |       |

### Routes

```php
// app/Controllers/Api/FormeJuridique.php
//
// Routes à ajouter dans app/Config/Routes.php (groupe 'api') :
   $routes->get   ('formejuridique',        'Api\FormeJuridique::index');
   $routes->get   ('formejuridique/like',   'Api\FormeJuridique::like');
   $routes->get   ('formejuridique/(:any)', 'Api\FormeJuridique::show/$1');
   $routes->post  ('formejuridique',        'Api\FormeJuridique::create');
   $routes->put   ('formejuridique/(:any)', 'Api\FormeJuridique::update/$1');
   $routes->delete('formejuridique/(:any)', 'Api\FormeJuridique::delete/$1');
//
// (:any) et non (:num) — la PK est un CHAR(4), pas un entier.

```

### backend
#### app\Controllers\Api\FormeJuridique.php
[[CI/PORTAIL/Portail/app/Controllers/Api/FormeJuridique.php]]
[[CI/PORTAIL/Portail/app/Controllers/Api/FormeJuridique]]
### frontend

\assets\js\features\formejuridique\formejuridique.controller.js
\assets\js\features\formejuridique\formejuridique.form.js
\assets\js\features\formejuridique\formejuridique.renderer.js
\assets\js\features\formejuridique\formejuridique.service.js
\assets\js\features\formejuridique\formejuridique.store.js
\assets\js\features\formejuridique\index.js
