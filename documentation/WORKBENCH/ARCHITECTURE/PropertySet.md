# PropertySet
Ils sont destinés a décrire les données échangées avec les  API

## Applications:
- [/assets/js/features/mot/mot.properties.js](/refactoring/assets/js/features/mot/mot.properties.js)
- [/assets/js/features/image/image.properties.js](/refactoring/assets/js/features/image/image.properties.js)
- [/assets/js/features/adresse/adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)

## type: 'checkbox'
Schema PropertySet — type 'checkbox' :

```json
{
    name:'is_active',
    type:'checkbox',
    default:true,
    options:{ label:'Oui, actif' }
}
```

---

## type: 'radio'

Schema PropertySet — type 'radio' :

```js
{
    name:'organisation_type_id',
    type:'radio',
    default:'1',
    options:{
        choices:[
            {value:'1',label:'Entreprise'},
            …
        ],
        required:''
    }
}
```

---

## type: 'relation'

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

---

# [mot.properties.js](/refactoring/assets/js/features/mot/mot.properties.js)


# [image.properties.js](/refactoring/assets/js/features/image/image.properties.js)

Propose 2 schémas distincts :
- Schéma CREATE pour upload d'une nouvelle image.
    - ImageCreatePropertySet — CREATE : file + alt + status
- Schéma UPDATE — modification d'une image existante.
    - ImageEditPropertySet   — UPDATE : alt + status seulement

les Champs read-only calculés à l'upload sont affichés en lecture, ils ne figurent jamais dans les PropertySet car non éditables
Pour image : filename, width, height, ratio, extension, size_ko, path sont affichés via detail()


# [adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)
Ce PropertySet introduit le type relation via les PK : 
- codepostal_id
- voietype_id

Les champs read-only sont absent du formulaire et affichés dans detail()) : id, latitude , longitude ,  precision,  voietype_nom — JOIN type_voies,  cp_codepostal— JOIN codes_postaux , cp_commune   — JOIN codes_postaux

Champs relation :
- codepostal_id → dialog_cp (fetchCpLike) — required
- voietype_id   → dialog_tv (fetchTvLike) — permit_empty

Le champ relation souscrit lui-même à dialog:select filtré sur dialogId 

— le Form reste propriétaire, le bus n'est qu'un tuyau.
  Les handlers sont stockés dans _busHandlers[] et désabonnés au destroy().

RelationPickerDialog est générique 
— fetchFn reçoit la requête, renvoie items[]. 
columns définit la table. 

AdresseWorkbench.bootstrap() est modifié pour créer les deux dialogs.

---













