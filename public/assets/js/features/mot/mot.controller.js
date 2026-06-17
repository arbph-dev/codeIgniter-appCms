// js/features/mot/mot.controller.js

import { bus } from '../../core/eventBus.js'  
import { fetchMot , fetchMotLike , saveMot , deleteMot } from './mot.service.js'  
import { motStore } from './mot.store.js'  

/*
bus.subscribe('mot:page', (page) => {  
    const { q } = motStore  
    bus.publish('mot:search', { q, page })  
})
*/

export function initMotController() {  
  
    bus.subscribe('mot:search', async (payload) => {  
  
        // 20260503-002 ← persister les critères de recherche dans le store
        if (payload.q  !== undefined) motStore.q  = payload.q
        
        //  20260506-003 - inutile
        // if (payload.id !== undefined) motStore.id = payload.id

        motStore.loading = true  
        motStore.error = null  
  
        bus.publish('mot:loading', true)  
  
        try {  
            const result = await fetchMot(payload)  
            
            /* 20260506-003 - plus efficace 
            if (result.data) {  
                motStore.data = result.data  
                motStore.pagination = result.pagination  
            } else {  
                motStore.data = [result]  
            }*/  
            motStore.data       = result.data || [result]
            motStore.pagination = result.pager //retour api


            bus.publish('mot:loaded', motStore)  
  
        } catch (err) {  
            motStore.error = err.message //a conserver pour info ?
            bus.publish('mot:error', err.message)  
        } finally {  
            motStore.loading = false  
            bus.publish('mot:loading', false)  
        }  
    })
    
    //20260503-002
    bus.subscribe('mot:page', (page) => {  
        const { q, id } = motStore   //  20260503-002 ← q est maintenant disponible via motStore
        
        //20260506-003
        //bus.publish('mot:search', { q, id, page })
        bus.publish('mot:search', { q, page })         
    })
    
    // 20260506-003 ── Sélection d'une ligne ──────────────────────────────────
    bus.subscribe('mot:select', (row) => {
        motStore.selected = row
        bus.publish('mot:mode', 'detail')
    })

    // 20260506-003 ── Changement de mode ─────────────────────────────────────
    bus.subscribe('mot:mode', (mode) => {
        motStore.mode = mode
        bus.publish('mot:render', motStore)
    })

    // 20260506-003 ── Sauvegarde (create / update) ───────────────────────────
    bus.subscribe('mot:save', async (payload) => {
        try {
            await saveMot(payload)
            bus.publish('mot:mode', 'list')
            bus.publish('mot:search', { q: motStore.q })
        } catch (err) {
            bus.publish('mot:error', err.message)
        }
    })

    // 20260506-003 ── Suppression ────────────────────────────────────────────
    bus.subscribe('mot:delete', async (id) => {
        if (!confirm(`Supprimer le mot #${id} ?`)) return
        try {
            await deleteMot(id)
            motStore.selected = null
            bus.publish('mot:mode', 'list')
            bus.publish('mot:search', { q: motStore.q })
        } catch (err) {
            bus.publish('mot:error', err.message)
        }
    })

    // ── Autocomplete / like ──────────────────────────────────────────────────
    //
    // Payload entrant  : { q, len, sourceId }
    //   q        : texte tapé
    //   len      : nb max suggestions (défaut 10)
    //   sourceId : identifiant de l'input appelant
    //              → retransmis dans la réponse pour que le renderer
    //                sache à quel champ afficher les suggestions
    //
    // Payload sortant  : { sourceId, items }
    //   items    : [ { mot_id, mot_lbl } ]

    
    /* 
    // VERSION 1 : utilise fetchMotLike iporter depuis mot.service.js
    // on peut supprimer le code ou le generaliser ua choix a reflechir
    */
    bus.subscribe('mot:ui:like', async ({ q, len = 10, sourceId }) => {
        if (!q || q.length < 2) {
            bus.publish('mot:ui:response', { sourceId, items: [] })  // ← transmis
            return
        }
        const data = await fetchMotLike({ q, len })
        bus.publish('mot:ui:response', { sourceId, items: data })    // ← transmis
    })
    
    /* VERSION 2 : utilise la fonction standard apiFetch qu'il faut importer

    bus.subscribe('mot:ui:like', async ({ q, len = 10, sourceId }) => {
        if (!q || q.length < 2) {
            bus.publish('mot:ui:response', { sourceId, items: [] })
            return
        }
        try {
            const res  = await apiFetch(`/api/mot/like?q=${encodeURIComponent(q)}&len=${len}`)
            const json = await res.json()
            bus.publish('mot:ui:response', { sourceId, items: json.data ?? [] })
        } catch {
            bus.publish('mot:ui:response', { sourceId, items: [] })
        }
    })
    */
}
