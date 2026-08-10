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

# PropertySet

## type: 'relation' dans le PropertySet :

```js
{
    name       : 'codepostal_id',
    type       : 'relation',
    description: 'Code postal',
    options    : {
        dialogId   : 'dialog_cp',
        valueKey   : 'id',          // FK stockée
        labelKey   : 'label',       // clé retournée par le dialog
        displayFn  : (data) =>      // reconstruction du label en mode edit (fill)
            `${data.cp_codepostal ?? ''} ${data.cp_commune ?? ''}`.trim(),
        placeholder: 'Code postal…',
        required   : '',
    },
}
```


Le champ relation souscrit lui-même à dialog:select filtré sur dialogId 

— le Form reste propriétaire, le bus n'est qu'un tuyau.
  Les handlers sont stockés dans _busHandlers[] et désabonnés au destroy().

RelationPickerDialog est générique 
— fetchFn reçoit la requête, renvoie items[]. 
columns définit la table. 


AdresseWorkbench.bootstrap() est modifié pour créer les deux dialogs.
