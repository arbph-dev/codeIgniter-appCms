/**
 * /assets/js/components/modelworkbench/io/LoaderFactory.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 4 / Step 4
 *
 * Formats supportés :
 *  [x] OBJ
 *  [x] OBJ + MTL
 *  [x] GLTF / GLB
 *  [x] 3DS
 * --------------------------------------------------------------------
 */

import * as THREE        from 'three';
import { OBJLoader }     from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader }     from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { TDSLoader }     from 'three/addons/loaders/TDSLoader.js';
import * as SU           from '/assets/js/shared/three/SceneUtils.js';

export class LoaderFactory
{
    /**
     * @param {Object} params
     * @param {string} params.path
     * @param {string} [params.mtl]
     * @param {number} [params.targetSize=3]
     * @returns {Promise<{ obj, mixer, animations, clips }>}
     */
    static load({ path, mtl, targetSize = 3 })
    {
        const ext = path.split('.').pop().toLowerCase();

        if (ext === 'obj' && mtl) return this._loadOBJMTL(path, mtl, targetSize);

        const loaders = {
            'obj'  : () => this._loadOBJ(path, targetSize),
            'gltf' : () => this._loadGLTF(path, targetSize),
            'glb'  : () => this._loadGLTF(path, targetSize),
            '3ds'  : () => this._load3DS(path, targetSize),
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

    // ─── Résultat sans animation (OBJ, OBJ+MTL, 3DS) ─────────────────────────

    static _result(obj)
    {
        return { obj, mixer: null, animations: [], clips: [] };
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
                    resolve(this._result(obj));
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
                                    resolve(this._result(obj));
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

    // ─── GLTF / GLB ───────────────────────────────────────────────────────────

    static _loadGLTF(path, targetSize)
    {
        return new Promise((resolve, reject) =>
        {
            new GLTFLoader().load(
                path,
                (gltf) =>
                {
                    const obj = gltf.scene;

                    SU.prepareObject(obj, targetSize);

                    let mixer = null;
                    let clips = [];

                    if (gltf.animations?.length)
                    {
                        mixer = new THREE.AnimationMixer(obj);

                        clips = gltf.animations.map((clip) => ({
                            name   : clip.name,
                            clip,
                            action : mixer.clipAction(clip)
                        }));
                    }

                    resolve({ obj, mixer, animations: gltf.animations ?? [], clips });
                },
                undefined,
                (error) =>
                {
                    console.error('LoaderFactory GLTF — erreur :', path, error);
                    reject(error);
                }
            );
        });
    }

    // ─── 3DS ──────────────────────────────────────────────────────────────────

    static _load3DS(path, targetSize)
    {
        // TDSLoader charge les textures depuis le même dossier que le .3ds
        const basePath = path.substring(0, path.lastIndexOf('/') + 1);

        return new Promise((resolve, reject) =>
        {
            new TDSLoader()
                .setPath(basePath)
                .load(
                    path,
                    (obj) =>
                    {
                        SU.prepareObject(obj, targetSize);
                        resolve(this._result(obj));
                    },
                    undefined,
                    (error) =>
                    {
                        console.error('LoaderFactory 3DS — erreur :', path, error);
                        reject(error);
                    }
                );
        });
    }
}
