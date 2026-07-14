<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Informatique;
use App\Controllers\Technologies;
/**
 * @var RouteCollection $routes
 */


// ← EN PREMIER, avant tous les groupes
$routes->options('(:any)', static function () {
    return response()->setStatusCode(200);
});


service('auth')->routes($routes);
$routes->get('/', 'Cms::index');
$routes->get('/user', 'User::index');
$routes->get('/admin', 'Admin::index');
$routes->get( 'admin/modelworkbench', 'Admin\ModelWorkbench::index' );


$routes->group('admin/cmspart', static function($routes)
{
    $routes->get('/',            'Admin\CmsPart::index');
    
    //$routes->get('create',       'Admin\CmsPart::create');
    $routes->get('create/(:num)',  'Admin\CmsPart::create/$1');
    $routes->post('insert', 'Admin\CmsPart::insert');
    $routes->get('edit/(:num)',  'Admin\CmsPart::edit/$1');
    $routes->post('update/(:num)', 'Admin\CmsPart::update/$1');    
    $routes->get('delete/(:num)','Admin\CmsPart::delete/$1');
    //$routes->post('save',        'Admin\CmsPart::save');
	$routes->get('up/(:num)',      'Admin\CmsPart::up/$1');
	$routes->get('down/(:num)',    'Admin\CmsPart::down/$1');    
});

$routes->get( 'admin/cmstree', 'Admin\CmsTree::index' );


//$routes->get( 'test-descriptor','TestDescriptor::index');

//$routes->get( 'cms/tree', 'CmsController::cmstree' );

$routes->get( 'cms/category/(:segment)' , 'CmsController::category/$1'  );
$routes->get( 'cms/article/(:segment)'  , 'CmsController::article/$1'   );  
$routes->get( 'cms/section/(:num)'      , 'CmsController::section/$1'   );
$routes->get( 'cms/part/(:num)'         , 'CmsController::part/$1'      );

//$routes->get( 'test/parts', 'TestController::parts' );
$routes->get( 'test/components', 'TestController::components' );
$routes->get( 'test/hierarchy',  'TestController::hierarchy');
$routes->get( 'test/service',  'TestController::service');
$routes->get( 'test/descriptors',  'TestController::descriptors');
$routes->get( 'test/cms', 'TestController::cms');


$routes->get('chimie', 'Chimie::index');
/* vue décomposée */

$routes->get('informatique', 'Informatique::index');
$routes->get('informatique/(:segment)', [Informatique::class, 'show']); // Added 2026-03-25

/* vue décomposée */
$routes->get('portal', 'Portal::index');

$routes->get('technologies', 'Technologies::index');
$routes->get('phpdebug', 'Technologies::debug');
$routes->get('technologies/(:segment)', 'Technologies::rubrique/$1');
$routes->get('technologies/(:segment)/(:segment)', 'Technologies::show/$1/$2');



$routes->get('sendtestmail', 'Sendtestmail::index');
$routes->get('dbtest', 'Dbtest::index');
// 1  grouper sous `/api/auth/`
//── Auth ────────────────────────────────────────────────────────────────────
$routes->group('api/auth', ['namespace' => 'App\Controllers\Api'], function($routes) {
    $routes->post('login',    'AuthController::login');    // POST /api/auth/login
    $routes->get('profile',   'AuthController::profile'); // GET /api/auth/profile
    $routes->get ('me',       'AuthController::me');       // GET  /api/auth/me
    $routes->post('logout',   'AuthController::logout');   // POST /api/auth/logout

//5->    // $routes->post('register','AuthController::register'); // futur
});

//$routes->get('api/debug/token', 'Api\AuthController::debugToken');



