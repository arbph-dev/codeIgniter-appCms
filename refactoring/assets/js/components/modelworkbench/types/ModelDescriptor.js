/**
 * ModelDescriptor.js
 * Contrat de données pour un modèle 3D dans le ModelWorkbench
 */

export const ModelDescriptor = {
    id: 'string',                    // ex: 'b26'
    name: 'string',
    slug: 'string',

    classification: {
        category: 'string',          // 'avions', 'vehicules', 'batiments'...
        type: 'string',              // 'aircraft', 'tank', 'building'...
        tags: ['string']
    },

    resource: {
        format: 'string',            // 'obj', 'glb', 'gltf', 'composite'
        main: 'string',              // chemin principal
        // path et mtl pour compatibilité OBJ
        path: 'string|null',
        mtl: 'string|null'
    },

    parts: ['string'],               // IDs des sous-modèles pour les composites

    realWorld: {
        unit: 'string',              // 'meter', 'feet'
        length: 'number|null',
        wingspan: 'number|null',
        height: 'number|null'
    },

    transform: {
        targetSize: 'number',        // Taille cible pour normalisation
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },   // degrés
        scale:    { x: 1, y: 1, z: 1 }
    },

    computed: {                      // Rempli après chargement
        boundingBox: {
            size: { x: 0, y: 0, z: 0 },
            center: { x: 0, y: 0, z: 0 },
            diagonal: 0
        },
        vertexCount: 0,
        meshCount: 0
    },

    thumbnail: 'string|null',

    metadata: {
        description: 'string|null',
        year: 'number|null',
        manufacturer: 'string|null'
    },

    relations: {
        composedOf: ['string'],      // composition forte (parts)
        compatibleWith: ['string']   // association faible
    }
};
