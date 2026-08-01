// ============================================================================
// assets/js/core/ComponentCatalog.js
// ============================================================================

import ComponentDefinitionRegistry from './ComponentDefinitionRegistry.js';

export class ComponentCatalog
{
    constructor()
    {
        this.registry = ComponentDefinitionRegistry;
    }

    /**
     * Charge les définitions par défaut.
     * Cette méthode sera enrichie au fur et à mesure des composants.
     */
    loadDefaults()
    {
        // TODO
        // registerRaw();
        // registerMermaid();
        // registerApex();
        // registerLeaflet();
        // registerThree();
    }

    /**
     * Nombre de composants.
     */
    count()
    {
        return this.registry.count();
    }

    /**
     * Toutes les définitions.
     *
     * @returns {ComponentDefinition[]}
     */
    list()
    {
        return this.registry.list();
    }

    /**
     * Définition par type.
     *
     * @param {string} type
     * @returns {ComponentDefinition|null}
     */
    get(type)
    {
        return this.registry.get(type);
    }

    /**
     * Vérifie l'existence.
     */
    has(type)
    {
        return this.registry.has(type);
    }

    /**
     * Liste filtrée.
     */
    filter(predicate)
    {
        return this.list().filter(predicate);
    }

    /**
     * Recherche texte.
     */
    search(text = '')
    {
        const q = text.toLowerCase();

        return this.filter(def =>

            def.type.toLowerCase().includes(q)
            || def.title.toLowerCase().includes(q)
            || (def.category ?? '').toLowerCase().includes(q)
            || (def.description ?? '').toLowerCase().includes(q)

        );
    }

    /**
     * Retourne toutes les catégories.
     */
    categories()
    {
        return [...new Set(
            this.list()
                .map(d => d.category)
                .filter(Boolean)
        )].sort();
    }

    /**
     * Composants d'une catégorie.
     */
    byCategory(category)
    {
        return this.filter(d => d.category === category);
    }

    /**
     * Composants possédant un tag.
     */
    byTag(tag)
    {
        return this.filter(d =>
            Array.isArray(d.tags)
            && d.tags.includes(tag)
        );
    }

    /**
     * Génère un descriptor.
     */
    createDescriptor(type)
    {
        const definition = this.get(type);

        return definition
            ? definition.createDefaultDescriptor()
            : null;
    }

    /**
     * Vide le registre.
     */
    clear()
    {
        this.registry.clear();
    }
}

export default ComponentCatalog;
