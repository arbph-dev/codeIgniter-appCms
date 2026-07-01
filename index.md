# Zealot v2 - Roadmap Architecture

## Objectif

Construire une plateforme SPA professionnelle permettant :

- gestion de données
- gestion de relations
- API cohérentes
- composants PHP
- composants JS
- système expert futur


## Projet
Les étapes du projet sont abordées dans [index](/project/index.md)

---
# Architecture CMS
## Structure
- [categories](/documentation/categories.md)
- [articles](/documentation/articles.md)
- [sections](/documentation/sections.md)
- [parts](/documentation/parts.md)

## Exploitation

### visualisation Category
```php
$routes->get( 'cms/category/(:segment)', 'CmsController::category/$1');
```
	https://zealot.fr/cms/category/test-cat

controller : CmsController
méthode : category
paramètre : string **slug** de l'article a consulter

---


## Administration

- [administration](/documentation/administration.md)


# Ressources

La version de production comporte les essais de mise en ouevre
Les source sont disponibles dans [dossier old](/old/)


## Authentification

```
service('auth')->routes($routes);
```


## Routes de test

Plusieurs essais succesifs de gestion des contenus.



```
$routes->get('chimie', 'Chimie::index');

$routes->get('informatique', 'Informatique::index');
$routes->get('informatique/(:segment)', [Informatique::class, 'show']); // Added 2026-03-25

$routes->get('portal', 'Portal::index');

$routes->get('technologies', 'Technologies::index');
$routes->get('phpdebug', 'Technologies::debug');
$routes->get('technologies/(:segment)', 'Technologies::rubrique/$1');
$routes->get('technologies/(:segment)/(:segment)', 'Technologies::show/$1/$2');
```
Des routes spécifiques pour le test de messagerie et base de données
```
$routes->get('sendtestmail', 'Sendtestmail::index');
$routes->get('dbtest', 'Dbtest::index');
```

## Version de production
Le CMS actuelle n'utilise pas les base de données.

Les articles sont strockées dans le controleur et transmis à la vue

3 routes sont prévues pour les utilisateurs anonymes, les utilisateurs et adminsistrateurs

```
$routes->get('/', 'Cms::index');
$routes->get('/user', 'User::index');
$routes->get('/admin', 'Admin::index');
```
