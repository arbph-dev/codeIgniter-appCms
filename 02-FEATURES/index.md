# 02-FEATURES

## définitions

- Workbench = orchestrateur  
- WorkbenchView = layout + montage uniquement  
- Panels = UI + callbacks onXxx  
- Services = API

### Workbench
Le Workbench crée les dialogs ; le Form s’y connecte uniquement via le bus (dialogId dans le PropertySet).

Le Workbench ne touche pas au DOM interne des panels.

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

---


# liste des Workbench
( par ordre d'implémentation)

- [MotWorkbench](/02-FEATURES/MotWorkbench.md)
- [ImageWorkbench](/02-FEATURES/ImageWorkbench.md)
- [AdresseWorkbench](/02-FEATURES/AdresseWorkbench.md)


---

# Frontend 
### core
[/assets/js/core/domhelper.js](/refactoring/assets/js/core/domhelper.js)

### shared

- [/assets/js/ui/shared/DialogManager.js](/refactoring/assets/js/ui/shared/DialogManager.js)
- [/assets/js/ui/shared/Form.js](/refactoring/assets/js/ui/shared/Form.js)
- [/assets/js/ui/shared/RelationPickerDialog.js](/refactoring/assets/js/ui/shared/RelationPickerDialog.js)

### Services / features
- [/assets/js/features/adresse/adresse.properties.js](/refactoring/assets/js/features/adresse/adresse.properties.js)

# Backend

Pour mettre en œuvre un Workbench il faut 
- une route
- un contrôleur pour gérer les routes du groupe workbench
- une vue pour fournir le Workbench

## routes
Les routes sont regroupées dans le groupe workbench

```php
$routes->get('adresse' , 'WorkbenchController::adresse');
```

## controleur WorkbenchController
Pour chaque **Workbench** on créé une fonction. Cette fonction fournit la vue contenant le script du **Workbench**

```php
  /** Workbench de test — feature Adresse  ; URL : /workbench/adresse     */    
  public function adresse() { return view('workbench/adresse'); }      
```
## Vue

La vue fournit 
- le style css
- les librairies de script
- le container, element div
- le script **Workbench**

Le script complet d'une vue : [app/Views/workbench/adresse.php](/refactoring/app/Views/workbench/adresse.php)


### style et script
Les vues ont des dépendances. Il est possible de regrouper ces dépendances pour les réemployer voir voir refactoring/app/Views/workbench/libs.php.

Dans l'immédiat on inclus directement ces dépendances car elle varie selon les ressources nécessaires

On en distingue 2 types : 
- Styles applicatifs : tronc commun et spécifique au workbench
- Styles et scripts des extensions

#### Styles applicatifs
```html
<head>
  ...
    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/workbench/theme_one.css">
    <link rel="stylesheet" href="/assets/css/workbench/workbench.css">
    <link rel="stylesheet" href="/assets/css/workbench/adresse.css">
```
#### Styles et scripts des extensions
```html
<head>
  ...
    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="/assets/css/components/leaflet.css">
```




### container
Le body du document contient le container qui accueillera le workbench

```html
  <body>
    <div id="adresseWorkbench"></div>
```

### script **Workbench**
On le place en fin de page dans un bloc script de type module
```js
        import AdressseWorkbench from '/assets/js/ui/workbench/adresse/AdresseWorkbench.js';
        const wb = new AdressseWorkbench();
        await wb.init('#adresseWorkbench');
```

