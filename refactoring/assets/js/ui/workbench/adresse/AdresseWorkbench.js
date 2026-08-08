// assets/js/ui/workbench/adresse/AdresseWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// 3 zones : list (left) / detail (center) / map (right).
//
// Spécificité vs ImageWorkbench :
//   • initLeaflet() appelé en bootstrap() — enregistre les bus subscriptions
//     une seule fois (guard _initialized dans leaflet.js)
//   • mapPanel synchronisé sur chaque sélection + après chaque save
//   • saveAdresse reçoit { id, ...data } — JSON pur
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase       from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }   from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor } from '/assets/js/ui/workbench/core/LayoutDescriptor.js'

import AdresseListPanel    from './AdresseListPanel.js'
import AdresseDetailPanel  from './AdresseDetailPanel.js'
import MapPanel            from './MapPanel.js'

import { initLeaflet }     from '/assets/js/components/leaflet.js'

import {
    fetchAdresse,
    saveAdresse,
    deleteAdresse,
} from '/assets/js/features/adresse/adresse.service.js'

// ── Layout ────────────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_adresse_layout',
    zones : [
        { name: 'left',   css: 'wb_adresse_left'    },
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
        this._onPageFn = null

        this._view       = null
        this.listPanel   = null
        this.detailPanel = null
        this.mapPanel    = null
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    async bootstrap()
    {
        // Leaflet bus subscriptions — guard _initialized empêche le double abonnement
        initLeaflet()

        this._view = new WorkbenchView(
            LAYOUT,
            this.getElement('.wb-content')
        )

        this._view.build()
        this._createPanels()
        this._bindEvents()
        this.load()
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

    // ── Événements ───────────────────────────────────────────────────────────

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

        // Sauvegarde — JSON pur
        this.detailPanel.onSave(async (id, data) =>
        {
            this.detailPanel.lock()

            try
            {
                const result = await saveAdresse({
                    id,
                    ...data,
                })

                if (!id)
                    this._page = 1

                await this.load()

                // L'API retourne idéalement la ressource complète,
                // notamment les coordonnées géocodées.
                const saved = result.data ?? null

                if (saved)
                {
                    this.detailPanel.show(saved)
                    this.mapPanel.show(saved)
                }
                else
                {
                    this.detailPanel.showFeedback(
                        'success',
                        'Enregistré.'
                    )
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
        this.detailPanel.onDelete(async id =>
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

        // Pagination
        this._onPageFn = page =>
        {
            this._page = page
            this.load()
        }

        this.bus.subscribe('wb:adresse:page', this._onPageFn)
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

            this.listPanel.show(
                items,
                result.pager ?? null
            )
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
        this.bus.unsubscribe(
            'wb:adresse:page',
            this._onPageFn
        )

        this._onPageFn = null

        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this.mapPanel?.destroy()

        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null

        super.destroy()
    }
}

export default AdresseWorkbench
