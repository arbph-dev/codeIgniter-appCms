// js/features/adresse/adresse.controller.js

import { bus }                                          from '../../core/eventBus.js'
import { fetchAdresse, fetchAdresseLike,
         saveAdresse, deleteAdresse }                   from './adresse.service.js'
import { adresseStore }                                 from './adresse.store.js'

export function initAdresseController() {

    // ── Recherche ─────────────────────────────────────────────────────────────
    bus.subscribe('adresse:search', async (payload) => {
        if (payload.q !== undefined) adresseStore.q = payload.q
        adresseStore.loading = true
        adresseStore.error   = null
        bus.publish('adresse:loading', true)
        try {
            const result           = await fetchAdresse(payload)
            adresseStore.data       = result.data || []
            adresseStore.pagination = result.pager
            bus.publish('adresse:loaded', adresseStore)
        } catch (err) {
            adresseStore.error = err.message
            bus.publish('adresse:error', err.message)
        } finally {
            adresseStore.loading = false
            bus.publish('adresse:loading', false)
        }
    })

    // ── Pagination ────────────────────────────────────────────────────────────
    bus.subscribe('adresse:page', (page) => {
        bus.publish('adresse:search', { q: adresseStore.q, page })
    })

    // ── Sélection ─────────────────────────────────────────────────────────────
    bus.subscribe('adresse:select', (row) => {
        adresseStore.selected = row
        bus.publish('adresse:mode', 'detail')
    })

    // ── Mode ──────────────────────────────────────────────────────────────────
    bus.subscribe('adresse:mode', (mode) => {
        adresseStore.mode = mode
        bus.publish('adresse:render', adresseStore)
    })

    // ── Sauvegarde ────────────────────────────────────────────────────────────
    bus.subscribe('adresse:save', async (payload) => {
        try {
            await saveAdresse(payload)
            bus.publish('adresse:mode', 'list')
            bus.publish('adresse:search', { q: adresseStore.q })
        } catch (err) { bus.publish('adresse:error', err.message) }
    })

    // ── Suppression ───────────────────────────────────────────────────────────
    bus.subscribe('adresse:delete', async (id) => {
        if (!confirm(`Supprimer l'adresse #${id} ?`)) return
        try {
            await deleteAdresse(id)
            adresseStore.selected = null
            bus.publish('adresse:mode', 'list')
            bus.publish('adresse:search', { q: adresseStore.q })
        } catch (err) { bus.publish('adresse:error', err.message) }
    })

    // ── Autocomplete adresse (pour usage dans d'autres modules) ───────────────
    bus.subscribe('adresse:ui:like', async ({ q, len = 10, sourceId }) => {
        const items = await fetchAdresseLike({ q, len })
        const formatted = items.map(i => ({
            ...i,
            _label: `${i.ligne4 ?? i.voienom} — ${i.cp_commune ?? ''}`
        }))
        bus.publish('adresse:ui:response', { sourceId, items: formatted })
    })
}
