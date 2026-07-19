/**
 * /assets/js/components/modelworkbench/ModelWorkbench.js
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 8
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 9
 * Vider ModelWorkbench et charger les modeles
 * evite d'avoir plusieurs modeles affichés
 * --------------------------------------------------------------------
 */

import { SceneManager }     from '/assets/js/components/modelworkbench/core3js/SceneManager.js';
import { LoaderFactory }    from '/assets/js/components/modelworkbench/io/LoaderFactory.js';
import { GeometryAnalysis } from '/assets/js/components/modelworkbench/services/GeometryAnalysis.js';
import { Toolbar }          from '/assets/js/components/modelworkbench/ui/Toolbar.js';
import { TreeView }         from '/assets/js/components/modelworkbench/ui/TreeView.js';
import { Inspector }        from '/assets/js/components/modelworkbench/ui/Inspector.js';
import { StatusBar }        from '/assets/js/components/modelworkbench/ui/StatusBar.js';
import { ModelTreeView }    from '/assets/js/components/modelworkbench/ui/ModelTreeView.js';
import { MODEL_LIST }       from '/assets/js/components/modelworkbench/data/modelList.js';

export class ModelWorkbench
{
    constructor({ container })
    {
        this.container = container;

        this.sceneManager  = null;
        this.toolbar       = null;
        this.treeView      = null;
        this.modelTreeView = null;
        this.inspector     = null;
        this.statusBar     = null;

        
        // ← Référence 
        // modèle chargé
        // Object3D racine du modèle chargé
        this.currentModel     = null;//commit 9     
        this.currentRoot      = null;//commit 9
        

        this.initialize();
    }

    initialize()
    {
        this._createLayout();
        this._createScene();
        this._createUI();
    }

    _createLayout()
    {
        this.container.innerHTML = '';

        this._toolbarEl   = this._el('div', 'wb-toolbar');
        this._modelTreeEl = this._el('div', 'wb-models');
        this._treeviewEl  = this._el('div', 'wb-treeview');
        this._canvasEl    = this._el('div', 'wb-canvas');
        this._inspectorEl = this._el('div', 'wb-inspector');
        this._statusbarEl = this._el('div', 'wb-statusbar');

        // Panneau gauche : liste des modèles (haut) + hiérarchie de scène (bas)
        const leftPanel = this._el('div', 'wb-left');
        leftPanel.append(this._modelTreeEl, this._treeviewEl);

        const main = this._el('div', 'wb-main');
        main.append(leftPanel, this._canvasEl, this._inspectorEl);

        this.container.append(this._toolbarEl, main, this._statusbarEl);
    }

    _createScene()
    {
        this.sceneManager = new SceneManager({ container: this._canvasEl });
    }

    _createUI()
    {
        this.toolbar = new Toolbar({
            container    : this._toolbarEl,
            sceneManager : this.sceneManager,
        });

        this.modelTreeView = new ModelTreeView({
            container : this._modelTreeEl,
            models    : MODEL_LIST,
            onSelect  : (model) => this.loadModelDescriptor(model),
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

    async loadModelDescriptor(model)
    {
        // commit 9 : Vider l'ancien modèle avant d'en charger un nouveau
        this.clearCurrentModel();
        this.currentModel = model;

        await this.loadModel(model);

        // commit 9 : Marquer visuellement le modèle comme actif dans le catalogue
        this.modelTreeView?.markAsLoaded?.(model.id);
    }

    async loadModel(model)
    {
        const result = await LoaderFactory.load({
            path       : model.resource.path,
            mtl        : model.resource.mtl,
            targetSize : model.transform.targetSize,
        });

        // commit 9 : Garder une référence à la racine du modèle
        this.currentRoot = result.obj;

        this.sceneManager.scene.add(result.obj);

        if (result.mixer)
        {
            this.sceneManager.addMixer(result.mixer);
        }

        this.analyze(result);

        return result;
    }

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

    destroy()
    {
        this.toolbar?.destroy();
        this.modelTreeView?.destroy();
        this.treeView?.destroy();
        this.inspector?.destroy();
        this.statusBar?.destroy();
        this.sceneManager?.destroy();
        this.container.innerHTML = '';
    }

    // commit 9 

    /** Vide le modèle actuellement chargé */
    clearCurrentModel()
    {
        if (this.currentRoot)
        {
            this.sceneManager.scene.remove(this.currentRoot);
            
            // Nettoyage mémoire (important pour Three.js)
            this.currentRoot.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });

            this.currentRoot = null;
        }

        // Réinitialiser les autres panneaux
        this.treeView?.renderEmpty?.() || (this.treeView && (this.treeView._body.innerHTML = ''));
        this.inspector?.showEmpty?.() || this.inspector?._empty();
        this.statusBar?.clear?.();
    }

    // Optionnel : bouton "Vider la scène" dans la Toolbar
    clearScene()
    {
        this.clearCurrentModel();
        this.currentModel = null;
        this.modelTreeView?.clearSelection?.();
    }

}
