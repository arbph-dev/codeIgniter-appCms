// ihm/carousel/CarouselManager.js
import { bus } from '../../core/eventBus.js'
import { Carousel } from './Carousel.js'

class CarouselManager {

    constructor() {
        this.carousels = new Map()
        this._registerEvents()
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    init() {
        const nodes = document.querySelectorAll('.cp_carousel')

        nodes.forEach(node => {
            const instance = new Carousel(node)
            this.carousels.set(instance.id, instance)
        })

        console.log(`CarouselManager: ${this.carousels.size} instance(s) enregistrée(s)`)
    }

    // ─── Accès ────────────────────────────────────────────────────────────────

    getById(idSuffix) {
        return this.carousels.get('CAROUSEL_' + idSuffix) ?? null
    }

    destroy(idSuffix) {
        const carousel = this.getById(idSuffix)
        if (!carousel) return
        carousel.destroy()
        this.carousels.delete('CAROUSEL_' + idSuffix)
    }

    // ─── Bus events ───────────────────────────────────────────────────────────

    _registerEvents() {

        // Lancer un carousel (optionnel : intervalle en ms en 2e arg)
        // bus.publish('carousel:run', '1')
        // bus.publish('carousel:run', { id: '1', interval: 3000 })
        bus.subscribe('carousel:run', (payload) => {
            const { id, interval } = this._parsePayload(payload)
            const carousel = this.getById(id)
            if (!carousel) return
            carousel.run(interval)
        })

        // Stopper un carousel
        bus.subscribe('carousel:stop', (idSuffix) => {
            this.getById(idSuffix)?.stop()
        })

        // Slide suivante (manuellement)
        bus.subscribe('carousel:next', (idSuffix) => {
            this.getById(idSuffix)?.next()
        })

        // Slide précédente (manuellement)
        bus.subscribe('carousel:prev', (idSuffix) => {
            this.getById(idSuffix)?.prev()
        })

        // Aller à un index précis
        bus.subscribe('carousel:goto', ({ id, index }) => {
            this.getById(id)?.show(index)
        })

        // Mode colonne (toutes les slides empilées)
        bus.subscribe('carousel:colmin', (idSuffix) => {
            this.getById(idSuffix)?.colmin()
        })

        // Longueur d'un carousel (debug)
        bus.subscribe('carousel:glen', (idSuffix) => {
            const carousel = this.getById(idSuffix)
            if (!carousel) return
            console.log(`Carousel ${carousel.id} → ${carousel.slides.length} slide(s)`)
        })

        // Actions globales
        bus.subscribe('carousel:run:all', (interval) => {
            this.carousels.forEach(c => c.run(interval))
        })

        bus.subscribe('carousel:stop:all', () => {
            this.carousels.forEach(c => c.stop())
        })

    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    // Accepte une string simple '1' ou un objet { id, interval }
    _parsePayload(payload) {
        if (typeof payload === 'string') return { id: payload, interval: 2000 }
        return { id: payload.id, interval: payload.interval ?? 2000 }
    }

}

export const carouselManager = new CarouselManager()
