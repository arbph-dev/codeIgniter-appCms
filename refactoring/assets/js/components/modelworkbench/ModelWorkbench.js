/**
 *    '/assets/js/components/modelworkbench/ModelWorkbench.js'
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
 * 
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 2
 *
 * Responsabilités :
 *  - recevoir le container DOM
 *  - initialiser et coordonner les sous-composants
 * --------------------------------------------------------------------
 */
 
import { SceneManager } from '/assets/js/components/modelworkbench/core3js/SceneManager.js';
 
export class ModelWorkbench
{
    constructor({ container })
    {
        this.container    = container;
        this.sceneManager = null;
 
        this.initialize();
    }
 
    initialize()
    {
        this.sceneManager = new SceneManager({
            container: this.container
        });
    }
}
