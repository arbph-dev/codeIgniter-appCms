// ============================================================
// assets/js/core/ComponentCatalog.js
//
// Catalogue public des composants.
//
// Responsabilités :
//   • façade sur ComponentDefinitionRegistry
//   • API unique utilisée par les Workbench
//   • aucune logique UI
// ============================================================

import { ComponentDefinitionRegistry } from './ComponentDefinitionRegistry.js';

export class ComponentCatalog
{
    /**
     * Enregistre une définition.
     *
     * @param {ComponentDefinition} definition
     */
    static register(definition)
    {
        ComponentDefinitionRegistry.register(definition);
    }

    /**
     * Désenregistre un composant.
     *
     * @param {string} type
     */
	static unregister(type)
	{
	    ComponentDefinitionRegistry.unregister(type);
	}
	/**
	 * Retourne une définition.
	 * @param {string} type
	 * @returns {ComponentDefinition|null}
	 */
	static get(type) { return ComponentDefinitionRegistry.get(type); }

    /**
     * Liste complète.
     *
     * @returns {ComponentDefinition[]}
     */
    static list()
    {
        return ComponentDefinitionRegistry.list();
    }

    /**
     * Vérifie l'existence.
     *
     * @param {string} type
     * @returns {boolean}
     */
	static has(type)
	{
	    return ComponentDefinitionRegistry.has(type);
	}

    /**
     * Retourne les catégories connues.
     *
     * @returns {string[]}
     */
    static categories()
    {
        const categories = new Set();

        this.list().forEach(def =>
        {
            categories.add(def.category ?? 'general');
        });

        return [...categories].sort();
    }

    /**
     * Filtre par catégorie.
     *
     * @param {string} category
     * @returns {ComponentDefinition[]}
     */
    static listByCategory(category)
    {
        return this.list().filter(
            def => def.category === category
        );
    }

    /**
     * Filtre selon une capacité.
     *
     * Exemple :
     *   listByCapability('editor')
     *   listByCapability('preview')
     *
     * @param {string} capability
     * @returns {ComponentDefinition[]}
     */
    static listByCapability(capability)
    {
        return this.list().filter(
            def => def.supports(capability)
        );
    }

    /**
     * Vide complètement le catalogue.
     */
    static clear()
    {
        ComponentDefinitionRegistry.clear();
    }
}

export default ComponentCatalog;