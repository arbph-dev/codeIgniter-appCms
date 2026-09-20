
# Exploitation

```js
import { byId, byName , qs , qsa , create } from '/assets/js/core/domhelper.js'
```

# Améliorations
intégrer `function typeofObj( Obj )` de [uiapp.js](/WebUI/uiapp.js#L69)


# helpers DOM
- byId
- byName
- qs
- qsa
- create

## byId

**exemple** : 
```js
  sidebar = byId("sidebar", document)
```

## byName

**exemple** : 
```js
  _main = byName("main")[0]

  _menu = byName( "nav", document )[0]

 _footer = byName("footer" , document )[0]
```


## qs

**exemple** : 
```js
  _footer_status = qs( "div#statusBar" , _footer )
  
  _header_actions_btn_fullscreen = qs( "header#header > div.header-actions > button#fullscreenBtn")
```

## qsa

**exemple** : 
```js
_main_panels = qsa("div.panel-card" , _main )  // on extrait les informations de la page

panelSections = qsa( "div.section-tab  > div.tab-content > h3" , panel )

const menuPanels = qsa('.nav-article', _menu )
```

## create

**exemple** : 
```js

```
