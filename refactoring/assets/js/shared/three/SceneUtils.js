// /assets/js/shared/three/SceneUtils.js
//
// Boîte à outils Three.js partagée entre composants.
//
// Partagé entre :
//   - components/three/viewers/Viewer.js
//   - components/modelworkbench/core/ (LightManager, GridManager, AxisManager...)
//
// Principe :
//   Chaque fonction retourne l'objet créé.
//   Elle ne l'ajoute PAS à la scène — c'est la responsabilité de l'appelant.
//
//   Exception : addDefaultLights(scene) est une fonction de commodité
//   qui ajoute directement deux lumières standard à la scène.
//
// Usage :
//   import * as SU from '/assets/js/shared/three/SceneUtils.js'
//
//   SU.addDefaultLights(this.scene)
//   this.scene.add( SU.axesHelper() )
//   this.scene.add( SU.grid() )
//   this.scene.background = SU.skyboxColor(0x111122)

import * as THREE from 'three';

// ─── Lumières ─────────────────────────────────────────────────────────────────

/**
 * Lumière ambiante.
 *
 * @param {number} color      Couleur hexadécimale.
 * @param {number} intensity
 * @returns {THREE.AmbientLight}
 */
export function ambientLight(color = 0xffffff, intensity = 0.6)
{
    return new THREE.AmbientLight(color, intensity);
}

/**
 * Lumière directionnelle.
 *
 * @param {number}   color
 * @param {number}   intensity
 * @param {number[]} position  [x, y, z]
 * @returns {THREE.DirectionalLight}
 */
export function directionalLight(color = 0xffffff, intensity = 2.0, position = [5, 10, 5])
{
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    return light;
}

/**
 * Lumière ponctuelle.
 *
 * @param {number}   color
 * @param {number}   intensity
 * @param {number[]} position  [x, y, z]
 * @param {number}   distance  Portée (0 = infinie).
 * @returns {THREE.PointLight}
 */
export function pointLight(color = 0xffffff, intensity = 1.0, position = [0, 5, 0], distance = 0)
{
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(...position);
    return light;
}

/**
 * Ajoute la combinaison standard ambiant + directionnel à une scène.
 * Fonction de commodité — modifie la scène directement.
 *
 * @param {THREE.Scene} scene
 */
export function addDefaultLights(scene)
{
    scene.add( ambientLight() );
    scene.add( directionalLight() );
}

// ─── Helpers visuels ──────────────────────────────────────────────────────────

/**
 * Repère d'axes colorés (X=rouge, Y=vert, Z=bleu).
 *
 * @param {number} size  Longueur des axes.
 * @returns {THREE.AxesHelper}
 */
export function axesHelper(size = 5)
{
    return new THREE.AxesHelper(size);
}

/**
 * Grille au sol.
 *
 * @param {number} size        Taille totale.
 * @param {number} divisions   Nombre de divisions.
 * @param {number} colorCenter Couleur de la ligne centrale.
 * @param {number} colorGrid   Couleur des autres lignes.
 * @returns {THREE.GridHelper}
 */
export function grid(size = 20, divisions = 20, colorCenter = 0x444444, colorGrid = 0x222222)
{
    return new THREE.GridHelper(size, divisions, colorCenter, colorGrid);
}

// ─── Skybox / Background ──────────────────────────────────────────────────────

/**
 * Fond couleur unie.
 *
 * @param {number} color  Hexadécimal.
 * @returns {THREE.Color}
 */
export function skyboxColor(color = 0x202020)
{
    return new THREE.Color(color);
}

/**
 * Fond panoramique equirectangulaire (photo 360°).
 * Assigner à scene.background.
 *
 * @param {string} path  Chemin vers l'image JPEG ou PNG.
 * @returns {THREE.Texture}
 */
export function skyboxEquirect(path)
{
    const tex = new THREE.TextureLoader().load(
        path,
        () => { tex.needsUpdate = true; },
        undefined,
        () => { console.warn('SceneUtils.skyboxEquirect — échec :', path); }
    );
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
}

/**
 * Fond cube (6 faces).
 *
 * @param {string} dirPath  Dossier contenant posx/negx/posy/negy/posz/negz.
 * @param {string} ext      Extension des fichiers (ex. '.jpg').
 * @returns {THREE.CubeTexture}
 */
export function skyboxCube(dirPath, ext = '.jpg')
{
    const faces = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz']
        .map(f => dirPath + f + ext);
    return new THREE.CubeTextureLoader().load(faces);
}

// ─── Particules ───────────────────────────────────────────────────────────────

/**
 * Champ d'étoiles (Points).
 *
 * @param {number} count   Nombre de particules.
 * @param {number} spread  Rayon de dispersion.
 * @param {number} color   Couleur hexadécimale.
 * @param {number} size    Taille des points.
 * @returns {THREE.Points}
 */
export function starfield(count = 8000, spread = 30, color = 0xaaddff, size = 0.05)
{
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++)
    {
        positions[i] = (Math.random() - 0.5) * spread;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({ color, size, sizeAttenuation: true });

    return new THREE.Points(geo, mat);
}

// ─── Textures ─────────────────────────────────────────────────────────────────

/**
 * Charge une texture.
 *
 * @param {string}   path
 * @param {Function} onLoad   Callback de succès (optionnel).
 * @param {Function} onError  Callback d'erreur (optionnel).
 * @returns {THREE.Texture}
 */
export function loadTexture(path, onLoad, onError)
{
    return new THREE.TextureLoader().load(
        path,
        onLoad  ?? (() => {}),
        undefined,
        onError ?? (() => { console.warn('SceneUtils.loadTexture — échec :', path); })
    );
}

/**
 * Matériau texturé double face.
 *
 * @param {string} path
 * @returns {THREE.MeshBasicMaterial}
 */
export function materialFromTexture(path)
{
    return new THREE.MeshBasicMaterial({
        map  : loadTexture(path),
        side : THREE.DoubleSide
    });
}

// ─── Géométrie ────────────────────────────────────────────────────────────────

/**
 * Centre un objet chargé (OBJ/GLTF) sur l'origine.
 *
 * @param {THREE.Object3D} obj
 * @returns {THREE.Object3D}
 */
export function centerObject(obj)
{
    const box    = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center);
    return obj;
}

/**
 * Redimensionne un objet pour que sa diagonale corresponde à targetSize.
 *
 * @param {THREE.Object3D} obj
 * @param {number}         targetSize  Longueur diagonale cible.
 * @returns {THREE.Object3D}
 */
export function normalizeSize(obj, targetSize = 2)
{
    const box  = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()).length();
    obj.scale.setScalar(targetSize / size);
    return obj;
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/**
 * Nombre aléatoire dans [min, max].
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randRange(min, max)
{
    return Math.random() * (max - min) + min;
}
