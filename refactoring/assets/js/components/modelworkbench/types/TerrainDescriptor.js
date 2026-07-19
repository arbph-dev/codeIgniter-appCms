/**
 * TerrainDescriptor.js
 * Contrat pour les terrains (TerranWorkbench)
 */

export const TerrainDescriptor = {
    id: 'string',
    name: 'string',
    slug: 'string',

    type: 'terrain',                    // 'heightmap', 'procedural', 'imported'

    resource: {
        heightmap: 'string|null',       // chemin vers la texture heightmap (ex: png 16-bit)
        texture: 'string|null',         // texture albedo / satellite
        normalMap: 'string|null',
        mask: 'string|null'             // pour végétation, routes, etc.
    },

    // Dimensions réelles (très important pour cohérence géographique)
    realWorld: {
        unit: 'meter',
        width: 'number',                // largeur réelle en mètres
        height: 'number',               // profondeur/longueur en mètres
        maxElevation: 'number',         // altitude maximale
        minElevation: 'number'          // altitude minimale (ex: mer)
    },

    // Paramètres de génération / affichage Three.js
    geometry: {
        widthSegments: 'number',        // ex: 128, 256, 512
        heightSegments: 'number',
        scale: { x: 1, y: 1, z: 1 },   // scale vertical (exagération du relief)
        displacementScale: 'number'     // intensité du displacement
    },

    // Géoréférencement (Leaflet + WMTS GeoPortail)
    geo: {
        enabled: true,
        crs: 'EPSG:4326',               // ou EPSG:2154 (Lambert 93)
        bounds: {
            minLat: 'number',
            maxLat: 'number',
            minLng: 'number',
            maxLng: 'number'
        },
        center: { lat: 'number', lng: 'number' },
        zoom: 'number'
    },

    // Textures & Matériaux
    materials: {
        mainTexture: 'string|null',     // référence à un TextureDescriptor
        normalMap: 'string|null',
        roughness: 'number',
        metalness: 'number'
    },

    // Options d’affichage
    display: {
        wireframe: false,
        castShadow: true,
        receiveShadow: true,
        visible: true
    },

    // Métadonnées
    metadata: {
        source: 'string|null',          // ex: "GeoPortail", "IGN", "SHOM"
        year: 'number|null',
        description: 'string|null',
        resolution: 'string'            // ex: "5m", "1m", "30cm"
    },

    // Pour usages futurs (végétation, eau, routes...)
    layers: [
        {
            type: 'vegetation' | 'water' | 'road' | 'building',
            mask: 'string|null',
            density: 'number'
        }
    ]
};
