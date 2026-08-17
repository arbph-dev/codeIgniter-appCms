// assets/js/ui/workbench/mot/MotWorkbench.js

import WorkbenchBase  from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import MotListPanel   from './MotListPanel.js'
import MotDetailPanel from './MotDetailPanel.js'
import { fetchMot, saveMot, deleteMot } from '/assets/js/features/mot/mot.service.js'
import { WorkbenchView }    from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor } from '/assets/js/ui/workbench/core/LayoutDescriptor.js'

const LAYOUT = createDescriptor({
    css   : 'wb_mot_layout',
    zones : [
        { name: 'left',  css: 'wb_mot_left'  },
        { name: 'right', css: 'wb_mot_right' },
    ],
})



export class MotWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Mot Workbench', ...config })

        this._q        = ''
        this._page     = 1
        this._onPageFn = null   // stocké pour unsubscribe propre
        this._view     = null
        this.listPanel   = null
        this.detailPanel = null
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    async bootstrap()
    {
        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()
        this.createPanels()
        this.bindEvents()
        this.load()
    }



    // ── Panels ────────────────────────────────────────────────────────────────

    createPanels()
    {
        this.listPanel   = new MotListPanel()
        this.detailPanel = new MotDetailPanel()

        this._view.mountPanels({
            left  : this.listPanel,
            right : this.detailPanel,
        })

    }

    // ── Événements ────────────────────────────────────────────────────────────

    bindEvents()
    {
        // Recherche
        this.listPanel.onSearch(q =>
        {
            this._q    = q
            this._page = 1
            this.detailPanel.clear()
            this.load()
        })

        // Sélection ligne → affichage direct (step 1)
        // Step 3 : remplacer par fetchMot({ id }) pour l'objet enrichi
        this.listPanel.onSelect(mot =>
        {
            this.detailPanel.show(mot)
        })

        // Nouveau mot
        this.listPanel.onNew(() =>
        {
            this.detailPanel.showNew()
        })

        this.listPanel.onPage( page => { this._page = page; this.load() } )

        // Sauvegarde (create + update)
        this.detailPanel.onSave(async (id, lbl) =>
        {
            this.detailPanel.lock()
            try
            {
                const result = await saveMot({ id, lbl })

                if (!id) this._page = 1     // création → retour page 1

                await this.load()

                // result.data : { mot_id, mot_lbl } retourné par l'API
                const saved = result.data ?? (id ? { mot_id: id, mot_lbl: lbl } : null)
                if (saved) this.detailPanel.show(saved)
            }
            catch (err)
            {
                const msg = err.message.includes('422')
                    ? 'Ce mot existe déjà.'
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
                await deleteMot(id)
                this.detailPanel.clear()
                this._page = 1              // évite une page désormais vide
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

        // Pagination — callback stocké pour pouvoir se désabonner
        this._onPageFn = (page) =>
        {
            this._page = page
            this.load()
        }
        this.bus.subscribe('wb:mot:page', this._onPageFn)
    }

    // ── Chargement ────────────────────────────────────────────────────────────

    async load()
    {
        this.listPanel.showLoading()
        try
        {
            const result = await fetchMot({
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
            console.error('[MotWorkbench] load error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        //this.bus.unsubscribe('wb:mot:page', this._onPageFn)
        //this._onPageFn = null
        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this._view.unmountPanels()
        this._view.destroy()
        this._view = null        
        super.destroy()
    }
}

export default MotWorkbench
