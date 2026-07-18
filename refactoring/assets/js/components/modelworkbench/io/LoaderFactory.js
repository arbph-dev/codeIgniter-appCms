/**
 * /assets/js/components/modelworkbench/io/LoaderFactory.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 4 / Step 2
 *
 * Formats supportés :
 *  [x] OBJ
 *  [x] OBJ + MTL
 *  [ ] GLTF / GLB
 *  [ ] 3DS
 * --------------------------------------------------------------------
 */

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as SU       from '/assets/js/shared/three/SceneUtils.js';

export class LoaderFactory
{
    /**
     * @param {Object} params
     * @param {string} params.path        Chemin vers le fichier OBJ.
     * @param {string} [params.mtl]       Chemin vers le fichier MTL (optionnel).
     * @param {number} [params.targetSize] Diagonale cible (défaut : 3).
     * @returns {Promise<THREE.Object3D>}
     *
     * @example
     * // OBJ seul
     * LoaderFactory.load({ path: '/models/ship.obj' })
     *
     * // OBJ + MTL
     * LoaderFactory.load({ path: '/models/ship.obj', mtl: '/models/ship.mtl' })
     */
    static load({ path, mtl, targetSize = 3 })
    {
        const ext = path.split('.').pop().toLowerCase();

        if (ext === 'obj' && mtl)
        {
            return this._loadOBJMTL(path, mtl, targetSize);
        }

        const loaders = {
            'obj' : () => this._loadOBJ(path, targetSize),
        };

        const loader = loaders[ext];

        if (!loader)
        {
            return Promise.reject(
                new Error(`LoaderFactory : format '.${ext}' non supporté.`)
            );
        }

        return loader();
    }

    // ─── OBJ ──────────────────────────────────────────────────────────────────

    static _loadOBJ(path, targetSize)
    {
        return new Promise((resolve, reject) =>
        {
            new OBJLoader().load(
                path,
                (obj) =>
                {
                    SU.prepareObject(obj, targetSize);
                    resolve(obj);
                },
                undefined,
                (error) =>
                {
                    console.error('LoaderFactory OBJ — erreur :', path, error);
                    reject(error);
                }
            );
        });
    }

    // ─── OBJ + MTL ────────────────────────────────────────────────────────────

    static _loadOBJMTL(path, mtlPath, targetSize)
    {
        // MTLLoader.setPath() attend le dossier, pas le chemin complet
        const basePath = mtlPath.substring(0, mtlPath.lastIndexOf('/') + 1);
        const mtlFile  = mtlPath.substring(mtlPath.lastIndexOf('/') + 1);

        return new Promise((resolve, reject) =>
        {
            new MTLLoader()
                .setPath(basePath)
                .load(
                    mtlFile,
                    (materials) =>
                    {
                        materials.preload();

                        new OBJLoader()
                            .setMaterials(materials)
                            .load(
                                path,
                                (obj) =>
                                {
                                    SU.prepareObject(obj, targetSize);
                                    resolve(obj);
                                },
                                undefined,
                                (error) =>
                                {
                                    console.error('LoaderFactory OBJ — erreur :', path, error);
                                    reject(error);
                                }
                            );
                    },
                    undefined,
                    (error) =>
                    {
                        console.error('LoaderFactory MTL — erreur :', mtlPath, error);
                        reject(error);
                    }
                );
        });
    }
}
