// /assets/js/components/wysedit.js
// (était : /assets/js/ihm/wysedit.js)
// Composant WYSIWYG simple — toggle édition / vue HTML
// Usage réservé aux utilisateurs avertis (innerHTML)
// =============================================================================
// Iter007 — migration ihm/ → components/
//   · Import chemin absolu (cohérence avec les autres composants)
//   · scope → root  (cohérence API initXxx(root = document))
//   ~ initWysedit : guard data-wysedit-init
//     Sans ce guard, un second appel initWysedit(root) sur la même zone
//     crée une seconde instance CpWysedit avec les mêmes subscriptions bus
//     namespaced → chaque événement wysedit:{action}:{id} serait traité 2×.
//   · window.eventBusPublish : désormais dans eventBus.js (Iter007),
//     disponible dès l'import d'eventBus.js — plus besoin de la déclarer ici.
//
// Pas de guard _initialized global : les subscriptions bus sont namespaced
// par instance (wysedit:show:{id}, wysedit:edit:{id}…). Plusieurs zones
// wysedit dans la même page créent chacune leurs propres subscriptions — c'est
// le comportement attendu.
// =============================================================================

import { bus } from '/assets/js/core/eventBus.js'


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
        this._showTextarea()   // état initial : édition
    }

    // ── Binding ───────────────────────────────────────────────────────────────

    _bindEvents() {
        this.toggleBtn?.addEventListener('click', () => this.toggleMode())

        // Subscriptions namespaced par id — plusieurs instances coexistent sans conflit
        bus.subscribe(`wysedit:show:${this.id}`,  () => this._showView())
        bus.subscribe(`wysedit:edit:${this.id}`,  () => this._showTextarea())
        bus.subscribe(`wysedit:clear:${this.id}`, () => this.clear())
        bus.subscribe(`wysedit:set:${this.id}`,   (content)  => this.setContent(content))
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
        this.isEditing ? this._showView() : this._showTextarea()
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

/**
 * Iter007 — initWysedit(root = document)
 *
 * Scanne root à la recherche de .cp_wysedit_zone non encore initialisées.
 * Crée une instance CpWysedit par zone et retourne le tableau d'instances
 * (utile pour un appelant externe qui veut interagir programmatiquement).
 *
 * Guard data-wysedit-init : évite la double-instance sur la même zone.
 * Pas de _initialized global : chaque zone a ses propres subscriptions bus.
 *
 * Note : non enregistré dans CmsArticleWorkbench (composant réservé à l'admin).
 * Sera ajouté dans CmsViewWorkbench (Iter008).
 *
 * window.eventBusPublish est disponible via l'import de eventBus.js.
 * Les boutons HTML peuvent appeler :
 *   window.eventBusPublish(event, 'wysedit:show:monId', null)
 *
 * @param   {Element|Document} root — document (défaut) ou pane ciblé
 * @returns {CpWysedit[]}           — instances créées lors de cet appel
 */
export function initWysedit(root = document)
{
    const zones = [...root.querySelectorAll('.cp_wysedit_zone')]
        .filter(zone => !zone.dataset.wyseditInit)   // guard : déjà initialisé

    const instances = []

    zones.forEach(zone => {
        const instance = new CpWysedit(zone)
        instances.push(instance)
        zone.dataset.wyseditInit = '1'   // marquer après init
    })

    if (instances.length) {
        console.log(`[wysedit] ${instances.length} zone(s) initialisée(s)`)
    }

    return instances
}
