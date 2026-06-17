// js/features/codenaf/codenaf.form.js

import { bus } from '../../core/eventBus.js'

export function initNafForm() {

    bus.subscribe('forms:submit', (form) => {

        if (form.id !== 'nafForm') return

        const formData = new FormData(form)

        const payload = {
            code: formData.get('nafcode')?.trim(),
            q: formData.get('nafq')?.trim()
        }

        // 🔒 validation minimale
        if (!payload.code && !payload.q) {
            bus.publish('naf:error', 'Veuillez saisir un code ou un libellé.')
            return
        }

        // 🔁 reset pagination implicite
        payload.page = 1

        bus.publish('naf:search', payload)
    })
}