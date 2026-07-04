Documentation en construction


// app/Controllers/Api/FormeJuridique.php
//
// Routes à ajouter dans app/Config/Routes.php (groupe 'api') :
//   $routes->get   ('formejuridique',        'Api\FormeJuridique::index');
//   $routes->get   ('formejuridique/like',   'Api\FormeJuridique::like');
//   $routes->get   ('formejuridique/(:any)', 'Api\FormeJuridique::show/$1');
//   $routes->post  ('formejuridique',        'Api\FormeJuridique::create');
//   $routes->put   ('formejuridique/(:any)', 'Api\FormeJuridique::update/$1');
//   $routes->delete('formejuridique/(:any)', 'Api\FormeJuridique::delete/$1');
//
// (:any) et non (:num) — la PK est un CHAR(4), pas un entier.
//
// Exemples :
//   GET  /api/formejuridique                      → liste paginée
//   GET  /api/formejuridique?q=soci&page=1        → recherche
//   GET  /api/formejuridique?id=5499              → par code
//   GET  /api/formejuridique/5499                 → par code (REST)
//   GET  /api/formejuridique/like?q=soci&len=10   → autocomplete
//   POST /api/formejuridique                      → créer
//   PUT  /api/formejuridique/5499                 → modifier
//   DELETE /api/formejuridique/5499               → supprimer
