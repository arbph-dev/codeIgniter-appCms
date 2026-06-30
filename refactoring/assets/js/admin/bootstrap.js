// /assets/js/admin/bootstrap.js
import { bus } from '/assets/js/core/eventBus.js'

import { initWysedit } from '/assets/js/ihm/wysedit.js'
import { initCodeVal } from '/assets/js/components/codeval.js'
import { initApex } from '/assets/js/components/apex.js'
import { initMermaid } from '/assets/js/components/mermaid.js'

window.eventBusPublish = (evt, eventName, page) => {

    bus.publish(eventName, page)

}

window.adminRenderMermaid = function(id)
{
    const source = document.getElementById( `MERMAID_${id}_SOURCE`);
    const result = document.getElementById( `MERMAID_${id}_RESULT`);

    if (!source || !result) { return; }

    result.textContent = source.value;
    
    window.eventBusPublish( null, 'mermaid:render', { id: result.id } );
}

export function initAdmin()
{
    initWysedit()

    initCodeVal()

    initApex()

    initMermaid()
}
