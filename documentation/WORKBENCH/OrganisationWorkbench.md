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






## Workbench core

### [TabSystem.js](/refactoring/assets/js/ui/workbench/TabSystem.js)
TabSystem iter007 

onTabChange(fn) est la pièce centrale : OrganisationWorkbench l'utilisera pour charger les adresses uniquement quand l'onglet "Adresses" est activé. 

resetTab(id) force le rechargement après un save sans détruire le TabSystem. 

markDirty/clearDirty sont prêts mais optionnels pour le premier OrganisationWorkbench.
- markDirty(id) `@param {string} id` : Marque un onglet comme "modifié" — indicateur visuel sur le bouton.


### [Form.js](/refactoring/assets/js/ui/shared/Form.js)
Form.js v4 

**radio et checkbox** suivent exactement le même schéma : PropertySet que les types précédents. 

Le cas :has(input:checked) en CSS donne un retour visuel immédiat sur le radio sélectionné sans une ligne de JS supplémentaire.

choix en radio avec flex-wrap donnent 3-4 lignes, **radio** pour la vue form principale, avec un type: 'select' en fallback si l'espace manque. 
correct pour un formulaire de création. Mais en onglet compact (TabSystem), le select est plus sobre. 



TabSystem dans OrgDetailPanel :

renderFn() → form.render() (construit le DOM)
initFn() → form.fill(org) (remplit au premier activate, lazy mais instantané — pas de fetch)
