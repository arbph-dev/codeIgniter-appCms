// ============================================================================
// assets/js/core/ComponentDefinitionRegistry.js
//
// Registre des ComponentDefinition.
//
// Responsabilités :
//   - enregistrer une définition
//   - récupérer une définition
//   - lister les définitions
//   - supprimer une définition
//   - vider le registre
//
// Ne contient AUCUNE logique métier.
// Le ComponentCatalog constitue la façade publique.
//
// ============================================================================

export class ComponentDefinitionRegistry
{
    /**
     * Stockage interne.
     *
     * @type {Map<string, ComponentDefinition>}
     */
    static definitions = new Map();

    /**
     * Enregistre une définition.
     *
     * @param {ComponentDefinition} definition
     * @returns {ComponentDefinition}
     */
    static register(definition)
    {
        if (!definition)
        {
            throw new Error(
                'ComponentDefinitionRegistry : définition manquante.'
            );
        }

        if (!definition.type)
        {
            throw new Error(
                'ComponentDefinitionRegistry : type manquant.'
            );
        }

        this.definitions.set(
            definition.type,
            definition
        );

        return definition;
    }

    /**
     * Retourne une définition.
     *
     * @param {Object} params
     * @param {string} params.type
     *
     * @returns {ComponentDefinition|null}
     */
    static get({ type = '' } = {})
    {
        return this.definitions.get(type) ?? null;
    }

    /**
     * Vérifie si une définition existe.
     *
     * @param {Object} params
     * @param {string} params.type
     *
     * @returns {boolean}
     */
    static has({ type = '' } = {})
    {
        return this.definitions.has(type);
    }

    /**
     * Supprime une définition.
     *
     * @param {Object} params
     * @param {string} params.type
     */
    static unregister({ type = '' } = {})
    {
        this.definitions.delete(type);
    }

    /**
     * Retourne toutes les définitions.
     *
     * @returns {ComponentDefinition[]}
     */
    static list()
    {
        return Array.from(
            this.definitions.values()
        );
    }

    /**
     * Retourne tous les types enregistrés.
     *
     * @returns {string[]}
     */
    static keys()
    {
        return Array.from(
            this.definitions.keys()
        );
    }

    /**
     * Vide complètement le registre.
     */
    static clear()
    {
        this.definitions.clear();
    }

    /**
     * Nombre de définitions enregistrées.
     *
     * @returns {number}
     */
    static count()
    {
        return this.definitions.size;
    }
}
