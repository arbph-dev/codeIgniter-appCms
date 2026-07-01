// js/features/entreprise/entreprise.form.js
import { bus } from '../../core/eventBus.js'

export function initEntForm() {
    bus.subscribe('forms:submit', (form) => {
        if (form.id === 'entSearchForm') {
            const fd = new FormData(form)
            const q  = fd.get('entq')?.trim()
            if (!q) { bus.publish('ent:error','Saisir un critère.'); return }
            bus.publish('ent:search',{q,page:1})
        }
        if (form.id === 'entEditForm') {
            const fd = new FormData(form)
            const payload = {
                id:                   fd.get('ent_id')?.trim()           || null,
                // Champs organisation
                nom:                  fd.get('nom')?.trim(),
                organisation_type_id: fd.get('organisation_type_id')?.trim() || 1,
                site_web:             fd.get('site_web')?.trim()         || null,
                urlreg:               fd.get('urlreg')?.trim()           || null,
                email:                fd.get('email')?.trim()            || null,
                telephone:            fd.get('telephone')?.trim()        || null,
                siren:                fd.get('siren')?.trim()            || null,
                description:          fd.get('description')?.trim()      || null,
                // Champs entreprise
                siret:                fd.get('siret')?.trim()            || null,
                codenaf_id:           fd.get('codenaf_id')?.trim()       || null,
                forme_juridique_id:   fd.get('forme_juridique_id')?.trim() || null,
                capital:              fd.get('capital')?.trim()          || null,
                effectif_min:         fd.get('effectif_min')?.trim()     || null,
                effectif_max:         fd.get('effectif_max')?.trim()     || null,
            }
            if (!payload.nom) { bus.publish('ent:error','Le nom est obligatoire.'); return }
            if (payload.capital)     payload.capital     = parseFloat(payload.capital)
            if (payload.effectif_min) payload.effectif_min = parseInt(payload.effectif_min)
            if (payload.effectif_max) payload.effectif_max = parseInt(payload.effectif_max)
            bus.publish('ent:save', payload)
        }
    })
}
