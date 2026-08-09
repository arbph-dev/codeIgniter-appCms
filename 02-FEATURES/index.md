# 02-FEATURES

## définitions

- Workbench = orchestrateur  
- WorkbenchView = layout + montage uniquement  
- Panels = UI + callbacks onXxx  
- Services = API

### Workbench

#### Cycle d’initialisation

WorkbenchBase.init() appelle typiquement renderStructure() puis bootstrap().

Ordre important : dialogs avant panels, sinon un clic relation trop tôt n’aurait pas de dialog dans le DOM.

```
bootstrap()
  │
  ├─ 1. initLeaflet()
  │     Guard _initialized dans leaflet.js → abonnements bus une seule fois
  │     (évite les doubles handlers si plusieurs workbenches / re-init)
  │
  ├─ 2. _createDialogs()
  │     RelationPickerDialog CP + TypeVoie → .render() → dans le body
  │     Avant le montage des panels : Form.js peut publier dialog:show
  │     dès le premier render() du détail
  │
  ├─ 3. WorkbenchView(LAYOUT, .wb-content).build()
  ├─ 4. _createPanels() + mountPanels
  ├─ 5. _bindEvents()
  └─ 6. load()   ← premier fetch
```





### WorkbenchView

#### Layout
Le descripteur ne porte que la structure CSS.

Les instances de panels restent dans le Workbench (_createPanels + mountPanels) — option B du design (Workbench maître de ses panels pour bindEvents).


```js
createDescriptor({
  css: 'wb_adresse_layout',
  zones: [
     { name: 'left',   css: 'wb_adresse_left'   },  // liste
    { name: 'center', css: 'wb_adresse_center' },  // détail / form
    { name: 'right',  css: 'wb_adresse_right'  },  // carte Leaflet
  ],
})
```



## liste des Workbench
- [AdresseWorkbench](/02-FEATURES/AdresseWorkbench.md)



## ressources


### Backend



### Frontend


Form.js
