/**
 * TextureDescriptor.js
 * Contrat pour les textures (utilisé par Model et TerranWorkbench)
 */

export const TextureDescriptor = {
    id: 'string',
    name: 'string',
    type: 'string',                  // 'albedo', 'normal', 'heightmap', 'mask', 'roughness', 'ao'...

    resource: {
        path: 'string',
        format: 'string'             // 'png', 'jpg', 'hdr', 'exr'
    },

    preview: 'string|null',          // Chemin vers une miniature

    resolution: {
        width: 'number',
        height: 'number'
    },

    // Géoréférencement (important pour terrains)
    geo: {
        enabled: false,
        crs: 'string|null',          // ex: 'EPSG:4326'
        bounds: {
            minLat: 'number|null',
            maxLat: 'number|null',
            minLng: 'number|null',
            maxLng: 'number|null'
        },
        resolutionMeters: 'number|null'
    },

    metadata: {
        source: 'string|null',
        year: 'number|null',
        description: 'string|null'
    }
};
