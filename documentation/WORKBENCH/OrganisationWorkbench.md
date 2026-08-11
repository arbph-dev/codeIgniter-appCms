# OrganisationWorkbench

> url : https://zealot.fr/workbench/organisation


## Architecture

### Frontend

/assets/
- /css
  - /workbench/
    - [forms.css](/refactoring/assets/css/workbench/forms.css)
    - [organisation.css](/refactoring/assets/css/workbench/organisation.css)
- /js
  - /features
    - /organisation/
      - [organisation.constants.js](/refactoring/assets/js/features/organisation/organisation.constants.js)
      - [organisation.properties.js](/refactoring/assets/js/features/organisation/organisation.properties.js)
      - [organisation.service.js](/refactoring/assets/js/features/organisation/organisation.service.js)
  - /ui
    - /shared/
      - [Form.js](/refactoring/assets/js/ui/shared/Form.js) 
    - /workbench/
      - [TabSystem.js](/refactoring/assets/js/ui/workbench/TabSystem.js)
      - /organisation/
        - [OrganisationWorkbench.js](/refactoring/assets/js/ui/workbench/organisation/OrganisationWorkbench.js)
        - [OrgDetailPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgDetailPanel.js)
        - [OrgListPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgListPanel.js)


### Backend


#### routes
Ajouter dans le groupe banc de test
```php
$routes->group('workbench', ['namespace' => 'App\Controllers'], static function ($routes)
{
    ...
    $routes->get('organisation'              ,   'WorkbenchController::organisation'          );    
``` 
#### controleur WorkbenchController
ajouter methode organisation
```php
    public function organisation() { return view('workbench/organisation'); }
```

#### view
[workbench/organisation.php](/refactoring/app/Views/workbench/organisation.php)










