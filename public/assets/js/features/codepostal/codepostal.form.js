// js/features/codepostal/codepostal.form.js
// Lecture seule — un seul formulaire : recherche

import { bus } from '../../core/eventBus.js'

export function initCpForm() {
    bus.subscribe('forms:submit', (form) => {
        if (form.id !== 'cpSearchForm') return

        const fd = new FormData(form)
        const q          = fd.get('cpq')?.trim()
        const codepostal = fd.get('cpcodepostal')?.trim()
        const codeinsee  = fd.get('cpcodeinsee')?.trim()

        if (!q && !codepostal && !codeinsee) {
            bus.publish('cp:error', 'Saisir un code postal, un code INSEE ou un nom de commune.')
            return
        }

        bus.publish('cp:search', { q, codepostal, codeinsee, page: 1 })
    })
}
