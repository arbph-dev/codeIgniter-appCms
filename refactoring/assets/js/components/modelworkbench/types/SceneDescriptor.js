/**
 * SceneDescriptor.js
 * Contrat pour une scène complète (SceneWorkbench)
 */

export const SceneDescriptor = {
    id: 'string',
    name: 'string',
    slug: 'string',

    classification: {
        category: 'string',           // 'military', 'urban', 'historical', 'training'...
        tags: ['string']
    },

    // Dimensions globales de la scène
    realWorld: {
        unit: 'meter',
        width: 'number',
        depth: 'number',
        maxHeight: 'number'
    },

    // Composition de la scène
    terrain: 'TerrainDescriptor|null',     // Référence ou objet complet
    skybox: 'SkyboxDescriptor|null',

    models: [
        {
            modelId: 'string',             // référence à un ModelDescriptor
            instanceId: 'string',          // identifiant unique dans cette scène
            transform: {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale:    { x: 1, y: 1, z: 1 }
            },
            visible: true,
            animations: [                  // Animations actives sur cette instance
                {
                    clipName: 'string',
                    loop: true,
                    speed: 1.0,
                    playing: false
                }
            ]
        }
    ],

    lighting: {
        ambient: { intensity: 0.6, color: '#ffffff' },
        directional: {
            position: { x: 50, y: 100, z: 50 },
            intensity: 1.2,
            castShadow: true
        },
        environment: {
            hdri: 'string|null',           // chemin vers une HDR
            intensity: 1.0
        }
    },

    // Paramètres globaux
    environment: {
        fog: {
            enabled: false,
            color: '#a0a0a0',
            near: 100,
            far: 1000
        },
        backgroundColor: '#000000'
    },

    // Métadonnées
    metadata: {
        description: 'string|null',
        author: 'string|null',
        createdAt: 'string',
        version: 'string'
    },

    // Pour futures extensions
    layers: [],          // ex: annotations, zones d'intérêt, paths...
    tags: []
};

