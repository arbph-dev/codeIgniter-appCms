// js/features/auth/auth.controller.js

import { bus }                          from '../../core/eventBus.js'
import { authStore }                    from './auth.store.js'
import { fetchLogin, fetchMe, fetchLogout } from './auth.service.js'

export function initAuthController() {

    // ── auth:check ───────────────────────────────────────────────────────────
    // Appelé au démarrage — vérifie si une session Shield OU un token existe
    bus.subscribe('auth:check', async () => {
        authStore.restore()              // récupère token/user depuis sessionStorage
        authStore.loading = true
        bus.publish('auth:loading', true)
  
        try {
            const user = await fetchMe(authStore.token)

            if (user) {
                authStore.user     = user
                authStore.loggedIn = true
                authStore.persist()
                bus.publish('auth:success', { user, token: authStore.token })
            } else {
                // Pas de session active
                authStore.clear()
                bus.publish('auth:guest')
            }
        } catch (err) {
            authStore.clear()
            bus.publish('auth:guest')
        } finally {
            authStore.loading = false
            bus.publish('auth:loading', false)
        }
    })

    // ── auth:login ───────────────────────────────────────────────────────────
    bus.subscribe('auth:login', async ({ email, password }) => {
        authStore.loading = true
        authStore.error   = null
        bus.publish('auth:loading', true)

        try {
            const data = await fetchLogin({ email, password })

            authStore.user     = data.user
            authStore.token    = data.token
            authStore.loggedIn = true
            authStore.persist()

            bus.publish('auth:success', { user: data.user, token: data.token })
            bus.publish('auth:changed')

        } catch (err) {
            authStore.error = err.message
            bus.publish('auth:error', err.message)
        } finally {
            authStore.loading = false
            bus.publish('auth:loading', false)
        }
    })

    // ── auth:logout ──────────────────────────────────────────────────────────
    bus.subscribe('auth:logout', async () => {
        authStore.loading = true
        bus.publish('auth:loading', true)

        try {
            if (authStore.token) {
                await fetchLogout(authStore.token)
            }
        } catch (err) {
            // On vide le store même si la révocation échoue côté serveur
            console.warn('[auth] logout error:', err.message)
        } finally {
            authStore.clear()
            authStore.loading = false
            bus.publish('auth:loading', false)
            bus.publish('auth:changed')
            bus.publish('auth:guest')
        }
    })

    // ── auth:success ─────────────────────────────────────────────────────────
    // Redirection selon le groupe après login (optionnel — le renderer peut aussi gérer)
    bus.subscribe('auth:success', ({ user }) => {
        const groups = user?.groups ?? []
        console.log(`[auth] connecté : ${user?.username} [${groups.join(', ')}]`)
    })
}
