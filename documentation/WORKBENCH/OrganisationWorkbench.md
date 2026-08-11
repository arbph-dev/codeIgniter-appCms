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
La vue complète : [workbench/organisation.php](/refactoring/app/Views/workbench/organisation.php)

On inclue les feuilles de styles CSS
- [forms.css](/refactoring/assets/css/workbench/forms.css)
- [organisation.css](/refactoring/assets/css/workbench/organisation.css)

```html
    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/organisation.css">
    <link rel="stylesheet" href="/assets/css/workbench/dialog.css">
    <link rel="stylesheet" href="/assets/css/workbench/forms.css">
```

On créé le conteneur et on ajout import et script d'initialisation
```html
    <div id="organisationWorkbench"></div>

    <script type="module">
        import OrganisationWorkbench from '/assets/js/ui/workbench/organisation/OrganisationWorkbench.js';
        const wb = new OrganisationWorkbench();
        await wb.init('#organisationWorkbench');
    </script>
```











