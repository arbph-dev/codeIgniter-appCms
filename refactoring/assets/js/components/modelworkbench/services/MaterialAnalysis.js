/**
 * /assets/js/components/modelworkbench/services/MaterialAnalysis.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 5
 *
 * Déduplique et catalogue les matériaux d'un Object3D.
 * --------------------------------------------------------------------
 */

export class MaterialAnalysis
{
    /**
     * @param   {THREE.Object3D} obj
     * @returns {Object[]}
     */
    static analyze(obj)
    {
        const seen      = new Set();
        const materials = [];

        obj.traverse((node) =>
        {
            if (!node.isMesh) return;

            const mats = Array.isArray(node.material)
                ? node.material
                : [node.material];

            mats.forEach((mat) =>
            {
                if (!mat || seen.has(mat.uuid)) return;
                seen.add(mat.uuid);

                materials.push({
                    name        : mat.name        || '(sans nom)',
                    type        : mat.type,
                    color       : mat.color ? '#' + mat.color.getHexString() : null,
                    hasMap      : !!mat.map,
                    transparent : mat.transparent  ?? false,
                    opacity     : mat.opacity       ?? 1,
                });
            });
        });

        return materials;
    }
}
