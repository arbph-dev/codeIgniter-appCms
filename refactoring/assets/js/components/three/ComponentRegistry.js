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
     */
    static register(type, componentClass)
    {
        if (!type) {
            throw new Error("ThreeJS Registry : type manquant.");
        }

        this.components.set(type, componentClass);
    }

    /**
     * Retourne une classe.
     */
    static get(type)
    {
        return this.components.get(type) ?? null;
    }

    /**
     * Vérifie l'existence.
     */
    static has(type)
    {
        return this.components.has(type);
    }

    /**
     * Supprime un composant.
     */
    static unregister(type)
    {
        this.components.delete(type);
    }

    /**
     * Liste les types enregistrés.
     */
    static list()
    {
        return Array.from(this.components.keys());
    }

    /**
     * Vide le registre.
     */
    static clear()
    {
        this.components.clear();
    }
}
