// js/core/apiFetch.js
// Helper central — injecte automatiquement le Bearer token sur toutes les requêtes API.
//
// ⚠ Content-Type :
//   • JSON (défaut) → 'application/json'
//   • FormData      → pas de header (le navigateur pose lui-même le boundary multipart)
//   • Surchargeable via options.headers

import { bus } from './eventBus.js'

export async function apiFetch(url, options = {}) {

    const token      = sessionStorage.getItem('auth_token')
    const isFormData = options.body instanceof FormData

    // Ne jamais forcer Content-Type sur un upload multipart :
    // le navigateur le calcule avec le boundary unique.
    const headers = {
        'Accept': 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers ?? {}),
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(url, { ...options, headers })

    // Token expiré ou révoqué → notifie le bus, vide le store
    if (res.status === 401) {
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
        bus.publish('auth:guest')
    }

    return res
}
