/**
 * /assets/js/components/modelworkbench/services/HierarchyAnalysis.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 5
 *
 * Traverse le graphe de scène et retourne un tableau plat de nodes.
 * Chaque node Mesh est enrichi : vertices, faces, matériau, taille.
 * --------------------------------------------------------------------
 */

import * as THREE from 'three';

export class HierarchyAnalysis
{
    /**
     * @param   {THREE.Object3D} obj
     * @returns {Object[]}
     */
    static analyze(obj)
    {
        const nodes = [];

        obj.traverse((node) =>
        {
            const entry = {
                name     : node.name || '(sans nom)',
                type     : node.type,
                children : node.children.length,
            };

            if (node.isMesh)
            {
                const geo   = node.geometry;
                const verts = geo.attributes.position?.count ?? 0;

                entry.vertices = verts;
                entry.faces    = geo.index
                    ? Math.round(geo.index.count / 3)
                    : Math.round(verts / 3);

                // Matériau(x)
                const mats = Array.isArray(node.material)
                    ? node.material
                    : [node.material];

                entry.materials = mats.map(m => m?.name || '(sans nom)');

                // Taille locale du mesh
                const box  = new THREE.Box3().setFromObject(node);
                const size = box.getSize(new THREE.Vector3());

                entry.size = {
                    x : _r(size.x),
                    y : _r(size.y),
                    z : _r(size.z),
                };
            }

            nodes.push(entry);
        });

        return nodes;
    }
}

function _r(v) { return Math.round(v * 10000) / 10000; }
