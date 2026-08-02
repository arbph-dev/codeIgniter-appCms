// ============================================================================
// assets/js/ui/workbench/catalog/ComponentCatalogWorkbench.js
// ============================================================================
// Iteration001 : version initiale (getElement / setItems / setDefinition / setData)
// Iteration002 : normalisation assemblage
//   — render() remplace getElement() sur tous les panels
//   — show()   remplace setItems / setDefinition / setData
//   — onSelect reçoit def (objet complet) ; def.type extrait explicitement ici
// ============================================================================

import WorkbenchBase      from '/assets/js/ui/workbench/WorkbenchBase.js';
import ComponentCatalog   from '/assets/js/core/ComponentCatalog.js';
import ComponentSelection from '/assets/js/core/ComponentSelection.js';
import CatalogPanel       from '/assets/js/ui/workbench/views/CatalogPanel.js';
import DefinitionPanel    from '/assets/js/ui/workbench/views/DefinitionPanel.js';
import DescriptorPanel    from '/assets/js/ui/workbench/views/DescriptorPanel.js';
import JsonPanel          from '/assets/js/ui/workbench/views/JsonPanel.js';

export class ComponentCatalogWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({
            name : 'Component Catalog',
            ...config,
        });

        // Métier
        this.catalog   = new ComponentCatalog();
        this.selection = new ComponentSelection();

        // Vues
        this.catalogPanel    = null;
        this.definitionPanel = null;
        this.descriptorPanel = null;
        this.jsonPanel       = null;
    }

    //--------------------------------------------------------------------------
    // Initialisation
    //--------------------------------------------------------------------------

    async bootstrap()
    {
        this.createLayout();
        this.createPanels();
        this.bindEvents();

        //this.catalog.load();
        await this.catalog.load();
        console.log(this.catalog.count());
        console.log(this.catalog.list());
        console.log(this.catalog.get('apex'));
        this.refreshCatalog();

    }

    //--------------------------------------------------------------------------
    // Layout
    //--------------------------------------------------------------------------

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

    //--------------------------------------------------------------------------
    // Panels
    // Seul endroit qui instancie, appelle render() et insère dans le DOM.
    //--------------------------------------------------------------------------

    createPanels()
    {
        this.catalogPanel    = new CatalogPanel();
        this.definitionPanel = new DefinitionPanel();
        this.descriptorPanel = new DescriptorPanel();
        this.jsonPanel       = new JsonPanel();

        this.getElement('.wb_catalog_left')
            .appendChild(this.catalogPanel.render());

        this.getElement('.wb_catalog_definition')
            .appendChild(this.definitionPanel.render());

        this.getElement('.wb_catalog_descriptor')
            .appendChild(this.descriptorPanel.render());

        this.getElement('.wb_catalog_json')
            .appendChild(this.jsonPanel.render());
    }

    //--------------------------------------------------------------------------
    // Événements
    //--------------------------------------------------------------------------

    bindEvents()
    {
        // onSelect reçoit la définition complète ; on en extrait le type.
        this.catalogPanel.onSelect(def =>
        {
            this.selectComponent(def.type);
        });
    }

    //--------------------------------------------------------------------------
    // Catalogue
    //--------------------------------------------------------------------------

    refreshCatalog()
    {
        this.catalogPanel.show(
            this.catalog.list()
        );
    }

    //--------------------------------------------------------------------------
    // Sélection
    //--------------------------------------------------------------------------

    selectComponent(type)
    {
        const definition = this.catalog.get(type);
        if (!definition) return;

        this.selection.set(definition);
        this.refreshSelection();
    }

    refreshSelection()
    {
        const definition = this.selection.get();
        if (!definition) return;

        this.definitionPanel.show(definition);
        this.descriptorPanel.show(definition);
        this.jsonPanel.show(definition.toJSON());
    }

    //--------------------------------------------------------------------------
    // Nettoyage
    //--------------------------------------------------------------------------

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
