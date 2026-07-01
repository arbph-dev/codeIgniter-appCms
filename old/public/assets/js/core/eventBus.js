
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
