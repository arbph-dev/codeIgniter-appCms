// assets/js/ui/shared/InlineListEditor.js
// ─────────────────────────────────────────────────────────────────────────────
// Composant liste + CRUD inline générique.
// Réutilisé par PersonneDetailPanel pour les onglets Alias et Parcours.
//
// Responsabilités :
//   • afficher une liste tabulaire d'items avec actions edit / supprimer
//   • basculer vers un Form.js pour créer ou modifier un item
//   • masquer la liste pendant l'édition, la restaurer à l'annulation
//   • notifier le Workbench via callbacks (onAdd, onUpdate, onDelete)
//
// Ce que InlineListEditor ne fait PAS :
//   • aucun appel API (délégué aux callbacks)
//   • aucune logique métier
//   • aucune pagination
//
// Point important — cohérence TabSystem :
//   _items est mis à jour par show() même si le tab n'a pas encore été rendu
//   (element = null). L'initFn du TabSystem utilise this._currentAliases /
//   this._currentParcours sur le panel, qui sont tenus à jour par refreshXxx()
//   → pas de donnée périmée à l'activation tardive d'un onglet.
//
// Interface :
//   new InlineListEditor({ propertySet, columns, onAdd, onUpdate, onDelete })
//   .render()     → HTMLElement (à appeler depuis renderFn du TabSystem)
//   .show(items)  → rafraîchit la liste ET stocke _items
//   .clear()      → état vide
//   .destroy()    → libère Form + références DOM
// ─────────────────────────────────────────────────────────────────────────────

import { Form }                       from '/assets/js/ui/shared/Form.js'
import { create, clear, notice, btn } from '/assets/js/core/domhelper.js'

export class InlineListEditor
{
    /**
     * @param {object}   options
     * @param {object[]} options.propertySet  PropertySet compatible Form.js
     * @param {Array<{key:string,label:string}>} options.columns  Colonnes table
     * @param {Function} [options.onAdd]      async (data) => void
     * @param {Function} [options.onUpdate]   async (id, data) => void
     * @param {Function} [options.onDelete]   async (id) => void
     */
    constructor({
        propertySet = [],
        columns     = [],
        onAdd       = null,
        onUpdate    = null,
        onDelete    = null,
    } = {})
    {
        this._ps       = propertySet
        this._columns  = columns
        this._onAdd    = onAdd
        this._onUpdate = onUpdate
        this._onDelete = onDelete

        this._items   = []
        this._editing = null   // item en cours d'édition ; null = création

        this.element   = null
        this._listEl   = null
        this._formWrap = null
        this._form     = null
    }

    // ── Cycle de vie ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('div', { class: 'wb_ile' })

        const toolbarEl = create('div', { class: 'wb_ile_toolbar' })
        toolbarEl.appendChild(btn({
            label   : 'Nouveau',
            icon    : 'fa-plus',
            variant : 'primary',
            onClick : () => this._showForm(null),
        }))
        this.element.appendChild(toolbarEl)

        this._listEl = create('div', { class: 'wb_ile_list' })
        this.element.appendChild(this._listEl)

        this._formWrap = create('div', { class: 'wb_ile_form wb_ile_form--hidden' })
        this.element.appendChild(this._formWrap)

        // Rendre les items déjà stockés (show() appelé avant render())
        this._renderList()

        return this.element
    }

    /**
     * Alimente la liste.
     * Stocke _items même si le tab n'est pas encore rendu (element = null).
     *
     * @param {object[]} items
     */
    show(items)
    {
        this._items = items ?? []
        if (!this._listEl) return     // tab pas encore rendu — stockage suffit
        this._hideForm()
        this._renderList()
    }

    clear()
    {
        this._items = []
        this._hideForm()
        if (!this._listEl) return
        clear(this._listEl)
        this._listEl.appendChild(notice('empty'))
    }

    destroy()
    {
        this._form?.destroy()
        this._form     = null
        this._editing  = null
        this.element   = null
        this._listEl   = null
        this._formWrap = null
        this._onAdd    = null
        this._onUpdate = null
        this._onDelete = null
    }

    // ── Rendu liste ───────────────────────────────────────────────────────────

    _renderList()
    {
        if (!this._listEl) return
        clear(this._listEl)

        if (!this._items.length)
        {
            this._listEl.appendChild(notice('empty'))
            return
        }

        const t     = document.createElement('table')
        t.className = 'cp_table'

        // THEAD
        const thead = document.createElement('thead')
        const trH   = document.createElement('tr')
        this._columns.forEach(col =>
        {
            const th = document.createElement('th')
            th.textContent = col.label
            trH.appendChild(th)
        })
        trH.appendChild(document.createElement('th'))    // colonne actions vide
        thead.appendChild(trH)
        t.appendChild(thead)

        // TBODY
        const tbody = document.createElement('tbody')
        this._items.forEach(item =>
        {
            const tr = document.createElement('tr')

            this._columns.forEach(col =>
            {
                const td = document.createElement('td')
                const v  = item[col.key]
                // Booléens → pictogramme ; null/undefined → tiret
                td.textContent = v === true ? '✓' : (v === false ? '' : (v ?? '—'))
                tr.appendChild(td)
            })

            const tdAct = document.createElement('td')
            tdAct.className = 'wb_ile_actions'

            tdAct.appendChild(btn({
                icon    : 'fa-pencil',
                label   : '',
                onClick : () => this._showForm(item),
            }))

            tdAct.appendChild(btn({
                icon    : 'fa-trash',
                label   : '',
                variant : 'danger',
                onClick : () => this._confirmDelete(item),
            }))

            tr.appendChild(tdAct)
            tbody.appendChild(tr)
        })

        t.appendChild(tbody)
        this._listEl.appendChild(t)
    }

    // ── Form ──────────────────────────────────────────────────────────────────

    _showForm(item)
    {
        this._editing = item

        this._form?.destroy()
        clear(this._formWrap)

        this._form = new Form({
            propertySet : this._ps,
            labels      : {
                submit : item ? 'Modifier' : 'Ajouter',
                cancel : 'Annuler',
            },
            onSubmit : (data) => this._handleSubmit(data),
            onCancel : () => this._hideForm(),
        })

        this._formWrap.appendChild(this._form.render())

        if (item) this._form.fill(item)
        else      this._form.reset()

        this._listEl.style.display = 'none'
        this._formWrap.classList.remove('wb_ile_form--hidden')
    }

    _hideForm()
    {
        this._form?.destroy()
        this._form    = null
        this._editing = null

        if (this._formWrap)
        {
            clear(this._formWrap)
            this._formWrap.classList.add('wb_ile_form--hidden')
        }
        if (this._listEl) this._listEl.style.display = ''
    }

    async _handleSubmit(data)
    {
        try
        {
            if (this._editing)
                await this._onUpdate?.(this._editing.id, data)
            else
                await this._onAdd?.(data)
        }
        catch (err)
        {
            console.error('[InlineListEditor] submit error', err)
        }
    }

    _confirmDelete(item)
    {
        if (!confirm('Supprimer cet élément ?')) return
        this._onDelete?.(item.id)
            ?.catch(err => console.error('[InlineListEditor] delete error', err))
    }
}

export default InlineListEditor
