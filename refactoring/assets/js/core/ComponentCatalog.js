// ============================================================================
// assets/js/core/ComponentCatalog.js
// 2026-08-02-001 : Stage 1
//
// Chargement du catalogue depuis l'API PHP.
//
// ============================================================================

import ComponentDefinition from './ComponentDefinition.js';
import ComponentDefinitionRegistry from './ComponentDefinitionRegistry.js';

export class ComponentCatalog
{
    constructor()
    {
        this.registry = ComponentDefinitionRegistry;
    }

    /**
     * Charge le catalogue depuis l'API.
     *
     * @returns {Promise<ComponentCatalog>}
     */
    async load()
    {
        const response = await fetch('/api/component-catalog');

        if (!response.ok)
        {
            throw new Error(
                `Impossible de charger le catalogue (${response.status})`
            );
        }

        const definitions = await response.json();

        this.registry.clear();

        for (const data of definitions)
        {
            this.registry.register(

                new ComponentDefinition({

                    type        : data.type,

                    title       : data.label,
                    description : data.description,

                    icon        : data.icon,

                    renderer    : data.rendererClass,
                    workbench   : data.workbenchClass,

                    ...data.metadata,

                })

            );
        }

        return this;
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
        return this.registry.get({ type });
    }

    /**
     * Vérifie l'existence.
     */
    has(type)
    {
        return this.registry.has({ type });
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
            ? definition.getDefaultDescriptor()
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
