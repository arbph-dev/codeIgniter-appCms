# categories

## Migration

[migration cmscategories](/documentation/MIGRATIONS/cmscategories.md#migration)


## visualisation Category
[https://zealot.fr/cms/category/test-cat](https://zealot.fr/cms/category/test-cat)

```php
$routes->get( 'cms/category/(:segment)', 'CmsController::category/$1');
```

controller :

CmsController

méthode :

category

paramètre :

string **slug** de l'article a consulter

---
