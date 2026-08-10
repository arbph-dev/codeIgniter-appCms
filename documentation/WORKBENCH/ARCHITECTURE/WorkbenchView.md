# WorkbenchView

## Layout
Le descripteur ne porte que la structure CSS.

voir assets/js/ui/workbench/core/LayoutDescriptor.js
Fabrique un descripteur de layout immuable.
Un descripteur décrit uniquement la STRUCTURE : la classe CSS du conteneur et les zones qui le composent. Il ne contient jamais de Panels ni de HTML.
Chaque Workbench définit son propre descripteur (une instance par Workbench).

Les instances de panels restent dans le Workbench (_createPanels + mountPanels) — option B du design (Workbench maître de ses panels pour bindEvents).


```js
//   {
//     css   : 'wb_mot_layout',            // classe du div conteneur
//     zones : [
//       { name: 'left',  css: 'wb_mot_left'  },
//       { name: 'right', css: 'wb_mot_right' },
//     ],
//   }


createDescriptor({
  css: 'wb_adresse_layout',
  zones: [
    { name: 'left',   css: 'wb_adresse_left'   },  // liste
    { name: 'center', css: 'wb_adresse_center' },  // détail / form
    { name: 'right',  css: 'wb_adresse_right'  },  // carte Leaflet
  ],
})
```
