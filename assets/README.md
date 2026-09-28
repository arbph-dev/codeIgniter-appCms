voir aussi [/app/](/app/)

# Ressources serveur : (/public)
C'est le dossier OVH à gérer
```
/public/assets
/public/uploads
/public/.htaccess
/public/arnaud.png
/public/CV.html
/public/favicon.ico
/public/index.php
/public/info.php
/public/mail.php
/public/recherche-mot-api.html
/public/robots.txt
/public/ui.html
```

## Arborescence 
(base /public/) => ui.html est /public/ui.html

- [`/ui.html`](/assets/ui_html.md)
- [`/assets/`](/assets/)
  - [`/css/`](/assets/css/)
    - [`uistyle.css`](/assets/css/uistyle_css.md)
  - [`/js/`](/assets/js/)
    - [`uiapp.js`](/assets/js/uiapp_js.md)
    - [`/components/`](/assets/js/components/)
      - [`apex.js`](/assets/js/components/apex.js) - [documentation apex.js](/assets/js/components/apex_js.md)
      - [codeval.js](/assets/js/components/codeval_js.md)
      - [mermaid.js](/assets/js/components/mermaid_js.md)
    - [`/core/`](/public/assets/js/core/)
      - [/assets/js/core/domhelper.js](/assets/js/core/domhelper.js) - [documentation domhelper.js](/assets/js/core/domhelper_js.md)
      - [/assets/js/core/eventBus.js](/assets/js/core/eventBus.js) [documentation eventBus.js](/assets/js/core/eventBus_js.md)
  - [`/libs/`](/public/assets/js/libs/)
    - [physics.js](/assets/js/libs/physics.js)- [documentation physics.js](/assets/js/libs/physics_js.md)
  - [`/ui/`](/assets/js/ui/)
    - [`/workbench/`](/assets/js/ui/workbench/)
      - /assets/js/ui/workbench/auth/
        - [ToolbarAuthPanel.js](/assets/js/ui/workbench/auth/ToolbarAuthPanel.js) - [documentation ToolbarAuthPanel.js](/assets/js/ui/workbench/auth/ToolbarAuthPanel_js.md)
      - /assets/js/ui/workbench/core/
        - [/assets/js/ui/workbench/core/AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase.js) - [documentation AuthPanelBase.js](/assets/js/ui/workbench/core/AuthPanelBase_js.md)



## Domaine

### Application
Le fichier principal est [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)

- [`/ui.html`](/assets/ui_html.md) on utilise [/ui.html](/WebUI/index.md) pour les travaux en cours
- /assets/css/
  - [`uistyle.css`](/assets/css/uistyle_css.md)
    - on utilise [/WebUI/uistyle.css](/WebUI/uistyle.css) pour les travaux en cours
- /assets/js/
  - [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)

## Composants
- /assets/js/components/
  - [apex.js](/assets/js/components/apex_js.md)
  - [codeval.js](/assets/js/components/codeval_js.md)
  - [mermaid.js](/assets/js/components/mermaid_js.md)

## core
- /assets/js/core/
  - [`domhelper.js`](/assets/js/core/domhelper_js.md)
    - la source [`/refactoring/assets/js/core/domhelper.js`](/refactoring/assets/js/core/domhelper.js)
  - [`eventBus.js`](/assets/core/eventBus_js.md)
    - source : [`/refactoring/assets/js/core/eventBus.js`](/refactoring/assets/js/core/eventBus.js)



## libs

- /assets/js/libs/
  - [/assets/js/libs/physics_js.md](/assets/js/libs/physics_js.md)
 


