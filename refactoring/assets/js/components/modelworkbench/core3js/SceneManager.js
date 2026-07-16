/**
 * '/assets/js/components/modelworkbench/core3js/SceneManager.js'
 * 
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * SceneManager
 *
 * Responsable de l'initialisation de la scène Three.js.
 *
 * Responsabilités actuelles :
 *  - créer la scène
 *  - préparer les objets Three.js
 *
 * Les éléments suivants seront ajoutés progressivement :
 *  - caméra
 *  - renderer
 *  - éclairage
 *  - contrôles utilisateur
 *  - grille
 *  - repère XYZ
 *  - boucle de rendu
 *  - gestion du redimensionnement
 * -------------------------------------------------------------
 * ModelWorkbench — Commit 2
 *
 * Responsabilités :
 *  - créer la scène Three.js
 *  - créer la caméra
 *  - créer le renderer WebGL
 *  - gérer la boucle d'animation
 *  - gérer le redimensionnement
 *
 * Commit 3 ajoutera :
 *  - LightManager
 *  - GridManager
 *  - AxisManager
 *  - OrbitControls
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 3
 *
 * Responsabilités :
 *  - créer la scène, la caméra, le renderer
 *  - orchestrer LightManager, GridManager, AxisManager
 *  - initialiser OrbitControls
 *  - gérer la boucle d'animation et le resize
 * -------------------------------------------------------------------- 
 */
import * as THREE            from 'three';
import { OrbitControls }     from 'three/addons/controls/OrbitControls.js';
import { SceneTimer }        from '/assets/js/shared/three/SceneTimer.js';
import { LightManager }      from './LightManager.js';
import { GridManager }       from './GridManager.js';
import { AxisManager }       from './AxisManager.js';

export class SceneManager
{
    constructor({ container })
    {
        this.container = container;

        this.scene    = null;
        this.camera   = null;
        this.renderer = null;
        this.controls = null;
        this.clock    = new SceneTimer();

        this.lightManager = null;
        this.gridManager  = null;
        this.axisManager  = null;

        this._animationId = null;

        this._onResize = this._onResize.bind(this);

        this.initialize();
    }

    // ─── Initialisation ───────────────────────────────────────────────────────

    initialize()
    {
        this._createScene();
        this._createCamera();
        this._createRenderer();
        this._createManagers();
        this._createControls();
        this._initResize();
        this._start();
    }

    _createScene()
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
    }

    _createCamera()
    {
        const w = this.container.clientWidth  || 800;
        const h = this.container.clientHeight || 600;

        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
    }

    _createRenderer()
    {
        const w = this.container.clientWidth  || 800;
        const h = this.container.clientHeight || 600;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(w, h);

        this.container.appendChild(this.renderer.domElement);
    }

    _createManagers()
    {
        this.lightManager = new LightManager({ scene: this.scene });
        this.lightManager.initialize();

        this.gridManager = new GridManager({ scene: this.scene });
        this.gridManager.initialize();

        this.axisManager = new AxisManager({ scene: this.scene });
        this.axisManager.initialize();
    }

    _createControls()
    {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
    }

    // ─── Resize ───────────────────────────────────────────────────────────────

    _initResize()
    {
        window.addEventListener('resize', this._onResize);
    }

    _onResize()
    {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;

        if (w === 0 || h === 0) return;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    // ─── Boucle d'animation ───────────────────────────────────────────────────

    _start()
    {
        this.clock.start();
        this._animate();
    }

    _animate()
    {
        this._animationId = requestAnimationFrame(() => this._animate());

        const delta = this.clock.tick(); // eslint-disable-line no-unused-vars

        // enableDamping requiert un appel par frame
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }

    // ─── Cycle de vie ─────────────────────────────────────────────────────────

    destroy()
    {
        cancelAnimationFrame(this._animationId);

        window.removeEventListener('resize', this._onResize);

        this.lightManager?.destroy();
        this.gridManager?.destroy();
        this.axisManager?.destroy();

        this.controls?.dispose();

        this.renderer?.dispose();

        if (this.renderer?.domElement?.parentNode === this.container)
        {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}
