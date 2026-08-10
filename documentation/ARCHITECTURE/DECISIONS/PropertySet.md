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
Ils sont destinés a décrire les données échangées avec les  API

## Applications:
- [/assets/js/features/mot/mot.properties.js](/refactoring/assets/js/features/mot/mot.properties.js)
- [/assets/js/features/image/image.properties.js](/refactoring/assets/js/features/image/image.properties.js)
- [/assets/js/features/adresse/adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)

### [mot.properties.js](/refactoring/assets/js/features/mot/mot.properties.js)


### [image.properties.js](/refactoring/assets/js/features/image/image.properties.js)

Propose 2 schémas distincts :
- Schéma CREATE pour upload d'une nouvelle image.
    - ImageCreatePropertySet — CREATE : file + alt + status
- Schéma UPDATE — modification d'une image existante.
    - ImageEditPropertySet   — UPDATE : alt + status seulement

les Champs read-only calculés à l'upload sont affichés en lecture, ils ne figurent jamais dans les PropertySet car non éditables
Pour image : filename, width, height, ratio, extension, size_ko, path sont affichés via detail()


### [adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)
Ce PropertySet introduit le type relation via les PK : 
- codepostal_id
- voietype_id

Les cChamps read-only sont absent du formulaire et affichés dans detail()) : id, latitude , longitude ,  precision,  voietype_nom — JOIN type_voies,  cp_codepostal— JOIN codes_postaux , cp_commune   — JOIN codes_postaux

Champs relation :
- codepostal_id → dialog_cp (fetchCpLike) — required
- voietype_id   → dialog_tv (fetchTvLike) — permit_empty






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
