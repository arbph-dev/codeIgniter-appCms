// assets/js/ui/workbench/core/AuthPanelBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Base des panels d'authentification.
//
// Différence avec PanelBase / ListPanelBase :
//   • Ne crée PAS son container — il prend le contrôle d'un élément existant
//   • render() est remplacé par init(selector) — pattern WorkbenchBase
//   • Le bus est la seule source d'état — pas de show(data) externe
//
// Ce que AuthPanelBase ne fait PAS :
//   • aucun appel API
//   • aucun import authStore
//   • aucune logique métier auth
// ─────────────────────────────────────────────────────────────────────────────
// Contrat sous-classes :
//   _buildLoading()              → HTMLElement
//   _buildGuestForm(error)       → HTMLElement
//   _buildRegisterForm(error)    → HTMLElement   ← NOUVEAU
//   _buildUserBar(user)          → HTMLElement[]
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase from '/assets/js/ui/workbench/core/PanelBase.js'
import { bus }   from '/assets/js/core/eventBus.js'
import { clear } from '/assets/js/core/domhelper.js'

export class AuthPanelBase extends PanelBase
{
    /**
     * @param {object} options
     * @param {string} options.selector  Sélecteur de la zone toolbar (.header-auth)
     */
    constructor({ selector } = {})
    {
        super()
        this._selector = selector
        this._target   = null
        this._user     = null

        this._onLoading         = null
        this._onSuccess         = null
        this._onGuest           = null
        this._onError           = null
        this._onRegisterPending = null
    }

    init()
    {
        this._target = document.querySelector(this._selector)

        if (!this._target)
        {
            console.error(`[${this.constructor.name}] Cible introuvable : "${this._selector}"`)
            return this
        }

        this._subscribeBus()
        return this
    }

    // ── Bus ───────────────────────────────────────────────────────────────────

    _subscribeBus()
    {
        this._onLoading = (on)       => { if (on) this._render('loading') }
        this._onSuccess = ({ user }) => { this._user = user; this._render('user') }
        this._onGuest   = ()         => { this._user = null; this._render('guest') }
        this._onError   = (msg)      => this._render('error', msg)

        this._onRegisterPending = ({ message }) => this._render('register-pending', message)

        bus.subscribe('auth:loading',          this._onLoading)
        bus.subscribe('auth:success',          this._onSuccess)
        bus.subscribe('auth:guest',            this._onGuest)
        bus.subscribe('auth:error',            this._onError)
        bus.subscribe('auth:register:pending', this._onRegisterPending)

        // Ouverture formulaire register depuis un bouton externe éventuel
        bus.subscribe('auth:show-register', () => this._render('register'))
    }

    //----- 2026-09-27-003 ---------------  helpers
    /** Conteneur du board user */
    _boardBody()
    {
        return document.querySelector('#user-board-body')
    }

    _mountRegisterForm(error = null)
    {
        const body = this._boardBody()
        if (!body) return

        clear(body)
        body.appendChild(this._buildRegisterForm(error))
        this._bindRegister()          // écoute .auth-register-submit dans le board
    }

    _mountRegisterPending(message)
    {
        const body = this._boardBody()
        if (!body) return

        clear(body)
        body.appendChild(this._buildRegisterPending(message))
    }

    /** Mini barre toolbar pendant l'inscription */
    _buildRegisterToolbar()
    {
        // Défaut — surchargeable dans ToolbarAuthPanel
        const wrap = document.createElement('div')
        wrap.className = 'auth-form'
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'auth-link auth-back-login'
        btn.textContent = 'Retour connexion'
        wrap.appendChild(btn)
        return wrap
    }    

    _clearBoardBody()
    {
        const body = this._boardBody()
        if (body) clear(body)
    }

    // ── Render ────────────────────────────────────────────────────────────────

    _render(state, payload = null)
    {
        if (!this._target) return

        clear(this._target)

        switch (state)
        {
            case 'loading':
                this._target.appendChild(this._buildLoading())
                break

            case 'guest':
                this._clearBoardBody() //----- 2026-09-27-003
                this._target.appendChild(this._buildGuestForm())
                this._bindForm()
                this._bindShowRegister()
                break


            case 'error':
                // erreur login → guest form + message
                this._target.appendChild(this._buildGuestForm(payload))
                this._bindForm()
                this._bindShowRegister()
                break

            // Dans _render() — remplacer le case 'register' :

            case 'register':
                // Toolbar : mini barre « retour »
                this._target.appendChild(this._buildRegisterToolbar())
                this._bindShowGuest()
                // Formulaire injecté dans le board user
                this._mountRegisterForm(payload)   // payload = message d'erreur éventuel
                bus.publish('board:register')
                break

            case 'register-pending':
                this._mountRegisterPending(payload)
                bus.publish('board:register')
                this._target.appendChild(this._buildRegisterToolbar())
                this._bindShowGuest()
                break

            //----- 2026-09-27-003
            case 'user':
                this._clearBoardBody() //----- 2026-09-27-003
                this._buildUserBar(this._user).forEach(el => this._target.appendChild(el))
                this._bindLogout()
                this._bindUser()
                this._bindAdmin()
                break

        }
    }

    // ── Bindings communs ──────────────────────────────────────────────────────

    _bindForm()
    {
        const phpForm = this._target.querySelector('form')
        if (phpForm)
        {
            phpForm.addEventListener('submit', (e) =>
            {
                e.preventDefault()
                this._emitLogin()
            })
        }

        this._target.querySelector('.auth-submit')
            ?.addEventListener('click', () => this._emitLogin())
    }

