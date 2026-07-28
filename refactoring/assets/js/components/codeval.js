// /assets/js/components/codeval.js
// =============================================================================
// Iter007
//   ~ initCodeVal()  → initCodeVal(root = document)
//     + guard _initialized : bus souscrit une seule fois
//     · root accepté pour uniformité API (initXxx(root)) mais NON utilisé :
//       codeval est piloté par bus events déclenchés depuis les onclick PHP
//       (window.eventBusPublish), pas par scan DOM.
//       Les handlers byId/qs cherchent toujours globalement par id — correct,
//       les ids CODEVAL_{id} sont uniques dans la page.
//
// window.eventBusPublish : déplacé dans eventBus.js (Iter007)
//   Était dans bootstrap.js → désormais disponible dès l'import d'eventBus.js.
// =============================================================================

import { byId, qs } from '/assets/js/core/domhelper.js'
import { bus }       from '/assets/js/core/eventBus.js'

import * as PHYS from '/assets/js/libs/physics.js'


/* =============================================================================
   LOGIC — aucun DOM
   ========================================================================= */

function call ()       { return 'calling module fonction' }
function call2 (data)  { return 'calling module fonction ' + data }

const availableApi = {
    call  : ()         => call(),
    call2 : (data)     => call2(data),
    PHYS,
    plot  : (id, cfg)  => bus.publish('apex:render', { id, ...cfg })
}

function runUserCode(code, api = {}) {
    return new Function(
        'api',
        `
        "use strict";
        ${code}
        return typeof result !== "undefined"
            ? result
            : undefined
        `
    )(api)
}

function evaluateCode(code) {
    return runUserCode(code, availableApi)
}


/* =============================================================================
   DOM helpers — accès par id global (CODEVAL_{id} est unique dans la page)
   ========================================================================= */

function getRoot(id)     { return byId(`CODEVAL_${id}`) }
function getTextarea(id) { return qs('textarea',    getRoot(id)) }
function getResult(id)   { return qs('.result',     getRoot(id)) }
function getScript(id)   { return qs('.scriptcode', getRoot(id)) }

function execute(id) {
    const code = getTextarea(id)?.value
    if (code === undefined) { return }

    try {
        renderResult(id, evaluateCode(code))
    } catch (err) {
        renderError(id, err.message)
    }
}


/* =============================================================================
   RENDERER
   ========================================================================= */

function renderResult(id, rs) {
    const el = getResult(id)
    if (!el) { return }
    el.style.display = 'block'
    el.textContent   = `Résultat : ${rs}`
}

function renderError(id, msg) {
    const el = getResult(id)
    if (!el) { return }
    el.style.display = 'block'
    el.textContent   = `Erreur : ${msg}`
}


/* =============================================================================
   INDEX
   ========================================================================= */

let _initialized = false   // guard : bus souscrit une seule fois

/**
 * Iter007 — initCodeVal(root = document)
 *
 * root est accepté pour l'uniformité de l'API (WorkbenchBase.initRegisteredComponentsIn)
 * mais n'est pas utilisé : codeval ne scanne pas le DOM à l'init.
 * L'interaction passe par window.eventBusPublish (onclick PHP) → bus → handlers ici.
 *
 * @param {Element|Document} root — ignoré
 */
export function initCodeVal(root = document)  // eslint-disable-line no-unused-vars
{
    if (_initialized) { return }

    bus.subscribe('codeval:toggle', (evalblockid) => {
        const parent   = getRoot(evalblockid)
        if (!parent) { return }

        const evblkcode = getScript(evalblockid)
        const evblkrs   = getResult(evalblockid)

        const stdisp = evblkcode.style.display
        const isOpen = stdisp === 'block' || stdisp === ''

        evblkcode.style.display = isOpen ? 'none'  : 'block'
        evblkrs.style.display   = isOpen ? 'none'  : 'block'
    })

    bus.subscribe('codeval:eval', (evalblockid) => execute(evalblockid))

    _initialized = true
    console.log('[codeval] initialisé')
}
