- chaque fichier employé est listé dans une note annexe [/assets/ressources.md](/assets/ressources.md)

- chaque fonction importée doit être répertorié et expliqué si besoin
  - exemple `/assets/js/uiapp.js` => [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)

# Ressources serveur : (/public)

```
/ui.html
/assets/css/uistyle.css
/assets/js/uiapp.js

/assets/js/components/apex.js
  import { initApex } from '/assets/js/components/apex.js'

/assets/js/components/codeval.js
  import { initCodeVal } from '/assets/js/components/codeval.js'

/assets/js/components/mermaid.js
  import { initMermaid } from '/assets/js/components/mermaid.js'

/assets/js/core/domhelper.js
  import { byId, byName , qs , qsa , create } from '/assets/js/core/domhelper.js'

/assets/js/core/eventBus.js

/assets/js/libs/physics.js
```




## Application
Le fichier principal est [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)


## Composants
- /ui.html
- /assets/css/
  - uistyle.css
- /assets/js/
  - [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)
- /assets/js/components/
  - [apex.js](/assets/js/components/apex_js.md)
  - [codeval.js](/assets/js/components/codeval_js.md)
  - [mermaid.js](/assets/js/components/mermaid_js.md)
- /assets/js/core/
  - domhelper.js
  - eventBus.js
- /assets/js/libs/
  - [/assets/js/libs/physics_js.md](/assets/js/libs/physics_js.md)
