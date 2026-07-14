 /**
    
    /assets/js/components/modelworkbench/admin/index.js
* --------------------------------------------------------------------
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
    
    //import { ModelWorkbench } from '../ModelWorkbench.js';
    import { ModelWorkbench } from '/assets/js/components/modelworkbench/ModelWorkbench.js'
    
    /**
     * Initialise le ModelWorkbench (Administration).
     */
    export function initModelWorkbench()
    {
        new ModelWorkbench();
    }   
