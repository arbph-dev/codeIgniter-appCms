/**

    '/assets/js/components/modelworkbench/ModelWorkbench.js'
 
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
