// assets/js/ui/workbench/personne/RelationTab.js
// ─────────────────────────────────────────────────────────────────────────────
// Onglet Relations — réutilisable pour PersonneDetailPanel et OrgDetailPanel.
//
// Pourquoi pas Form.js ici :
//   Le champ target_id est un picker dont le dialogId dépend du target_type
//   du RelationType sélectionné, connu uniquement au runtime. Cette dépendance
//   dynamique inter-champs sort du périmètre de Form.js — le form est donc
//   construit manuellement.
//
// Différences vs InlineListEditor :
//   • form de création construit manuellement
//   • target_type dérivé du RelationType sélectionné, jamais saisi par l'user
//   • action deactivate (soft) en plus de delete (physique)
//
// Paramètres :
//   sourceType    {string}    'personne' | 'organisation'
//   sourceId      {number}    id de l'entité source
//   relationTypes {object[]}  types filtrés par source_type (pré-chargés)
//   dialogMap     {object}    { personne:'dialog_personne_picker',
//                               organisation:'dialog_org_picker' }
//   onCreate      {Function}  async (data) => void
//   onDeactivate  {Function}  async (id)   => void
//   onDelete      {Function}  async (id)   => void
// ─────────────────────────────────────────────────────────────────────────────

import { create, clear, notice, btn } from '/assets/js/core/domhelper.js'
import { bus }                        from '/assets/js/core/eventBus.js'

export class RelationTab
{
    constructor({
        sourceType    = 'personne',
        sourceId      = null,
        relationTypes = [],
        dialogMap     = {},
        onCreate      = null,
        onDeactivate  = null,
        onDelete      = null,
    } = {})
    {
        this._sourceType    = sourceType
        this._sourceId      = sourceId
        this._relationTypes = relationTypes
        this._dialogMap     = dialogMap
        this._onCreate      = onCreate
        this._onDeactivate  = onDeactivate
        this._onDelete      = onDelete

        /** Items courants — mis à jour par show(), cohérent avec InlineListEditor. */
        this._items = []

        this.element   = null
        this._listEl   = null
        this._formWrap = null

        // État form de création
        this._selectedTypeId  = relationTypes[0]?.id ?? null
        this._targetId        = null
        this._targetDisplayEl = null
        this._dateDebutEl     = null
        this._dateFinEl       = null
        this._commentaireEl   = null

        this._busHandler = null
    }

    // ── Cycle de vie ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('div', { class: 'wb_rel_tab' })

        const toolbarEl = create('div', { class: 'wb_ile_toolbar' })
        toolbarEl.appendChild(btn({
            label   : 'Nouvelle relation',
            icon    : 'fa-plus',
            variant : 'primary',
            onClick : () => this._showForm(),
        }))
        this.element.appendChild(toolbarEl)

        this._listEl = create('div', { class: 'wb_rel_list' })
        this.element.appendChild(this._listEl)

        this._formWrap = create('div', { class: 'wb_ile_form wb_ile_form--hidden' })
        this.element.appendChild(this._formWrap)

        // Écoute les sélections de n'importe quel picker de cible
        this._busHandler = ({ sourceId, item }) =>
        {
            if (!Object.values(this._dialogMap).includes(sourceId)) return
            this._targetId = item.id
            if (this._targetDisplayEl)
                this._targetDisplayEl.value = item.nom_complet ?? item.nom ?? String(item.id)
        }
        bus.subscribe('dialog:select', this._busHandler)

        // Rendre les items déjà stockés
        this._renderList()

