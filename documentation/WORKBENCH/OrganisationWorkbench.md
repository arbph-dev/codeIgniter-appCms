# OrganisationWorkbench

> url : https://zealot.fr/workbench/organisation


## Architecture

### Frontend

/assets/
- /css
  - /workbench/
    - [forms.css](/refactoring/assets/css/workbench/forms.css)
    - [organisation.css](/refactoring/assets/css/workbench/organisation.css)
- /js
  - /features
    - /organisation/
      - [organisation.constants.js](/refactoring/assets/js/features/organisation/organisation.constants.js)
      - [organisation.properties.js](/refactoring/assets/js/features/organisation/organisation.properties.js)
      - [organisation.service.js](/refactoring/assets/js/features/organisation/organisation.service.js)
  - /ui
    - /shared/
      - [Form.js](/refactoring/assets/js/ui/shared/Form.js)
    - /workbench/
      - [TabSystem.js](/refactoring/assets/js/ui/workbench/TabSystem.js)
      - /organisation/
        - [OrganisationWorkbench.js](/refactoring/assets/js/ui/workbench/organisation/OrganisationWorkbench.js)
        - [OrgDetailPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgDetailPanel.js)
        - [OrgListPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgListPanel.js)


### Backend


#### routes
Ajouter dans le groupe banc de test
```php
$routes->group('workbench', ['namespace' => 'App\Controllers'], static function ($routes)
{
    ...
    $routes->get('organisation'              ,   'WorkbenchController::organisation'          );    
``` 
#### controleur WorkbenchController
ajouter methode organisation
```php
    public function organisation() { return view('workbench/organisation'); }
```

#### view
La vue complète : [workbench/organisation.php](/refactoring/app/Views/workbench/organisation.php)

On inclue les feuilles de styles CSS
- [forms.css](/refactoring/assets/css/workbench/forms.css)
- [organisation.css](/refactoring/assets/css/workbench/organisation.css)

```html
    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/organisation.css">
    <link rel="stylesheet" href="/assets/css/workbench/dialog.css">
    <link rel="stylesheet" href="/assets/css/workbench/forms.css">
```

On créé le conteneur et on ajout import et script d'initialisation
```html
    <div id="organisationWorkbench"></div>

    <script type="module">
        import OrganisationWorkbench from '/assets/js/ui/workbench/organisation/OrganisationWorkbench.js';
        const wb = new OrganisationWorkbench();
        await wb.init('#organisationWorkbench');
    </script>
```

# Implémentation

## Service

Pour démarrer OrganisationWorkbench il faut vérifier

Api/Organisation.php
- format exact des réponses
  - GET  /api/organisation      → { data:[], pager:{} }
  - GET  /api/organisation/{id} → { data:{} }
  - POST /api/organisation      → { data:{} } ou { status, id }
  - PUT  /api/organisation/{id} → idem

Schema relation
- organisations ↔ adresses
  - table pivot ? ou adresse_id directe sur organisations ?

Relations directes sur organisations :
- adresse_id — FK directe (pas pivot) → AdressePickerDialog = RelationPickerDialog configuré avec fetchAdresseLike
- withRelations() ne joint pas les adresses
  - displayFn affiche Adresse #id au chargement , itemDisplay donne le formatage complet après sélection picker.

**Backend à enrichir** plus tard.

### [organisation.constants.js](/refactoring/assets/js/features/organisation/organisation.constants.js)

Définit une constante `ORGANISATION_TYPES`, tableau d'objet, miroir de la table. 

**organisation_types** n'as pas d'enum ni de model; c'est un référentiel table pure. Si la table évolue un jour, le fichier est à mettre à jour.

```js
export const ORGANISATION_TYPES = [
    { value: '1', label: 'Entreprise'              },
    { value: '2', label: 'Association loi 1901'    },
    { value: '3', label: 'Coopérative'             },
    { value: '4', label: 'Établissement public'    },
    { value: '5', label: 'Établissement scolaire'  },
    { value: '6', label: 'Collectivité territoriale'},
    { value: '7', label: 'Musée / Site culturel'   },
]
```
Le PropertySet définit un champ `organisation_type_id` de type **radio** fait le lien avec `ORGANISATION_TYPES` dans [organisation.properties.js](/refactoring/assets/js/features/organisation/organisation.properties.js)
```js
{
    name        : 'organisation_type_id',
    description : 'Type',
    type        : 'radio',
    default     : '1',
    options     : {
        required : '',
        choices  : ORGANISATION_TYPES,
    },
}
```

