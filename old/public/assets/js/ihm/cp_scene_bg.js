// /assets/js/ihm/cp_scene_bg.js
//
// ══════════════════════════════════════════════════════════════════════════════
// Fond SVG animé pour les scènes .cp_scene
//
// Injection d'un SVG inline (position:absolute, inset:0) remplaçant le
// background-image CSS. Compatible avec z-index des .cp_actor existants.
//
// Éléments animés :
//   · Ciel dégradé nuit (radialGradient)
//   · 55 étoiles scintillantes (animate attributeName="opacity")
//   · Lune croissant
//   · 2 chandelles avec flamme vacillante
//
// Déclenchement : tabs:switch (article contenant la scène devient visible).
// Chaque .cp_scene n'est initialisé qu'une seule fois (WeakSet).
// ══════════════════════════════════════════════════════════════════════════════

import { bus } from '../core/eventBus.js'

const SCENE_SELECTOR = '.cp_scene'
const initialized    = new WeakSet()

// ── Générateur d'étoiles ──────────────────────────────────────────────────────

function generateStars(count = 55) {
    return Array.from({ length: count }, () => {
        const x       = (2 + Math.random() * 96).toFixed(1)
        const y       = (1 + Math.random() * 62).toFixed(1)
        const r       = (0.3 + Math.random() * 0.85).toFixed(2)
        const opBase  = (0.3 + Math.random() * 0.65).toFixed(2)
        const opHigh  = (parseFloat(opBase) + 0.25 + Math.random() * 0.1).toFixed(2)
        const dur     = (1.5 + Math.random() * 2.8).toFixed(1)
        const begin   = (Math.random() * 5).toFixed(1)
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="white">
    <animate attributeName="opacity"
        values="${opBase};${opHigh};${opBase * 0.4};${opHigh};${opBase}"
        dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
</circle>`
    }).join('\n')
}

// ── Générateur chandelle ──────────────────────────────────────────────────────

function buildCandle(cx, stemY, dur = '0.42s') {
    const fy = stemY         // base flamme = haut de la bougie
    return `
    <rect x="${cx - 1.2}" y="${stemY}" width="2.4" height="7" fill="#c8960a" rx="0.4"/>
    <!-- Flamme extérieure -->
    <ellipse cx="${cx}" cy="${fy - 1}" rx="1.1" ry="2.2" fill="#ff8c00" opacity="0.95">
        <animate attributeName="ry"
            values="2.2;3.1;1.9;2.7;2.2"
            dur="${dur}" repeatCount="indefinite"/>
        <animate attributeName="cy"
            values="${fy - 1};${fy - 1.6};${fy - 0.5};${fy - 1.3};${fy - 1}"
            dur="${dur}" repeatCount="indefinite"/>
        <animate attributeName="rx"
            values="1.1;0.9;1.3;0.95;1.1"
            dur="${dur}" repeatCount="indefinite"/>
    </ellipse>
    <!-- Cœur de flamme (jaune) -->
    <ellipse cx="${cx}" cy="${fy - 1.8}" rx="0.6" ry="1.3" fill="#fff176" opacity="0.9">
        <animate attributeName="ry"
            values="1.3;2;1;1.6;1.3"
            dur="${dur}" repeatCount="indefinite"/>
        <animate attributeName="cy"
            values="${fy - 1.8};${fy - 2.3};${fy - 1.3};${fy - 2};${fy - 1.8}"
            dur="${dur}" repeatCount="indefinite"/>
    </ellipse>
    <!-- Mèche -->
    <line x1="${cx}" y1="${stemY}" x2="${cx}" y2="${fy - 0.5}" stroke="#333" stroke-width="0.3"/>`
}

// ── Constructeur SVG ──────────────────────────────────────────────────────────

function buildSVG(uid) {
    const gradId = `skyG_${uid}`
    const glowId = `glow_${uid}`
    const stars  = generateStars(55)

    return `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
    style="position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;"
    aria-hidden="true">

    <defs>
        <radialGradient id="${gradId}" cx="50%" cy="20%" r="85%">
            <stop offset="0%"   stop-color="#1a237e"/>
            <stop offset="50%"  stop-color="#0d1240"/>
            <stop offset="100%" stop-color="#04000f"/>
        </radialGradient>
        <filter id="${glowId}" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>

    <!-- Ciel nocturne -->
    <rect width="100" height="100" fill="url(#${gradId})"/>

    <!-- Étoiles -->
    ${stars}

    <!-- Lune croissant -->
    <circle cx="79" cy="11" r="8" fill="#fffde7" filter="url(#${glowId})"/>
    <circle cx="83" cy="9"  r="7.2" fill="#04000f"/>

    <!-- Halo de lune -->
    <circle cx="79" cy="11" r="11" fill="none" stroke="#fffde7" stroke-width="0.3" opacity="0.2"/>

    <!-- Sol sombre (horizon) -->
    <rect y="86" width="100" height="14" fill="#030008"/>

    <!-- Chandelles -->
    ${buildCandle(8, 82, '0.44s')}
    ${buildCandle(92, 82, '0.38s')}

</svg>`
}

// ── Injection dans une scène ──────────────────────────────────────────────────

let _uidCounter = 0

function injectBackground(scene) {
    if (initialized.has(scene)) return
    initialized.add(scene)

    const uid = ++_uidCounter

    // Retire le fond photo (il serait masqué de toute façon)
    scene.style.backgroundImage = 'none'
    scene.insertAdjacentHTML('afterbegin', buildSVG(uid))

    console.log(`[scene_bg] SVG injecté dans .cp_scene (uid=${uid})`)
}

// ── Scan article ──────────────────────────────────────────────────────────────

function checkAndInject(articleId) {
    const article = document.getElementById(articleId)
    if (!article) return
    article.querySelectorAll(SCENE_SELECTOR).forEach(injectBackground)
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initSceneBg() {
    // Réagit aux changements d'onglet
    bus.subscribe('tabs:switch', ({ name }) => checkAndInject(name))

    // Traite les articles déjà visibles au chargement (premier onglet)
    document.querySelectorAll('article').forEach(art => {
        if (getComputedStyle(art).display !== 'none') checkAndInject(art.id)
    })

    console.log('[scene_bg] init')
}
