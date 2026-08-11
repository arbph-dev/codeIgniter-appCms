// assets/js/ui/workbench/image/ImageWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// Premier Workbench à 3 zones — valide WorkbenchView sans modification du core.
//
// Layout :
//   left   → ImageListPanel   (grille de vignettes)
//   center → ImageDetailPanel (metadata + formulaires)
//   right  → ImagePreviewPanel (grande prévisualisation)
//
// Différences vs MotWorkbench :
//   • LAYOUT 3 zones au lieu de 2
//   • onSave reçoit (id, data) — data = {file?, alt, status}
//   • previewPanel.show() synchronisé avec detailPanel.show()
//   • Filtre _status disponible (extensible via UI)
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase     from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView } from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor } from '/assets/js/ui/workbench/core/LayoutDescriptor.js'

import ImageListPanel    from './ImageListPanel.js'
import ImageDetailPanel  from './ImageDetailPanel.js'
import ImagePreviewPanel from './ImagePreviewPanel.js'

import {
    fetchImage,
    saveImage,
    deleteImage,
} from '/assets/js/features/image/image.service.js'

// ── Layout ────────────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_image_layout',
    zones : [
        { name: 'left',   css: 'wb_image_left'   },
        { name: 'center', css: 'wb_image_center'  },
        { name: 'right',  css: 'wb_image_right'   },
    ],
})

// ── Workbench ─────────────────────────────────────────────────────────────────

export class ImageWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Image Workbench', ...config })

        this._q        = ''
        this._status   = ''
        this._page     = 1
        this._onPageFn = null

        this._view        = null
        this.listPanel    = null
        this.detailPanel  = null
        this.previewPanel = null
    }

    // ── Initialisation ────────────────────────────────────────────────────────

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
        this.listPanel    = new ImageListPanel()
        this.detailPanel  = new ImageDetailPanel()
        this.previewPanel = new ImagePreviewPanel()

        this._view.mountPanels({
            left   : this.listPanel,
            center : this.detailPanel,
            right  : this.previewPanel,
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
            this.previewPanel.clear()
            this.load()
        })

        // Sélection → détail + preview synchronisés
        this.listPanel.onSelect(image =>
        {
            this.detailPanel.show(image)
            this.previewPanel.show(image)
        })

        // Nouveau → efface preview, ouvre formulaire create
        this.listPanel.onNew(() =>
        {
            this.previewPanel.clear()
            this.detailPanel.showNew()
        })

        // Sauvegarde — create (id=null, data contient file) ou update (data sans file)
        this.detailPanel.onSave(async (id, data) =>
        {
            this.detailPanel.lock()
            try
            {
                const result = await saveImage({ id, ...data })

                // Création → retour page 1 pour voir la nouvelle image
                if (!id) this._page = 1

                await this.load()

                // Affiche l'image persistée si l'API retourne la ressource complète
                const saved = result.data ?? null
                if (saved)
                {
                    this.detailPanel.show(saved)
                    this.previewPanel.show(saved)
                }
                else
                {
                    this.detailPanel.showFeedback('success', 'Enregistré.')
                }
            }
            catch (err)
            {
                const msg = err.message.includes('422')
                    ? 'Fichier invalide ou déjà existant.'
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
                await deleteImage(id)
                this.detailPanel.clear()
                this.previewPanel.clear()
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
        this._onPageFn = (page) =>
        {
            this._page = page
            this.load()
        }
        this.bus.subscribe('wb:image:page', this._onPageFn)
    }

    // ── Chargement ────────────────────────────────────────────────────────────

    async load()
    {
        this.listPanel.showLoading()
        try
        {
            const result = await fetchImage({
                q       : this._q    || undefined,
                status  : this._status || undefined,
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
            console.error('[ImageWorkbench] load error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this.bus.unsubscribe('wb:image:page', this._onPageFn)
        this._onPageFn = null

        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this.previewPanel?.destroy()

        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null

        super.destroy()
    }
}

export default ImageWorkbench
