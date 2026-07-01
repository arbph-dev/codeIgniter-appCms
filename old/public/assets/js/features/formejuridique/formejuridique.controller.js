// js/features/formejuridique/formejuridique.controller.js

import { bus }                                      from '../../core/eventBus.js'
import { fetchFj, fetchFjLike, saveFj, deleteFj }  from './formejuridique.service.js'
import { fjStore }                                  from './formejuridique.store.js'

export function initFjController() {

    // ── Recherche ─────────────────────────────────────────────────────────────
    bus.subscribe('fj:search', async (payload) => {
        if (payload.q  !== undefined) fjStore.q  = payload.q
        if (payload.id !== undefined) fjStore.id = payload.id

        fjStore.loading = true
        fjStore.error   = null
        bus.publish('fj:loading', true)

        try {
            const result      = await fetchFj(payload)
            fjStore.data       = result.data || [result]
            fjStore.pagination = result.pager
            bus.publish('fj:loaded', fjStore)
        } catch (err) {
            fjStore.error = err.message
            bus.publish('fj:error', err.message)
        } finally {
            fjStore.loading = false
            bus.publish('fj:loading', false)
        }
    })

    // ── Pagination ────────────────────────────────────────────────────────────
    bus.subscribe('fj:page', (page) => {
        bus.publish('fj:search', { q: fjStore.q, page })
    })

    // ── Sélection ─────────────────────────────────────────────────────────────
    bus.subscribe('fj:select', (row) => {
        fjStore.selected = row
        bus.publish('fj:mode', 'detail')
    })

    // ── Mode ──────────────────────────────────────────────────────────────────
    bus.subscribe('fj:mode', (mode) => {
        fjStore.mode = mode
        bus.publish('fj:render', fjStore)
    })

    // ── Sauvegarde ────────────────────────────────────────────────────────────
    bus.subscribe('fj:save', async (payload) => {
        try {
            await saveFj(payload)
            bus.publish('fj:mode', 'list')
            bus.publish('fj:search', { q: fjStore.q })
        } catch (err) {
            bus.publish('fj:error', err.message)
        }
    })

    // ── Suppression ───────────────────────────────────────────────────────────
    bus.subscribe('fj:delete', async (id) => {
        if (!confirm(`Supprimer la forme juridique « ${id} » ?`)) return
        try {
            await deleteFj(id)
            fjStore.selected = null
            bus.publish('fj:mode', 'list')
            bus.publish('fj:search', { q: fjStore.q })
        } catch (err) {
            bus.publish('fj:error', err.message)
        }
    })

    // ── Autocomplete ──────────────────────────────────────────────────────────
    bus.subscribe('fj:ui:like', async ({ q, len = 10, sourceId }) => {
        const items = await fetchFjLike({ q, len })
        bus.publish('fj:ui:response', { sourceId, items })
    })
}
