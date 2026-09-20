"use strict"
import { bus } from '/assets/js/core/eventBus.js'
import { byId, byName , qs , qsa , create } from '/assets/js/core/domhelper.js'
import { initMermaid } from '/assets/js/components/mermaid.js'
import { initApex } from '/assets/js/components/apex.js'
import { initCodeVal } from '/assets/js/components/codeval.js'
import { initCallout} from '/assets/js/components/callout.js'

// variables gloables
let _pages = []
let currentTheme = "marine"
let _main = null
let _menu = null
//let _menu_list = null
let _footer = null
let _footer_status = null
//let _header = null
//let _header_actions = null
let _header_actions_btn_fullscreen = null
let _header_actions_btn_theme = null
let _main_panels = null

let _currentPanel = 0 //par defaut voir le code html 
let _currentSection = 0

let sidebar = null


/*  ======================================================================================================================  */
// Gestion du thème
function themeSwitch(){
  currentTheme = currentTheme === "marine" ? "nature" : "marine";
  document.documentElement.dataset.theme = currentTheme;  
  _header_actions_btn_theme.textContent = currentTheme === "marine" ? "Thème nature" : "Thème marine";
}

/*  ======================================================================================================================  */
function switchPanel(index) {
  _main_panels.forEach((panel, i) => { panel.classList.toggle("hidden", i !== index) })
  _currentPanel = index
  statusWrite( `Onglet actif : ${_pages[index].title}` )
}
/*  ======================================================================================================================  */
function switchSection(index) {
  // voir pour assigner les variables : panel_Sections et panel_header_Buttons
  let panel_Sections = qsa( "div.section-tab > div.tab-content" , _main_panels[_currentPanel] )
  let panel_header_Buttons = qsa( "div.section-tab > div.tab-headers > button.tab-btn", _main_panels[_currentPanel] )

  panel_Sections.forEach( c => c.classList.remove("active") )
  panel_header_Buttons.forEach( b => b.classList.remove("active") )

  panel_Sections[index].classList.add("active")
  panel_header_Buttons[index].classList.add("active")
  
  _currentSection = index
  
}

/*  ======================================================================================================================  */
async function fullscreenSwitch() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }
  catch (e) { console.warn("Plein écran indisponible :", e);}
}

/*  ======================================================================================================================  */
// https://developer.mozilla.org/fr/docs/Web/API/HTML_DOM_API
function typeofObj( Obj ){

  if (Obj != null && Obj != undefined){
    
    if ( Obj instanceof HTMLButtonElement   ) { return "HTMLButtonElement  " }
    if ( Obj instanceof HTMLCollection ) { return "HTMLCollection" }
    if ( Obj instanceof HTMLDivElement ) { return "HTMLDivElement" }
    if ( Obj instanceof HTMLElement ) { return "HTMLElement" }
    if ( Obj instanceof Array ) { return "Array" }

    return typeof Obj
  }
  return "null"
  
}

/*  ======================================================================================================================  */
function readPage(){

  let articleObj = null  
  let panelSections = null
  let strTemp = null

  if ( _main && _menu) { 
  
  _main_panels = qsa("div.panel-card" , _main )  // on extrait les informations de la page
  
  _main_panels.forEach((  panel , index ) => {

    if ( !panel.classList.contains("hidden") ) { _currentPanel = index }

    strTemp = qs( "h2.panel-title" , panel).innerText
    panelSections = qsa( "div.section-tab  > div.tab-content > h3" , panel )

    articleObj = { index , title : strTemp , sections : [] } // constuire un objet

    _pages.push( articleObj )

    panelSections.forEach((  section , sindex ) => { 
      _pages[ index ].sections.push( section.innerText ) 
    })      

  })

  return true
  }
}

/*  ======================================================================================================================  */
function initPagination(){
  let buttonTemp = null
  let pagination_buttons = null

  console.log("----- Adding pagination buttons -------") // on construit la pagination depuis _pages

  pagination_buttons = qs( "div.pagination-buttons" , document )   // reference sur element   
  
  _pages.forEach((  panel , index ) => { 

    buttonTemp = create( 'button', { type: 'button', class: 'primary-button switch-tab-btn', text: panel.title } )
    buttonTemp.addEventListener('click', () => switchPanel(index) )

    pagination_buttons.appendChild( buttonTemp )

  })

}
/*  ======================================================================================================================  */
function initNavigation(){
  
  let buttonTemp = null
  //on ajoute dans chaque panel la barrre de navigations panel
  _pages.forEach((  panel , index ) => { 

    let panel_header = qs( "div.section-tab > div.tab-headers" , _main_panels[index] )   // reference sur element 
  
    _pages[ index ].sections.forEach(( section , sindex) => {
     
      if (sindex === 0 ){ //par defaut le bouton 0 est actif 
        buttonTemp = create( 'button', { type: 'button', class: 'tab-btn active', text: section } )
      }
      else{
        buttonTemp = create( 'button', { type: 'button', class: 'tab-btn', text: section } )
      }
      
      panel_header.appendChild( buttonTemp )
      buttonTemp.addEventListener('click', () => { switchSection(sindex) })

    })

  })

}

