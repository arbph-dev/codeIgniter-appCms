// ============================================================================
// assets/js/ui/workbench/catalog/ComponentCatalogWorkbench.js
// ============================================================================

import WorkbenchBase              from '/assets/js/ui/workbench/WorkbenchBase.js';

import ComponentCatalog           from '/assets/js/core/ComponentCatalog.js';
import ComponentSelection         from '/assets/js/core/ComponentSelection.js';

import CatalogPanel              from '/assets/js/ui/workbench/views/CatalogPanel.js';
import DefinitionPanel           from '/assets/js/ui/workbench/views/DefinitionPanel.js';
import DescriptorPanel           from '/assets/js/ui/workbench/views/DescriptorPanel.js';
import JsonPanel                 from '/assets/js/ui/workbench/views/JsonPanel.js';

export class ComponentCatalogWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({
            name : 'Component Catalog',
            ...config
        });

        // métier
        this.catalog   = new ComponentCatalog();
        this.selection = new ComponentSelection();

        // vues
        this.catalogPanel    = null;
        this.definitionPanel = null;
        this.descriptorPanel = null;
        this.jsonPanel       = null;
    }

    //----------------------------------------------------------------------
    // Initialisation
    //----------------------------------------------------------------------

    bootstrap()
    {
        this.createLayout();
        this.createPanels();
        this.bindEvents();

        this.refreshCatalog();
    }

    //----------------------------------------------------------------------
    // Layout
    //----------------------------------------------------------------------

    createLayout()
    {
        const body = this.getElement('.wb-content');

        body.innerHTML = `
            <div class="wb_catalog_layout">

                <div class="wb_catalog_left"></div>

                <div class="wb_catalog_right">

                    <div class="wb_catalog_definition"></div>

                    <div class="wb_catalog_descriptor"></div>

                    <div class="wb_catalog_json"></div>

                </div>

            </div>
        `;
    }

    //----------------------------------------------------------------------
    // Panels
    //----------------------------------------------------------------------

    createPanels()
    {
        this.catalogPanel =
            new CatalogPanel();

        this.definitionPanel =
            new DefinitionPanel();

        this.descriptorPanel =
            new DescriptorPanel();

        this.jsonPanel =
            new JsonPanel();

        this.getElement('.wb_catalog_left')
            .appendChild(this.catalogPanel.getElement());

        this.getElement('.wb_catalog_definition')
            .appendChild(this.definitionPanel.getElement());

        this.getElement('.wb_catalog_descriptor')
            .appendChild(this.descriptorPanel.getElement());

        this.getElement('.wb_catalog_json')
            .appendChild(this.jsonPanel.getElement());
    }

    //----------------------------------------------------------------------
    // Events
    //----------------------------------------------------------------------

    bindEvents()
    {
        this.catalogPanel.onSelect(type =>
        {
            this.selectComponent(type);
        });
    }

    //----------------------------------------------------------------------
    // Catalogue
    //----------------------------------------------------------------------

    refreshCatalog()
    {
        this.catalogPanel.setItems(
            this.catalog.list()
        );
    }

    //----------------------------------------------------------------------
    // Sélection
    //----------------------------------------------------------------------

    selectComponent(type)
    {
        const definition = this.catalog.get(type);

        if (!definition) {
            return;
        }

        this.selection.set(definition);

        this.refreshSelection();
    }

    refreshSelection()
    {
        const definition = this.selection.get();

        if (!definition) {
            return;
        }

        this.definitionPanel.setDefinition(definition);

        this.descriptorPanel.setDefinition(definition);

        this.jsonPanel.setData(
            definition.toJSON()
        );
    }

    //----------------------------------------------------------------------
    // Nettoyage
    //----------------------------------------------------------------------

    destroy()
    {
        this.catalogPanel?.destroy?.();
        this.definitionPanel?.destroy?.();
        this.descriptorPanel?.destroy?.();
        this.jsonPanel?.destroy?.();

        super.destroy();
    }
}

export default ComponentCatalogWorkbench;
