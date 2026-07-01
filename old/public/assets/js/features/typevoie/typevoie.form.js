// js/features/typevoie/typevoie.form.js

import { bus } from '../../core/eventBus.js'

export function initTvForm() {
    bus.subscribe('forms:submit', (form) => {

        if (form.id === 'tvSearchForm') {
            const fd = new FormData(form)
            const payload = { id: fd.get('tvid')?.trim(), q: fd.get('tvq')?.trim() }
            if (!payload.id && !payload.q) {
                bus.publish('tv:error', 'Saisir un id ou un libellé.')
                return
            }
            bus.publish('tv:search', payload)
        }

        if (form.id === 'tvEditForm') {
            const fd = new FormData(form)
            bus.publish('tv:save', {
                id:  fd.get('tv_id')?.trim() || null,
                nom: fd.get('tv_nom')?.trim(),
            })
        }
    })
}
