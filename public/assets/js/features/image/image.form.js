// js/features/image/image.form.js

import { bus } from '../../core/eventBus.js'

export function initImageForm() {

    bus.subscribe('forms:submit', (form) => {

        // ── Recherche
        if (form.id === 'imageSearchForm') {

            const fd = new FormData(form)

            const payload = {
                id: fd.get('imageid')?.trim(),
                q: fd.get('imageq')?.trim(),
                status: fd.get('imagestatus')?.trim(),
            }

            if (!payload.id && !payload.q && !payload.status) {

                bus.publish(
                    'image:error',
                    'Veuillez saisir un critère.'
                )

                return
            }

            bus.publish('image:search', payload)
        }

        // ── Edition
        if (form.id === 'imageEditForm') {

            const fd = new FormData(form)

            bus.publish('image:save', {
                id: fd.get('id')?.trim(),
                file: fd.get('file'),
                alt: fd.get('alt')?.trim(),
                status: fd.get('status')?.trim(),
                user_id: fd.get('user_id')?.trim(),
            })
        }
    })
}