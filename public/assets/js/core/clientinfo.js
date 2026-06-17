// /assets/js/core/clientinfo.js
import { bus } from './eventBus.js'

/**
 * Sonde les capacités du navigateur et les publie sur le bus ('client:info').
 * Utile pour les décisions d'interface que le CSS ne peut pas prendre
 * (présence du tactile, permissions, speech synthesis, connexion réseau, etc.)
 *
 * Usage dans index.php :
 *   import { probeClientCapabilities } from '/assets/js/core/clientinfo.js'
 *   const info = await probeClientCapabilities()
 */
export async function probeClientCapabilities() {

    // ── 1. Écran et fenêtre ─────────────────────────────────────────────────
    const screenInfo = {
        width         : screen.width,
        height        : screen.height,
        availWidth    : screen.availWidth,
        availHeight   : screen.availHeight,
        colorDepth    : screen.colorDepth,
        pixelRatio    : window.devicePixelRatio || 1,
        orientation   : screen.orientation?.type ?? 'unknown',
    }

    const viewportInfo = {
        innerWidth  : window.innerWidth,
        innerHeight : window.innerHeight,
    }

    // ── 2. Détection du type d'appareil (JS, au-delà du CSS) ────────────────
    const touchPoints   = navigator.maxTouchPoints || 0
    const isTouchDevice = touchPoints > 0 || 'ontouchstart' in window
    let deviceType
    if (window.innerWidth < 768)       deviceType = isTouchDevice ? 'mobile'  : 'small-screen'
    else if (window.innerWidth < 1200) deviceType = isTouchDevice ? 'tablet'  : 'desktop-small'
    else                               deviceType = 'desktop'

    // ── 3. Informations navigator de base ───────────────────────────────────
    const nav = {
        language     : navigator.language,
        languages    : [...(navigator.languages || [])],
        onLine       : navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        maxTouchPoints: touchPoints,
        platform     : navigator.platform,          // déprécié mais utile en fallback
        userAgent    : navigator.userAgent,
    }

    // ── 4. Connexion réseau ──────────────────────────────────────────────────
    const conn = navigator.connection
    const connectionInfo = conn ? {
        type          : conn.type,
        effectiveType : conn.effectiveType,
        downlink      : conn.downlink,
        saveData      : conn.saveData,
    } : null

    // ── 5. Présence des API (feature detection) ──────────────────────────────
    const capabilities = {
        geolocation       : 'geolocation'       in navigator,
        mediaDevices      : 'mediaDevices'       in navigator,
        speechSynthesis   : 'speechSynthesis'    in window,
        speechRecognition : 'SpeechRecognition'  in window || 'webkitSpeechRecognition' in window,
        notifications     : 'Notification'       in window,
        bluetooth         : 'bluetooth'          in navigator,
        usb               : 'usb'                in navigator,
        nfc               : 'nfc'                in navigator,
        vibrate           : 'vibrate'            in navigator,
        share             : 'share'              in navigator,
        clipboard         : 'clipboard'          in navigator,
        serviceWorker     : 'serviceWorker'      in navigator,
        localStorage      : (() => { try { return !!window.localStorage } catch { return false } })(),
        indexedDB         : 'indexedDB'          in window,
        webGL             : (() => {
            try {
                const c = document.createElement('canvas')
                return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
            } catch { return false }
        })(),
    }

    // ── 6. Permissions (asynchrones) ────────────────────────────────────────
    const permissions = {}
    if (navigator.permissions) {
        const probes = [
            'geolocation', 'notifications',
            'camera', 'microphone',
            'clipboard-read', 'clipboard-write',
        ]
        await Promise.allSettled(
            probes.map(async name => {
                try {
                    const result = await navigator.permissions.query({ name })
                    permissions[name] = result.state  // 'granted' | 'denied' | 'prompt'
                } catch {
                    permissions[name] = 'unsupported'
                }
            })
        )
    }

    // ── 7. Voix de synthèse vocale ───────────────────────────────────────────
    let speechVoices = []
    if (capabilities.speechSynthesis) {
        const getVoices = () => speechSynthesis.getVoices().map(v => ({
            name  : v.name,
            lang  : v.lang,
            local : v.localService,
        }))
        speechVoices = getVoices()
        if (!speechVoices.length) {
            // Les voix peuvent arriver en différé
            await new Promise(resolve => {
                speechSynthesis.addEventListener('voiceschanged', () => {
                    speechVoices = getVoices()
                    resolve()
                }, { once: true })
                // Timeout de sécurité
                setTimeout(resolve, 500)
            })
        }
    }

    // ── 8. Assemblage et publication ────────────────────────────────────────
    const info = {
        deviceType,
        isTouchDevice,
        screen      : screenInfo,
        viewport    : viewportInfo,
        navigator   : nav,
        connection  : connectionInfo,
        capabilities,
        permissions,
        speechVoices,
    }

    console.log('[clientinfo]', info)
    bus.publish('client:info', info)

    return info
}
