// assets/js/ui/workbench/personne/PersonneDetailPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Deux modes :
//   CREATE → Form unique (PersonneInfoPropertySet)
//   EDIT   → TabSystem 4 onglets
//              "Identité"  → Form(PersonneInfoPropertySet)
//              "Alias"     → InlineListEditor(PersonneAliasPropertySet)
//              "Parcours"  → InlineListEditor(buildParcoursPropertySet)
//              "Relations" → RelationTab
//
// Actions globales (hors tabs, mode EDIT uniquement) :
//   Fusionner → dialog_merge_picker → onMerge(sourceId, targetId)
//   Supprimer → confirmation inline → onDelete(id)
//
// Refresh partiel — sans rebuild du panel ni du TabSystem :
//   refreshAliases(items)   → met à jour _currentAliases + InlineListEditor
//   refreshParcours(items)  → met à jour _currentParcours + InlineListEditor
//   refreshRelations(items) → met à jour _currentRelations + RelationTab
//
//   _currentXxx est lu par l'initFn du TabSystem lors de l'activation tardive
//   d'un onglet → les données sont toujours fraîches même si l'onglet n'était
//   pas actif au moment du refresh.
//
// show() attend : { personne, aliases[], parcours[], relations[] }
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase           from '/assets/js/ui/workbench/core/PanelBase.js'
import { TabSystem }       from '/assets/js/ui/workbench/TabSystem.js'
import { Form }            from '/assets/js/ui/shared/Form.js'
import { InlineListEditor} from '/assets/js/ui/shared/InlineListEditor.js'
import { RelationTab }     from '/assets/js/ui/workbench/personne/RelationTab.js'
import { create, clear, btn } from '/assets/js/core/domhelper.js'
import { toolbar }         from '/assets/js/ui/shared/templates/toolbar.template.js'
import { bus }             from '/assets/js/core/eventBus.js'
import {
    PersonneInfoPropertySet,
    PersonneAliasPropertySet,
    buildParcoursPropertySet,
} from '/assets/js/features/personne/personne.properties.js'

export class PersonneDetailPanel extends PanelBase
{
    /**
     * @param {object}   [config]
     * @param {object[]} [config.parcoursTypes]  fetchParcoursTypes()
     * @param {object[]} [config.relationTypes]  fetchRelationTypes({ sourceType:'personne' })
     * @param {object}   [config.dialogMap]      { personne: 'dialog_personne_picker',
     *                                             organisation: 'dialog_org_picker' }
     */
    constructor({ parcoursTypes = [], relationTypes = [], dialogMap = {} } = {})
    {
        super()

        this._parcoursTypes = parcoursTypes
        this._relationTypes = relationTypes
        this._dialogMap     = dialogMap

        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null

        // Données courantes — tenues à jour par show() et refreshXxx()
        this._currentData      = null   // { personne, aliases, parcours, relations }
        this._currentPersonne  = null
        this._currentAliases   = []
        this._currentParcours  = []     // résolu avec type_label
        this._currentRelations = []

        this._working = false

        // Composants internes
        this._tabs           = null
        this._formIdentite   = null
        this._aliasEditor    = null
        this._parcoursEditor = null
        this._relationTab    = null
        this._formCreate     = null

        // Callbacks → Workbench
        this._onSaveFn    = null
        this._onDeleteFn  = null
        this._onMergeFn   = null

        this._onAliasAdd    = null
        this._onAliasUpdate = null
        this._onAliasDelete = null

        this._onParcoursAdd    = null
        this._onParcoursUpdate = null
        this._onParcoursDelete = null

        this._onRelationCreate     = null
        this._onRelationDeactivate = null
        this._onRelationDelete     = null
    }

    // ── Cycle de vie ──────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_detail_panel' })

