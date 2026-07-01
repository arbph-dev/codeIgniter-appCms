// js/features/formejuridique/formejuridique.form.js
//
// Écoute forms:submit pour deux formulaires :
//   #fjSearchForm  → publie fj:search
//   #fjEditForm    → publie fj:save

import { bus } from '../../core/eventBus.js'

export function initFjForm() {
    bus.subscribe('forms:submit', (form) => {

        // ── Recherche ─────────────────────────────────────────────────────────
        if (form.id === 'fjSearchForm') {
            const fd = new FormData(form)
            const payload = {
                id: fd.get('fjid')?.trim(),
                q:  fd.get('fjq')?.trim(),
            }
            if (!payload.id && !payload.q) {
                bus.publish('fj:error', 'Saisir un code ou un mot-clé.')
                return
            }
            bus.publish('fj:search', payload)
        }

        // ── Édition ───────────────────────────────────────────────────────────
        if (form.id === 'fjEditForm') {
            const fd = new FormData(form)
            bus.publish('fj:save', {
                id:          fd.get('fj_id')?.trim(),
                description: fd.get('fj_description')?.trim(),
            })
        }
    })
}
