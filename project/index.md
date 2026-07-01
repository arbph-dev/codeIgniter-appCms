Dans cette section on regroupe le snotes inhérentes au projet

Phase 0 - Stabilisation
    Objectifs
    Livrables
    Travaux réalisés
    Travaux restant
    Documents liés
    Code concerné

Phase 1 - Audit Backend

Phase 2 - Recherche

...

Phase 7 - Système Expert


# Routes du cms

```php
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
```