### [organisation.properties.js](/refactoring/assets/js/features/organisation/organisation.properties.js)

Trois PropertySets distincts :
- OrgInfoPropertySet     — identité + type (onglet Informations / form create)
- OrgContactPropertySet  — coordonnées + liens (onglet Contacts)
- OrgAdressePropertySet  — adresse_id via AdressePickerDialog (onglet Adresse)

### [organisation.service.js](/refactoring/assets/js/features/organisation/organisation.service.js)
Adapté depuis old
- chemins new architecture, pattern image/adresse.service.js




## Workbench core

### [TabSystem.js](/refactoring/assets/js/ui/workbench/TabSystem.js)
TabSystem iter007 

onTabChange(fn) est la pièce centrale : OrganisationWorkbench l'utilisera pour charger les adresses uniquement quand l'onglet "Adresses" est activé. 

resetTab(id) force le rechargement après un save sans détruire le TabSystem. 

markDirty/clearDirty sont prêts mais optionnels pour le premier OrganisationWorkbench.
- markDirty(id) `@param {string} id` : Marque un onglet comme "modifié" — indicateur visuel sur le bouton.





---

### [Form.js](/refactoring/assets/js/ui/shared/Form.js)
Form.js v4 

**radio et checkbox** suivent exactement le même schéma : PropertySet que les types précédents. 

Le cas :has(input:checked) en CSS donne un retour visuel immédiat sur le radio sélectionné sans une ligne de JS supplémentaire.

choix en radio avec flex-wrap donnent 3-4 lignes, **radio** pour la vue form principale, avec un type: 'select' en fallback si l'espace manque. 
correct pour un formulaire de création. Mais en onglet compact (TabSystem), le select est plus sobre. 


## Panels



### [OrgDetailPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgDetailPanel.js)

TabSystem dans OrgDetailPanel :
- renderFn() → form.render() (construit le DOM)
- initFn() → form.fill(org) (remplit au premier activate, lazy mais instantané — pas de fetch)

OrgDetailPanel appelle this.listPanel.onPage dans _bindEvents() mais OrgListPanel utilise encore pagination({ busEvent: 'wb:org:page' }) 

il faut : 
- soit câbler le bus dans le Workbench
- soit modifier OrgListPanel.show() pour utiliser onPage via callback.

**C'est l'incohérence de pagination identifiée en bilan AdresseWorkbench à corriger dans cette implémentation ou notée pour la prochaine session.**


_makeForm() dans OrgDetailPanel
- une seule factory qui crée les trois Forms avec le même onSubmit → onSave(id, data).
- Chaque onglet sauvegarde indépendamment ses champs.

Le backend CI n'applique que les allowedFields présents — envoyer des champs partiels est sûr.

Deux modes :
- CREATE → Form unique (OrgInfoPropertySet) — nom + type suffisent

- EDIT   → TabSystem 3 onglets
  - "Informations" → Form(OrgInfoPS)     renderFn + initFn fill()
  - "Contacts"     → Form(OrgContactPS)  renderFn + initFn fill()
  - "Adresse"      → Form(OrgAdressePS)  renderFn + initFn fill()

onSave(fn) : fn(id, data)
  id   = null → création
  id   > 0   → mise à jour partielle (seulement les champs du tab actif)

TabSystem.onTabChange() n'est pas nécessaire ici (toutes les données sont déjà dans `org`, pas de fetch lazy par onglet).





### [OrgListPanel.js](/refactoring/assets/js/ui/workbench/organisation/OrgListPanel.js)

OrgListPanel.onPage(fn)
- pagination via callback pur, cohérent avec le contrat panel.
- Le bus local wb:org:page est éliminé.


### AdressePickerDialog
Pas de fichier séparé. C'est RelationPickerDialog configuré avec fetchAdresseLike et les colonnes adresse. L'abstraction RelationPickerDialog absorbe ce cas sans extension.





---

## [OrganisationWorkbench.js](/refactoring/assets/js/ui/workbench/organisation/OrganisationWorkbench.js)
 2 zones : list (left) + detail (center, TabSystem intégré dans OrgDetailPanel)

 Dialogs :
   dialog_adresse — RelationPickerDialog pour adresse_id
                    (fetchAdresseLike → suggest AdresseModel)

 onSave(id, data) — id=null création, id>0 mise à jour partielle
   Le Workbench fait toujours saveOrg({ id, ...data }) — le backend
   n'applique que les allowedFields présents dans data.

 Pagination via onPage(fn) — cohérent avec le contrat callback panels.










