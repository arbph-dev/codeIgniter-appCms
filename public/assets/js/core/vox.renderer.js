// /assets/js/core/vox.renderer.js
//
// ══════════════════════════════════════════════════════════════════════════════
// Rendu UI du moteur Vox — AUCUNE logique de synthèse ici.
//
// Responsabilités :
//   · Afficher la phrase en cours dans l'élément statusId
//   · Surligner le mot prononcé (word boundary)
//   · Activer visuellement l'acteur qui parle (.cp_actor--speaking)
//   · Rendre la liste des voix disponibles
//
// Événements consommés (bus) :
//   vox:start        { statusId, alias, sentence, index }
//   vox:end          { statusId }
//   vox:highlight    { html, statusId }
//   vox:voices:list  { voices: [{name, lang, default}] }
//
// Aucune référence DOM codée en dur — tout passe par statusId et data-alias.
// ══════════════════════════════════════════════════════════════════════════════

import { bus } from './eventBus.js'

// ── Helpers DOM ───────────────────────────────────────────────────────────────

function getEl(id) {
    return id ? document.getElementById(id) : null
}

/**
 * Bascule .cp_actor--speaking sur l'acteur dont [data-alias] === alias.
 * Passe null pour retirer la classe de tous.
 */
function setActorSpeaking(alias) {
    document.querySelectorAll('.cp_actor').forEach(el => {
        el.classList.toggle(
            'cp_actor--speaking',
            alias !== null && el.dataset.alias === alias
        )
    })
}

// ── Handlers ──────────────────────────────────────────────────────────────────

function onStart({ statusId, alias, sentence } = {}) {
    const el = getEl(statusId)
    if (el) el.innerHTML = sentence ?? ''
    setActorSpeaking(alias ?? null)
}

function onEnd({ statusId } = {}) {
    const el = getEl(statusId)
    if (el) el.textContent = '—'
    setActorSpeaking(null)
}

function onHighlight({ html, statusId } = {}) {
    const el = getEl(statusId)
    if (el) el.innerHTML = html
}

/**
 * Rendu de la liste des voix disponibles dans #VOX_VOICES_LIST.
 * Migré depuis vox.js / initVoxBus — DOM isolé ici.
 */
function onVoicesList({ voices = [] } = {}) {
    const target = getEl('VOX_VOICES_LIST')
    if (!target) return

    target.innerHTML = voices.map(v => `
        <div class="vox_voice_item" style="margin:4px 0;display:flex;gap:8px;align-items:center;">
            <span><b>${v.name}</b> <small>(${v.lang})</small></span>
            <button onclick="window.eventBusPublish(event,'vox:setVoice',{name:'${v.name}'})">
                Sélectionner
            </button>
            <button onclick="
                window.eventBusPublish(event,'vox:setVoice',{name:'${v.name}'});
                window.eventBusPublish(event,'vox:speak',{text:'Bonjour. Test de la voix.'});">
                Tester
            </button>
        </div>`
    ).join('')
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initVoxRenderer() {
    bus.subscribe('vox:start',       onStart)
    bus.subscribe('vox:end',         onEnd)
    bus.subscribe('vox:highlight',   onHighlight)
    bus.subscribe('vox:voices:list', onVoicesList)
    console.log('[vox.renderer] init')
}
