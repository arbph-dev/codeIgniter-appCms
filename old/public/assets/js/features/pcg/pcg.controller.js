// js/features/pcg/pcg.controller.js

import { bus }             from '../../core/eventBus.js'
import { pcgStore }        from './pcg.store.js'
import {
    fetchPcg,
    fetchPcgOne,
    fetchPcgChildren,
    fetchPcgHierarchy,
    fetchPcgTree,
} from './pcg.service.js'

export function initPcgController() {

    // ── pcg:search ───────────────────────────────────────────────────────────
    // payload : { q, classe, page, perPage }
    bus.subscribe('pcg:search', async (payload = {}) => {
        pcgStore.loading = true
        pcgStore.error   = null
        pcgStore.query   = payload.q      ?? pcgStore.query
        pcgStore.classe  = payload.classe ?? pcgStore.classe
        pcgStore.page    = payload.page   ?? 1
        bus.publish('pcg:loading', true)

        try {
            const data = await fetchPcg({
                q:       pcgStore.query,
                classe:  pcgStore.classe,
                page:    pcgStore.page,
                perPage: pcgStore.perPage,
            })
            pcgStore.results = data.data  ?? []
            pcgStore.pager   = data.pager ?? null
            bus.publish('pcg:results', pcgStore.results)
        } catch (err) {
            pcgStore.error = err.message
            bus.publish('pcg:error', err.message)
        } finally {
            pcgStore.loading = false
            bus.publish('pcg:loading', false)
        }
    })

    // ── pcg:select ───────────────────────────────────────────────────────────
    // payload : { numpcg }
    bus.subscribe('pcg:select', async ({ numpcg }) => {
        pcgStore.loading = true
        bus.publish('pcg:loading', true)

        try {
            const [compte, children, hierarchy] = await Promise.all([
                fetchPcgOne(numpcg),
                fetchPcgChildren(numpcg),
                fetchPcgHierarchy(numpcg),
            ])

            pcgStore.selected  = compte
            pcgStore.children  = children
            pcgStore.hierarchy = hierarchy

            bus.publish('pcg:selected', {
                compte,
                children,
                hierarchy,
            })
        } catch (err) {
            pcgStore.error = err.message
            bus.publish('pcg:error', err.message)
        } finally {
            pcgStore.loading = false
            bus.publish('pcg:loading', false)
        }
    })

    // ── pcg:children ─────────────────────────────────────────────────────────
    // payload : { numpcg } — pour le treeview lazy
    bus.subscribe('pcg:children', async ({ numpcg }) => {
        try {
            const children = await fetchPcgChildren(numpcg)
            bus.publish('pcg:children:loaded', { numpcg, children })
        } catch (err) {
            bus.publish('pcg:error', err.message)
        }
    })

    // ── pcg:tree ─────────────────────────────────────────────────────────────
    // Charge l'arbre complet — pour l'admin SPA
    bus.subscribe('pcg:tree', async () => {
        if (pcgStore.treeLoaded) {
            bus.publish('pcg:tree:loaded', pcgStore.tree)
            return
        }

        pcgStore.loading = true
        bus.publish('pcg:loading', true)

        try {
            const tree = await fetchPcgTree()
            pcgStore.tree       = tree
            pcgStore.treeLoaded = true
            bus.publish('pcg:tree:loaded', tree)
        } catch (err) {
            pcgStore.error = err.message
            bus.publish('pcg:error', err.message)
        } finally {
            pcgStore.loading = false
            bus.publish('pcg:loading', false)
        }
    })

    // ── pcg:reset ────────────────────────────────────────────────────────────
    bus.subscribe('pcg:reset', () => {
        pcgStore.reset()
        bus.publish('pcg:results', [])
    })
}
