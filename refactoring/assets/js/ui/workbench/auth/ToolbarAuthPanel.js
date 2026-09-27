// assets/js/ui/workbench/auth/ToolbarAuthPanel.js

import AuthPanelBase from '/assets/js/ui/workbench/core/AuthPanelBase.js'
import { create }    from '/assets/js/core/domhelper.js'

export class ToolbarAuthPanel extends AuthPanelBase
{
    constructor()
    {
        super({ selector: '.header-auth' })
    }

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

        wrap.appendChild(create('label', { class: 'sr-only', for: 'auth-email', text: 'Email' }))
        wrap.appendChild(create('input', {
            id: 'auth-email', type: 'email', name: 'email',
            placeholder: 'Email', autocomplete: 'username', required: '',
        }))

        wrap.appendChild(create('label', { class: 'sr-only', for: 'auth-password', text: 'Mot de passe' }))
        wrap.appendChild(create('input', {
            id: 'auth-password', type: 'password', name: 'password',
            placeholder: 'Mot de passe', autocomplete: 'current-password', required: '',
        }))

        const btnLogin = create('button', { type: 'button', class: 'auth-submit' })
        btnLogin.append(
            create('i',    { class: 'fa fa-fw fa-sign-in', 'aria-hidden': 'true' }),
            create('span', { text: 'Connexion' }),
        )
        wrap.appendChild(btnLogin)

        // Bouton Register
        const btnReg = create('button', { type: 'button', class: 'auth-link auth-register-btn' })
        btnReg.append(
            create('i',    { class: 'fa fa-fw fa-user-plus', 'aria-hidden': 'true' }),
            create('span', { text: 'Inscription' }),
        )
        wrap.appendChild(btnReg)

        return wrap
    }
    //----- 2026-09-27-003
    _buildRegisterForm(error = null)
    {
        const wrap = create('div', { class: 'auth-form auth-register-form' })

        if (error)
        {
            wrap.appendChild(create('p', { class: 'auth-error', text: error }))
        }

        const fields = [
            { name: 'shield_username', type: 'text',     placeholder: 'Nom d\'utilisateur', autocomplete: 'username' },
            { name: 'shield_email',    type: 'email',    placeholder: 'Email',              autocomplete: 'email' },
            { name: 'firstpassword',   type: 'password', placeholder: 'Mot de passe',       autocomplete: 'new-password' },
            { name: 'secondpassword',  type: 'password', placeholder: 'Confirmer',          autocomplete: 'new-password' },
            { name: 'client_profil_tel',    type: 'tel',  placeholder: 'Tél. fixe (opt.)' },
            { name: 'client_profil_mobile', type: 'tel',  placeholder: 'Tél. mobile (opt.)' },
            // persid / orgid : stubs — autocomplete ultérieur
            { name: 'client_profil_persid', type: 'number', placeholder: 'Personne ID (opt.)' },
            { name: 'client_profil_orgid',  type: 'number', placeholder: 'Organisation ID (opt.)' },
        ]

        for (const f of fields)
        {
            wrap.appendChild(create('input', {
                type: f.type, name: f.name,
                placeholder: f.placeholder,
                autocomplete: f.autocomplete ?? 'off',
            }))
        }

        const btnSubmit = create('button', { type: 'button', class: 'auth-register-submit' })
        btnSubmit.append(
            create('i',    { class: 'fa fa-fw fa-check', 'aria-hidden': 'true' }),
            create('span', { text: 'Créer le compte' }),
        )
        wrap.appendChild(btnSubmit)
        /* 2026-09-27-003
        const btnBack = create('button', { type: 'button', class: 'auth-link auth-back-login' })
        btnBack.append(
            create('i',    { class: 'fa fa-fw fa-arrow-left', 'aria-hidden': 'true' }),
            create('span', { text: 'Retour' }),
        )
        wrap.appendChild(btnBack)
        */

        return wrap
    }

    _buildRegisterPending(message)
    {
        const wrap = create('div', { class: 'auth-pending' })
        wrap.appendChild(create('p', { class: 'auth-success', text: message ?? 'Vérifiez votre email.' }))
        /* 2026-09-27-003
        const btnBack = create('button', { type: 'button', class: 'auth-link auth-back-login' })
        btnBack.append(
            create('i',    { class: 'fa fa-fw fa-arrow-left', 'aria-hidden': 'true' }),
            create('span', { text: 'Retour connexion' }),
        )
        wrap.appendChild(btnBack)
        */
        return wrap
    }

    /**
     *  Mini barre affichée dans .header-auth pendant l'inscription 
     * ---- 2026-09-27-003
     */
    _buildRegisterToolbar()
    {
        const wrap = create('div', { class: 'auth-form' })

        const btnBack = create('button', { type: 'button', class: 'auth-link auth-back-login' })
        btnBack.append(
            create('i',    { class: 'fa fa-fw fa-arrow-left', 'aria-hidden': 'true' }),
            create('span', { text: 'Retour connexion' }),
        )
        wrap.appendChild(btnBack)
        return wrap
    }

    _buildUserBar(user)
    {
        const isAdmin = (user.groups ?? []).some(g => ['admin', 'superadmin'].includes(g))
        const nodes   = []

        const username = create('span', { class: 'auth-username' })
        username.append(
            create('i',    { class: 'fa fa-fw fa-user-circle-o', 'aria-hidden': 'true' }),
            create('span', { text: ' ' + (user.username ?? '') }),
        )
        nodes.push(username)

        // Board user (tous les connectés, y compris admin)
        const btnUser = create('button', { type: 'button', class: 'auth-link auth-board-user' })
        btnUser.append(
            create('i',    { class: 'fa fa-fw fa-th-large', 'aria-hidden': 'true' }),
            create('span', { text: 'Board' }),
        )
        nodes.push(btnUser)

        // Board admin (groupes admin / superadmin)
        if (isAdmin)
        {
            const btnAdmin = create('button', { type: 'button', class: 'auth-link auth-board-admin' })
            btnAdmin.append(
                create('i',    { class: 'fa fa-fw fa-cog', 'aria-hidden': 'true' }),
                create('span', { text: 'Admin' }),
            )
            nodes.push(btnAdmin)
        }

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