/*  ======================================================================================================================  */
function openMenuPanel(index) {

  const menuPanels = qsa('.nav-article', _menu )

  menuPanels.forEach((menupanel, i) => {
    menupanel.classList.toggle('open', i === index)
  })

  //switchPanel(index)
}

/*  ======================================================================================================================  */
function initMenu(){

  _pages.forEach((  panel , index ) => { 
    const menu_panel = create('div', { class: 'nav-article' })
    const menu_panel_item = create('div', { class: 'nav-header-row  primary-button'  , text: panel.title  })
    const menu_panel_item_button = create('button', { class: 'nav-toggle', type: 'button' })
    menu_panel_item_button.setAttribute( 'aria-expanded', false)
    const menu_panel_item_i = create('i', { class: 'fa fa-fw fa-cogs' }) 

    const sub_menu = create( 'ul', { class: 'nav-toc'}) // ****

    
    panel.sections.forEach(( section , sindex) => {
      const subitem  = create( 'li', { text: section } )
      sub_menu.appendChild(subitem)

      subitem.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        switchPanel(index)
        switchSection(sindex)
        if (window.innerWidth > 768){
          menu_panel.classList.remove('open')
        }
        else{ 
          closeSidebar() 
        }           
      })

      /*
      subitem.addEventListener('mouseout', (e) => {
        if (window.innerWidth > 768){
          menu_panel.classList.remove('open')
        }
      })
      */

    })

    menu_panel_item_button.appendChild(menu_panel_item_i)
    menu_panel_item.appendChild(menu_panel_item_button)
    menu_panel.appendChild(menu_panel_item)
    menu_panel.appendChild(sub_menu)
  
    _menu.appendChild(menu_panel)

    menu_panel.addEventListener('click', () => {
      console.log(`menu clic panel : ${index}`)
      openMenuPanel(index)
    })

    menu_panel.addEventListener('mouseleave', () => {
      console.log(`leave menu : ${index}`)
      if (window.innerWidth > 768){ menu_panel.classList.remove('open') }
    })
    /*
      if (window.innerWidth > 768){ menu_panel.classList.remove('open') }

    */

  })
}

/*  ======================================================================================================================  */
function setPageRef(){

  _main = byName("main")[0]
  // sidebar = byId("sidebar", document)
  // _menu = byName( "nav", document )[0]
  // _menu_list = qs( "nav#sidebar" , document )
  _menu = byName( "nav", document )[0]

  console.log( typeofObj( _menu ) )

  _footer = byName("footer" , document )[0]
  _footer_status = qs( "div#statusBar" , _footer )
  
  _header_actions_btn_fullscreen = qs( "header#header > div.header-actions > button#fullscreenBtn")
  _header_actions_btn_fullscreen.addEventListener("click", fullscreenSwitch );// Gestion du plein écran

  _header_actions_btn_theme = qs( "header#header > div.header-actions > button#themeBtn")
  _header_actions_btn_theme.addEventListener("click", themeSwitch );// Gestion du thème - click header

  if ( !readPage() ) { return }
  
  initPagination()    
  initNavigation()
  initMenu()

}

/*  ======================================================================================================================  */
function openSidebar() { _menu.classList.add("open") }

function closeSidebar() { _menu.classList.remove("open") }

function initSidebar() {
    bus.subscribe('sidebar:open', openSidebar)
    bus.subscribe('sidebar:close', closeSidebar)    
    window.openNav = () => { bus.publish('sidebar:open') }
    window.closeNav = () => { bus.publish('sidebar:close') }
}

/*  ======================================================================================================================  */
function statusWrite( textContent ){
    if (_footer_status){ 
      _footer_status.textContent = textContent 
    }
    else{
        console.log("STATUS :: " + textContent)
    }    
}

/*  ======================================================================================================================  */
document.addEventListener("DOMContentLoaded", () => {
  setPageRef() //definit les references aux elements dom
  initSidebar() // event + bus handlers 
})

// onload 
window.onload = (event) => {
  initMermaid()
  initApex()
  initCodeVal()
  initCallout()
} 
  
