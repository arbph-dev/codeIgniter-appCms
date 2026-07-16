/**
 * /assets/js/components/modelworkbench/core3js/GridManager.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 3
 *
 * Responsabilités :
 *  - ajouter la grille de référence à la scène
 *  - exposer setVisible() pour l'UI (commit 6)
 * --------------------------------------------------------------------
 */

import * as SU from '/assets/js/shared/three/SceneUtils.js';

export class GridManager
{
    constructor({ scene })
    {
        this.scene = scene;
        this._grid = null;
    }

    initialize()
    {
        this._grid = SU.grid(20, 20);
        this.scene.add(this._grid);
    }

    setVisible(visible)
    {
        if (this._grid) this._grid.visible = visible;
    }

    destroy()
    {
        if (!this._grid) return;

        this.scene.remove(this._grid);
        this._grid.geometry.dispose();
        this._grid.material.dispose();
        this._grid = null;
    }
}
