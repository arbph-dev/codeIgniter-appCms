/**
 * SceneDescriptor.js
 * Contrat pour une scène complète
 */

export const SceneDescriptor = {
    id: 'string',
    name: 'string',
    slug: 'string',

    classification: {
        category: 'string',
        tags: ['string']
    },

    realWorld: {
        unit: 'meter',
        width: 'number',
        depth: 'number',
        maxHeight: 'number'
    },

    // Références uniquement (plus flexible)
    terrain: 'string|null',        // terrainId
    skybox: 'string|null',         // skyboxId

    models: [
        {
            modelId: 'string',           // ex: 'b17'
            instanceId: 'string',        // identifiant unique dans la scène
            transform: {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale:    { x: 1, y: 1, z: 1 }
            },
            visible: true,
            animations: [
                {
                    clipName: 'string',
                    loop: true,
                    speed: 1.0,
                    playing: false
                }
            ]
        }
    ],

    // === Éclairage multi-sources ===
    lights: [
        {
            type: 'ambient' | 'directional' | 'point' | 'spot',
            name: 'string',
            intensity: 'number',
            color: 'string',                  // '#ffffff'
            position: { x: 0, y: 0, z: 0 },   // pour point & spot
            target: { x: 0, y: 0, z: 0 },     // pour directional & spot
            castShadow: 'boolean',
            parameters: {}                    // distance, angle, penumbra, etc.
        }
    ],

    environment: {
        fog: {
            enabled: false,
            color: '#a0a0a0',
            near: 100,
            far: 1000
        },
        backgroundColor: '#000000'
    },

    metadata: {
        description: 'string|null',
        author: 'string|null',
        createdAt: 'string',
        version: 'string',
        historicalContext: 'string|null'     // ex: "Raid sur Saint-Leu-d'Esserent - 4 juillet 1944"
    }
};
