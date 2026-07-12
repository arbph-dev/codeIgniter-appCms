// assets/js/components/three/ComponentFactory.js

import { Registry } from './Registry.js';

export class ComponentFactory
{
    /**
     * Crée une instance de composant.
     *
     * @param {HTMLElement} element
     * @param {Object} options
     * @returns {Object}
     */
    static create({ element, options = {} } )
    {
        const type = options.type ?? 'viewer';

        const ComponentClass = Registry.get(type);

        if (!ComponentClass)
        {
            throw new Error(
                `ThreeJS : composant '${type}' non enregistré.`
            );
        }

        return new ComponentClass(element, options);
    }
}
