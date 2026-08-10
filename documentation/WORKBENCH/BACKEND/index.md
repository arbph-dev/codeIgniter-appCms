# Backend

Pour mettre en œuvre un Workbench il faut 
- une route
- un contrôleur pour gérer les routes du groupe workbench
- une vue pour fournir le Workbench ( html, css ,js)

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


# ImageWorkbench - Backend 
Backend résolu en 3 lignes.

```php
// Routes
$routes->get('image', 'WorkbenchController::image');

// WorkbenchController
public function image() {
    return view('workbench/image');
}

// Vue : stub pur
<div id="imageWorkbench"></div>
<script type="module">
    import ImageWorkbench from '/assets/js/ui/workbench/image/ImageWorkbench.js';
    const wb = new ImageWorkbench();
    await wb.init('#imageWorkbench');
</script>
```