// ── API métier (session OU token) ────────────────────────────────────────────
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {

    // Mot
    $routes->get('mot/like', 'Mot::like');// Doit être AVANT la route ressource générique
    //$routes->resource('mot'); // a tester en lieu et place des 4 linges ci dessous
    $routes->get   ('mot',        'Mot::index');
    $routes->post  ('mot',        'Mot::create');
    $routes->put   ('mot/(:num)', 'Mot::update/$1');
    $routes->delete('mot/(:num)', 'Mot::delete/$1');

    // 3 CodeNaf est ReadOnly => pas de resource
    $routes->get('codesnaf',                          'CodeNaf::index');
    $routes->get('codesnaf/tree',                     'CodeNaf::tree');
    $routes->get('codesnaf/like',                     'CodeNaf::like');    
    $routes->get('codesnaf/(:segment)/children',      'CodeNaf::children/$1');
    $routes->get('codesnaf/(:segment)/hierarchy',     'CodeNaf::hierarchy/$1');
    $routes->get('codesnaf/(:segment)',               'CodeNaf::show/$1');

    // PCG est R/W => resource
    // on doit placer les autres methodes et routes avant pour qu'elle soit gérées
    $routes->get    ('comptespcg/tree',               'Comptespcg::tree');
    $routes->get    ('comptespcg/(:segment)/children','Comptespcg::children/$1');
    $routes->get    ('comptespcg/(:segment)/hierarchy','Comptespcg::hierarchy/$1');
    $routes->resource('comptespcg');

    $routes->get('image/like', 'Image::like');
    $routes->resource('image', [ 'controller' => 'Image']);

    $routes->get   ('formejuridique',        'FormeJuridique::index');
    $routes->get   ('formejuridique/like',   'FormeJuridique::like');
    $routes->get   ('formejuridique/(:any)', 'FormeJuridique::show/$1');
    $routes->post  ('formejuridique',        'FormeJuridique::create');
    $routes->put   ('formejuridique/(:any)', 'FormeJuridique::update/$1');
    $routes->delete('formejuridique/(:any)', 'FormeJuridique::delete/$1');

    $routes->get   ('typevoie',        'TypeVoie::index');
    $routes->get   ('typevoie/like',   'TypeVoie::like');    // ← avant (:num)
    $routes->get   ('typevoie/(:num)', 'TypeVoie::show/$1');
    $routes->post  ('typevoie',        'TypeVoie::create');
    $routes->put   ('typevoie/(:num)', 'TypeVoie::update/$1');
    $routes->delete('typevoie/(:num)', 'TypeVoie::delete/$1');

    $routes->get('codepostal',        'CodePostal::index');
    $routes->get('codepostal/like',   'CodePostal::like');   // ← avant (:num)
    $routes->get('codepostal/(:num)', 'CodePostal::show/$1');
    // ⚠ Pas de POST/PUT/DELETE — référentiel en lecture seule.
    
    $routes->get   ('adresse',        'Adresse::index');
    $routes->get   ('adresse/like',   'Adresse::like');      // ← avant (:num)
    $routes->get   ('adresse/(:num)', 'Adresse::show/$1');
    $routes->post  ('adresse',        'Adresse::create');
    $routes->put   ('adresse/(:num)', 'Adresse::update/$1');
    $routes->delete('adresse/(:num)', 'Adresse::delete/$1');

 
    // Organisation
    $routes->get   ('organisation',        'Organisation::index');
    $routes->get   ('organisation/like',   'Organisation::like');
    $routes->get   ('organisation/(:num)', 'Organisation::show/$1');
    $routes->post  ('organisation',        'Organisation::create');
    $routes->put   ('organisation/(:num)', 'Organisation::update/$1');
    $routes->delete('organisation/(:num)', 'Organisation::delete/$1');

    // Entreprise
    $routes->get   ('entreprise',        'Entreprise::index');
    $routes->get   ('entreprise/like',   'Entreprise::like');
    $routes->get   ('entreprise/(:num)', 'Entreprise::show/$1');
    $routes->post  ('entreprise',        'Entreprise::create');
    $routes->put   ('entreprise/(:num)', 'Entreprise::update/$1');
    $routes->delete('entreprise/(:num)', 'Entreprise::delete/$1');


    // Debug
    $routes->get('ping',  'Ping::getIndex');
    $routes->get('ping2', 'Ping2::getIndex');
});
