// js/features/image/image.controller.js

import { bus } from '../../core/eventBus.js'

import {
    fetchImage,
    fetchImageLike,
    saveImage,
    deleteImage
}
from './image.service.js'

import { imageStore } from './image.store.js'

export function initImageController() {

    // ─────────────────────────────────────────────────────────
    // SEARCH
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:search', async (payload) => {

        if (payload.q !== undefined) {
            imageStore.q = payload.q
        }

        if (payload.status !== undefined) {
            imageStore.status = payload.status
        }

        imageStore.loading = true
        imageStore.error = null

        bus.publish('image:loading', true)

        try {

            const result = await fetchImage(payload)

            imageStore.data = result.data || [result]

            imageStore.pagination = result.pager

            bus.publish('image:loaded', imageStore)

        } catch (err) {

            imageStore.error = err.message

            bus.publish('image:error', err.message)

        } finally {

            imageStore.loading = false

            bus.publish('image:loading', false)
        }
    })

    // ─────────────────────────────────────────────────────────
    // PAGINATION
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:page', (page) => {

        const { q, status } = imageStore

        bus.publish('image:search', {
            q,
            status,
            page
        })
    })

    // ─────────────────────────────────────────────────────────
    // SELECT
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:select', (row) => {

        imageStore.selected = row

        bus.publish('image:mode', 'detail')
    })

    // ─────────────────────────────────────────────────────────
    // MODE
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:mode', (mode) => {

        imageStore.mode = mode

        bus.publish('image:render', imageStore)
    })

    // ─────────────────────────────────────────────────────────
    // SAVE
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:save', async (payload) => {

        try {

            await saveImage(payload)

            bus.publish('image:mode', 'list')

            bus.publish('image:search', {
                q: imageStore.q
            })

        } catch (err) {

            bus.publish('image:error', err.message)
        }
    })

    // ─────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────

    bus.subscribe('image:delete', async (id) => {

        if (!confirm(`Supprimer l'image #${id} ?`)) {
            return
        }

        try {

            await deleteImage(id)

            imageStore.selected = null

            bus.publish('image:mode', 'list')

            bus.publish('image:search', {
                q: imageStore.q
            })

        } catch (err) {

            bus.publish('image:error', err.message)
        }
    })

    // ─────────────────────────────────────────────────────────
    // LIKE
    // ─────────────────────────────────────────────────────────

    bus.subscribe(
        'image:ui:like',
        async ({ q, len = 10, sourceId }) => {

            if (!q || q.length < 2) {

                bus.publish(
                    'image:ui:response',
                    {
                        sourceId,
                        items: []
                    }
                )

                return
            }

            const data = await fetchImageLike({ q, len })

            bus.publish(
                'image:ui:response',
                {
                    sourceId,
                    items: data
                }
            )
        }
    )
}
