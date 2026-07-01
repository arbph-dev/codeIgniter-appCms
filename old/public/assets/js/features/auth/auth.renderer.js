// js/features/auth/auth.renderer.js
// Met à jour .header-auth dynamiquement — aucun rechargement de page

import { bus }       from '../../core/eventBus.js'
import { authStore } from './auth.store.js'

// ── Templates ────────────────────────────────────────────────────────────────

function tplGuest(error = null) {
    return `
        ${error ? `<div class="auth-error">${error}</div>` : ''}
        <form class="auth-form" id="authLoginForm" onsubmit="return false">
            <label class="sr-only" for="auth-email">Email</label>
            <input id="auth-email" type="email" name="email"
                   placeholder="Email" autocomplete="username" required>
            <label class="sr-only" for="auth-password">Mot de passe</label>
            <input id="auth-password" type="password" name="password"
                   placeholder="Mot de passe" autocomplete="current-password" required>
            <button type="submit" id="authSubmitBtn">
                <i class="fa fa-fw fa-sign-in"></i>
                <span>Login</span>
            </button>
        </form>
    `
}

function tplLoading() {
    return `<span class="auth-loading"><i class="fa fa-spinner fa-spin"></i></span>`
}

function tplUser(user) {
    const isAdmin = (user.groups ?? []).some(g => g === 'admin' || g === 'superadmin')
    return `
        <span class="auth-username">
            <i class="fa fa-fw fa-user-circle-o"></i>
            ${user.username ?? ''}
        </span>
        ${isAdmin ? `
        <a class="auth-link" href="/admin">
            <i class="fa fa-fw fa-cog"></i><span>Admin</span>
        </a>` : ''}
        <a class="auth-link" href="/user">
            <i class="fa fa-fw fa-th-large"></i><span>Board</span>
        </a>
        <button class="auth-link auth-logout" id="authLogoutBtn" type="button">
            <i class="fa fa-fw fa-sign-out"></i><span>Logout</span>
        </button>
    `
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPanel() {
    return document.querySelector('.header-auth')
}

function bindLoginForm() {
    const form = document.getElementById('authLoginForm')
    if (!form) return

    form.addEventListener('submit', () => {
        const email    = form.querySelector('[name="email"]')?.value?.trim()
        const password = form.querySelector('[name="password"]')?.value?.trim()
        if (!email || !password) return
        bus.publish('auth:login', { email, password })
    })
}

function bindLogoutBtn() {
    document.getElementById('authLogoutBtn')
        ?.addEventListener('click', () => bus.publish('auth:logout'))
}

// ── Rendu principal ───────────────────────────────────────────────────────────

function render(state) {
    const panel = getPanel()
    if (!panel) return

    if (state === 'loading') {
        panel.innerHTML = tplLoading()
        return
    }

    if (state === 'guest') {
        panel.innerHTML = tplGuest()
        bindLoginForm()
        return
    }

    if (state === 'error') {
        panel.innerHTML = tplGuest(authStore.error)
        bindLoginForm()
        return
    }

    if (state === 'user') {
        panel.innerHTML = tplUser(authStore.user)
        bindLogoutBtn()
        return
    }
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initAuthRenderer() {

    // Interception du form PHP existant (cas où JS charge après le HTML Shield)
    const phpForm = document.querySelector('.auth-form[action="/login"]')
    if (phpForm) {
        phpForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const email    = phpForm.querySelector('[name="email"]')?.value?.trim()
            const password = phpForm.querySelector('[name="password"]')?.value?.trim()
            if (email && password) bus.publish('auth:login', { email, password })
        })
    }

    // ── Abonnements bus ───────────────────────────────────────────────────────

    bus.subscribe('auth:loading', (loading) => {
        if (loading) render('loading')
    })

    bus.subscribe('auth:guest', () => {
        render('guest')
    })

    bus.subscribe('auth:success', () => {
        render('user')
    })

    bus.subscribe('auth:error', () => {
        render('error')
    })

    // auth:changed — re-render complet selon l'état du store
    bus.subscribe('auth:changed', () => {
        render(authStore.loggedIn ? 'user' : 'guest')
    })

    // ── CSS inline (injecté une seule fois) ───────────────────────────────────
    if (!document.getElementById('auth-renderer-style')) {
        const style = document.createElement('style')
        style.id    = 'auth-renderer-style'
        style.textContent = `
            .auth-loading {
                color: inherit;
                font-size: 1.2rem;
                padding: 0 8px;
            }
            .auth-error {
                background: rgba(231,76,60,0.15);
                border: 1px solid #e74c3c;
                color: #e74c3c;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #authSubmitBtn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `
        document.head.appendChild(style)
    }
}
