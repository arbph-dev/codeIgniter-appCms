/**
 * WorkbenchBase.js
 * Classe de base pour tous les Workbenches (Model, Scene, Terran, Skybox, etc.)
 */

import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';           // À adapter selon ton organisation

export class WorkbenchBase
{
    constructor({ container, workbenchType = 'base', options = {} })
    {
        this.container = container;
        this.type = workbenchType;                    // 'model', 'scene', 'terran', 'skybox'...
        this.options = options;

        // Références principales
        this.sceneManager = null;
        this.toolbar = null;
        this.inspector = null;
        this.statusBar = null;
        this.treeView = null;

        // Données courantes
        this.currentScene = null;                     // SceneDescriptor ou null
        this.currentSelection = null;                 // Objet sélectionné (model, node, terrain...)

        this._eventListeners = new Map();
    }

    // ─── Initialisation ─────────────────────────────────────
    initialize()
    {
        this._createLayout();
        this._initSceneManager();
        this._createUIComponents();
        this._registerDefaultEvents();
        this.onInitialized();
    }

    _createLayout()
    {
        this.container.innerHTML = `
            <div class="wb-toolbar"></div>
            <div class="wb-main">
                <div class="wb-left"></div>
                <div class="wb-canvas"></div>
                <div class="wb-inspector"></div>
            </div>
            <div class="wb-statusbar"></div>
        `;

        this._toolbarEl   = this.container.querySelector('.wb-toolbar');
        this._leftEl      = this.container.querySelector('.wb-left');
        this._canvasEl    = this.container.querySelector('.wb-canvas');
        this._inspectorEl = this.container.querySelector('.wb-inspector');
        this._statusbarEl = this.container.querySelector('.wb-statusbar');
    }

    _initSceneManager()
    {
        this.sceneManager = new SceneManager({
            container: this._canvasEl,
            workbench: this
        });
    }

    _createUIComponents()
    {
        // À surcharger dans les classes enfants
    }

    _registerDefaultEvents()
    {
        // Événements communs à tous les workbenches
        this.on('selectionChanged', (selection) => {
            this.currentSelection = selection;
            this.inspector?.show(selection);
        });
    }

    // ─── Méthodes à surcharger ───────────────────────────────
    onInitialized() { /* hook */ }
    onModelLoaded(model) { /* hook */ }
    onSelectionChanged(selection) { /* hook */ }
    
    // ─── Resize ───────────────────────────────────────────────────────────────
    /**
     * Gère le redimensionnement de la vue Three.js
     * À appeler lors du resize de la fenêtre ou du conteneur
     */
    handleResize()
    {
        if (!this.sceneManager) return;
        
        const canvasContainer = this._canvasEl;
        if (!canvasContainer) return;

        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        this.sceneManager.handleResize(width, height);
    }

    /**
     * Active l'écoute automatique du resize de la fenêtre
     */
    enableAutoResize()
    {
        this._resizeHandler = () => this.handleResize();
        window.addEventListener('resize', this._resizeHandler);
        
        // Premier appel pour initialiser correctement
        setTimeout(() => this.handleResize(), 50);
    }

    /**
     * Désactive l'écoute du resize (à appeler dans destroy())
     */
    disableAutoResize()
    {
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
    }
    // ─── Méthodes communes utiles ────────────────────────────
    fitToView(target = null)
    {
        this.sceneManager?.fitToObject(target || this.sceneManager.scene);
    }

    resetCamera()
    {
        this.sceneManager?.resetCamera();
    }

    clear()
    {
        this.sceneManager?.clear();
        this.currentSelection = null;
        this.inspector?.clear();
    }

    // ─── Système d'événements léger ──────────────────────────
    on(event, callback)
    {
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, []);
        }
        this._eventListeners.get(event).push(callback);
    }

    emit(event, data)
    {
        const listeners = this._eventListeners.get(event);
        if (listeners) {
            listeners.forEach(cb => cb(data));
        }
    }

    // ─── Cycle de vie ────────────────────────────────────────
    destroy()
    {
        this.disableAutoResize();
        
        this.sceneManager?.destroy();
        this.toolbar?.destroy();
        this.inspector?.destroy();
        this.statusBar?.destroy();
        this.treeView?.destroy();

        this.container.innerHTML = '';
        this._eventListeners.clear();
    }
}
