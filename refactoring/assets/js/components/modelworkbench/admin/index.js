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
* Commit 7
* ModelWorkbench attend un ModelDescriptor et plus un chemin de fichier.
* ajout de data/modelList.js pour test avant controleur et model en mvc
*/
 
import { ModelWorkbench } from '/assets/js/components/modelworkbench/ModelWorkbench.js';
import { MODEL_LIST } from '/assets/js/components/modelworkbench/data/modelList.js';

import * as THREE          from 'three';   // ← ajouter

export function initModelWorkbench()
{
    const container = document.getElementById('modelworkbench');
 
    if (!container)
    {
        console.error('ModelWorkbench : container #modelworkbench introuvable.');
        return;
    }
 
    
    //-----------------------------------------------
    // À retirer en commit 6 (Inspector) -----
    // Exposition temporaire pour debug console
    const wb = new ModelWorkbench({ container });
    window._wb = wb;
    window.debugModel = debugModel
    
    //-----------------------------------------------
    // À remettre en commit 6 (Inspector) ?? - voir Claude 
    //new ModelWorkbench({ container });
    //-----------------------------------------------
    // Commit 7 - ajout de data/modelList.js 
    window._models = MODEL_LIST;
}


function debugModel(obj)
{
    //const { Box3, Vector3 } = await import('three');
    const box    = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    console.log('position',    obj.position);
    console.log('bbox center', center);
    return center;
}