        this._feedbackEl = create('div', {
            class: 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.element.append(toolbar({ title: 'Personne' }), this._feedbackEl, this.bodyEl)
        this.clear()
        return this.element
    }

    // ── Mode édition ──────────────────────────────────────────────────────────

    /**
     * @param {object} data  { personne, aliases[], parcours[], relations[] }
     */
    show(data)
    {
        if (!this.bodyEl) return
        this._destroyAll()
        this._hideFeedback()
        clear(this.bodyEl)

        if (!data?.personne) { this._showEmpty(); return }

        const { personne, aliases = [], parcours = [], relations = [] } = data

        this._currentData      = { personne, aliases, parcours, relations }
        this._currentPersonne  = personne
        this._currentAliases   = aliases
        this._currentParcours  = this._resolveParcours(parcours)
        this._currentRelations = relations

        const tabContainer = create('div', {})
        this.bodyEl.appendChild(tabContainer)

        // ── Composants des onglets ────────────────────────────────────────────

        this._formIdentite = this._makeForm(PersonneInfoPropertySet, 'Enregistrer')

        this._aliasEditor = new InlineListEditor({
            propertySet : PersonneAliasPropertySet,
            columns     : [
                { key: 'alias',        label: 'Alias'     },
                { key: 'alias_type',   label: 'Type'      },
                { key: 'is_principal', label: 'Principal' },
            ],
            onAdd    : async (d)     => this._onAliasAdd?.({ ...d, personne_id: personne.id }),
            onUpdate : async (id, d) => this._onAliasUpdate?.(id, d),
            onDelete : async (id)    => this._onAliasDelete?.(id),
        })

        this._parcoursEditor = new InlineListEditor({
            propertySet : buildParcoursPropertySet(this._parcoursTypes),
            columns     : [
                { key: 'titre',      label: 'Titre'  },
                { key: 'type_label', label: 'Type'   },
                { key: 'date_debut', label: 'Début'  },
                { key: 'date_fin',   label: 'Fin'    },
            ],
            onAdd    : async (d)     => this._onParcoursAdd?.({ ...d, personne_id: personne.id }),
            onUpdate : async (id, d) => this._onParcoursUpdate?.(id, d),
            onDelete : async (id)    => this._onParcoursDelete?.(id),
        })

        this._relationTab = new RelationTab({
            sourceType    : 'personne',
            sourceId      : personne.id,
            relationTypes : this._relationTypes,
            dialogMap     : this._dialogMap,
            onCreate      : async (d)  => this._onRelationCreate?.(d),
            onDeactivate  : async (id) => this._onRelationDeactivate?.(id),
            onDelete      : async (id) => this._onRelationDelete?.(id),
        })

        // ── TabSystem ─────────────────────────────────────────────────────────
        //
        // initFn lit toujours this._currentXxx (pas une closure sur la variable
        // locale) — cohérent avec les refreshXxx() qui mettent à jour this._currentXxx
        // avant que l'onglet soit activé pour la première fois.

        this._tabs = new TabSystem({ cssWrap: 'wb_personne_tabs' })
            .addTab(
                'identite',
                'Identité',
                () => this._formIdentite.render(),
                () => this._formIdentite.fill(this._currentPersonne),
            )
            .addTab(
                'alias',
                'Alias',
                () => this._aliasEditor.render(),
                () => this._aliasEditor.show(this._currentAliases),
            )
            .addTab(
                'parcours',
                'Parcours',
                () => this._parcoursEditor.render(),
                () => this._parcoursEditor.show(this._currentParcours),
            )
            .addTab(
                'relations',
                'Relations',
                () => this._relationTab.render(),
                () => this._relationTab.show(this._currentRelations),
            )
            .render(tabContainer)

        // ── Actions globales ──────────────────────────────────────────────────

        const actions = create('div', { class: 'wb_detail_actions' })
        actions.append(
            btn({
                label   : 'Fusionner',
                icon    : 'fa-compress',
                onClick : () => this._confirmMerge(personne),
            }),
            btn({
                label   : 'Supprimer',
                icon    : 'fa-trash',
                variant : 'danger',
                onClick : () => this._confirmDelete(personne),
            }),
        )
        this.bodyEl.appendChild(actions)
    }

    // ── Mode création ─────────────────────────────────────────────────────────

    showNew()
    {
        if (!this.bodyEl) return
        this._destroyAll()
        this._hideFeedback()
        this._currentData     = null
        this._currentPersonne = null
        clear(this.bodyEl)

        this._formCreate = this._makeForm(PersonneInfoPropertySet, 'Créer')
        this.bodyEl.appendChild(this._formCreate.render())
        this._formCreate.reset()
    }

    // ── Refresh partiel ───────────────────────────────────────────────────────

    refreshAliases(items)
    {
        this._currentAliases = items ?? []
        this._aliasEditor?.show(this._currentAliases)
    }

    refreshParcours(items)
    {
        this._currentParcours = this._resolveParcours(items ?? [])
        this._parcoursEditor?.show(this._currentParcours)
    }

    refreshRelations(items)
    {
        this._currentRelations = items ?? []
        this._relationTab?.show(this._currentRelations)
    }

    // ── Feedback / verrou ─────────────────────────────────────────────────────

    showFeedback(type, msg)
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = msg
        this._feedbackEl.className   = `wb_detail_feedback wb_detail_feedback--${type}`
    }

    lock()   { this._working = true  }
    unlock() { this._working = false }

    clear()
    {
        if (!this.bodyEl) return
        this._destroyAll()
        this._hideFeedback()
        this._currentData     = null
        this._currentPersonne = null
        this._showEmpty()
    }

    destroy()
    {
        this._destroyAll()
        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null
    }

    // ── Callbacks Panel → Workbench ───────────────────────────────────────────

    onSave(fn)   { this._onSaveFn   = fn }
    onDelete(fn) { this._onDeleteFn = fn }
    onMerge(fn)  { this._onMergeFn  = fn }

