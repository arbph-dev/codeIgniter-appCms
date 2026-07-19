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
* ModelWorkbench — Commit 6
 *
 * Orchestre le layout, les composants UI et les services d'analyse.
 * --------------------------------------------------------------------
 */
 
import { SceneManager }     from '/assets/js/components/modelworkbench/core3js/SceneManager.js';
import { LoaderFactory }    from '/assets/js/components/modelworkbench/io/LoaderFactory.js';
import { GeometryAnalysis } from '/assets/js/components/modelworkbench/services/GeometryAnalysis.js';
import { Toolbar }          from '/assets/js/components/modelworkbench/ui/Toolbar.js';
import { TreeView }         from '/assets/js/components/modelworkbench/ui/TreeView.js';
import { Inspector }        from '/assets/js/components/modelworkbench/ui/Inspector.js';
import { StatusBar }        from '/assets/js/components/modelworkbench/ui/StatusBar.js';
 
export class ModelWorkbench
{
    constructor({ container })
    {
        this.container = container;
 
        this.sceneManager = null;
        this.toolbar      = null;
        this.treeView     = null;
        this.inspector    = null;
        this.statusBar    = null;
 
        this.initialize();
    }
 
    // ─── Initialisation ───────────────────────────────────────────────────────
 
    initialize()
    {
        this._createLayout();
        this._createScene();
        this._createUI();
    }
 
    /**
     * Construit la structure DOM du Workbench dans le container.
     * La vue PHP reste propre : <div id="modelworkbench"></div>
     */
    _createLayout()
    {
        this.container.innerHTML = '';
 
        this._toolbarEl   = this._el('div', 'wb-toolbar');
        this._treeviewEl  = this._el('div', 'wb-treeview');
        this._canvasEl    = this._el('div', 'wb-canvas');
        this._inspectorEl = this._el('div', 'wb-inspector');
        this._statusbarEl = this._el('div', 'wb-statusbar');
 
        const main = this._el('div', 'wb-main');
        main.append(this._treeviewEl, this._canvasEl, this._inspectorEl);
 
        this.container.append(this._toolbarEl, main, this._statusbarEl);
    }
 
    _createScene()
    {
        this.sceneManager = new SceneManager({
            container: this._canvasEl
        });
    }
 
    _createUI()
    {
        this.toolbar = new Toolbar({
            container    : this._toolbarEl,
            sceneManager : this.sceneManager,
        });
 
        this.treeView = new TreeView({
            container : this._treeviewEl,
            onSelect  : (node) => this.inspector.showNode(node),
        });
 
        this.inspector = new Inspector({
            container: this._inspectorEl,
        });
 
        this.statusBar = new StatusBar({
            container: this._statusbarEl,
        });
    }
 
    // ─── API publique ─────────────────────────────────────────────────────────
 
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
 
        // Analyse automatique + mise à jour UI
        this.analyze(result);
 
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
 
        this.statusBar.render(report.global);
        this.treeView.render(result.obj);
        this.inspector.showGlobal(report);
 
        return report;
    }
 
    // ─── Utilitaires ──────────────────────────────────────────────────────────
 
    _el(tag, cls)
    {
        const el = document.createElement(tag);
        el.className = cls;
        return el;
    }
 
    // ─── Cycle de vie ─────────────────────────────────────────────────────────
 
    destroy()
    {
        this.toolbar?.destroy();
        this.treeView?.destroy();
        this.inspector?.destroy();
        this.statusBar?.destroy();
        this.sceneManager?.destroy();
        this.container.innerHTML = '';
    }
}





