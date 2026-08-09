# 02-FEATURES

## définitions

- Workbench = orchestrateur  
- WorkbenchView = layout + montage uniquement  
- Panels = UI + callbacks onXxx  
- Services = API

### WorkbenchView

#### Layout
Le descripteur ne porte que la structure CSS.

Les instances de panels restent dans le Workbench (_createPanels + mountPanels) — option B du design (Workbench maître de ses panels pour bindEvents).


```
createDescriptor({js
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