        return this.element
    }

    show(items)
    {
        this._items = items ?? []
        if (!this._listEl) return
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
        if (this._busHandler)
        {
            bus.unsubscribe('dialog:select', this._busHandler)
            this._busHandler = null
        }
        this.element   = null
        this._listEl   = null
        this._formWrap = null
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

        const thead = document.createElement('thead')
        const trH   = document.createElement('tr')
        ;['Type', 'Cible', 'Début', 'Fin', 'Statut', ''].forEach(lbl =>
        {
            const th = document.createElement('th')
            th.textContent = lbl
            trH.appendChild(th)
        })
        thead.appendChild(trH)
        t.appendChild(thead)

        const tbody = document.createElement('tbody')
        this._items.forEach(({ relation, relation_type }) =>
        {
            const tr = document.createElement('tr')

            ;[
                relation_type?.label ?? '—',
                `${relation.target_type} #${relation.target_id}`,
                relation.date_debut ?? '—',
                relation.date_fin   ?? '—',
                relation.actif ? '✓' : '✗',
            ].forEach(text =>
            {
                const td = document.createElement('td')
                td.textContent = text
                tr.appendChild(td)
            })

            const tdAct = document.createElement('td')
            tdAct.className = 'wb_ile_actions'

            // Désactivation douce — prioritaire sur la suppression physique
            if (relation.actif)
            {
                tdAct.appendChild(btn({
                    label   : 'Désactiver',
                    icon    : 'fa-ban',
                    onClick : () => this._onDeactivate?.(relation.id)
                        ?.catch(err => console.error('[RelationTab] deactivate error', err)),
                }))
            }

            tdAct.appendChild(btn({
                icon    : 'fa-trash',
                label   : '',
                variant : 'danger',
                onClick : () => this._confirmDelete(relation.id),
            }))

            tr.appendChild(tdAct)
            tbody.appendChild(tr)
        })

        t.appendChild(tbody)
        this._listEl.appendChild(t)
    }

    // ── Form de création ──────────────────────────────────────────────────────

    _showForm()
    {
        if (!this._formWrap) return
        clear(this._formWrap)

        this._targetId        = null
        this._targetDisplayEl = null
        this._dateDebutEl     = null
        this._dateFinEl       = null
        this._commentaireEl   = null

        const form = create('div', { class: 'wb_form' })

        form.appendChild(this._buildTypeSelect())
        form.appendChild(this._buildTargetField())
        form.appendChild(this._buildDateField('_dateDebutEl',   'Début'))
        form.appendChild(this._buildDateField('_dateFinEl',     'Fin'))
        form.appendChild(this._buildTextField('_commentaireEl', 'Commentaire'))

        const btnRow = create('div', { class: 'wb_detail_btn_row' })
        btnRow.append(
            btn({ label: 'Enregistrer', variant: 'primary', onClick: () => this._handleCreate() }),
            btn({ label: 'Annuler',                         onClick: () => this._hideForm()     }),
        )
        form.appendChild(btnRow)

        this._formWrap.appendChild(form)
        this._listEl.style.display = 'none'
        this._formWrap.classList.remove('wb_ile_form--hidden')
    }

    _buildTypeSelect()
    {
        const wrap   = create('div',    { class: 'wb_form_field' })
        const label  = create('label',  { class: 'wb_detail_label', for: 'rt_type', text: 'Type de relation' })
        const select = create('select', { id: 'rt_type', class: 'wb_detail_input' })

        this._relationTypes.forEach(rt =>
        {
            const opt = document.createElement('option')
            opt.value       = String(rt.id)
            opt.textContent = rt.label
            select.appendChild(opt)
        })

        if (this._selectedTypeId) select.value = String(this._selectedTypeId)

        select.addEventListener('change', () =>
        {
            this._selectedTypeId = parseInt(select.value, 10) || null
            // Réinitialise la cible si target_type change avec le type
            this._targetId = null
            if (this._targetDisplayEl) this._targetDisplayEl.value = ''
        })

        wrap.append(label, select)
        return wrap
    }

    _buildTargetField()
    {
        const wrap  = create('div',   { class: 'wb_form_field' })
        const label = create('label', { class: 'wb_detail_label', text: 'Entité liée' })

        this._targetDisplayEl = create('input', {
            type        : 'text',
            class       : 'wb_detail_input wb_relation_display',
            placeholder : 'Sélectionner…',
            readonly    : '',
        })

        const pickerBtn = btn({
            icon    : 'fa-search',
            label   : '',
            onClick : () =>
            {
                const targetType = this._currentTargetType()
                if (!targetType) return
                const dialogId = this._dialogMap[targetType]
                if (!dialogId)
                {
                    console.warn(`[RelationTab] Pas de dialog pour target_type="${targetType}"`)
                    return
                }
                bus.publish('dialog:show', dialogId)
            },
        })

        const row = create('div', { class: 'wb_relation_wrapper' })
        row.append(this._targetDisplayEl, pickerBtn)
        wrap.append(label, row)
        return wrap
    }

    _buildDateField(prop, labelText)
    {
        const wrap  = create('div',   { class: 'wb_form_field' })
        const label = create('label', { class: 'wb_detail_label', text: labelText })
        const input = create('input', { type: 'date', class: 'wb_detail_input' })
        this[prop]  = input
        wrap.append(label, input)
        return wrap
    }

    _buildTextField(prop, labelText)
    {
        const wrap  = create('div',   { class: 'wb_form_field' })
        const label = create('label', { class: 'wb_detail_label', text: labelText })
        const input = create('input', { type: 'text', class: 'wb_detail_input' })
        this[prop]  = input
        wrap.append(label, input)
        return wrap
    }

    _hideForm()
    {
        this._targetId        = null
        this._targetDisplayEl = null
        this._dateDebutEl     = null
        this._dateFinEl       = null
        this._commentaireEl   = null

        if (this._formWrap)
        {
            clear(this._formWrap)
            this._formWrap.classList.add('wb_ile_form--hidden')
        }
        if (this._listEl) this._listEl.style.display = ''
    }

    // ── Logique métier ────────────────────────────────────────────────────────

    _currentTargetType()
    {
        if (!this._selectedTypeId) return null
        return this._relationTypes.find(t => t.id === this._selectedTypeId)?.target_type ?? null
    }

    async _handleCreate()
    {
        if (!this._selectedTypeId)
        {
            alert('Veuillez sélectionner un type de relation.')
            return
        }
        if (!this._targetId)
        {
            alert('Veuillez sélectionner une entité cible.')
            return
        }

        const targetType = this._currentTargetType()
        if (!targetType) return

        const data = {
            relation_type_id : this._selectedTypeId,
            source_type      : this._sourceType,
            source_id        : this._sourceId,
            target_type      : targetType,
            target_id        : this._targetId,
            date_debut       : this._dateDebutEl?.value    || null,
            date_fin         : this._dateFinEl?.value      || null,
            commentaire      : this._commentaireEl?.value  || null,
        }

        try
        {
            await this._onCreate?.(data)
        }
        catch (err)
        {
            console.error('[RelationTab] create error', err)
        }
    }

    _confirmDelete(id)
    {
        if (!confirm('Supprimer définitivement cette relation ?')) return
        this._onDelete?.(id)
            ?.catch(err => console.error('[RelationTab] delete error', err))
    }
}

export default RelationTab
