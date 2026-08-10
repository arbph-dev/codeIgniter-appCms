# LayoutDescriptor

Le descripteur [LayoutDescriptor](/refactoring/assets/js/ui/workbench/core/LayoutDescriptor.js) ne porte que la structure CSS ,il fournit un descripteur de layout immuable. 

Chaque Workbench définit son propre descripteur (une instance par Workbench).

Un descripteur décrit uniquement la STRUCTURE : 
- la classe CSS du conteneur
- les zones qui le composent.

Il ne contient jamais de Panels ni de HTML. 
```js
{
    css   : 'wb_mot_layout',            // classe du div conteneur
    zones : [
        { name: 'left',  css: 'wb_mot_left'  },
        { name: 'right', css: 'wb_mot_right' },
    ],
}
```

---
