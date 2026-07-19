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
* ModelWorkbench — Commit 5
 *
 * Nouveauté : analyze(result) — rapport complet sur un modèle chargé.
 * --------------------------------------------------------------------
 */

import { SceneManager }    from '/assets/js/components/modelworkbench/core3js/SceneManager.js';
import { LoaderFactory }   from '/assets/js/components/modelworkbench/io/LoaderFactory.js';
import { GeometryAnalysis} from '/assets/js/components/modelworkbench/services/GeometryAnalysis.js';

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

    /**
     * Analyse un modèle chargé.
     * Reçoit le contrat retourné par loadModel().
     *
     * @param   {{ obj, animations }} result
     * @returns {{ global, hierarchy, materials, animations }}
     *
     * @example
     * const result = await _wb.loadModel('/assets/.../Soldier.glb')
     * const a = _wb.analyze(result)
     *
     * a.global.meshCount       // nb de meshes
     * a.global.vertexCount     // nb de vertices total
     * a.animations[0].name     // 'Idle'
     * a.hierarchy[2].faces     // faces du 3ème node
     * a.materials[0].hasMap    // a-t-il une texture ?
     */
    analyze(result)
    {
        const report = GeometryAnalysis.analyze(result);

        console.group('GeometryAnalysis');
        console.log('global',     report.global);
        console.log('hierarchy',  report.hierarchy);
        console.log('materials',  report.materials);
        console.log('animations', report.animations);
        console.groupEnd();

        return report;
    }
}