    onAliasAdd(fn)    { this._onAliasAdd    = fn }
    onAliasUpdate(fn) { this._onAliasUpdate = fn }
    onAliasDelete(fn) { this._onAliasDelete = fn }

    onParcoursAdd(fn)    { this._onParcoursAdd    = fn }
    onParcoursUpdate(fn) { this._onParcoursUpdate = fn }
    onParcoursDelete(fn) { this._onParcoursDelete = fn }

    onRelationCreate(fn)     { this._onRelationCreate     = fn }
    onRelationDeactivate(fn) { this._onRelationDeactivate = fn }
    onRelationDelete(fn)     { this._onRelationDelete     = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    _makeForm(ps, submitLabel)
    {
        return new Form({
            propertySet : ps,
            labels      : { submit: submitLabel },
            onSubmit    : (data) =>
            {
                if (this._working) return
                this._onSaveFn?.(this._currentPersonne?.id ?? null, data)
            },
            onCancel    : () =>
            {
                if (this._working) return
                this._currentData ? this.show(this._currentData) : this.clear()
            },
        })
    }

    /** Injecte type_label depuis le référentiel local. */
    _resolveParcours(parcours)
    {
        return parcours.map(p => ({
            ...p,
            type_label : this._parcoursTypes.find(t => t.id === p.type)?.label ?? String(p.type),
        }))
    }

    _confirmDelete(personne)
    {
        this._destroyAll()
        clear(this.bodyEl)

        const zone = create('div', { class: 'wb_detail_confirm' })
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_msg',
            text  : `Supprimer « ${personne.nom_complet ?? personne.nom} » ?`,
        }))

        const btnRow = create('div', { class: 'wb_detail_btn_row' })
        btnRow.append(
            btn({
                label   : 'Confirmer',
                variant : 'danger',
                onClick : () => { if (!this._working) this._onDeleteFn?.(personne.id) },
            }),
            btn({
                label   : 'Annuler',
                onClick : () => this.show(this._currentData),
            }),
        )
        zone.appendChild(btnRow)
        this.bodyEl.appendChild(zone)
    }

    _confirmMerge(personne)
    {
        this._destroyAll()
        clear(this.bodyEl)

        let mergeTargetId = null

        const zone = create('div', { class: 'wb_detail_confirm' })
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_msg',
            text  : `Fusionner « ${personne.nom_complet ?? personne.nom} » dans…`,
        }))
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_sub',
            text  : 'La fiche source sera archivée. L\'opération est irréversible.',
        }))

        // Picker cible
        const targetInput = create('input', {
            type        : 'text',
            class       : 'wb_detail_input wb_relation_display',
            placeholder : 'Sélectionner la personne cible…',
            readonly    : '',
        })

        const mergeHandler = ({ sourceId, item }) =>
        {
            if (sourceId !== 'dialog_merge_picker') return
            mergeTargetId     = item.id
            targetInput.value = item.nom_complet ?? item.nom ?? String(item.id)
        }
        bus.subscribe('dialog:select', mergeHandler)

        const pickerRow = create('div', { class: 'wb_relation_wrapper' })
        pickerRow.append(
            targetInput,
            btn({ icon: 'fa-search', label: '', onClick: () => bus.publish('dialog:show', 'dialog_merge_picker') }),
        )
        zone.appendChild(pickerRow)

        const btnRow = create('div', { class: 'wb_detail_btn_row' })
        btnRow.append(
            btn({
                label   : 'Fusionner',
                variant : 'danger',
                onClick : () =>
                {
                    if (!mergeTargetId || this._working) return
                    bus.unsubscribe('dialog:select', mergeHandler)
                    this._onMergeFn?.(personne.id, mergeTargetId)
                },
            }),
            btn({
                label   : 'Annuler',
                onClick : () =>
                {
                    bus.unsubscribe('dialog:select', mergeHandler)
                    this.show(this._currentData)
                },
            }),
        )
        zone.appendChild(btnRow)
        this.bodyEl.appendChild(zone)
    }

    _showEmpty()
    {
        if (!this.bodyEl) return
        clear(this.bodyEl)
        this.bodyEl.appendChild(create('p', { class: 'wb-empty', text: 'Sélectionnez une personne.' }))
    }

    _hideFeedback()
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = ''
        this._feedbackEl.className   = 'wb_detail_feedback wb_detail_feedback--hidden'
    }

    _destroyAll()
    {
        this._tabs?.destroy();           this._tabs           = null
        this._formIdentite?.destroy();   this._formIdentite   = null
        this._aliasEditor?.destroy();    this._aliasEditor    = null
        this._parcoursEditor?.destroy(); this._parcoursEditor = null
        this._relationTab?.destroy();    this._relationTab    = null
        this._formCreate?.destroy();     this._formCreate     = null
    }
}

export default PersonneDetailPanel
