// assets/js/components/three/resources/ResourceLoader.js

import { ResourceRegistry } from './ResourceRegistry.js';

export class ResourceLoader
{
    /**
     * Charge une ressource.
     *
     * @param {Object} params
     * @param {string} params.resource
     * @param {Viewer} params.viewer
     * @returns {Object}
     */
    static load( { resource = '' , viewer = null } )
    {
        if (!resource)
        {
            throw new Error( 'ResourceLoader : ressource manquante.' );
        }

        if (!viewer)
        {
            throw new Error( 'ResourceLoader : viewer manquant.' );
        }

        const Resource = ResourceRegistry.get({
            resource
        });

        if (!Resource)
        {
            throw new Error(
                `ResourceLoader : ressource '${resource}' non enregistrée.`
            );
        }

        return new Resource({

            viewer,

            options: viewer.options.resourceOptions ?? {}

        });
    }
}
