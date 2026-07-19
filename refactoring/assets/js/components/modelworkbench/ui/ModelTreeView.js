/**
 * /assets/js/components/modelworkbench/ui/ModelTreeView.js
 *
 * --------------------------------------------------------------------
 * ModelWorkbench
 *
 * Catalogue des modèles disponibles.
 *
 * Responsabilités :
 *  - afficher les ModelDescriptor disponibles ;
 *  - regrouper les modèles par catégorie ;
 *  - signaler la sélection d'un modèle.
 *
 * Ne connaît pas :
 *  - Three.js ;
 *  - LoaderFactory ;
 *  - SceneManager ;
 *  - le chargement des ressources.
 * --------------------------------------------------------------------
 * commit9 
 * Ajouter 2 deux méthodes
 */

export class ModelTreeView
{
    /**
     * @param {Object} params
     * @param {HTMLElement} params.container
     * @param {ModelDescriptor[]} [params.models=[]]
     * @param {Function} [params.onSelect]
     */
    constructor({ container, models = [], onSelect = null })
    {
        this.container = container;
        this.models    = models;
        this.onSelect  = onSelect;

        this._selectedId = null;

        this.render();
    }

    // ─── Rendu ────────────────────────────────────────────────────────────────

    render(models = this.models)
    {
        this.models = models;

        this.container.innerHTML = '';

        const groups = this._groupByCategory(this.models);

        Object.entries(groups).forEach(([category, models]) =>
        {
            this._renderCategory(category, models);
        });
    }

    _renderCategory(category, models)
    {
        const categoryEl = document.createElement('div');

        categoryEl.className = 'wb-model-category';

        const titleEl = document.createElement('div');

        titleEl.className = 'wb-model-category-title';
        titleEl.textContent = category;

        const modelsEl = document.createElement('div');

        modelsEl.className = 'wb-model-category-items';

        models.forEach(model =>
        {
            modelsEl.appendChild(
                this._createModelElement(model)
            );
        });

        categoryEl.append(titleEl, modelsEl);

        this.container.appendChild(categoryEl);
    }

    _createModelElement(model)
    {
        const element = document.createElement('div');

        element.className = 'wb-model-item';
        element.dataset.modelId = model.id;

        element.textContent = model.name;

        element.addEventListener(
            'click',
            () => this._select(model, element)
        );

        return element;
    }

    // ─── Sélection ─────────────────────────────────────────────────────────────

    _select(model, element)
    {
        this._clearSelection();

        element.classList.add('is-selected');

        this._selectedId = model.id;

        this.onSelect?.(model);
    }

    _clearSelection()
    {
        this.container
            .querySelectorAll('.wb-model-item.is-selected')
            .forEach(element =>
            {
                element.classList.remove('is-selected');
            });
    }

    // ─── Organisation ─────────────────────────────────────────────────────────

    _groupByCategory(models)
    {
        return models.reduce((groups, model) =>
        {
            const category = model.category || 'Autres';

            if (!groups[category])
            {
                groups[category] = [];
            }

            groups[category].push(model);

            return groups;
        }, {});
    }

    // ─── API publique ─────────────────────────────────────────────────────────

    setModels(models)
    {
        this.render(models);
    }

    selectById(id)
    {
        const model = this.models.find(
            model => model.id === id
        );

        if (!model) return;

        const element = this.container.querySelector(
            `[data-model-id="${id}"]`
        );

        if (!element) return;

        this._select(model, element);
    }

    getSelected()
    {
        return this.models.find(
            model => model.id === this._selectedId
        ) ?? null;
    }

    // ─── Cycle de vie ──────────────────────────────────────────────────────────

    destroy()
    {
        this.container.innerHTML = '';

        this.models = [];
        this.onSelect = null;
        this._selectedId = null;
    }
    // commit 9
    clearSelection()
    {
        this._clearSelection();
        this._selectedId = null;
    }
    
    // commit 9
    markAsLoaded(id)
    {
        // Mise en évidence du modèle chargé (optionnel mais très utile)
        this.container.querySelectorAll('.wb-model-item').forEach(el => {
            el.classList.toggle('is-loaded', el.dataset.modelId === id);
        });
    }    
}
