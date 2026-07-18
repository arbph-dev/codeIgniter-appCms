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

        //const wb = new ModelWorkbench({ container });
        //window._wb = wb;  // expose pour la console        
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
     * @param   {string} path            Chemin vers le fichier OBJ.
     * @param   {Object} [options]
     * @param   {string} [options.mtl]         Chemin vers le fichier MTL.
     * @param   {number} [options.targetSize]  Diagonale cible (défaut : 3).
     * @returns {Promise<THREE.Object3D>}
     *
     * @example
     * // OBJ seul
     * await wb.loadModel('/models/ship.obj')
     *
     * // OBJ + MTL
     * await wb.loadModel('/models/ship.obj', { mtl: '/models/ship.mtl' })
     *
     * // Taille personnalisée
     * await wb.loadModel('/models/ship.obj', { mtl: '/models/ship.mtl', targetSize: 5 })
     */
    async loadModel(path, options = {})
    {
        const obj = await LoaderFactory.load({ path, ...options });
 
        this.sceneManager.scene.add(obj);
 
        console.log('ModelWorkbench : modèle chargé —', path, obj);
 
        return obj;
    }
}

