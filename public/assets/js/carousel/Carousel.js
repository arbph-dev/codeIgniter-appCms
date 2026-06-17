// ihm/carousel/Carousel.js

export class Carousel {

    constructor(rootNode) {
        this.root   = rootNode
        this.id     = rootNode.id
        this.images = Array.from(rootNode.querySelectorAll('img'))
        this.slides = []        // wrappers .cp_slide — cachés à l'init
        this.index  = 0

        // rAF
        this._rafId     = null
        this._lastTime  = null
        this._interval  = 2000  // ms entre chaque slide

        // IntersectionObserver — pause auto hors écran
        this._observer  = null
        this._visible   = false

        this._tick = this._tick.bind(this)

        this.setup()
        this._initObserver()
    }

    // ─── Setup ───────────────────────────────────────────────────────────────

    setup() {
        this.root.classList.add('cp_carousel-ready')

        this.images.forEach((img, i) => {
            const wrapper = img.closest('a') || img
            wrapper.classList.add('cp_slide')
            if (i === 0) wrapper.classList.add('active')
        })

        // Cache les wrappers une seule fois — plus de querySelectorAll à chaque tick
        this.slides = Array.from(this.root.querySelectorAll('.cp_slide'))
    }

    _initObserver() {
        this._observer = new IntersectionObserver(
            (entries) => {
                this._visible = entries[0].isIntersecting
                // Si le carousel redevient visible et qu'il était en cours → reprend
                if (this._visible && this._rafId !== null) {
                    this._lastTime = null // reset du timer pour éviter un saut
                }
            },
            { threshold: 0.1 }
        )
        this._observer.observe(this.root)
    }

    // ─── Boucle rAF ──────────────────────────────────────────────────────────

    _tick(timestamp) {
        if (!this._visible) {
            // Hors écran : on maintient la boucle active mais on ne touche pas au DOM
            this._rafId = requestAnimationFrame(this._tick)
            return
        }

        if (this._lastTime === null) {
            this._lastTime = timestamp
        }

        const elapsed = timestamp - this._lastTime

        if (elapsed >= this._interval) {
            this._lastTime = timestamp
            this._advance()
        }

        this._rafId = requestAnimationFrame(this._tick)
    }

    // ─── Navigation ──────────────────────────────────────────────────────────

    _advance() {
        this.show(this.index + 1)
    }

    show(index) {
        this.slides[this.index].classList.remove('active')
        this.index = ((index % this.slides.length) + this.slides.length) % this.slides.length
        this.slides[this.index].classList.add('active')
    }

    next() {
        this.show(this.index + 1)
    }

    prev() {
        this.show(this.index - 1)
    }

    // ─── Contrôle ────────────────────────────────────────────────────────────

    run(interval = 2000) {
        if (this._rafId !== null) return  // déjà en cours
        this._interval  = interval
        this._lastTime  = null
        this._rafId     = requestAnimationFrame(this._tick)
    }

    stop() {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId)
            this._rafId    = null
            this._lastTime = null
        }
    }

    // ─── Modes d'affichage ───────────────────────────────────────────────────

    colmin() {
        this.stop()
        this.root.style.display       = 'flex'
        this.root.style.flexDirection = 'column'
        // On rend tous les wrappers visibles (pas les <img> bruts)
        this.slides.forEach(slide => {
            slide.style.position = 'relative'
            slide.style.display  = 'block'
        })
    }

    // ─── Destroy ─────────────────────────────────────────────────────────────

    destroy() {
        this.stop()
        if (this._observer) {
            this._observer.disconnect()
            this._observer = null
        }
        this.root.innerHTML = ''
        this.slides = []
        this.images = []
    }

}
