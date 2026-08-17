// assets/js/ui/workbench/adresse/AdresseWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// 3 zones : list (left) / detail (center) / map (right).
//
// Spécificité vs ImageWorkbench :
//   • initLeaflet() appelé en bootstrap() — enregistre les bus subscriptions
//     une seule fois (guard _initialized dans leaflet.js)
//   • mapPanel synchronisé sur chaque sélection + après chaque save
//   • saveAdresse reçoit { adr_id, ...data } — JSON pur, pas de FormData
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase       from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }   from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor} from '/assets/js/ui/workbench/core/LayoutDescriptor.js'

import AdresseListPanel    from './AdresseListPanel.js'
import AdresseDetailPanel  from './AdresseDetailPanel.js'
import MapPanel            from './MapPanel.js'

import { initLeaflet }        from '/assets/js/components/leaflet.js'
import { RelationPickerDialog } from '/assets/js/ui/shared/RelationPickerDialog.js'

import {
    fetchAdresse,
    saveAdresse,
    deleteAdresse,
} from '/assets/js/features/adresse/adresse.service.js'

import { fetchCpLike } from '/assets/js/features/codepostal/codepostal.service.js'
import { fetchTvLike } from '/assets/js/features/typevoie/typevoie.service.js'

// ── Layout ────────────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_adresse_layout',
    zones : [
        { name: 'left',   css: 'wb_adresse_left'   },
        { name: 'center', css: 'wb_adresse_center'  },
        { name: 'right',  css: 'wb_adresse_right'   },
    ],
})

// ── Workbench ─────────────────────────────────────────────────────────────────

export class AdresseWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Adresse Workbench', ...config })

        this._q        = ''
        this._page     = 1
        //this._onPageFn = null

        this._view         = null
        this.listPanel     = null
        this.detailPanel   = null
        this.mapPanel      = null

        this._cpPicker     = null   // RelationPickerDialog CodePostal
        this._tvPicker     = null   // RelationPickerDialog TypeVoie
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    async bootstrap()
    {
        // 1. Leaflet — guard _initialized empêche le double abonnement
        initLeaflet()

        // 2. Dialogs relation — insérés dans body avant le montage des panels
        //    (Form.js publie dialog:show dès que render() est appelé)
        this._createDialogs()

        // 3. Layout + panels + events + premier chargement
        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()
        this._createPanels()
        this._bindEvents()
        this.load()
    }

    // ── Dialogs relation ──────────────────────────────────────────────────────

    _createDialogs()
    {
        // CodePostal — référentiel, minLength 2 (35 000+ communes)
        this._cpPicker = new RelationPickerDialog({
            id        : 'dialog_cp',
            title     : 'Code postal',
            fetchFn   : (q) => fetchCpLike({ q, len: 20 }),
            columns   : [
                { key: 'codepostal', label: 'CP'      },
                { key: 'commune',    label: 'Commune'  },
            ],
            minLength : 2,
        }).render()

        // TypeVoie — liste courte, minLength 1
        this._tvPicker = new RelationPickerDialog({
            id        : 'dialog_tv',
            title     : 'Type de voie',
            fetchFn   : (q) => fetchTvLike({ q, len: 20 }),
            columns   : [
                { key: 'nom', label: 'Type de voie' },
            ],
            minLength : 1,
        }).render()
    }

    // ── Panels ────────────────────────────────────────────────────────────────

    _createPanels()
    {
        this.listPanel   = new AdresseListPanel()
        this.detailPanel = new AdresseDetailPanel()
        this.mapPanel    = new MapPanel()

        this._view.mountPanels({
            left   : this.listPanel,
            center : this.detailPanel,
            right  : this.mapPanel,
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
            this.mapPanel.clear()
            this.load()
        })

        // Sélection → détail + carte synchronisés
        this.listPanel.onSelect(adresse =>
        {
            this.detailPanel.show(adresse)
            this.mapPanel.show(adresse)
        })

        // Nouveau → efface carte, ouvre formulaire
        this.listPanel.onNew(() =>
        {
            this.mapPanel.clear()
            this.detailPanel.showNew()
        })
        
        // Pagination — callback (ListPanelBase / D02)
        this.listPanel.onPage(page =>
        {
            this._page = page
            this.load()
        })

        // Sauvegarde — JSON pur (pas de FormData pour Adresse)
        this.detailPanel.onSave(async ( id, data) =>
        {
            this.detailPanel.lock()
            try
            {
                const result = await saveAdresse({ id, ...data })

                if (!id) this._page = 1

                await this.load()

                // Si l'API retourne la ressource complète (avec lat/lng éventuels)
                const saved = result.data ?? null
                if (saved)
                {
                    this.detailPanel.show(saved)
                    this.mapPanel.show(saved)  // pans sur les coords géocodées si présentes
                }
                else
                {
                    this.detailPanel.showFeedback('success', 'Enregistré.')
                }
            }
            catch (err)
            {
                const msg = err.message.includes('422')
                    ? 'Adresse invalide ou déjà existante.'
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
                await deleteAdresse(id)
                this.detailPanel.clear()
                this.mapPanel.clear()
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
            const result = await fetchAdresse({
                q       : this._q || undefined,
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
            console.error('[AdresseWorkbench] load error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {

        this._cpPicker?.destroy()   // retire dialog_cp du DOM
        this._tvPicker?.destroy()   // retire dialog_tv du DOM

        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this.mapPanel?.destroy()    // publie leaflet:destroy

        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null

        super.destroy()
    }
}

export default AdresseWorkbench
