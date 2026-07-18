/**
 * /assets/js/components/modelworkbench/services/AnimationAnalysis.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench — Commit 5
 *
 * Catalogue les AnimationClips d'un modèle GLTF.
 * Retourne [] pour OBJ / 3DS.
 * --------------------------------------------------------------------
 */

export class AnimationAnalysis
{
    /**
     * @param   {THREE.AnimationClip[]} animations
     * @returns {Object[]}
     */
    static analyze(animations)
    {
        if (!animations?.length) return [];

        return animations.map((clip) => ({
            name        : clip.name,
            duration    : _r(clip.duration),  // secondes, 2 décimales
            tracksCount : clip.tracks.length,
            tracks      : clip.tracks.map((t) => ({
                name : t.name,
                type : t.constructor.name,    // VectorKeyframeTrack, QuaternionKeyframeTrack...
            })),
        }));
    }
}

function _r(v) { return Math.round(v * 100) / 100; }
