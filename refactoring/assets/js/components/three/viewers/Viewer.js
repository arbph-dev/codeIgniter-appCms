/*
/assets/js/components/three/viewers/Viewer.js

Responsabilités
- encapsule une scène Three.js
- encapsule un renderer WebGL
- encapsule une caméra
- gère le cycle de vie
    - init()
    - refresh()
    - destroy()
- gère le rendu
- gère le redimensionnement
- délègue le chargement des ressources
*/
// /assets/js/components/three/viewers/Viewer.js


import * as THREE from 'three';

import { ResourceLoader } from '/assets/js/components/three/resources/ResourceLoader.js';
import { SceneTimer }     from '/assets/js/shared/three/SceneTimer.js';
import * as SU            from '/assets/js/shared/three/SceneUtils.js';

export class Viewer
{
    constructor({
        element,
        options
    })
    {
        this.element = element;
        this.options = options;

        this.scene    = null;
        this.camera   = null;
        this.renderer = null;

        this.resource = null;

        this.animationId = null;

        this.clock    = new SceneTimer();
        this._visible  = false;
        this._observer = null;

        this.state = {};
    }

    /**
     * Initialise le viewer.
     */
    init()
    {
        const width  = this.element.clientWidth  || 800;
        const height = this.element.clientHeight || 400;

        // -----------------------------------------------------------------
        // Scene
        // -----------------------------------------------------------------

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(
            this.options.background ?? '#202020'
        );

        // -----------------------------------------------------------------
        // Camera
        // -----------------------------------------------------------------

        this.camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            0.1,
            1000
        );

        this.camera.position.set(2, 2, 4);

        // -----------------------------------------------------------------
        // Renderer
        // -----------------------------------------------------------------

        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);

        this.element.appendChild(this.renderer.domElement);

        // -----------------------------------------------------------------
        // Lumières
        // -----------------------------------------------------------------

        SU.addDefaultLights(this.scene);

        // -----------------------------------------------------------------
        // Resource
        // -----------------------------------------------------------------

        this.resource = ResourceLoader.load({
            resource : this.options.resource,
            viewer   : this
        });

        this.resource.init();

        // -----------------------------------------------------------------
        // Resize
        // -----------------------------------------------------------------

        window.addEventListener('resize', () => this.resize());

        // -----------------------------------------------------------------
        // Visibilité
        // -----------------------------------------------------------------

        this._initObserver();

        // -----------------------------------------------------------------
        // Animation
        // -----------------------------------------------------------------

        this.clock.start();
        this.animate();
    }

    refresh()
    {
        this.render();
    }

    resize()
    {
        const width  = this.element.clientWidth;
        const height = this.element.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        this.render();
    }

    render()
    {
        this.renderer.render(this.scene, this.camera);
    }

    animate()
    {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this._visible) return;

        const delta = this.clock.tick();

        this.resource?.update(delta);

        this.render();
    }

    /**
     * Suspend le rendu GPU quand le composant quitte le viewport.
     * Reprend proprement à son retour grâce à clock.resume().
     */
    _initObserver()
    {
        this._observer = new IntersectionObserver(
            (entries) =>
            {
                this._visible = entries[0].isIntersecting;

                if (this._visible)
                {
                    // Réinitialise _tLast pour éviter un delta explosif
                    // accumulé pendant la période d'invisibilité.
                    this.clock.resume();
                }
            },
            { threshold: 0.1 }
        );

        this._observer.observe(this.element);
    }

    destroy()
    {
        cancelAnimationFrame(this.animationId);

        if (this._observer)
        {
            this._observer.disconnect();
            this._observer = null;
        }

        this.resource?.destroy();

        this.renderer?.dispose();

        this.element.innerHTML = '';
    }
}
