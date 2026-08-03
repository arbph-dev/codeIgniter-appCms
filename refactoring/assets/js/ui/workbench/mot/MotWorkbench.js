// ============================================================================
// assets/js/ui/workbench/mot/MotWorkbench.js
// ============================================================================
// Assemblage uniquement — aucune logique d'affichage dans le Workbench.
// Auth     : transparente via apiFetch (aucun token ici)
// Données  : fetchMot() direct — pas de détour par le bus global
// Bus      : souscription à 'wb:mot:page' uniquement (namespaced)
//
// ⚠ Dépendance connue — mot.service.fetchMot :
//   Sans `q` ni `id`, l'URL construite (/api/mot?) n'inclut pas page/per_page.
//   Conséquence : la pagination de la liste initiale est toujours page 1.
//   Fix suggéré dans mot.service.js (voir commentaire dans load()).
// ============================================================================

import WorkbenchBase  from '/assets/js/ui/workbench/WorkbenchBase.js'
import MotListPanel   from './MotListPanel.js'
import MotDetailPanel from './MotDetailPanel.js'
import { fetchMot }   from '/assets/js/features/mot/mot.service.js'

export class MotWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Mot Workbench', ...config })

        // État de navigation local — pas de store partagé
        this._q    = ''
        this._page = 1

        this.listPanel   = null
        this.detailPanel = null
    }

    //--------------------------------------------------------------------------
    // Initialisation
    //--------------------------------------------------------------------------

    async bootstrap()
    {
        this.createLayout()
        this.createPanels()
        this.bindEvents()
        await this.load()
    }

    //--------------------------------------------------------------------------
    // Layout
    //--------------------------------------------------------------------------

    createLayout()
    {
        const body = this.getElement('.wb-content')

        body.innerHTML = `
            <div class="wb_mot_layout">
                <div class="wb_mot_left"></div>
                <div class="wb_mot_right"></div>
            </div>
        `
    }

    //--------------------------------------------------------------------------
    // Panels
    // Seul endroit qui instancie, appelle render() et insère dans le DOM.
    //--------------------------------------------------------------------------

    createPanels()
    {
        this.listPanel   = new MotListPanel()
        this.detailPanel = new MotDetailPanel()

        this.getElement('.wb_mot_left')
            .appendChild(this.listPanel.render())

        this.getElement('.wb_mot_right')
            .appendChild(this.detailPanel.render())
    }

    //--------------------------------------------------------------------------
    // Événements
    //--------------------------------------------------------------------------

    bindEvents()
    {
        // Recherche — reset page + vide le détail
        this.listPanel.onSearch(q =>
        {
            this._q    = q
            this._page = 1
            this.detailPanel.clear()
            this.load()
        })

        // Sélection — affichage direct depuis la row (step 1)
        // Step 3 : remplacer par fetchMot({ id: mot.mot_id }) + detailPanel.show(result)
        this.listPanel.onSelect(mot =>
        {
            this.detailPanel.show(mot)
        })

        // Pagination — la factory pagination() publie sur le bus (namespaced)
        this.bus.subscribe('wb:mot:page', (page) =>
        {
            this._page = page
            this.load()
        })
    }

    //--------------------------------------------------------------------------
    // Chargement
    //
    // ⚠ Fix suggéré dans mot.service.js — fetchMot sans q :
    //
    //   Actuel  : url = '/api/mot?'  → page et per_page absents de l'URL
    //   Corrigé :
    //     const params = new URLSearchParams()
    //     if (id)  { params.set('id', id) }
    //     else {
    //         if (q) params.set('q', q)
    //         params.set('page',     page)
    //         params.set('per_page', perPage)
    //     }
    //     const response = await apiFetch(`/api/mot?${params}`)
    //
    //   Avec ce fix, la liste initiale paginée fonctionnera correctement.
    //--------------------------------------------------------------------------

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

            // Réponse uniforme : { status, data: [...], pager: {...} }
            // Cas id unique possible (data = objet) — normalisé en tableau
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

    //--------------------------------------------------------------------------
    // Nettoyage
    //--------------------------------------------------------------------------

    destroy()
    {
        this.bus.unsubscribe?.('wb:mot:page')   // si le bus le supporte
        this.listPanel?.destroy?.()
        this.detailPanel?.destroy?.()
        super.destroy()
    }
}

export default MotWorkbench
