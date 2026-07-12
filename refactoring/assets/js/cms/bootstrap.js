// /assets/js/cms/bootstrap.js


import { initApex } from '/assets/js/components/apex.js'
import { initCallout} from '/assets/js/components/callout.js'
import { initCodeVal } from '/assets/js/components/codeval.js'
import { initLeaflet }  from '/assets/js/components/leaflet.js'
import { initMermaid } from '/assets/js/components/mermaid.js'
import { init } from `/assets/js/components/three/index.js`

/*
    ATTENION : ordre de dépendance
    - CodeVal publie des événements apex:render, donc Apex doit être initialisé avant.
        on prévoit de faire de meme avec d'autres composants 
        CodeVal est intilalisé en dernier

    - Callout , Leaflet , Mermaid peuvent être initialisés dans n'importe quel ordre.    
*/

export function initCms()
{
    // dépendance de CodeVal
    initApex()

    // independant
    initCallout()
    initLeaflet()    
    initMermaid()

    init()

    // utilisateur de composant
    initCodeVal()


}
