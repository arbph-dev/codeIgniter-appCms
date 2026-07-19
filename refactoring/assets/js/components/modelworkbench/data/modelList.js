/**
 * /assets/js/components/modelworkbench/data/modelList.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench
 *
 * Catalogue temporaire de ModelDescriptor.
 *
 * Cette liste sera ultérieurement remplacée par les données fournies
 * par le contrôleur PHP.
 * --------------------------------------------------------------------
 */

/**
 * @typedef {Object} ModelDescriptor
 *
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} type
 *
 * @property {Object} resource
 * @property {string} resource.format
 * @property {string} resource.path
 * @property {string|null} resource.mtl
 *
 * @property {Object} transform
 * @property {number} transform.targetSize
 * @property {Object} transform.position
 * @property {number} transform.position.x
 * @property {number} transform.position.y
 * @property {number} transform.position.z
 * @property {Object} transform.rotation
 * @property {number} transform.rotation.x
 * @property {number} transform.rotation.y
 * @property {number} transform.rotation.z
 * @property {Object} transform.scale
 * @property {number} transform.scale.x
 * @property {number} transform.scale.y
 * @property {number} transform.scale.z
 *
 * @property {Object} metadata
 * @property {string} metadata.description
 * @property {number|null} metadata.sizeBytes
 */


/**
 * Catalogue temporaire des modèles.
 *
 * @type {ModelDescriptor[]}
 */
export const MODEL_LIST =
[
    {
        id       : 'fw190',
        name     : 'Focke-Wulf Fw 190',
        category : 'avions',
        type     : 'aircraft',

        resource :
        {
            format : 'obj',

            path : '/assets/img/3js/model3d/avions/FW190.obj',

            mtl : null,
        },

        transform :
        {
            targetSize : 3,

            position :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            rotation :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            scale :
            {
                x : 1,
                y : 1,
                z : 1,
            },
        },

        metadata :
        {
            description : 'Train déployé et verrière pilote ouverte',

            sizeBytes : null,
        },
    },


    {
        id       : 'barco',
        name     : 'Barco',
        category : 'bateaux',
        type     : 'boat',

        resource :
        {
            format : 'obj',

            path : '/assets/img/3js/model3d/bateaux/barco/Barco_obj/Barco.obj',

            mtl : '/assets/img/3js/model3d/bateaux/barco/Barco_obj/Barco.mtl',
        },

        transform :
        {
            targetSize : 3,

            position :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            rotation :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            scale :
            {
                x : 1,
                y : 1,
                z : 1,
            },
        },

        metadata :
        {
            description : 'Modèle OBJ avec matériaux MTL',

            sizeBytes : null,
        },
    },


    {
        id       : 'ferrari',
        name     : 'Ferrari',
        category : 'vehicules',
        type     : 'car',

        resource :
        {
            format : 'glb',

            path : '/assets/img/3js/model3d/ferrari.glb',

            mtl : null,
        },

        transform :
        {
            targetSize : 3,

            position :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            rotation :
            {
                x : 0,
                y : 0,
                z : 0,
            },

            scale :
            {
                x : 1,
                y : 1,
                z : 1,
            },
        },

        metadata :
        {
            description : 'Modèle GLB',

            sizeBytes : null,
        },
    },
];