    _bindShowRegister()
    {
        this._target.querySelector('.auth-register-btn')
            ?.addEventListener('click', () => this._render('register'))
    }

    _bindShowGuest()
    {
        this._target.querySelector('.auth-back-login')
            ?.addEventListener('click', () => this._render('guest'))
    }
    //----- 2026-09-27-003 _bindRegister doit cibler le board, pas seulement this._target
    _bindRegister()
    {
        /*this._target.querySelector('.auth-register-submit')
            ?.addEventListener('click', () => this._emitRegister())*/
        const body = this._boardBody()
            if (!body) return

            body.querySelector('.auth-register-submit')
                ?.addEventListener('click', () => this._emitRegister())        
    }

    _bindLogout()
    {
        this._target.querySelector('.auth-logout')
            ?.addEventListener('click', () => bus.publish('auth:logout'))
    }

    _bindUser()
    {
        this._target.querySelector('.auth-board-user')
            ?.addEventListener('click', () => bus.publish('board:user'))
    }

    _bindAdmin()
    {
        this._target.querySelector('.auth-board-admin')
            ?.addEventListener('click', () => bus.publish('board:admin'))
    }

    _emitLogin()
    {
        const email    = this._target.querySelector('[name="email"]')?.value?.trim()
        const password = this._target.querySelector('[name="password"]')?.value?.trim()
        if (email && password) bus.publish('auth:login', { email, password })
    }

    /**
     * Valide firstpassword / secondpassword, fusionne en shield_password,
     * puis publie auth:register.
     * ----- 2026-09-27-003
     * _emitRegister lit les champs depuis le board - const root
     */

    _emitRegister()
    {
        /*
        const username = this._target.querySelector('[name="shield_username"]')?.value?.trim()
        const email    = this._target.querySelector('[name="shield_email"]')?.value?.trim()
        const pass1    = this._target.querySelector('[name="firstpassword"]')?.value ?? ''
        const pass2    = this._target.querySelector('[name="secondpassword"]')?.value ?? ''

        const tel    = this._target.querySelector('[name="client_profil_tel"]')?.value?.trim()    || null
        const mobile = this._target.querySelector('[name="client_profil_mobile"]')?.value?.trim() || null
        const persid = this._target.querySelector('[name="client_profil_persid"]')?.value?.trim() || null
        const orgid  = this._target.querySelector('[name="client_profil_orgid"]')?.value?.trim()  || null
        */
        const root = this._boardBody() ?? this._target // _emitRegister lit les champs depuis le board

        const username = root.querySelector('[name="shield_username"]')?.value?.trim()
        const email    = root.querySelector('[name="shield_email"]')?.value?.trim()
        const pass1    = root.querySelector('[name="firstpassword"]')?.value ?? ''
        const pass2    = root.querySelector('[name="secondpassword"]')?.value ?? ''

        const tel    = root.querySelector('[name="client_profil_tel"]')?.value?.trim()    || null
        const mobile = root.querySelector('[name="client_profil_mobile"]')?.value?.trim() || null
        const persid = root.querySelector('[name="client_profil_persid"]')?.value?.trim() || null
        const orgid  = root.querySelector('[name="client_profil_orgid"]')?.value?.trim()  || null        
        
        // Validation mots de passe
        if (pass1 !== pass2)
        {
            this._render('register', 'Les mots de passe ne correspondent pas.')
            return
        }

        const complexity = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
        if (!complexity.test(pass1))
        {
            this._render('register',
                'Mot de passe trop faible (min. 8 car., 1 majuscule, 1 chiffre, 1 caractère spécial).')
            return
        }

        if (!username || !email)
        {
            this._render('register', 'Nom d\'utilisateur et email obligatoires.')
            return
        }

        bus.publish('auth:register', {
            shield_username:      username,
            shield_email:         email,
            shield_password:      pass1,
            client_profil_tel:    tel,
            client_profil_mobile: mobile,
            client_profil_persid: persid ? Number(persid) : null,
            client_profil_orgid:  orgid  ? Number(orgid)  : 0,
        })
    }

    // ── Hooks ─────────────────────────────────────────────────────────────────

    _buildLoading()
    {
        throw new Error(`[${this.constructor.name}] _buildLoading() non implémenté`)
    }

    _buildGuestForm(error = null)
    {
        throw new Error(`[${this.constructor.name}] _buildGuestForm() non implémenté`)
    }

    /** @returns {HTMLElement} */
    _buildRegisterForm(error = null)
    {
        throw new Error(`[${this.constructor.name}] _buildRegisterForm() non implémenté`)
    }

    /** Message post-inscription (email à valider) */
    _buildRegisterPending(message)
    {
        // Défaut minimal — surchargeable
        const wrap = document.createElement('div')
        wrap.className = 'auth-pending'
        wrap.textContent = message ?? 'Vérifiez votre email.'
        return wrap
    }

    _buildUserBar(user)
    {
        throw new Error(`[${this.constructor.name}] _buildUserBar() non implémenté`)
    }

    destroy()
    {
        bus.unsubscribe('auth:loading',          this._onLoading)
        bus.unsubscribe('auth:success',          this._onSuccess)
        bus.unsubscribe('auth:guest',            this._onGuest)
        bus.unsubscribe('auth:error',            this._onError)
        bus.unsubscribe('auth:register:pending', this._onRegisterPending)

        this._onLoading = this._onSuccess = this._onGuest = this._onError = null
        this._onRegisterPending = null

        if (this._target) clear(this._target)
        this._target = null
        this._user   = null

        super.destroy()
    }
}

export default AuthPanelBase
