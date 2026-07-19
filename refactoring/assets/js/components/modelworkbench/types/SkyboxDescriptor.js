/**
 * SkyboxDescriptor.js
 * Contrat pour les environnements lointains / ciel
 */

export const SkyboxDescriptor = {
    id: 'string',
    name: 'string',
    slug: 'string',

    type: 'string',                    // 'cube', 'hdr', 'equirectangular', 'procedural'

    resource: {
        main: 'string',                // .hdr ou dossier cube (px, nx, py...)
        format: 'string'               // 'hdr', 'jpg', 'png'
    },

    // Paramètres visuels
    intensity: 1.0,
    rotation: 0,                       // rotation Y en degrés
    blur: 0.0,                         // niveau de flou (pour reflections)

    // Soleil / Lumière principale
    sun: {
        enabled: true,
        position: { x: 100, y: 100, z: 50 },
        color: '#ffffff',
        intensity: 2.5
    },

    // Atmosphère (optionnel)
    atmosphere: {
        enabled: true,
        turbidity: 2.5,                // nébulosité
        rayleigh: 1.0,                 // diffusion
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8
    },

    // Informations contextuelles
    metadata: {
        description: 'string|null',
        timeOfDay: 'string',           // 'day', 'sunset', 'night', 'dawn'
        weather: 'string',             // 'clear', 'cloudy', 'overcast'
        location: 'string|null',       // ex: "Normandie, France"
        year: 'number|null'
    },

    thumbnail: 'string|null'
};
