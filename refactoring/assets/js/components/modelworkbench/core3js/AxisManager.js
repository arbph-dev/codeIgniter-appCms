/**
 * /assets/js/components/modelworkbench/core3js/AxisManager.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 3
 *
 * Responsabilités :
 *  - ajouter le repère d'axes à la scène
 *  - exposer setVisible() pour l'UI (commit 6)
 * --------------------------------------------------------------------
 */

import * as SU from '/assets/js/shared/three/SceneUtils.js';

export class AxisManager
{
    constructor({ scene })
    {
        this.scene = scene;
        this._axes = null;
    }

    initialize()
    {
        this._axes = SU.axesHelper(5);
        this.scene.add(this._axes);
    }

    setVisible(visible)
    {
        if (this._axes) this._axes.visible = visible;
    }

    destroy()
    {
        if (!this._axes) return;

        this.scene.remove(this._axes);
        this._axes = null;
    }
}
