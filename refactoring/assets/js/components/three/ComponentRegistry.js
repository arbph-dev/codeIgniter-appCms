/*
/assets/js/components/three/registry.js

- `register(type, class)`
- `create(options)`
- `exists(type)`
- `list()`

Il deviendra probablement réutilisable par les autres composants

*/
// assets/js/components/three/ComponentRegistry.js

export class ComponentRegistry
{
    static components = new Map();

    /**
     * Enregistre un composant.
     *
     * @param {Object} params
     * @param {string} params.type
     * @param {*} params.component
     */
    static register({ type = '' , component = null } )
    {
        if (!type) {
            throw new Error( 'ComponentRegistry : type manquant.');
        }

        if (!component) {
            throw new Error( `ComponentRegistry : composant '${type}' invalide.`);
        }

        this.components.set(type, component);
    }

    /**
     * Retourne un composant.
     *
     * @param {Object} params
     * @param {string} params.type
     * @returns {*|null}
     */
    static get( { type = '' } )
    {
        return this.components.get(type) ?? null;
    }

    /**
     * Vérifie si un composant est enregistré.
     *
     * @param {Object} params
     * @param {string} params.type
     * @returns {boolean}
     */
    static has( { type = '' } )
    {
        return this.components.has(type);
    }

    /**
     * Désenregistre un composant.
     *
     * @param {Object} params
     * @param {string} params.type
     */
    static unregister( { type = '' } )
    {
        this.components.delete(type);
    }

    /**
     * Retourne la liste des types enregistrés.
     *
     * @returns {string[]}
     */
    static list()
    {
        return Array.from(this.components.keys());
    }

    /**
     * Vide complètement le registre.
     */
    static clear()
    {
        this.components.clear();
    }
}
