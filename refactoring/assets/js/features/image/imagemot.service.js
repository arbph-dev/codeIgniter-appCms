// assets/js/features/image/imageMot.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Relation N–N Image ↔ Mot — côté client.
// Miroir de ImageMot.php (index / attach / detach / sync).
//
// Pattern ImageTagger :
//   1. fetchImageMots(imageId)         → mots actuels de l'image (objets complets)
//   2. attachMot(imageId, motId)       → ajoute un mot
//   3. detachMot(imageId, motId)       → retire un mot
//   4. syncMots(imageId, ids)          → remplace l'ensemble (transaction serveur)
// ─────────────────────────────────────────────────────────────────────────────

import { apiFetch } from '/assets/js/core/apiFetch.js'

/**
 * Charge les mots d'une image (objets complets).
 * Équivalent à ?include=mots sur show(), mais ciblé sur un seul appel.
 *
 * @param {number} imageId
 * @returns {Promise<object[]>}  liste de mots { mot_id, mot_lbl }
 */
export async function fetchImageMots(imageId)
{
    const res = await apiFetch(`/api/image/${imageId}/mots`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? []
}

/**
 * Attache un mot à une image.
 * Idempotent côté serveur : si l'association existe déjà → 200 (pas d'erreur).
 *
 * @param {number} imageId
 * @param {number} motId
 * @returns {Promise<{ data: object, message: string }>}
 */
export async function attachMot(imageId, motId)
{
    const res = await apiFetch(`/api/image/${imageId}/mots`, {
        method : 'POST',
        body   : JSON.stringify({ mot_id: motId }),
    })
    if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

/**
 * Détache un mot d'une image.
 * Idempotent : si l'association est absente → 200 sans erreur.
 *
 * @param {number} imageId
 * @param {number} motId
 * @returns {Promise<object>}
 */
export async function detachMot(imageId, motId)
{
    const res = await apiFetch(`/api/image/${imageId}/mots/${motId}`, {
        method : 'DELETE',
    })
    if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.message ?? `HTTP ${res.status}`)
    }
    return res.json()
}

/**
 * Remplace l'ensemble des mots liés à une image (transaction serveur).
 * Les mots absents de `ids` sont détachés, les nouveaux sont attachés.
 *
 * @param {number}   imageId
 * @param {number[]} ids      tableau de mot_id (peut être vide → tout détacher)
 * @returns {Promise<object[]>}  mots finaux après sync
 */
export async function syncMots(imageId, ids)
{
    const res = await apiFetch(`/api/image/${imageId}/mots`, {
        method : 'PUT',
        body   : JSON.stringify({ ids }),
    })
    if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.message ?? `HTTP ${res.status}`)
    }
    const json = await res.json()
    return json.data ?? []
}
