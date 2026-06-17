// js/features/typevoie/typevoie.controller.js

import { bus }                                  from '../../core/eventBus.js'
import { fetchTv, fetchTvLike, saveTv, deleteTv } from './typevoie.service.js'
import { tvStore }                              from './typevoie.store.js'

export function initTvController() {

    bus.subscribe('tv:search', async (payload) => {
        if (payload.q  !== undefined) tvStore.q  = payload.q
        if (payload.id !== undefined) tvStore.id = payload.id
        tvStore.loading = true
        tvStore.error   = null
        bus.publish('tv:loading', true)
        try {
            const result      = await fetchTv(payload)
            tvStore.data       = result.data || [result]
            tvStore.pagination = result.pager
            bus.publish('tv:loaded', tvStore)
        } catch (err) {
            tvStore.error = err.message
            bus.publish('tv:error', err.message)
        } finally {
            tvStore.loading = false
            bus.publish('tv:loading', false)
        }
    })

    bus.subscribe('tv:page', (page) => {
        bus.publish('tv:search', { q: tvStore.q, page })
    })

    bus.subscribe('tv:select', (row) => {
        tvStore.selected = row
        bus.publish('tv:mode', 'detail')
    })

    bus.subscribe('tv:mode', (mode) => {
        tvStore.mode = mode
        bus.publish('tv:render', tvStore)
    })

    bus.subscribe('tv:save', async (payload) => {
        try {
            await saveTv(payload)
            bus.publish('tv:mode', 'list')
            bus.publish('tv:search', { q: tvStore.q })
        } catch (err) { bus.publish('tv:error', err.message) }
    })

    bus.subscribe('tv:delete', async (id) => {
        if (!confirm(`Supprimer le type de voie #${id} ?`)) return
        try {
            await deleteTv(id)
            tvStore.selected = null
            bus.publish('tv:mode', 'list')
            bus.publish('tv:search', { q: tvStore.q })
        } catch (err) { bus.publish('tv:error', err.message) }
    })

    bus.subscribe('tv:ui:like', async ({ q, len = 10, sourceId }) => {
        const items = await fetchTvLike({ q, len })
        bus.publish('tv:ui:response', { sourceId, items })
    })
}
