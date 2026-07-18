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
 * 
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 2
 *
 * Responsabilités :
 *  - recevoir le container DOM
 *  - initialiser et coordonner les sous-composants
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 4 / Step 1
 *
 * Nouveauté : loadModel(path) — charge un modèle et l'ajoute à la scène.
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 4 / Step 3
 * --------------------------------------------------------------------
 */

import { SceneManager }  from '/assets/js/components/modelworkbench/core3js/SceneManager.js';
import { LoaderFactory } from '/assets/js/components/modelworkbench/io/LoaderFactory.js';

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
        this.container.style.width  = '1024px';
        this.container.style.height = '768px';

        this.sceneManager = new SceneManager({
            container: this.container
        });
    }

    /**
     * Charge un modèle et l'ajoute à la scène.
     *
     * @param   {string} path
     * @param   {Object} [options]
     * @param   {string} [options.mtl]
     * @param   {number} [options.targetSize=3]
     * @returns {Promise<{ obj, mixer, animations, clips }>}
     *
     * @example
     * // GLTF animé
     * const { obj, clips } = await wb.loadModel('/models/soldier.glb')
     * clips.find(c => c.name === 'Walk')?.action.play()
     *
     * // OBJ + MTL
     * const { obj } = await wb.loadModel('/models/ship.obj', { mtl: '/models/ship.mtl' })
     */
    async loadModel(path, options = {})
    {
        const result = await LoaderFactory.load({ path, ...options });

        this.sceneManager.scene.add(result.obj);

        if (result.mixer)
        {
            this.sceneManager.addMixer(result.mixer);
        }

        console.log('ModelWorkbench : modèle chargé —', path);
        console.log('animations :', result.clips.map(c => c.name));

        return result;
    }
}
