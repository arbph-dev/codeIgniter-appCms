import { bus } from '../core/eventBus.js'


function openSidebar() {
    const nav = document.querySelector("#sidebar")
    nav.classList.add("open")
}

function closeSidebar() {
    const nav = document.querySelector("#sidebar")
    nav.classList.remove("open")
}

export function initSidebar() {
    console.log( `chargement module : ihm - sidebar`)
//sidebar
    bus.subscribe('sidebar:open', openSidebar)
    bus.subscribe('sidebar:close', closeSidebar)    

    window.openNav = () => { bus.publish('sidebar:open') }
    window.closeNav = () => { bus.publish('sidebar:close') }

}