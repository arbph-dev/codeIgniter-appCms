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

import { ComponentFactory } from './ComponentFactory.js';

const INSTANCES = new Map();

/**
 * Initialise tous les composants Three.js présents dans un conteneur.
 *
 * @param {Document|HTMLElement} container
 */
export function init(container = document)
{
    container
        .querySelectorAll('.cp_threejs')
        .forEach(create);
}

/**
 * Crée une instance à partir d'un élément DOM.
 *
 * @param {HTMLElement} element
 * @returns {Object|null}
 */
export function create(element)
{
    if (!(element instanceof HTMLElement))
    {
        console.error('ThreeJS : élément invalide.', element);
        return null;
    }

    const id = readId(element);

    if (INSTANCES.has(id))
    {
        return INSTANCES.get(id);
    }

    const options = readOptions(element);

    if (options === null)
    {
        return null;
    }

    try
    {
        const instance = ComponentFactory.create( { element, options} );
        instance.init();
        INSTANCES.set(id, instance);
        return instance;
    }
    catch (error)
    {
        console.error('ThreeJS : impossible de créer le composant.', error);
        return null;
    }
}

/**
 * Détruit une instance.
 */
export function destroy(id)
{
    const instance = INSTANCES.get(id);

    if (!instance)
    {
        return;
    }

    instance.destroy();
    INSTANCES.delete(id);
}

/**
 * Rafraîchit une instance.
 */
export function refresh(id)
{
    const instance = INSTANCES.get(id);

    if (instance)
    {
        instance.refresh();
    }
}

/**
 * Rafraîchit toutes les instances.
 */
export function refreshAll()
{
    INSTANCES.forEach(instance => instance.refresh());
}

/**
 * Retourne une instance.
 */
export function get(id)
{
    return INSTANCES.get(id) ?? null;
}

/**
 * Retourne toutes les instances.
 */
export function list()
{
    return Array.from(INSTANCES.values());
}


/* -------------------------------------------------------------------------- */
/*  Privé                                                                     */
/* -------------------------------------------------------------------------- */

function readId(element)
{
    return element.id;
}

function readOptions(element)
{
    try
    {
        return JSON.parse(
            element.dataset.options || '{}'
        );
    }
    catch (error)
    {
        console.error(
            'ThreeJS : data-options invalide.',
            element,
            error
        );

        return null;
    }
}
