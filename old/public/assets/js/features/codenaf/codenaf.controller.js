// js/features/codenaf/codenaf.controller.js
// Ajout : naf:ui:like pour autocomplete Entreprise

import { bus }                                       from '../../core/eventBus.js'
import { nafStore }                                  from './codenaf.store.js'
import { fetchNaf, fetchNafLike, fetchChildren, fetchTree } from './codenaf.service.js'

export function initNafController() {

    bus.subscribe('naf:search', async (payload) => {
        if (payload.q    !== undefined) nafStore.q    = payload.q
        if (payload.code !== undefined) nafStore.code = payload.code
        nafStore.loading = true
        bus.publish('naf:loading', true)
        try {
            const result      = await fetchNaf(payload)
            nafStore.data      = result.data || [result]
            nafStore.pagination = result.pager || result.pagination
            bus.publish('naf:loaded', nafStore)
        } catch (err) {
            nafStore.error = err.message
            bus.publish('naf:error', err.message)
        } finally {
            nafStore.loading = false
            bus.publish('naf:loading', false)
        }
    })

    bus.subscribe('naf:page', (page) => {
        bus.publish('naf:search', { q: nafStore.q, code: nafStore.code, page })
    })

    bus.subscribe('naf:children', async (code) => {
        const children = await fetchChildren(code)
        bus.publish('naf:children:loaded', { code, children })
    })

    bus.subscribe('naf:tree', async () => {
        const tree = await fetchTree()
        nafStore.tree = tree
        bus.publish('naf:tree:loaded', tree)
    })

    // ── Autocomplete pour formulaire Entreprise ───────────────
    bus.subscribe('naf:ui:like', async ({ q, len = 10, sourceId }) => {
        const items = await fetchNafLike({ q, len })
        bus.publish('naf:ui:response', { sourceId, items })
    })
}
