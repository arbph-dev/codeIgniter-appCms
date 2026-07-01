Le portail actuel doit évoluer

## Description

Dans cette section on regroupe les notes inhérentes au projet de refactoring

Les fonctionnalités à mettre en oeuvre : 
- Portail CMS : categories → articles → sections → parts
- MySQL 8+ / MariaDB 10.5+ (InnoDB, utf8mb4)
- Descripteurs de composants stockés en JSON sur parts.config


## Administration

### visualisation cms

[https://zealot.fr/admin/cmstree](https://zealot.fr/admin/cmstree)

```php
$routes->get( 'admin/cmstree', 'Admin\CmsTree::index' );
```
controller : Admin\CmsTree 
méthode : index
paramètre : ---


---

## Système de composants

### DescriptorDefinition
Décrit une instance.
Exemple :
```php
[    
	'type' => 'codeval',
	'id'   => 'CVG5'
]
```

Le descripteur contient :

- le type
- l'identifiant
- la configuration

Il ne contient aucun code métier.

---

### ComponentDefinition

Décrit une classe de composant.

Exemple :

```
codeval
apex
vox
dialog
treeview
datagrid
threejs
```

Décrit :

- structure
- paramètres
- ressources
- événements

---

### ComponentRegistry

Catalogue des composants disponibles.

Responsabilités :

- enregistrer les constructeurs
- retrouver un composant par type
- créer les instances

Exemple :

```
registry.register(    "codeval",    CodeValComponent);
```

---

### CompositeComponentDefinition

Décrit un composant contenant d'autres composants.

Exemples :

- ArticleList
- ArticleEditor
- AddressEditor
- RomeoJulietteScene

Un composant composite ne contient aucune logique spéciale.

Il orchestre simplement plusieurs composants simples.

---

## Vue PHP

Principe validé :

```php
$type = $part['type'] ?? 'raw';

if ($type === 'raw') {
    echo $part['content'];
}
else {
    echo view( "components/{$type}", $part );
}
```

Le CMS devient un moteur de rendu basé sur les descripteurs.

---





---
# Audit

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
