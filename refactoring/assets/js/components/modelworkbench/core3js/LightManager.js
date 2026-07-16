/**
 * /assets/js/components/modelworkbench/core3js/LightManager.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 3
 *
 * Responsabilités :
 *  - ajouter les lumières standard à la scène
 *  - stocker les références pour un dispose propre
 *
 * Utilise SceneUtils pour rester cohérent avec le composant Three.js.
 * --------------------------------------------------------------------
 */

import * as SU from '/assets/js/shared/three/SceneUtils.js';

export class LightManager
{
    constructor({ scene })
    {
        this.scene   = scene;
        this._lights = [];
    }

    initialize()
    {
        const ambient     = SU.ambientLight();
        const directional = SU.directionalLight();

        this._lights.push(ambient, directional);
        this.scene.add(...this._lights);
    }

    destroy()
    {
        this._lights.forEach(l => this.scene.remove(l));
        this._lights = [];
    }
}
