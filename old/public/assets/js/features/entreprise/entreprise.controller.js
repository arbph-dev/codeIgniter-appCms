// js/features/entreprise/entreprise.controller.js
import { bus }                                from '../../core/eventBus.js'
import { fetchEnt, fetchEntLike,
         saveEnt, deleteEnt }                 from './entreprise.service.js'
import { entStore }                           from './entreprise.store.js'

export function initEntController() {
    bus.subscribe('ent:search', async (payload) => {
        if (payload.q!==undefined) entStore.q = payload.q
        entStore.loading=true; entStore.error=null
        bus.publish('ent:loading',true)
        try {
            const r = await fetchEnt(payload)
            entStore.data=r.data||[]; entStore.pagination=r.pager
            bus.publish('ent:loaded',entStore)
        } catch(e) { entStore.error=e.message; bus.publish('ent:error',e.message)
        } finally  { entStore.loading=false; bus.publish('ent:loading',false) }
    })
    bus.subscribe('ent:page',   (p) => bus.publish('ent:search',{q:entStore.q,page:p}))
    bus.subscribe('ent:select', (r) => { entStore.selected=r; bus.publish('ent:mode','detail') })
    bus.subscribe('ent:mode',   (m) => { entStore.mode=m; bus.publish('ent:render',entStore) })
    bus.subscribe('ent:save', async (payload) => {
        try { await saveEnt(payload); bus.publish('ent:mode','list'); bus.publish('ent:search',{q:entStore.q})
        } catch(e) { bus.publish('ent:error',e.message) }
    })
    bus.subscribe('ent:delete', async (id) => {
        if (!confirm(`Supprimer l'entreprise #${id} ?`)) return
        try { await deleteEnt(id); entStore.selected=null; bus.publish('ent:mode','list'); bus.publish('ent:search',{q:entStore.q})
        } catch(e) { bus.publish('ent:error',e.message) }
    })
    bus.subscribe('ent:ui:like', async ({q,len=10,sourceId}) => {
        const items = await fetchEntLike({q,len})
        bus.publish('ent:ui:response',{sourceId,items})
    })
}
