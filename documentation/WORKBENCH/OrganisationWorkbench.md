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
créé 
- routes
- controleur
- view
  - [workbench/organisation.php](/refactoring/app/Views/workbench/organisation.php)

