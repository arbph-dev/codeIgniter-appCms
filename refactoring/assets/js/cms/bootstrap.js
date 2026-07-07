import { initApex } from '/assets/js/components/apex.js'
import { initCodeVal } from '/assets/js/components/codeval.js'
import { initMermaid } from '/assets/js/components/mermaid.js'
import { initCallout} from '/assets/js/components/callout.js'

export function initCms()
{
    initApex()
    initMermaid()
    initCodeVal()
    initCallout()
}
