
# Structure

## images

```sql
-- Images
CREATE TABLE images (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    path        VARCHAR(500) NOT NULL,
    filename    VARCHAR(255) NOT NULL,
    alt         TEXT,                    -- description pour balise alt
    status      ENUM('pending','validated','rejected') DEFAULT 'pending',
    uploaded_by INT UNSIGNED,            -- user_id Shield
    created_at  DATETIME,
    updated_at  DATETIME
);
```
## image_categories

```sql
-- Classification hiérarchique images
CREATE TABLE image_categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(255) NOT NULL,
    parent_id   INT UNSIGNED NULL,
    FOREIGN KEY (parent_id) REFERENCES image_categories(id)
);
```

## mot_image
```sql
-- Pivot mot ↔ image
CREATE TABLE mot_image (
    mot_id      INT UNSIGNED,
    image_id    INT UNSIGNED,
    PRIMARY KEY (mot_id, image_id)
);
```



# Backend

## Routes

```
// ── API métier (session OU token) ────────────────────────────────────────────
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    
    $routes->get('mot/like', 'Mot::like');
    $routes->get('mot/batch', 'Mot::batch');// Mot batch (lazy loading frontend)
    //$routes->resource('mot'); // a tester en lieu et place des 4 lignes ci dessous
    $routes->get   ('mot',        'Mot::index');
    $routes->post  ('mot',        'Mot::create');
    $routes->put   ('mot/(:num)', 'Mot::update/$1');
    $routes->delete('mot/(:num)', 'Mot::delete/$1');


    // ajout 2026-08-12
    $routes->get( 'image/(:num)/mots','ImageMot::index/$1');
    $routes->post( 'image/(:num)/mots', 'ImageMot::attach/$1');
    $routes->put( 'image/(:num)/mots', 'ImageMot::sync/$1' );
    $routes->delete( 'image/(:num)/mots/(:num)', 'ImageMot::detach/$1/$2');
    $routes->get( 'mot/(:num)/images', 'MotImage::index/$1');

    $routes->get('image/like', 'Image::like');
    $routes->resource('image', [ 'controller' => 'Image']);
```


## API
- [Image.md](/documentation/API/Image.md)
- [API/index - image](/documentation/API/index.md#image)
- [API/index - mot](/documentation/API/index.md#mot)

## Fichiers
- [app/Controllers/Api/Image.php](/refactoring/app/Controllers/Api/Image.php)
- [app/Controllers/Api/ImageMot.php](/refactoring/app/Controllers/Api/ImageMot.php)
- [app/Controllers/Api/Mot.php](/refactoring/app/Controllers/Api/Mot.php)
- [app/Controllers/Api/MotImage.php](/refactoring/app/Controllers/Api/MotImage.php)
- [app/Models/ImageModel.php](/old/app/Models/ImageModel.php)
- [app/Models/ImageMotModel.php](/refactoring/app/Models/ImageMotModel.php)
- [app/Services/ImageMotService.php](/refactoring/app/Services/ImageMotService.php)






