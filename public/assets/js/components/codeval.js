import { byId, qs } from '/assets/js/core/domhelper.js'
import { bus } from '/assets/js/core/eventBus.js'

import * as PHYS from '/assets/js/libs/physics.js'
/*
saisie user
const result = moteur.genererCourbeCouple(30)
api.plot(result)
api.speak("Courbe générée")
*/

/*  partie LOGIC -------- !! Aucun DOM !! */

// avoir si il faut passer en scope window
function call () { return 'calling module fonction' }

function call2 (data) { return 'calling module fonction ' + data }
// 
const availableApi = {
    call: () => call(),
    call2: (data) => call2(data),
    PHYS,
    plot: (id, cfg) =>
        bus.publish('apex:render', { id, ...cfg })
 }

//-------------------------------------------------------------- 
/*
function runUserCode(code, api = {}) {
    return new Function('api', `"use strict"; return (${code})`)(api)

    return new Function(
        'api',
        `"use strict"; ${code}`
    )(api)
}
*/  

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
    return runUserCode(code , availableApi)
    //return eval(code)
}




/*partie DOM ----  utilse la librairie DOM */
function getRoot(id) { return byId(`CODEVAL_${id}`) }
function getTextarea(id) { return qs('textarea', getRoot(id)) }
function getResult(id) { return qs('.result', getRoot(id)) }
function getScript(id) { return qs('.scriptcode', getRoot(id)) }

function execute(id) {
    const code = getTextarea(id).value

    try {
        const result = evaluateCode(code)
        renderResult(id, result)
    }
    catch (err) {
        renderError(id, err.message)
    }
}


/* renderer ---------------------------------------------------*/

function renderResult( id , rs ) {
    const el = getResult(id)
    el.style.display = 'block'
    el.textContent = `Résultat : ${rs}`
}

function renderError( id , msg ) {
    const el = getResult(id)
    el.style.display = 'block'
    el.textContent = `Erreur : ${msg}`
}

/* gestion interne et bus----------------------------------------------------------------
bus.subscribe('codeval:run', ...)
bus.subscribe('codeval:toggle', ...)
*/




export function initCodeVal() {

    bus.subscribe( 'codeval:toggle', ( evalblockid ) =>{
        const parent = getRoot( evalblockid )
        if (!parent){ return }
        
        const evblkcode = getScript( evalblockid )
        //const evblkrs = parent.querySelector( '.result' )
        const evblkrs = getResult( evalblockid )
        
        const stdisp = evblkcode.style.display
        if ( ( stdisp === 'block' ) || (stdisp === '' ) ){
            evblkcode.style.display = 'none'
            evblkrs.style.display = 'none'
        }
        else{
            evblkcode.style.display = 'block'
            evblkrs.style.display = 'block'
        }
    })
    

    bus.subscribe( 'codeval:eval', ( evalblockid ) =>execute( evalblockid ) )

}
