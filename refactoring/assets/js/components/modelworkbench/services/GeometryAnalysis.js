/**
 * /assets/js/components/modelworkbench/services/GeometryAnalysis.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 5
 *
 * Coordinateur principal de l'analyse.
 * Reçoit le contrat complet { obj, animations } de LoaderFactory
 * et retourne un rapport structuré :
 *
 *  {
 *    global     : { size, center, diagonal, meshCount, vertexCount, faceCount }
 *    hierarchy  : HierarchyAnalysis[]
 *    materials  : MaterialAnalysis[]
 *    animations : AnimationAnalysis[]
 *  }
 * --------------------------------------------------------------------
 */

import * as THREE            from 'three';
import { HierarchyAnalysis } from './HierarchyAnalysis.js';
import { MaterialAnalysis }  from './MaterialAnalysis.js';
import { AnimationAnalysis } from './AnimationAnalysis.js';

export class GeometryAnalysis
{
    /**
     * @param   {Object}             params
     * @param   {THREE.Object3D}     params.obj
     * @param   {THREE.AnimationClip[]} [params.animations]
     * @returns {{ global, hierarchy, materials, animations }}
     */
    static analyze({ obj, animations = [] })
    {
        // Garantit des matrices à jour avant tout calcul
        obj.updateMatrixWorld(true);

        // ── Bounding box globale ──────────────────────────────────────────────

        const box    = new THREE.Box3().setFromObject(obj);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // ── Stats agrégées ────────────────────────────────────────────────────

        let meshCount   = 0;
        let vertexCount = 0;
        let faceCount   = 0;

        obj.traverse((node) =>
        {
            if (!node.isMesh) return;

            meshCount++;

            const geo   = node.geometry;
            const verts = geo.attributes.position?.count ?? 0;

            vertexCount += verts;
            faceCount   += geo.index
                ? geo.index.count / 3
                : verts / 3;
        });

        return {
            global : {
                size        : { x: _r(size.x),   y: _r(size.y),   z: _r(size.z)   },
                center      : { x: _r(center.x), y: _r(center.y), z: _r(center.z) },
                diagonal    : _r(size.length()),
                meshCount,
                vertexCount,
                faceCount   : Math.round(faceCount),
            },
            hierarchy  : HierarchyAnalysis.analyze(obj),
            materials  : MaterialAnalysis.analyze(obj),
            animations : AnimationAnalysis.analyze(animations),
        };
    }
}

function _r(v) { return Math.round(v * 10000) / 10000; }
