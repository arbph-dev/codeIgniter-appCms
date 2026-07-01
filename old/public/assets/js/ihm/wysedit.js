// js/ihm/wysedit.js
// Composant WYSIWYG simple — toggle édition / vue HTML
// Usage réservé aux utilisateurs avertis (innerHTML)

import { bus } from '../core/eventBus.js'

// ── Classe principale ─────────────────────────────────────────────────────────

class CpWysedit {
    constructor(rootElement) {
        this.root      = rootElement
        this.id        = rootElement.id || Math.random().toString(36).slice(2)
        this.textarea  = rootElement.querySelector('.cp_wysedit_textarea')
        this.view      = rootElement.querySelector('.cp_wysedit_view')
        this.toggleBtn = rootElement.querySelector('.cp_wysedit_toggle')
        this.isEditing = true

        this._bindEvents()
        this._showTextarea() // état initial : édition
    }

    // ── Binding ───────────────────────────────────────────────────────────────

    _bindEvents() {
        // Bouton toggle
        this.toggleBtn?.addEventListener('click', () => this.toggleMode())

        // Bus global — écoute les événements ciblant cet id
        bus.subscribe(`wysedit:show:${this.id}`,  () => this._showView())
        bus.subscribe(`wysedit:edit:${this.id}`,  () => this._showTextarea())
        bus.subscribe(`wysedit:clear:${this.id}`, () => this.clear())
        bus.subscribe(`wysedit:set:${this.id}`,   (content) => this.setContent(content))
        bus.subscribe(`wysedit:get:${this.id}`,   (callback) => {
            if (typeof callback === 'function') callback(this.getContent())
        })
    }

    // ── Modes ─────────────────────────────────────────────────────────────────

    _showTextarea() {
        if (!this.textarea || !this.view) return
        this.textarea.style.display = 'block'
        this.view.style.display     = 'none'
        if (this.toggleBtn) this.toggleBtn.textContent = 'Aperçu'
        this.isEditing = true
        bus.publish(`wysedit:mode:${this.id}`, 'edit')
    }

    _showView() {
        if (!this.textarea || !this.view) return
        // innerHTML — usage réservé aux utilisateurs avertis
        this.view.innerHTML         = this.textarea.value
        this.textarea.style.display = 'none'
        this.view.style.display     = 'block'
        if (this.toggleBtn) this.toggleBtn.textContent = 'Éditer'
        this.isEditing = false
        bus.publish(`wysedit:mode:${this.id}`, 'view')
    }

    toggleMode() {
        if (this.isEditing) {
            this._showView()
        } else {
            this._showTextarea()
        }
    }

    // ── API publique ──────────────────────────────────────────────────────────

    getContent() {
        return this.textarea?.value ?? ''
    }

    setContent(html) {
        if (this.textarea) this.textarea.value = html
        if (!this.isEditing && this.view) this.view.innerHTML = html
    }

    clear() {
        if (this.textarea) this.textarea.value = ''
        if (this.view)     this.view.innerHTML  = ''
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initWysedit(scope = document) {
    const zones    = scope.querySelectorAll('.cp_wysedit_zone')
    const instances = []

    zones.forEach(zone => {
        const instance = new CpWysedit(zone)
        instances.push(instance)
    })

    // Expose window.eventBusPublish → bus (déjà défini dans index.php)
    // Les boutons HTML peuvent donc appeler :
    // window.eventBusPublish(null, 'wysedit:show:monId', null)

    return instances
}
