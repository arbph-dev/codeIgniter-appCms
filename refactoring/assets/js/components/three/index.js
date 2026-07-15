/*

/assets/js/components/three/index.js

- API publique
- découverte des `.cp_threejs`
- lecture de `data-options`
- création des instances
- destruction
- rafraîchissement

Aucune connaissance de Three.js.
*/

// assets/js/components/three/index.js


// CORE
//import { bus } from '/assets/js/core/EventBus.js'; // usage futur
import { ComponentFactory } from '/assets/js/core/ComponentFactory.js';
import { ComponentRegistry } from '/assets/js/core/ComponentRegistry.js';
import { ResourceRegistry } from '/assets/js/core/ResourceRegistry.js';

// SHARED/THREE
import { Viewer } from '/assets/js/shared/three/Viewer.js';

// creer ThreeResourceRegistry
import { ThreeResourceRegistry } from '/assets/js/shared/three/ThreeResourceRegistry.js';


//assets/js/shared/three/resources/

import { CubeResource } from '/assets/js/shared/three/resources/CubeResource.js';


/** Enregistrement des composants Three.js */
ComponentRegistry.register( { type: 'viewer' , component: Viewer } );

/** Enregistrement des ressources */
ThreeResourceRegistry.register( { resource: 'cube', component: CubeResource });


/**
 * Initialise tous les composants Three.js présents
 * dans le document.
 */
export function init(root = document)
{
    root
        .querySelectorAll('.cp_threejs')
        .forEach(element => {

            let options = {};

            try
            {
                options = JSON.parse(
                    element.dataset.options ?? '{}'
                );
            }
            catch (e)
            {
                console.error(
                    'Three.js : options JSON invalides.',
                    e
                );
            }

            const component = ComponentFactory.create({

                element,

                options

            });

            component.init();

        });
}
