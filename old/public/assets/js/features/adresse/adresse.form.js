// js/features/adresse/adresse.form.js

import { bus } from '../../core/eventBus.js'

export function initAdresseForm() {
    bus.subscribe('forms:submit', (form) => {

        // ── Recherche ─────────────────────────────────────────────────────────
        if (form.id === 'adresseSearchForm') {
            const fd = new FormData(form)
            const q  = fd.get('adresseq')?.trim()
            if (!q) { bus.publish('adresse:error', 'Saisir un critère de recherche.'); return }
            bus.publish('adresse:search', { q, page: 1 })
        }

        // ── Édition ───────────────────────────────────────────────────────────
        if (form.id === 'adresseEditForm') {
            const fd = new FormData(form)

            const payload = {
                id:               fd.get('adresse_id')?.trim()    || null,
                complement:       fd.get('complement')?.trim()     || null,
                voienumero:       fd.get('voienumero')?.trim()     || null,
                voierpt:          fd.get('voierpt')?.trim()        || null,
                voietype_id:      fd.get('voietype_id')?.trim()    || null,
                voiecharniere:    fd.get('voiecharniere')?.trim()  ?? null,
                voienom:          fd.get('voienom')?.trim(),
                infodistribution: fd.get('infodistribution')?.trim() || null,
                codepostal_id:    fd.get('codepostal_id')?.trim(),
                acheminement:     fd.get('acheminement')?.trim()   || null,
                latitude:         fd.get('latitude')?.trim()       || null,
                longitude:        fd.get('longitude')?.trim()      || null,
                precision:        fd.get('precision')?.trim()      || null,
            }

            if (!payload.voienom) {
                bus.publish('adresse:error', 'Le nom de voie est obligatoire.')
                return
            }
            if (!payload.codepostal_id) {
                bus.publish('adresse:error', 'Le code postal est obligatoire.')
                return
            }

            // Conversion numérique
            if (payload.voietype_id)   payload.voietype_id   = parseInt(payload.voietype_id)
            if (payload.codepostal_id) payload.codepostal_id = parseInt(payload.codepostal_id)
            if (payload.voiecharniere !== null && payload.voiecharniere !== '')
                payload.voiecharniere = parseInt(payload.voiecharniere)
            else
                payload.voiecharniere = null

            bus.publish('adresse:save', payload)
        }
    })
}
