// assets/js/ui/workbench/organisation/OrgDetailPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Deux modes :
//   CREATE → Form unique (OrgInfoPropertySet) — nom + type suffisent
//   EDIT   → TabSystem 3 onglets
//              "Informations" → Form(OrgInfoPS)     renderFn + initFn fill()
//              "Contacts"     → Form(OrgContactPS)  renderFn + initFn fill()
//              "Adresse"      → Form(OrgAdressePS)  renderFn + initFn fill()
//
// onSave(fn) : fn(id, data)
//   id   = null → création
//   id   > 0   → mise à jour partielle (seulement les champs du tab actif)
//
// TabSystem.onTabChange() n'est pas nécessaire ici (toutes les données
// sont déjà dans `org`, pas de fetch lazy par onglet).
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase   from '/assets/js/ui/workbench/core/PanelBase.js'
import { TabSystem } from '/assets/js/ui/workbench/TabSystem.js'
import { Form }    from '/assets/js/ui/shared/Form.js'
import { create, clear, detail } from '/assets/js/core/domhelper.js'
import { toolbar } from '/assets/js/ui/shared/templates/toolbar.template.js'
import {
    OrgInfoPropertySet,
    OrgContactPropertySet,
    OrgAdressePropertySet,
    OrgComputePropertySet,
} from '/assets/js/features/organisation/organisation.properties.js'

export class OrgDetailPanel extends PanelBase
{
    constructor(config = {})
    {
        super()
        this.element       = null
        this.bodyEl        = null
        this._feedbackEl   = null

        this._currentOrg   = null
        this._working      = false

        this._tabs         = null   // TabSystem instance (edit mode)
        this._formInfos    = null
        this._formContacts = null
        this._formAdresse  = null
        this._formCreate   = null  // form simple (create mode)

        this._onSaveFn     = null
        this._onDeleteFn   = null
    }

    // ── Rendu ─────────────────────────────────────────────────────────────────

    render()
    {
        this.element = create('section', { class: 'wb_mot_detail_panel' })

        const header = toolbar({ title: 'Organisation' })

        this._feedbackEl = create('div', {
            class : 'wb_detail_feedback wb_detail_feedback--hidden',
        })

        this.bodyEl = create('div', { class: 'wb_panel_body' })

        this.element.append(header, this._feedbackEl, this.bodyEl)
        this.clear()
        return this.element
    }

    // ── show() — mode édition avec TabSystem ──────────────────────────────────

    show(org)
    {
        if (!this.bodyEl) return
        this._destroyForms()
        this._hideFeedback()
        clear(this.bodyEl)

        if (!org) { this._showEmpty(); return }

        this._currentOrg = { ...org }

        const tabContainer = create('div', {})
        this.bodyEl.appendChild(tabContainer)

        // Instanciation des Forms (pas encore render())
        this._formInfos    = this._makeForm(OrgInfoPropertySet,    org, 'Enregistrer')
        this._formContacts = this._makeForm(OrgContactPropertySet, org, 'Enregistrer')
        this._formAdresse  = this._makeForm(OrgAdressePropertySet, org, 'Lier')

        this._tabs = new TabSystem({ cssWrap: 'wb_org_tabs' })
            .addTab(
                'infos',
                'Informations',
                () => this._formInfos.render(),
                () => this._formInfos.fill(org)
            )
            .addTab(
                'contacts',
                'Contacts',
                () => this._formContacts.render(),
                () => this._formContacts.fill(org)
            )
            .addTab(
                'adresse',
                'Adresse',
                () => this._formAdresse.render(),
                () => this._formAdresse.fill(org)
            )
            .render(tabContainer)

        // Actions globales (Supprimer)
        const actions = create('div', { class: 'wb_detail_actions' })
        const delBtn  = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Supprimer' })
        delBtn.addEventListener('click', () => this._confirmDelete(org))
        actions.appendChild(delBtn)
        this.bodyEl.appendChild(actions)
    }

    // ── showNew() — mode création ─────────────────────────────────────────────

    showNew()
    {
        if (!this.bodyEl) return
        this._destroyForms()
        this._hideFeedback()
        this._currentOrg = null
        clear(this.bodyEl)

        this._formCreate = this._makeForm(OrgInfoPropertySet, null, 'Créer', 'create')
        this.bodyEl.appendChild(this._formCreate.render())
        this._formCreate.reset()
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
        this._destroyForms()
        this._hideFeedback()
        this._currentOrg = null
        this._showEmpty()
    }

    destroy()
    {
        this._destroyForms()
        this.element     = null
        this.bodyEl      = null
        this._feedbackEl = null
        this._onSaveFn   = null
        this._onDeleteFn = null
    }

    onSave(fn)   { this._onSaveFn   = fn }
    onDelete(fn) { this._onDeleteFn = fn }

    // ── Privées ───────────────────────────────────────────────────────────────

    /**
     * Fabrique un Form avec onSubmit → onSave(id, data) et onCancel → retour.
     * @param {object[]} ps  PropertySet
     * @param {object}   org Organisation courante (null = création)
     * @param {string}   submitLabel
     */
    _makeForm(ps, org, submitLabel = 'Enregistrer')
    {
        return new Form({
            propertySet        : ps,
            computePropertySet : OrgComputePropertySet,
            labels             : { submit: submitLabel },
            onSubmit           : (data) =>
            {
                if (this._working) return
                this._onSaveFn?.(org?.id ?? null, data)
            },
            onCancel           : () =>
            {
                if (this._working) return
                this._currentOrg ? this.show(this._currentOrg) : this.clear()
            },
        })
    }

    _confirmDelete(org)
    {
        this._destroyForms()
        clear(this.bodyEl)

        const zone = create('div', { class: 'wb_detail_confirm' })
        zone.appendChild(create('p', {
            class : 'wb_detail_confirm_msg',
            text  : `Supprimer « ${org.nom} » ?`,
        }))

        const btnRow     = create('div', { class: 'wb_detail_btn_row' })
        const confirmBtn = create('button', { type: 'button', class: 'wb-btn wb-btn--danger', text: 'Confirmer' })
        const cancelBtn  = create('button', { type: 'button', class: 'wb-btn', text: 'Annuler' })

        confirmBtn.addEventListener('click', () => { if (!this._working) this._onDeleteFn?.(org.id) })
        cancelBtn.addEventListener('click',  () => this.show(org))

        btnRow.append(confirmBtn, cancelBtn)
        zone.appendChild(btnRow)
        this.bodyEl.appendChild(zone)
    }

    _showEmpty()
    {
        clear(this.bodyEl)
        this.bodyEl.appendChild(
            create('p', { class: 'wb-empty', text: 'Sélectionnez une organisation.' })
        )
    }

    _hideFeedback()
    {
        if (!this._feedbackEl) return
        this._feedbackEl.textContent = ''
        this._feedbackEl.className   = 'wb_detail_feedback wb_detail_feedback--hidden'
    }

    _destroyForms()
    {
        this._tabs?.destroy();         this._tabs         = null
        this._formInfos?.destroy();    this._formInfos    = null
        this._formContacts?.destroy(); this._formContacts = null
        this._formAdresse?.destroy();  this._formAdresse  = null
        this._formCreate?.destroy();   this._formCreate   = null
    }
}

export default OrgDetailPanel
