# articles

## Migrations
Les parts sont stockées dans la table cmsarticles.

La migration est détaillé ici : [migration cmsarticles](/documentation/MIGRATIONS/cmsarticles.md#migration)


## Visualisation Article 
[https://zealot.fr/cms/article/test-art](https://zealot.fr/cms/article/test-art)

```php
$routes->get( 'cms/article/(:segment)', 'CmsController::article/$1' );  
```
	
