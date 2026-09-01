# Données

## Strucutre
- `DESCRIBE adresses` systématique avant tout nouveau fichier

| Field            | Type                                     | Null | Key | Default | Extra          |
| ---------------- | ---------------------------------------- | ---- | --- | ------- | -------------- |
| id               | bigint unsigned                          | NO   | PRI | _NULL_  | auto_increment |
| complement       | varchar(60)                              | YES  |     | _NULL_  |                |
| voienumero       | varchar(10)                              | YES  |     | _NULL_  |                |
| voierpt          | enum('B','T','Q','C')                    | YES  |     | _NULL_  |                |
| voietype_id      | tinyint unsigned                         | YES  | MUL | _NULL_  |                |
| voiecharniere    | tinyint unsigned                         | YES  |     | _NULL_  |                |
| voienom          | varchar(60)                              | NO   |     | _NULL_  |                |
| infodistribution | varchar(60)                              | YES  |     | _NULL_  |                |
| codepostal_id    | int unsigned                             | NO   | MUL | _NULL_  |                |
| acheminement     | varchar(100)                             | YES  |     | _NULL_  |                |
| latitude         | decimal(10,7)                            | YES  | MUL | _NULL_  |                |
| longitude        | decimal(10,7)                            | YES  |     | _NULL_  |                |
| precision        | enum('numero','voie','commune','approx') | YES  |     | _NULL_  |                |
| created_at       | timestamp                                | YES  |     | _NULL_  |                |
| updated_at       | timestamp                                | YES  |     | _NULL_  |                |

## Index

- `SHOW INDEX FROM adresses` pour identifier FK non contraintes et patterns d'accès

| Table    | Non_unique | Key_name          | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
| -------- | ---------- | ----------------- | ------------ | ------------- | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- | ---------- |
| adresses | 0          | PRIMARY           | 1            | id            | A         | 6           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_codepostal_id | 1            | codepostal_id | A         | 5           | _NULL_   | _NULL_ |      | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_voietype_id   | 1            | voietype_id   | A         | 2           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_lat_lng       | 1            | latitude      | A         | 6           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |
| adresses | 1          | idx_lat_lng       | 2            | longitude     | A         | 6           | _NULL_   | _NULL_ | YES  | BTREE      |         |               | YES     | _NULL_     |




### backend
- [app/Controllers/Api/Adresse.php](/old/app/Controllers/Api/Adresse.php)
- [app/Models/AdresseModel.php](/old/app/Models/AdresseModel.php)
- Enums
    - [app/Enums/Charniere.php](/old/app/Enums/Charniere.php)
    - [app/Enums/GeocodePrecision.php](/old/app/Enums/GeocodePrecision.php)
    - [app/Enums/IndiceRepetition.php](/old/app/Enums/IndiceRepetition.php)

#### app/Models/AdresseModel.php
```php
    public function withRelations(): static
    {
        return $this
            ->select('
                adresses.*,
                tv.nom        AS voietype_nom,
                cp.codepostal AS cp_codepostal,
                cp.commune    AS cp_commune
            ')
            ->join('type_voies    tv', 'tv.id = adresses.voietype_id',  'left')
            ->join('codes_postaux cp', 'cp.id = adresses.codepostal_id', 'left');
    }
```

a voir aussi :
- [app/Controllers/Api/Adresse.php](/old/app/Controllers/Api/Adresse.php)
- [app/Controllers/Api/CodePostal.php](/old/app/Controllers/Api/CodePostal.php)
- [app/Controllers/Api/TypeVoie.php](/old/app/Controllers/Api/TypeVoie.php)



### Routes 
```
$routes->get   ('adresse/like',   'Adresse::like');      // ← avant (:num)
$routes->get   ('adresse',        'Adresse::index');
$routes->get   ('adresse/(:num)', 'Adresse::show/$1');
$routes->post  ('adresse',        'Adresse::create');
$routes->put   ('adresse/(:num)', 'Adresse::update/$1');
$routes->delete('adresse/(:num)', 'Adresse::delete/$1');

$routes->get   ('typevoie/like',   'TypeVoie::like');    // ← avant (:num)
$routes->get   ('typevoie',        'TypeVoie::index');
$routes->get   ('typevoie/(:num)', 'TypeVoie::show/$1');
$routes->post  ('typevoie',        'TypeVoie::create');
$routes->put   ('typevoie/(:num)', 'TypeVoie::update/$1');
$routes->delete('typevoie/(:num)', 'TypeVoie::delete/$1');

$routes->get('codepostal',        'CodePostal::index');
$routes->get('codepostal/like',   'CodePostal::like');   // ← avant (:num)
$routes->get('codepostal/(:num)', 'CodePostal::show/$1');
// ⚠ Pas de POST/PUT/DELETE — référentiel en lecture seule.
```

### Frontend

\assets\js\features\adresse\adresse.controller.js"
\assets\js\features\adresse\adresse.form.js"
\assets\js\features\adresse\adresse.renderer.js"
\assets\js\features\adresse\adresse.service.js"
\assets\js\features\adresse\adresse.store.js"
\assets\js\features\adresse\index.js"

### Notes
Avant adresse il faut résoudre 
codepostal_id via : GET /codepostal?codepostal=29000
voietype_id  via : GET /typevoie/like (autocomplete) ou GET /typevoie/1 (select) 


## Relations

codepostal_id -> [[Z/METIERS/geographie/code postaux]]
relation 1 adresse a un unique codepostal ; mais un codepostal peut appartenir à plusieurs adresse
1 codepostal vers n adresse la clef est dans adresse

voietype_id[[Z/METIERS/geographie/Type Voie]]

Enum
 - [[Z/METIERS/geographie/Charniere]]  : entre type et nom de voie :  de la 
-  [[Z/METIERS/geographie/GeocodePrecision]] : précision de l'adresse
-  [[Z/METIERS/geographie/IndiceRepetition]] : indice de répétition dans la voie 




## Frontend JS
### index.js
```php
/* ================================================================
   SNIPPETS D'INTÉGRATION
   ================================================================

   ── 1. index.php — import ────────────────────────────────────────
   ── 2. index.php — window.addEventListener('load', ...) ─────────
   ── 3. Cms.php — article ─────────────────────────────────────────
   ── 4. Routes.php (groupe api) ───────────────────────────────────
   ── 5. Enums PHP — copier dans app/Enums/ ────────────────────────
   ⚠ Vérifier que PHP >= 8.1 sur OVH (requis pour les enums natifs).
   ================================================================ */
```
### adresse.controller.js
### adresse.form.js
### adresse.renderer.js
### adresse.service.js
### adresse.store.js
