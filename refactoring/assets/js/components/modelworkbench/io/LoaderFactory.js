/**
 * /assets/js/components/modelworkbench/io/LoaderFactory.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 4 / Step 1
 *
 * Responsabilités :
 *  - détecter le format depuis l'extension du fichier
 *  - déléguer au bon loader
 *  - retourner une Promise<THREE.Object3D>
 *  - centrer et normaliser l'objet chargé
 *
 * Formats supportés :
 *  [x] OBJ
 *  [ ] OBJ + MTL
 *  [ ] GLTF / GLB
 *  [ ] 3DS
 * --------------------------------------------------------------------
 */

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as SU       from '/assets/js/shared/three/SceneUtils.js';

export class LoaderFactory
{
    /**
     * Charge un modèle 3D depuis son chemin.
     * Détecte le format automatiquement depuis l'extension.
     *
     * @param   {Object} params
     * @param   {string} params.path  Chemin vers le fichier.
     * @returns {Promise<THREE.Object3D>}
     */
    static load({ path })
    {
        const ext = path.split('.').pop().toLowerCase();

        const loaders = {
            'obj' : () => this._loadOBJ(path),
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

    static _loadOBJ(path)
    {
        return new Promise((resolve, reject) =>
        {
            const loader = new OBJLoader();

            loader.load(
                path,
                (obj) =>
                {
                    SU.centerObject(obj);
                    SU.normalizeSize(obj, 2);
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
}
