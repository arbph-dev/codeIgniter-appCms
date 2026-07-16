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
* 
* ModelWorkbench — Commit 2
*
* Point d'entrée Administration.
* Responsabilité : lire le container DOM, initialiser le Workbench.
* --------------------------------------------------------------------
*/
 
import { ModelWorkbench } from '/assets/js/components/modelworkbench/ModelWorkbench.js';
 
export function initModelWorkbench()
{
    const container = document.getElementById('modelworkbench');
 
    if (!container)
    {
        console.error('ModelWorkbench : container #modelworkbench introuvable.');
        return;
    }
 
    new ModelWorkbench({ container });
}
