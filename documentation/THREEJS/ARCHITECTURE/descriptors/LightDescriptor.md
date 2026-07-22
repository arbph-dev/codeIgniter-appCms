
Lights : Traités comme des instances réutilisables (excellent pour le réemploi du "Sun" par exemple).


## Propriétés

- id: 'string'
- name: 'string'
- slug: 'string'
- type: 'directional' // 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere'
- color: '#ffffff'
- intensity: 1.0
- castShadow: false

### classification
```js
    classification: {
        category: 'light',
        type: 'string',                    // ex: 'natural', 'artificial', 'studio'
        tags: ['string']                   // ex: ['sun', 'key-light', 'fill-light']
    },
```

classification.type : pour distinguer lumières naturelles / artificielles.

### parameters
Paramètres spécifiques selon le type de lumière
```js

    parameters: {
        // Point & Spot
        distance: null,
        decay: 1.0,

        // Spot uniquement
        angle: Math.PI / 6,                // ~30 degrés
        penumbra: 0.2,                     // douceur des bords

        // Directional & Spot
        target: { x: 0, y: 0, z: 0 },

        // Hemisphere
        groundColor: '#ffffff'
    },

```

### defaultTransform
utile pour des lumières comme le Soleil (position par défaut haute).

```js
    // Informations de position par défaut (utiles pour les lumières naturelles)
    defaultTransform: {
        position: { x: 50, y: 100, z: 50 },
        rotation: { x: 0, y: 0, z: 0 }
    },
```

### metadata
Métadonnées, colorTemperature utile pour le réalisme.

```js
    metadata: {
        description: 'string|null',
        purpose: 'string|null',            // ex: 'soleil principal', 'lumière d'ambiance', 'key light'
        energyConsumption: 'number|null',  // en watts (pour lumières artificielles)
        colorTemperature: 'number|null'    // en Kelvin (ex: 5500 pour lumière du jour)
    },
```

### animationCapabilities
préparation pour des animations de lumière dans le futur.

```js
    // Pour usage futur (ex: animation de lumière)
    animationCapabilities: {
        canAnimateIntensity: false,
        canAnimateColor: false,
        canMove: false
    }
```


