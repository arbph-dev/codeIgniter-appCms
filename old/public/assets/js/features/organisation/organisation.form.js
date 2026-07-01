// js/features/organisation/organisation.form.js
import { bus } from '../../core/eventBus.js'

export function initOrgForm() {
    bus.subscribe('forms:submit', (form) => {
        if (form.id === 'orgSearchForm') {
            const fd = new FormData(form)
            const q  = fd.get('orgq')?.trim()
            if (!q) { bus.publish('org:error','Saisir un critère.'); return }
            bus.publish('org:search', { q, page:1 })
        }
        if (form.id === 'orgEditForm') {
            const fd = new FormData(form)
            const payload = {
                id:                   fd.get('org_id')?.trim()     || null,
                nom:                  fd.get('nom')?.trim(),
                organisation_type_id: fd.get('organisation_type_id')?.trim() || null,
                site_web:             fd.get('site_web')?.trim()    || null,
                urlreg:               fd.get('urlreg')?.trim()      || null,
                email:                fd.get('email')?.trim()       || null,
                telephone:            fd.get('telephone')?.trim()   || null,
                siren:                fd.get('siren')?.trim()       || null,
                lien_facebook:        fd.get('lien_facebook')?.trim()  || null,
                lien_instagram:       fd.get('lien_instagram')?.trim() || null,
                lien_linkedin:        fd.get('lien_linkedin')?.trim()  || null,
                description:          fd.get('description')?.trim() || null,
            }
            if (!payload.nom) { bus.publish('org:error','Le nom est obligatoire.'); return }
            bus.publish('org:save', payload)
        }
    })
}
