// assets/js/ui/workbench/imagetagger/ImageTaggerWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// Orchestre : ImageTaggerListPanel / TaggerPanel / ImagePreviewPanel
//
// Pattern mises à jour optimistes :
//   attach → taggerPanel.addMot (immédiat) → API → succès: badge++
//                                                 → erreur: taggerPanel.removeMot + feedback
//   detach → taggerPanel.removeMot (immédiat) → API → succès: badge--
//                                                    → erreur: taggerPanel.addMot + feedback
//
// Pas de dialogs — l'autocomplete inline du TaggerPanel suffit.
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase         from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }     from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor }  from '/assets/js/ui/workbench/core/LayoutDescriptor.js'

import ImageTaggerListPanel  from './ImageTaggerListPanel.js'
import TaggerPanel           from './TaggerPanel.js'
import ImagePreviewPanel     from '/assets/js/ui/workbench/image/ImagePreviewPanel.js'

import { fetchImage }                    from '/assets/js/features/image/image.service.js'
import { fetchImageMots, attachMot, detachMot } from '/assets/js/features/image/imagemot.service.js'
import { fetchMotBatch }                 from '/assets/js/features/mot/mot.service.js'

// ── Layout ────────────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_tagger_layout',
    zones : [
        { name: 'left',   css: 'wb_tagger_left'   },
        { name: 'center', css: 'wb_tagger_center'  },
        { name: 'right',  css: 'wb_tagger_right'   },
    ],
})

// ── Workbench ─────────────────────────────────────────────────────────────────

export class ImageTaggerWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Image Tagger', ...config })

        this._q         = ''
        this._status    = ''
        this._page      = 1
        this._onPageFn  = null

        this._view         = null
        this.listPanel     = null
        this.taggerPanel   = null
        this.previewPanel  = null
    }

    async bootstrap()
    {
        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()
        this._createPanels()
        this._bindEvents()
        this.load()
    }

    // ── Panels ────────────────────────────────────────────────────────────────

    _createPanels()
    {
        this.listPanel    = new ImageTaggerListPanel()
        this.taggerPanel  = new TaggerPanel()
        this.previewPanel = new ImagePreviewPanel()

        this._view.mountPanels({
            left   : this.listPanel,
            center : this.taggerPanel,
            right  : this.previewPanel,
        })
    }

    // ── Événements ────────────────────────────────────────────────────────────

    _bindEvents()
    {
        // Recherche + filtre statut
        this.listPanel.onSearch(({ q, status }) =>
        {
            this._q      = q
            this._status = status
            this._page   = 1
            this.taggerPanel.clear()
            this.previewPanel.clear()
            this.load()
        })

        // Sélection d'une image
        this.listPanel.onSelect(async (image) =>
        {
            this.previewPanel.show(image)
            this.taggerPanel.clear()

            try
            {
                // Utilise mot_ids si disponibles (include=mot_ids) → batch
                // Sinon fallback sur fetchImageMots (GET /api/image/:id/mots)
                let mots = []

                if (Array.isArray(image.mot_ids))
                {
                    mots = image.mot_ids.length > 0
                        ? await fetchMotBatch(image.mot_ids)
                        : []
                }
                else
                {
                    mots = await fetchImageMots(image.id)
                }

                this.taggerPanel.show(image, mots)
            }
            catch (err)
            {
                this.taggerPanel.showFeedback('error', err.message)
            }
        })

        // Attach — optimiste dans TaggerPanel, confirmation ici
        this.taggerPanel.onAttach(async (imageId, motId, motObj) =>
        {
            try
            {
                await attachMot(imageId, motId)
                // Chip déjà ajouté optimistiquement — on met à jour le badge
                this.listPanel.updateMotCount(imageId, this.taggerPanel.getMotCount())
            }
            catch (err)
            {
                // Revert du chip optimiste
                this.taggerPanel.removeMot(motId)
                this.taggerPanel.showFeedback('error', err.message)
            }
        })

        // Detach — optimiste dans TaggerPanel, confirmation ici
        this.taggerPanel.onDetach(async (imageId, motId, motObj) =>
        {
            try
            {
                await detachMot(imageId, motId)
                // Chip déjà retiré optimistiquement — on met à jour le badge
                this.listPanel.updateMotCount(imageId, this.taggerPanel.getMotCount())
            }
            catch (err)
            {
                // Revert : re-ajoute le chip
                this.taggerPanel.addMot(motObj)
                this.taggerPanel.showFeedback('error', err.message)
            }
        })

        // Pagination — bus (pattern commun)
        this._onPageFn = (page) => { this._page = page; this.load() }
        this.bus.subscribe('wb:tagger:page', this._onPageFn)
    }

    // ── Chargement ────────────────────────────────────────────────────────────

    async load()
    {
        this.listPanel.showLoading()
        try
        {
            const result = await fetchImage({
                q       : this._q      || undefined,
                status  : this._status || undefined,
                include : 'mot_ids',   // badge count sans charger les labels
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
            console.error('[ImageTaggerWorkbench] load error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this.bus.unsubscribe('wb:tagger:page', this._onPageFn)
        this._onPageFn = null

        this.listPanel?.destroy()
        this.taggerPanel?.destroy()
        this.previewPanel?.destroy()

        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null

        super.destroy()
    }
}

export default ImageTaggerWorkbench
