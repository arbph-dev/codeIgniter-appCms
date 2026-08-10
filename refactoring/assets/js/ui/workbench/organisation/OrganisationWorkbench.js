// assets/js/ui/workbench/organisation/OrganisationWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// 2 zones : list (left) + detail (center, TabSystem intégré dans OrgDetailPanel)
//
// Dialogs :
//   dialog_adresse — RelationPickerDialog pour adresse_id
//                    (fetchAdresseLike → suggest AdresseModel)
//
// onSave(id, data) — id=null création, id>0 mise à jour partielle
//   Le Workbench fait toujours saveOrg({ id, ...data }) — le backend
//   n'applique que les allowedFields présents dans data.
//
// Pagination via onPage(fn) — cohérent avec le contrat callback panels.
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase          from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }      from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor }   from '/assets/js/ui/workbench/core/LayoutDescriptor.js'
import { RelationPickerDialog } from '/assets/js/ui/shared/RelationPickerDialog.js'

import OrgListPanel           from './OrgListPanel.js'
import OrgDetailPanel         from './OrgDetailPanel.js'

import { fetchOrg, saveOrg, deleteOrg } from '/assets/js/features/organisation/organisation.service.js'
import { fetchAdresseLike }             from '/assets/js/features/adresse/adresse.service.js'

// ── Layout 2 zones ────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_org_layout',
    zones : [
        { name: 'left',   css: 'wb_org_left'   },
        { name: 'center', css: 'wb_org_center'  },
    ],
})

// ── Workbench ─────────────────────────────────────────────────────────────────

export class OrganisationWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Organisation Workbench', ...config })

        this._q      = ''
        this._typeId = null
        this._page   = 1

        this._view        = null
        this.listPanel    = null
        this.detailPanel  = null

        this._adressePicker = null
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    async bootstrap()
    {
        this._createDialogs()

        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()
        this._createPanels()
        this._bindEvents()
        this.load()
    }

    // ── Dialogs ───────────────────────────────────────────────────────────────

    _createDialogs()
    {
        // AdressePickerDialog — RelationPickerDialog configuré pour les adresses
        // fetchAdresseLike retourne { id, voienom, voienumero, voietype_nom,
        //                             cp_codepostal, cp_commune } (suggest AdresseModel)
        this._adressePicker = new RelationPickerDialog({
            id        : 'dialog_adresse',
            title     : 'Sélectionner une adresse',
            fetchFn   : (q) => fetchAdresseLike({ q, len: 20 }),
            columns   : [
                { key: 'voienom',    label: 'Voie'    },
                { key: 'cp_commune', label: 'Commune' },
            ],
            minLength : 2,
        }).render()
    }

    // ── Panels ────────────────────────────────────────────────────────────────

    _createPanels()
    {
        this.listPanel   = new OrgListPanel()
        this.detailPanel = new OrgDetailPanel()

        this._view.mountPanels({
            left   : this.listPanel,
            center : this.detailPanel,
        })
    }

    // ── Événements ────────────────────────────────────────────────────────────

    _bindEvents()
    {
        // Recherche
        this.listPanel.onSearch(q =>
        {
            this._q    = q
            this._page = 1
            this.detailPanel.clear()
            this.load()
        })

        // Sélection
        this.listPanel.onSelect(org =>
        {
            this.detailPanel.show(org)
        })

        // Nouveau
        this.listPanel.onNew(() => this.detailPanel.showNew())

        // Pagination — callback pur (pas de bus local)
        this.listPanel.onPage(page =>
        {
            this._page = page
            this.load()
        })

        // Sauvegarde
        this.detailPanel.onSave(async (id, data) =>
        {
            this.detailPanel.lock()
            try
            {
                const result = await saveOrg({ id, ...data })

                if (!id) this._page = 1

                await this.load()

                const saved = result.data ?? null
                if (saved)
                {
                    this.detailPanel.show(saved)
                }
                else
                {
                    this.detailPanel.showFeedback('success', 'Enregistré.')
                }
            }
            catch (err)
            {
                const msg = err.message.includes('422')
                    ? 'Données invalides — vérifiez les champs obligatoires.'
                    : err.message
                this.detailPanel.showFeedback('error', msg)
            }
            finally
            {
                this.detailPanel.unlock()
            }
        })

        // Suppression
        this.detailPanel.onDelete(async (id) =>
        {
            this.detailPanel.lock()
            try
            {
                await deleteOrg(id)
                this.detailPanel.clear()
                this._page = 1
                await this.load()
            }
            catch (err)
            {
                this.detailPanel.showFeedback('error', err.message)
            }
            finally
            {
                this.detailPanel.unlock()
            }
        })
    }

    // ── Chargement ────────────────────────────────────────────────────────────

    async load()
    {
        this.listPanel.showLoading()
        try
        {
            const result = await fetchOrg({
                q       : this._q      || undefined,
                typeId  : this._typeId || undefined,
                page    : this._page,
                perPage : 20,
            })

            const items = Array.isArray(result.data)
                ? result.data
                : (result.data ? [result.data] : [])

            this.listPanel.show(items, result.pager ?? null)
        }
        catch (err)
        {
            this.listPanel.showError(err.message)
            console.error('[OrganisationWorkbench] load error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this._adressePicker?.destroy()
        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null
        super.destroy()
    }
}

export default OrganisationWorkbench
