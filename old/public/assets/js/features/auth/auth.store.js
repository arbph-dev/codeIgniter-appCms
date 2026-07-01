// js/features/auth/auth.store.js

export const authStore = {
    user:     null,    // { id, username, email, groups, permissions }
    token:    null,    // Personal Access Token (sessionStorage)
    loggedIn: false,
    loading:  false,
    error:    null,

    // ── Persistence sessionStorage ───────────────────────────────────────────

    persist() {
        if (this.token) {
            sessionStorage.setItem('auth_token', this.token)
        }
        if (this.user) {
            sessionStorage.setItem('auth_user', JSON.stringify(this.user))
        }
    },

    restore() {
        this.token = sessionStorage.getItem('auth_token') || null
        const raw  = sessionStorage.getItem('auth_user')
        this.user  = raw ? JSON.parse(raw) : null
        this.loggedIn = !!this.token && !!this.user
    },

    clear() {
        this.user     = null
        this.token    = null
        this.loggedIn = false
        this.error    = null
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
    },

    // ── Helpers ──────────────────────────────────────────────────────────────

    inGroup(group) {
        return this.user?.groups?.includes(group) ?? false
    },

    can(permission) {
        return this.user?.permissions?.includes(permission) ?? false
    },

    isAdmin() {
        return this.inGroup('admin') || this.inGroup('superadmin')
    },
}
