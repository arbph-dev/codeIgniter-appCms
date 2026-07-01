// js/features/codepostal/codepostal.controller.js

import { bus }                    from '../../core/eventBus.js'
import { fetchCp, fetchCpLike }  from './codepostal.service.js'
import { cpStore }               from './codepostal.store.js'

export function initCpController() {

    // ── Recherche ─────────────────────────────────────────────────────────────
    bus.subscribe('cp:search', async (payload) => {
        if (payload.q          !== undefined) cpStore.q          = payload.q
        if (payload.codepostal !== undefined) cpStore.codepostal = payload.codepostal

        cpStore.loading = true
        cpStore.error   = null
        bus.publish('cp:loading', true)

        try {
            const result      = await fetchCp(payload)
            cpStore.data       = result.data || []
            cpStore.pagination = result.pager
            bus.publish('cp:loaded', cpStore)
        } catch (err) {
            cpStore.error = err.message
            bus.publish('cp:error', err.message)
        } finally {
            cpStore.loading = false
            bus.publish('cp:loading', false)
        }
    })

    // ── Pagination ────────────────────────────────────────────────────────────
    bus.subscribe('cp:page', (page) => {
        bus.publish('cp:search', { q: cpStore.q, page })
    })

    // ── Sélection → détail ────────────────────────────────────────────────────
    bus.subscribe('cp:select', (row) => {
        cpStore.selected = row
        bus.publish('cp:mode', 'detail')
    })

    // ── Mode ──────────────────────────────────────────────────────────────────
    bus.subscribe('cp:mode', (mode) => {
        cpStore.mode = mode
        bus.publish('cp:render', cpStore)
    })

    // ── Autocomplete ──────────────────────────────────────────────────────────
    // Payload : { q, len, sourceId }
    bus.subscribe('cp:ui:like', async ({ q, len = 15, sourceId }) => {
        const items = await fetchCpLike({ q, len })
        // Label affiché : "29000 — QUIMPER"
        const formatted = items.map(i => ({
            ...i,
            _label: `${i.codepostal} — ${i.commune}`,
        }))
        bus.publish('cp:ui:response', { sourceId, items: formatted })
    })
}
