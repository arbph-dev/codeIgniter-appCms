// ============================================================================
// assets/js/core/ComponentDefinition.js
//
// Contrat décrivant un composant du catalogue.
//
// Une ComponentDefinition contient uniquement des métadonnées.
// Elle ne crée jamais d'instance de composant.
//
// Stage 1
// ============================================================================

export class ComponentDefinition
{
    constructor({
        type          = '',
        title         = '',
        description   = '',
        category      = 'General',

        version       = '1.0.0',
        author        = '',
        icon          = 'fa-cube',

        tags          = [],

        capabilities  = {},

        descriptor    = {},

        defaults      = {},

        renderer      = null,
        controller    = null,
        workbench     = null,
    } = {})
    {
        if (!type) {
            throw new Error('ComponentDefinition : type obligatoire.');
        }

        this.type        = type;
        this.title       = title || type;
        this.description = description;
        this.category    = category;

        this.version     = version;
        this.author      = author;
        this.icon        = icon;

        this.tags = [...tags];

        this.capabilities =
        {
            cms        : true,
            preview    : true,
            workbench  : true,
            export     : false,
            import     : false,

            ...capabilities
        };

        // Définition du descriptor supporté
        this.descriptor =
        {
            properties : [],
            required   : [],

            ...descriptor
        };

        // Valeurs par défaut du descriptor
        this.defaults =
        {
            ...defaults
        };

        // Références techniques
        this.renderer   = renderer;
        this.controller = controller;
        this.workbench  = workbench;
    }

    //----------------------------------------------------------------------
    // Capabilities
    //----------------------------------------------------------------------

    hasCapability(name)
    {
        return Boolean(this.capabilities[name]);
    }

    //----------------------------------------------------------------------
    // Tags
    //----------------------------------------------------------------------

    hasTag(tag)
    {
        return this.tags.includes(tag);
    }

    addTag(tag)
    {
        if (!this.hasTag(tag)) {
            this.tags.push(tag);
        }

        return this;
    }

    //----------------------------------------------------------------------
    // Descriptor
    //----------------------------------------------------------------------

    getDefaultDescriptor()
    {
        return structuredClone(this.defaults);
    }

    //----------------------------------------------------------------------
    // Export
    //----------------------------------------------------------------------

    toJSON()
    {
        return {
            type         : this.type,
            title        : this.title,
            description  : this.description,
            category     : this.category,

            version      : this.version,
            author       : this.author,
            icon         : this.icon,

            tags         : [...this.tags],

            capabilities : {
                ...this.capabilities
            },

            descriptor : {
                ...this.descriptor
            },

            defaults : {
                ...this.defaults
            }
        };
    }
}

export default ComponentDefinition;
