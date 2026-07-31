// ============================================================
// assets/js/core/ComponentDefinition.js
// Définition d'un composant CMS
// ============================================================

export class ComponentDefinition
{
    constructor({
        id = '',
        type = '',
        label = '',
        category = 'general',

        renderer = null,
        adminRenderer = null,

        descriptor = null,

        icon = 'fa-cube',
        version = '1.0.0',
        description = '',

        capabilities = {},

        metadata = {}
    } = {})
    {
        this.id             = id;
        this.type           = type;
        this.label          = label;
        this.category       = category;

        this.renderer       = renderer;
        this.adminRenderer  = adminRenderer;

        this.descriptor     = descriptor;

        this.icon           = icon;
        this.version        = version;
        this.description    = description;

        this.capabilities = {
            preview : true,
            editor  : false,
            provider: false,
            api     : false,
            ...capabilities
        };

        this.metadata = metadata;
    }

    //-----------------------------------------------------------------
    // helpers
    //-----------------------------------------------------------------

    hasRenderer()
    {
        return this.renderer !== null;
    }

    hasAdminRenderer()
    {
        return this.adminRenderer !== null;
    }

    hasDescriptor()
    {
        return this.descriptor !== null;
    }

    supports(feature)
    {
        return this.capabilities[feature] === true;
    }

    //-----------------------------------------------------------------
    // export
    //-----------------------------------------------------------------

    toJSON()
    {
        return {
            id            : this.id,
            type          : this.type,
            label         : this.label,
            category      : this.category,

            renderer      : this.renderer?.name ?? null,
            adminRenderer : this.adminRenderer?.name ?? null,
            descriptor    : this.descriptor?.name ?? null,

            icon          : this.icon,
            version       : this.version,
            description   : this.description,

            capabilities  : this.capabilities,
            metadata      : this.metadata
        };
    }
}

export default ComponentDefinition;