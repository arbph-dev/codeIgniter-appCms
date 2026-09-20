
// js/core/eventBus.js
/**
 * 
 * Publication Event
 *  bus.publish('sidebar:open')
 
* Souscription
 * bus.subscribe('sidebar:open', () => {
 *     ihm_SidebarOpen()
 * })
 * 
 * 
 * 
 * 
 * let eventCount = 0

publish(event, payload) {
    eventCount++
    console.log("Bus load:", eventCount)
}
 */

class EventBus {

    constructor( debug = false ) {
        if (EventBus.instance) {
            return EventBus.instance
        }

        this.events = {}
        EventBus.instance = this
        this.eventCount = 0
        this.debug = debug
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = []
        }

        this.events[event].push(callback)
    }

    publish(event, data = null) {
        if (!this.events[event]) return
        this.eventCount++
        if (this.debug ){
            console.log("Bus load:", this.eventCount)
            console.log(performance.memory)
        }
        
        this.events[event].forEach(cb => cb(data))
    }

    unsubscribe(event, callback) {
        if (!this.events[event]) return

        this.events[event] =
            this.events[event].filter(cb => cb !== callback)
    }
}

export const bus = new EventBus()
 
// =============================================================================
// Pont HTML inline → bus
// =============================================================================
// Iter007 : déplacé depuis /assets/js/cms/bootstrap.js vers ici.
//
// Utilisé par les renderers PHP qui génèrent des onclick inline, ex :
//   CodeValRenderer   : onclick="window.eventBusPublish(event,'codeval:eval','CV_1')"
//
// Disponible dès que eventBus.js est importé par n'importe quel module,
// indépendamment du bootstrap CMS — plus de couplage avec bootstrap.js.
//
// Signature : (evt, eventName, payload)
//   evt       — événement DOM (ignoré, présent pour compatibilité onclick)
//   eventName — nom de l'événement bus
//   payload   — données transmises aux subscribers
// =============================================================================
 
window.eventBusPublish = (evt, eventName, payload = null) => {
    bus.publish(eventName, payload)
}
