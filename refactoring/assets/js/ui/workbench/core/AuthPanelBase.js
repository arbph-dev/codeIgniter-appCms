// assets/js/ui/workbench/core/AuthPanelBase.js
// ─────────────────────────────────────────────────────────────────────────────
// Base des panels d'authentification.
//
// Différence avec PanelBase / ListPanelBase :
//   • Ne crée PAS son container — il prend le contrôle d'un élément existant
//   • render() est remplacé par init(selector) — pattern WorkbenchBase
//   • Le bus est la seule source d'état — pas de show(data) externe
//
// Contrat sous-classes :
//   _buildLoading()           → HTMLElement
//   _buildGuestForm(error)    → HTMLElement
//   _buildUserBar(user)       → HTMLElement[]
//
// Ce que AuthPanelBase ne fait PAS :
//   • aucun appel API
//   • aucun import authStore
//   • aucune logique métier auth
// ─────────────────────────────────────────────────────────────────────────────

import PanelBase   from '/assets/js/ui/workbench/core/PanelBase.js'
import { bus }     from '/assets/js/core/eventBus.js'
import { clear }   from '/assets/js/core/domhelper.js'

export class AuthPanelBase extends PanelBase
{
    /**
     * @param {object} options
     * @param {string} options.selector  Sélecteur CSS de la zone cible (déjà dans le DOM)
     */
    constructor({ selector } = {})
    {
        super()
        this._selector = selector
        this._target   = null
        this._user     = null

        // Stockés pour unsubscribe propre dans destroy()
        this._onLoading = null
        this._onSuccess = null
        this._onGuest   = null
        this._onError   = null
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    /**
     * Trouve la cible dans le DOM et branche le bus.
     * Remplace render() — le container existe déjà, on n'en crée pas.
     */
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

        bus.subscribe('auth:loading', this._onLoading)
        bus.subscribe('auth:success', this._onSuccess)
        bus.subscribe('auth:guest',   this._onGuest)
        bus.subscribe('auth:error',   this._onError)
    }

    // ── Render interne ────────────────────────────────────────────────────────

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
                this._target.appendChild(this._buildGuestForm())
                this._bindForm()
                break

            case 'error':
                this._target.appendChild(this._buildGuestForm(payload))
                this._bindForm()
                break

            case 'user':
                this._buildUserBar(this._user).forEach(el => this._target.appendChild(el))
                this._bindLogout()
                break
        }
    }

    // ── Binding commun ────────────────────────────────────────────────────────

    _bindForm()
    {
        // Progressive enhancement — intercepte aussi un form PHP si présent
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

    _bindLogout()
    {
        this._target.querySelector('.auth-logout')
            ?.addEventListener('click', () => bus.publish('auth:logout'))
    }

    _emitLogin()
    {
        const email    = this._target.querySelector('[name="email"]')?.value?.trim()
        const password = this._target.querySelector('[name="password"]')?.value?.trim()
        if (email && password) bus.publish('auth:login', { email, password })
    }

    // ── Hooks — à implémenter ─────────────────────────────────────────────────

    /** @returns {HTMLElement} */
    _buildLoading()
    {
        throw new Error(`[${this.constructor.name}] _buildLoading() non implémenté`)
    }

    /**
     * @param {string|null} error
     * @returns {HTMLElement}
     */
    _buildGuestForm(error = null)
    {
        throw new Error(`[${this.constructor.name}] _buildGuestForm() non implémenté`)
    }

    /**
     * @param {object} user
     * @returns {HTMLElement[]}
     */
    _buildUserBar(user)
    {
        throw new Error(`[${this.constructor.name}] _buildUserBar() non implémenté`)
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    destroy()
    {
        bus.unsubscribe('auth:loading', this._onLoading)
        bus.unsubscribe('auth:success', this._onSuccess)
        bus.unsubscribe('auth:guest',   this._onGuest)
        bus.unsubscribe('auth:error',   this._onError)

        this._onLoading = null
        this._onSuccess = null
        this._onGuest   = null
        this._onError   = null

        if (this._target) clear(this._target)
        this._target = null
        this._user   = null

        super.destroy()
    }
}

export default AuthPanelBase
