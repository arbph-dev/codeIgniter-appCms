La partie administration est réalisé avec :

les controleurs :
- [Admin\CmsTree](/refactoring/app/Controllers/Admin/CmsTree.php)

le service :

les vues:


### visualisation cms
url : [https://zealot.fr/admin/cmstree](https://zealot.fr/admin/cmstree)

routes : 
```php
$routes->get( 'admin/cmstree', 'Admin\CmsTree::index' );
```
controller : [Admin\CmsTree](/refactoring/app/Controllers/Admin/CmsTree.php)
méthode : index
paramètre : ---
