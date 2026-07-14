


## JS

```
assets/js/components/modelworkbench/

├── admin/
│   └── index.js
├── core3js/
│   └── SceneManager.js
├── ModelWorkbench.js
└── index.js
```

---

## PHP
```
app/
├── Config/
│   └── Routes.php
├── Controllers/
│   └── Admin/
│       └── ModelWorkbench.php
└── Views/
    └── admin/
        └── modelworkbench.php
```

---
## Fichiers

---
### `/app/Config/Routes.php`
```php
/*
|--------------------------------------------------------------------------
| ModelWorkbench
|--------------------------------------------------------------------------
*/
$routes->get( 'admin/modelworkbench', 'Admin\ModelWorkbench::index' );
```
---
### `/app/Controllers/Admin/ModelWorkbench.php`
```php
<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;

/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Contrôleur d'administration du ModelWorkbench.
 *
 * Responsabilité :
 *  - afficher le Workbench.
 * --------------------------------------------------------------------
 */
class ModelWorkbench extends BaseController
{
    /**
     * Affiche le ModelWorkbench.
     */
    public function index()
    {
        return view('admin/modelworkbench');
    }
}
```

---
### `/app/Views/admin/modelworkbench.php`
```php
<?php
/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Vue d'administration du ModelWorkbench.
 * --------------------------------------------------------------------
 */
?>
<!DOCTYPE html>

<html lang="fr">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>ModelWorkbench</title>

    <!-- Bibliothèques externes -->
    <?= view('cms/libs') ?>

</head>

<body>

<div id="modelworkbench">

    <!-- Zone principale du Workbench -->

</div>

<script type="module">

    import { initModelWorkbench }
        from '/assets/js/components/modelworkbench/admin/index.js';

    import { bus }
        from '/assets/js/core/eventBus.js';

    window.eventBusPublish = (evt, evtName, page) =>
        bus.publish(evtName, page);

    document.addEventListener('DOMContentLoaded', initModelWorkbench);

</script>

</body>

</html>
```


---
### `/assets/js/components/modelworkbench/admin/index.js`
```js
/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Point d'entrée de la version Administration.
 *
 * Responsabilités :
 *  - Initialiser le ModelWorkbench.
 *  - Démarrer les composants nécessaires à l'administration.
 *
 * Les fonctionnalités seront ajoutées progressivement au fil
 * des commits.
 * --------------------------------------------------------------------
 */

import { ModelWorkbench } from '../ModelWorkbench.js';

/**
 * Initialise le ModelWorkbench (Administration).
 */
export function initModelWorkbench()
{
    new ModelWorkbench();
}
```
---
### `/assets/js/components/modelworkbench/core3js/SceneManager.js`
```js
/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * SceneManager
 *
 * Responsable de l'initialisation de la scène Three.js.
 *
 * Responsabilités actuelles :
 *  - créer la scène
 *  - préparer les objets Three.js
 *
 * Les éléments suivants seront ajoutés progressivement :
 *  - caméra
 *  - renderer
 *  - éclairage
 *  - contrôles utilisateur
 *  - grille
 *  - repère XYZ
 *  - boucle de rendu
 *  - gestion du redimensionnement
 * --------------------------------------------------------------------
 */

export class SceneManager
{
    constructor()
    {
        this.scene = null;

        this.initialize();
    }

    /**
     * Initialise la scène Three.js.
     */
    initialize()
    {
        this.createScene();
    }

    /**
     * Création de la scène.
     */
    createScene()
    {
        this.scene = null;
    }
}
```

---
### `/assets/js/components/modelworkbench/ModelWorkbench.js`
```js
/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Composant principal du Workbench.
 *
 * Responsabilités :
 *  - Initialiser les sous-composants.
 *  - Coordonner le Workbench.
 *
 * Les fonctionnalités seront ajoutées progressivement.
 * --------------------------------------------------------------------
 */

// import { SceneManager } from './core3js/SceneManager.js';
import { SceneManager } from '/assets/js/components/modelworkbench/core3js/SceneManager.js';

export class ModelWorkbench
{
    constructor()
    {
        this.sceneManager = null;

        this.initialize();
    }

    /**
     * Initialisation du Workbench.
     */
    initialize()
    {
        this.sceneManager = new SceneManager();
    }
}
```

---
### `/assets/js/components/modelworkbench/index.js`
- production à créer (identique à admin)
```js
  null
```



Note : fichier /js la convention import n'est pas respectée
