La partie administration est réalisé avec :

les controleurs :
- [Admin/CmsPart](/refactoring/app/Controllers/Admin/CmsPart.php)
- [Admin/CmsTree](/refactoring/app/Controllers/Admin/CmsTree.php)


le service :

les vues:
‎- admin/cmspart/index
- admin/cmspart/edit

## Controleurs

### CmsPart
Le controleur [Admin/CmsPart](/refactoring/app/Controllers/Admin/CmsPart.php) permet la gestion CRUD des [Parts](/documentation/parts.md)

Il emploie le service : 

Les méthodes du controleur :
- CmsPart.index
- CmsPart.edit
- CmsPart.update
- CmsPart.create
- CmsPart.insert
- CmsPart.delete
- CmsPart.up
- CmsPart.down

### CmsTree
[Admin/CmsTree](/refactoring/app/Controllers/Admin/CmsTree.php) à la charge d'afficher le cms en representant sa structure hiérarchique

# visualisation cms
url : [https://zealot.fr/admin/cmstree](https://zealot.fr/admin/cmstree)

routes : 
```php
$routes->get( 'admin/cmstree', 'Admin\CmsTree::index' );
```
controller : [Admin\CmsTree](/refactoring/app/Controllers/Admin/CmsTree.php)
méthode : index
paramètre : ---
