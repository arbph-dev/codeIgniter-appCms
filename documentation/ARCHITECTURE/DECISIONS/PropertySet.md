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

---
# domhelper
Cette librairie permet de factoriser la création des éléments

## [/assets/js/core/domhelper.js : detail()](/refactoring/assets/js/core/domhelper.js#L558)
employée par les **panels**
Construit une `<dl class="cp_detail">` depuis un tableau de `{ label, value }`.

Exemple :
```js
    panels.detail.appendChild(detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ]))
```
