// ============================================================================
// assets/js/core/ComponentSelection.js
//
// Etat de sélection courant du ComponentCatalogWorkbench.
//
// Stage 1
// ============================================================================

export class ComponentSelection
{
    constructor()
    {
        this.clear();
    }

    /**
     * Sélectionne une définition.
     *
     * @param {ComponentDefinition|null} definition
     * @returns {ComponentSelection}
     */
    set(definition)
    {
        this.definition = definition ?? null;
        return this;
    }

    /**
     * Retourne la définition sélectionnée.
     *
     * @returns {ComponentDefinition|null}
     */
    get()
    {
        return this.definition;
    }

    /**
     * Retourne le type sélectionné.
     *
     * @returns {string|null}
     */
    getType()
    {
        return this.definition?.type ?? null;
    }

    /**
     * Retourne le descriptor par défaut.
     *
     * @returns {Object|null}
     */
    getDescriptor()
    {
        if (!this.definition) {
            return null;
        }

        return this.definition.getDefaultDescriptor();
    }

    /**
     * Indique si une sélection existe.
     *
     * @returns {boolean}
     */
    hasSelection()
    {
        return this.definition !== null;
    }

    /**
     * Efface la sélection.
     */
    clear()
    {
        this.definition = null;
    }

    /**
     * Export simple.
     */
    toJSON()
    {
        if (!this.definition) {
            return null;
        }

        return this.definition.toJSON();
    }
}

export default ComponentSelection;
