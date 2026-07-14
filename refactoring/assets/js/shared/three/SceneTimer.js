// /assets/js/shared/three/SceneTimer.js
//
// Remplacement de THREE.Clock (déprécié depuis r168).
// Basé sur performance.now() — résolution sub-milliseconde.
//
// Partagé entre :
//   - components/three/viewers/Viewer.js
//   - components/modelworkbench/core/SceneManager.js
//
// Usage :
//
//   const timer = new SceneTimer()
//   timer.start()
//
//   // dans la boucle animate :
//   const delta = timer.tick()   // secondes écoulées depuis le tick précédent
//   const t     = timer.elapsed  // secondes écoulées depuis start()
//
// Facteur temps (optionnel) :
//   timer.scale = 1    → temps réel (défaut)
//   timer.scale = 2    → simulation ralentie ×2
//   timer.scale = 0.5  → simulation accélérée ×2

export class SceneTimer
{
    constructor()
    {
        this._t0      = null   // timestamp de démarrage (ms)
        this._tLast   = null   // timestamp du dernier tick (ms)
        this._delta   = 0      // secondes entre tick(n-1) et tick(n), scalé
        this._elapsed = 0      // secondes depuis start(), scalé
        this._running = false
        this._scale   = 1      // facteur d'échelle temps (>1 = ralenti)
    }

    // ─── Contrôle ─────────────────────────────────────────────────────────────

    start()
    {
        const now     = performance.now()
        this._t0      = now
        this._tLast   = now
        this._delta   = 0
        this._elapsed = 0
        this._running = true
        return this
    }

    stop()
    {
        this._running = false
        return this
    }

    /**
     * Reprend sans remettre elapsed à zéro.
     * À appeler au retour de visibilité (IntersectionObserver)
     * pour éviter un delta explosif après une longue pause.
     */
    resume()
    {
        this._tLast  = performance.now()
        this._running = true
        return this
    }

    // ─── Tick ─────────────────────────────────────────────────────────────────

    /**
     * À appeler une seule fois par frame, en début de boucle animate.
     *
     * @returns {number} delta en secondes (scalé)
     */
    tick()
    {
        if (!this._running)
        {
            this._delta = 0
            return 0
        }

        const now      = performance.now()
        const rawDelta = (now - this._tLast) / 1000  // secondes réelles

        this._tLast = now

        // Clamp à 100 ms : évite un saut au retour d'un onglet inactif
        const clamped = Math.min(rawDelta, 0.1)

        this._delta    = clamped / this._scale
        this._elapsed += this._delta

        return this._delta
    }

    // ─── Accesseurs ───────────────────────────────────────────────────────────

    /** Dernier delta calculé (secondes, scalé). */
    get delta()   { return this._delta   }

    /** Temps total écoulé depuis start() (secondes, scalé). */
    get elapsed() { return this._elapsed }

    get scale()   { return this._scale   }
    set scale(v)  { this._scale = Math.max(0.001, Number(v)) }

    get running() { return this._running }
}
