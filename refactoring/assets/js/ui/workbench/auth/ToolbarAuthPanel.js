// assets/js/ui/workbench/auth/ToolbarAuthPanel.js
// ─────────────────────────────────────────────────────────────────────────────
// Panel auth de la barre de navigation — cible .header-auth.
//
// Implémente les builders DOM de AuthPanelBase via create().
// Ne contient aucune logique — uniquement de la présentation.
// ─────────────────────────────────────────────────────────────────────────────

import AuthPanelBase from '/assets/js/ui/workbench/core/AuthPanelBase.js'
import { create }    from '/assets/js/core/domhelper.js'

export class ToolbarAuthPanel extends AuthPanelBase
{
    constructor()
    {
        super({ selector: '.header-auth' })
    }

    // ── Builders DOM ──────────────────────────────────────────────────────────

    _buildLoading()
    {
        const wrap = create('span', { class: 'auth-loading' })
        wrap.appendChild(create('i', { class: 'fa fa-spinner fa-spin', 'aria-hidden': 'true' }))
        return wrap
    }

    _buildGuestForm(error = null)
    {
        const wrap = create('div', { class: 'auth-form' })

        if (error)
        {
            wrap.appendChild(create('p', { class: 'auth-error', text: error }))
        }

        // Email
        wrap.appendChild(create('label', { class: 'sr-only', for: 'auth-email', text: 'Email' }))
        wrap.appendChild(create('input', {
            id          : 'auth-email',
            type        : 'email',
            name        : 'email',
            placeholder : 'Email',
            autocomplete: 'username',
            required    : '',
        }))

        // Mot de passe
        wrap.appendChild(create('label', { class: 'sr-only', for: 'auth-password', text: 'Mot de passe' }))
        wrap.appendChild(create('input', {
            id          : 'auth-password',
            type        : 'password',
            name        : 'password',
            placeholder : 'Mot de passe',
            autocomplete: 'current-password',
            required    : '',
        }))

        // Bouton
        const btn = create('button', { type: 'button', class: 'auth-submit' })
        btn.append(
            create('i',    { class: 'fa fa-fw fa-sign-in', 'aria-hidden': 'true' }),
            create('span', { text: 'Connexion' }),
        )
        wrap.appendChild(btn)

        return wrap
    }

    _buildUserBar(user)
    {
        const isAdmin = (user.groups ?? []).some(g => ['admin', 'superadmin'].includes(g))
        const nodes   = []

        // Nom d'utilisateur
        const username = create('span', { class: 'auth-username' })
        username.append(
            create('i',    { class: 'fa fa-fw fa-user-circle-o', 'aria-hidden': 'true' }),
            create('span', { text: ' ' + (user.username ?? '') }),
        )
        nodes.push(username)

        // Admin (conditionnel)
        if (isAdmin)
        {
            const admin = create('a', { class: 'auth-link', href: '/admin' })
            admin.append(
                create('i',    { class: 'fa fa-fw fa-cog', 'aria-hidden': 'true' }),
                create('span', { text: 'Admin' }),
            )
            nodes.push(admin)
        }

        // Board
        const board = create('a', { class: 'auth-link', href: '/user' })
        board.append(
            create('i',    { class: 'fa fa-fw fa-th-large', 'aria-hidden': 'true' }),
            create('span', { text: 'Board' }),
        )
        nodes.push(board)

        // Déconnexion
        const logoutBtn = create('button', { type: 'button', class: 'auth-link auth-logout' })
        logoutBtn.append(
            create('i',    { class: 'fa fa-fw fa-sign-out', 'aria-hidden': 'true' }),
            create('span', { text: 'Déconnexion' }),
        )
        nodes.push(logoutBtn)

        return nodes
    }
}

export default ToolbarAuthPanel
