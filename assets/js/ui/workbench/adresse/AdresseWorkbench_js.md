## ressource

### js
- refactoring/assets/js/wbapp.js
- refactoring/assets/js/ui/workbench/WorkbenchBase.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ARCHITECTURE/domhelper.md a rapprocher de assets

### css
cp_detail
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/css/workbench/workbench.css
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Views/layouts/cms.php#L381
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/css/workbench/theme_one.css
- refactoring/assets/css/workbench/adresse.css

# Workbench Adresse

fichiers : 
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/adresse/AdresseDetailPanel.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/adresse/AdresseListPanel.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/adresse/AdresseWorkbench.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/ui/workbench/adresse/MapPanel.js

```
.panel-card
 ├── h2.panel-title              → menu principal
 ├── p.panel-description
 └── .section-tab
      ├── .tab-headers           → construit par uiapp.js
      ├── #adresses-0.tab-content
      │    └── h3                → sous-menu
      └── #adresses-1.tab-content
           ├── h3                → sous-menu
           └── #adresse-workbench
                └── AdresseWorkbench
                     ├── liste
                     ├── détail
                     └── carte
  ```

## Historique
voir https://github.com/arbph-dev/codeIgniter-appCms/blob/main/assets/js/components/leaflet_js.md#historique
