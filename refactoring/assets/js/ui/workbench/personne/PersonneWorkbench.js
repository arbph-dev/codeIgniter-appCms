// assets/js/ui/workbench/personne/PersonneWorkbench.js
// ─────────────────────────────────────────────────────────────────────────────
// 2 zones : list (left) + detail (center)
//
// Dialogs — 3 instances RelationPickerDialog :
//   dialog_personne_picker  cible relation type personne
//   dialog_org_picker       cible relation type organisation
//   dialog_merge_picker     cible fusion (sourceId distinct pour le routing bus)
//
// Bootstrap :
//   1. Pré-charge parcours_types + relation_types en parallèle
//   2. Crée les dialogs (enregistrés dans document.body via DialogManager)
//   3. Construit le layout et monte les panels
//   4. Bind les événements
//   5. Premier load()
//
// Refresh partiel après CRUD alias / parcours / relation :
//   _refreshSubEntities() → fetchPersonneById() → refreshAliases/Parcours/Relations()
//   Le panel reste affiché, seul l'onglet actif est mis à jour visuellement.
//
// Dépendance externe :
//   fetchOrgLike doit être exportée depuis organisation.service.js.
//   Signature attendue : async ({ q, len }) => object[]
// ─────────────────────────────────────────────────────────────────────────────

import WorkbenchBase            from '/assets/js/ui/workbench/core/WorkbenchBase.js'
import { WorkbenchView }        from '/assets/js/ui/workbench/core/WorkbenchView.js'
import { createDescriptor }     from '/assets/js/ui/workbench/core/LayoutDescriptor.js'
import { RelationPickerDialog } from '/assets/js/ui/shared/RelationPickerDialog.js'

import PersonneListPanel   from './PersonneListPanel.js'
import PersonneDetailPanel from './PersonneDetailPanel.js'

import {
    fetchPersonne,
    fetchPersonneLike,
    fetchPersonneById,
    savePersonne,
    deletePersonne,
    mergePersonne,
} from '/assets/js/features/personne/personne.service.js'

import {
    saveAlias,
    deleteAlias,
} from '/assets/js/features/personne/personne-alias.service.js'

import {
    saveParcours,
    deleteParcours,
} from '/assets/js/features/personne/personne-parcours.service.js'

import {
    createRelation,
    deactivateRelation,
    deleteRelation,
} from '/assets/js/features/relation/relation.service.js'

import { fetchRelationTypes } from '/assets/js/features/relation-type/relation-type.service.js'
import { fetchParcoursTypes } from '/assets/js/features/parcours-type/parcours-type.service.js'
import { fetchOrgLike }       from '/assets/js/features/organisation/organisation.service.js'

// ── Layout ────────────────────────────────────────────────────────────────────

const LAYOUT = createDescriptor({
    css   : 'wb_personne_layout',
    zones : [
        { name: 'left',   css: 'wb_personne_left'   },
        { name: 'center', css: 'wb_personne_center' },
    ],
})

// ── Workbench ─────────────────────────────────────────────────────────────────

