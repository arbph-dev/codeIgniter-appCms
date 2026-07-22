/*
/assets/js/components/modelworkbench/types/SceneDescriptor.js

 */

export const SceneDescriptor =
{
    id   : 'string',
    name : 'string',
    slug : 'string',

    classification :
    {
        category : 'string',
        tags     : ['string']
    },

    realWorld :
    {
        unit      : 'meter',
        width     : 'number',
        depth     : 'number',
        maxHeight : 'number'
    },

    resources :
    {
        terrain : 'terrainId|null',
        skybox  : 'skyboxId|null'
    },

    models :
    [
        {
            instanceId : 'string',
            modelId    : 'string',

            transform :
            {
                position : { x:0, y:0, z:0 },
                rotation : { x:0, y:0, z:0 },
                scale    : { x:1, y:1, z:1 }
            },

            visible : true,

            animations :
            [
                {
                    clipName : 'string',
                    loop     : true,
                    speed    : 1,
                    playing  : false
                }
            ]
        }
    ],

    lights :
    [
        {
            instanceId : 'string',
            lightId    : 'string',

            transform :
            {
                position : { x:0, y:0, z:0 },
                rotation : { x:0, y:0, z:0 }
            },

            visible : true,

            overrides :
            {
                intensity : 'number|null',
                color     : 'string|null'
            }
        }
    ],

    environment :
    {
        fog :
        {
            enabled : false,
            color   : '#a0a0a0',
            near    : 100,
            far     : 1000
        },

        backgroundColor : '#000000'
    },

    metadata :
    {
        description       : 'string|null',
        author            : 'string|null',
        createdAt         : 'string',
        version           : 'string',
        historicalContext : 'string|null'
    }
};
