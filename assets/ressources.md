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
```




## Application
Le fichier principal est [/assets/js/uiapp_js.md](/assets/js/uiapp_js.md)


## Composants
- [apex](/assets/js/components/apex_js.md)
- [mermaid](/assets/js/components/mermaid_js.md)