export class PersonneWorkbench extends WorkbenchBase
{
    constructor(config = {})
    {
        super({ name: 'Personne Workbench', ...config })

        this._q    = ''
        this._page = 1

        this._parcoursTypes     = []
        this._relationTypes     = []
        this._currentPersonneId = null

        this._view         = null
        this.listPanel     = null
        this.detailPanel   = null

        this._personnePicker = null
        this._orgPicker      = null
        this._mergePicker    = null
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    async bootstrap()
    {
        // 1. Référentiels — en parallèle, bloquants (nécessaires avant les panels)
        ;[this._parcoursTypes, this._relationTypes] = await Promise.all([
            fetchParcoursTypes(),
            fetchRelationTypes({ sourceType: 'personne' }),
        ])

        // 2. Dialogs avant les panels (Form.js peut publier dialog:show dès le 1er render)
        this._createDialogs()

        // 3. Layout + panels
        this._view = new WorkbenchView(LAYOUT, this.getElement('.wb-content'))
        this._view.build()
        this._createPanels()

        // 4. Événements
        this._bindEvents()

        // 5. Chargement initial
        this.load()
    }

    // ── Dialogs ───────────────────────────────────────────────────────────────

    _createDialogs()
    {
        this._personnePicker = new RelationPickerDialog({
            id        : 'dialog_personne_picker',
            title     : 'Sélectionner une personne',
            fetchFn   : (q) => fetchPersonneLike({ q, len: 20 }),
            columns   : [
                { key: 'nom_complet',    label: 'Nom'      },
                { key: 'date_naissance', label: 'Né(e) le' },
            ],
            minLength : 2,
        }).render()

        this._orgPicker = new RelationPickerDialog({
            id        : 'dialog_org_picker',
            title     : 'Sélectionner une organisation',
            fetchFn   : (q) => fetchOrgLike({ q, len: 20 }),
            columns   : [
                { key: 'nom',   label: 'Nom'   },
                { key: 'siren', label: 'SIREN' },
            ],
            minLength : 2,
        }).render()

        // dialog_merge_picker : même fetchFn que dialog_personne_picker
        // mais sourceId distinct → le mergeHandler dans PersonneDetailPanel
        // discrimine sur sourceId === 'dialog_merge_picker'
        this._mergePicker = new RelationPickerDialog({
            id        : 'dialog_merge_picker',
            title     : 'Fusionner dans…',
            fetchFn   : (q) => fetchPersonneLike({ q, len: 20 }),
            columns   : [
                { key: 'nom_complet',    label: 'Nom'      },
                { key: 'date_naissance', label: 'Né(e) le' },
            ],
            minLength : 2,
        }).render()
    }

    // ── Panels ────────────────────────────────────────────────────────────────

    _createPanels()
    {
        this.listPanel = new PersonneListPanel()

        this.detailPanel = new PersonneDetailPanel({
            parcoursTypes : this._parcoursTypes,
            relationTypes : this._relationTypes,
            dialogMap     : {
                personne     : 'dialog_personne_picker',
                organisation : 'dialog_org_picker',
            },
        })

        this._view.mountPanels({
            left   : this.listPanel,
            center : this.detailPanel,
        })
    }

    // ── Événements ────────────────────────────────────────────────────────────

    _bindEvents()
    {
        // ── Liste ─────────────────────────────────────────────────────────────

        this.listPanel.onSearch(q =>
        {
            this._q    = q
            this._page = 1
            this.detailPanel.clear()
            this.load()
        })

        this.listPanel.onSelect(personne => this._showPersonne(personne.id))

        this.listPanel.onNew(() => this.detailPanel.showNew())

        this.listPanel.onPage(page =>
        {
            this._page = page
            this.load()
        })

        // ── Personne — identité ───────────────────────────────────────────────

        this.detailPanel.onSave(async (id, data) =>
        {
            this.detailPanel.lock()
            try
            {
                const result = await savePersonne({ id, ...data })
                if (!id) this._page = 1
                await this.load()

                // Après création, result.data est la personne ; après PUT, idem.
                const savedId = result.data?.id ?? id
                if (savedId) await this._showPersonne(savedId)
                else this.detailPanel.showFeedback('success', 'Enregistré.')
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

        this.detailPanel.onDelete(async (id) =>
        {
            this.detailPanel.lock()
            try
            {
                await deletePersonne(id)
                this._currentPersonneId = null
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

        this.detailPanel.onMerge(async (sourceId, targetId) =>
        {
            this.detailPanel.lock()
            try
            {
                await mergePersonne(sourceId, targetId)
                this._currentPersonneId = null
                this._page = 1
                await this.load()
                // Afficher la fiche cible qui absorbe la source
                await this._showPersonne(targetId)
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

        // ── Alias ─────────────────────────────────────────────────────────────

        this.detailPanel.onAliasAdd(async (data) =>
        {
            await saveAlias(data)
            await this._refreshSubEntities()
        })

        this.detailPanel.onAliasUpdate(async (id, data) =>
        {
            await saveAlias({ id, ...data })
            await this._refreshSubEntities()
        })

        this.detailPanel.onAliasDelete(async (id) =>
        {
            await deleteAlias(id)
            await this._refreshSubEntities()
        })

        // ── Parcours ──────────────────────────────────────────────────────────

        this.detailPanel.onParcoursAdd(async (data) =>
        {
            await saveParcours(data)
            await this._refreshSubEntities()
        })

        this.detailPanel.onParcoursUpdate(async (id, data) =>
        {
            await saveParcours({ id, ...data })
            await this._refreshSubEntities()
        })

        this.detailPanel.onParcoursDelete(async (id) =>
        {
            await deleteParcours(id)
            await this._refreshSubEntities()
        })

        // ── Relations ─────────────────────────────────────────────────────────

        this.detailPanel.onRelationCreate(async (data) =>
        {
            await createRelation(data)
            await this._refreshSubEntities()
        })

        this.detailPanel.onRelationDeactivate(async (id) =>
        {
            await deactivateRelation(id)
            await this._refreshSubEntities()
        })

        this.detailPanel.onRelationDelete(async (id) =>
        {
            await deleteRelation(id)
            await this._refreshSubEntities()
        })
    }

    // ── Chargement ────────────────────────────────────────────────────────────

    async load()
    {
        this.listPanel.showLoading()
        try
        {
            const result = await fetchPersonne({
                q       : this._q      || undefined,
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
            console.error('[PersonneWorkbench] load error', err)
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Charge la fiche complète et l'affiche dans le panel.
     * Stocke _currentPersonneId pour les refreshes partiels.
     */
    async _showPersonne(id)
    {
        this._currentPersonneId = id
        try
        {
            const data = await fetchPersonneById(id)
            if (data) this.detailPanel.show(data)
        }
        catch (err)
        {
            this.detailPanel.showFeedback('error', err.message)
            console.error('[PersonneWorkbench] _showPersonne error', err)
        }
    }

    /**
     * Rafraîchit les sous-entités de la personne courante sans rebuilder le panel.
     * Appelé après tout CRUD sur alias, parcours ou relation.
     */
    async _refreshSubEntities()
    {
        if (!this._currentPersonneId) return
        try
        {
            const data = await fetchPersonneById(this._currentPersonneId)
            if (!data) return
            this.detailPanel.refreshAliases(data.aliases    ?? [])
            this.detailPanel.refreshParcours(data.parcours  ?? [])
            this.detailPanel.refreshRelations(data.relations ?? [])
        }
        catch (err)
        {
            console.error('[PersonneWorkbench] _refreshSubEntities error', err)
        }
    }

    // ── Nettoyage ─────────────────────────────────────────────────────────────

    destroy()
    {
        this._personnePicker?.destroy()
        this._orgPicker?.destroy()
        this._mergePicker?.destroy()
        this.listPanel?.destroy()
        this.detailPanel?.destroy()
        this._view?.unmountPanels()
        this._view?.destroy()
        this._view = null
        super.destroy()
    }
}

export default PersonneWorkbench
