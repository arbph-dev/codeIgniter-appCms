// js/features/organisation/organisation.controller.js
import { bus }                             from '../../core/eventBus.js'
import { fetchOrg, fetchOrgLike,
         saveOrg, deleteOrg }              from './organisation.service.js'
import { orgStore }                        from './organisation.store.js'

export function initOrgController() {
    bus.subscribe('org:search', async (payload) => {
        if (payload.q      !== undefined) orgStore.q      = payload.q
        if (payload.typeId !== undefined) orgStore.typeId = payload.typeId
        orgStore.loading = true; orgStore.error = null
        bus.publish('org:loading', true)
        try {
            const r = await fetchOrg(payload)
            orgStore.data = r.data || []; orgStore.pagination = r.pager
            bus.publish('org:loaded', orgStore)
        } catch (e) { orgStore.error = e.message; bus.publish('org:error', e.message)
        } finally   { orgStore.loading = false; bus.publish('org:loading', false) }
    })

    bus.subscribe('org:page',   (p) => bus.publish('org:search', { q: orgStore.q, page: p }))
    bus.subscribe('org:select', (r) => { orgStore.selected = r; bus.publish('org:mode', 'detail') })
    bus.subscribe('org:mode',   (m) => { orgStore.mode = m; bus.publish('org:render', orgStore) })

    bus.subscribe('org:save', async (payload) => {
        try { await saveOrg(payload); bus.publish('org:mode','list'); bus.publish('org:search',{q:orgStore.q})
        } catch(e) { bus.publish('org:error', e.message) }
    })

    bus.subscribe('org:delete', async (id) => {
        if (!confirm(`Supprimer l'organisation #${id} ?`)) return
        try { await deleteOrg(id); orgStore.selected=null; bus.publish('org:mode','list'); bus.publish('org:search',{q:orgStore.q})
        } catch(e) { bus.publish('org:error', e.message) }
    })

    bus.subscribe('org:ui:like', async ({ q, len=10, sourceId }) => {
        const items = await fetchOrgLike({ q, len })
        bus.publish('org:ui:response', { sourceId, items })
    })
}
