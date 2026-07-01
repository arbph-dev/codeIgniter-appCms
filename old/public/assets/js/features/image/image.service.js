// js/features/image/image.service.js

import { apiFetch } from '../../core/apiFetch.js'

// ─────────────────────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────────────────────

export async function fetchImage({
    id,
    q,
    status,
    page = 1,
    perPage = 10
}) {

    let url = '/api/image?'

    if (id) {
        url += `id=${encodeURIComponent(id)}`
    }
    else {

        const params = new URLSearchParams()

        if (q) params.append('q', q)
        if (status) params.append('status', status)

        params.append('page', page)
        params.append('per_page', perPage)

        url += params.toString()
    }

    const res = await apiFetch(url)

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
    }

    return await res.json()
}

// ─────────────────────────────────────────────────────────────
// LIKE
// ─────────────────────────────────────────────────────────────

export async function fetchImageLike({ q, len = 10 }) {

    if (!q || q.length < 2) {
        return []
    }

    try {

        const url =
            `/api/image/like?q=${encodeURIComponent(q)}&len=${len}`

        const res = await apiFetch(url)

        const json = await res.json()

        return json.data ?? []

    } catch {

        return []
    }
}

// ─────────────────────────────────────────────────────────────
// CREATE / UPDATE
// ─────────────────────────────────────────────────────────────

export async function saveImage(payload) {

    const {
        id,
        file,
        alt,
        status,
        user_id
    } = payload

    const method = id ? 'PUT' : 'POST'

    const url = id
        ? `/api/image/${id}`
        : '/api/image'

    let options = { method }

    // CREATE multipart/form-data
    if (!id) {

        const fd = new FormData()

        fd.append('file', file)

        if (alt) fd.append('alt', alt)
        if (status) fd.append('status', status)
        if (user_id) fd.append('user_id', user_id)

        options.body = fd
    }

    // UPDATE JSON
    else {

        options.body = JSON.stringify({
            alt,
            status
        })

        options.headers = {
            'Content-Type': 'application/json'
        }
    }

    const res = await apiFetch(url, options)

    if (!res.ok) {

        let msg = `HTTP ${res.status}`

        try {
            const json = await res.json()
            msg = json.message || msg
        } catch {}

        throw new Error(msg)
    }

    return await res.json()
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteImage(id) {

    const res = await apiFetch(
        `/api/image/${id}`,
        { method: 'DELETE' }
    )

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
    }

    return await res.json()
}