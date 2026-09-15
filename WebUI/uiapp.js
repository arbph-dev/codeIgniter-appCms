"use strict"
import { bus } from '/assets/js/core/eventBus.js'
import { byId, byName , qs , qsa } from '/assets/js/core/domhelper.js'

// variables gloables

//onglet
let pages = ["Tableau de bord", "Paramètres", "Diagnostic"]
let currentTheme = "marine"

let _main = null
let _menu = null
let _footer = null
let _footer_status = null
//let _header = null
//let _header_actions = null
let _header_actions_btn_fullscreen = null
let _header_actions_btn_theme = null



let sidebarList = null
let panels = null
let sidebar = null
let panelLinks = null

// Gestion du thème
function themeSwitch(){
  currentTheme = currentTheme === "marine" ? "nature" : "marine";
  //document.documentElement.setAttribute("data-theme", currentTheme);
  document.documentElement.dataset.theme = currentTheme;  
  _header_actions_btn_theme.textContent = currentTheme === "marine" ? "Thème nature" : "Thème marine";
}


// handlers Event
// Gestion onglets depuis menu
// traduit event en index
/*

      <ul id="sidebarList">
        <li class="active" data-index="0">Tableau de bord</li>
        <li data-index="1">Paramètres</li>
        <li data-index="2">Diagnostic</li>
*/   
function tabSwitch(e) {

  if (e.target.tagName === "LI") {
    const index = parseInt(e.target.dataset.index, 10)
    switchTab(index)
  }
}

//-------------------------------------------------------------------------------------------------
// Changement d'onglet de navigation

function switchTab(index) {
  //const items = sidebarList.querySelectorAll("li");
  const panels = _main.querySelectorAll(".panel-card");

  sidebarList.forEach((item, i) => { item.classList.toggle("active", i === index)  })

  panels.forEach((panel, i) => { panel.classList.toggle("hidden", i !== index) })

  statusWrite( `Onglet actif : ${pages[index]}` )
}

async function fullscreenSwitch() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }
  catch (e) { console.warn("Plein écran indisponible :", e);}
}


// https://developer.mozilla.org/fr/docs/Web/API/HTML_DOM_API
function typeofObj( Obj ){
  let str = null
  if ( Obj instanceof HTMLButtonElement   ) { return "HTMLButtonElement  " }
  if ( Obj instanceof HTMLCollection ) { return "HTMLCollection" }
  if ( Obj instanceof HTMLDivElement ) { return "HTMLDivElement" }
  if ( Obj instanceof HTMLElement ) { return "HTMLElement" }
  return "Object"
}




function setPageRef(){
  
  _main = byName("main")[0]
  console.log( typeofObj(_main) )


  sidebarList = document.querySelectorAll("nav#sidebar > div.nav-article > div.nav-header-row > a.nav-title")
  console.log(sidebarList[0].innerText)

  sidebar = byId("sidebar", document)
  _menu = byName( "nav", document )[0]

  // let panelLinks = null
  sidebarList = document.querySelectorAll("ul.nav-toc > li > a")

  _footer = byName("footer" , document )[0]
  _footer_status = qs( "div#statusBar" , _footer ) //console.log(_footer_status)
  
  _header_actions_btn_fullscreen = qs( "header#header > div.header-actions > button#fullscreenBtn") 
  _header_actions_btn_theme = qs( "header#header > div.header-actions > button#themeBtn")


  if (!_main || !sidebar) {
    console.error("uiapp.js : main ou #sidebar introuvable");
    return;
  }

  panels = _main.querySelectorAll(".panel-card");

  console.log("--- Building nav----")
  
  console.log("--- 2026-09-14-000 : intégration domhelper ----")
  console.log(_main)
  console.log(_menu)
  console.log(_footer)


  console.log(_header_actions_btn_fullscreen)
  console.log(_header_actions_btn_theme)


}



function openSidebar() { sidebar.classList.add("open") }

function closeSidebar() { sidebar.classList.remove("open") }

function initSidebar() {
    bus.subscribe('sidebar:open', openSidebar)
    bus.subscribe('sidebar:close', closeSidebar)    
    window.openNav = () => { bus.publish('sidebar:open') }
    window.closeNav = () => { bus.publish('sidebar:close') }
}

/*gestion des menus "articles" pour le moment un seul article */
function initArticlesNavigation() {

  document.querySelectorAll('nav#sidebar > div.nav-article > div.nav-header-row').forEach((button) => {
    button.addEventListener('click', () => {
      const article = button.closest('.nav-article');
      const isOpen = article.classList.toggle('open');
      button.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
    });
  });

}

function initArticleTabsNavigation() {

  document.querySelectorAll('ul.nav-toc > li > a').forEach((button) => {

    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.targetId, 10)
      console.log(button.innerText + " " + index)
      switchTab(index)
      


      if (window.innerWidth > 768){                                         // pour pc
        const article = button.closest('.nav-article'); 
        const isOpen = article.classList.toggle('open');
        button.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
      }
      else{ closeSidebar() }                                                // pour mobile
    })      

  })

}


// Événement sur les boutons des sous-onglets 
function initTabsButtonNaviagtion(){

  document.querySelectorAll("div.panel-card").forEach((card) => {

    const tabBtns = card.querySelectorAll("div.section-tab > div.tab-headers > button.tab-btn ");
    
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
    
        card.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        card.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        card.querySelector(`#${btn.dataset.tab}`).classList.add("active");

      });
    
    });

  })

}



function initPagination() {

  document.querySelectorAll("div.pagination-buttons > button.switch-tab-btn").forEach((button) => {

    button.addEventListener("click", () => { 
      const index = parseInt(button.dataset.targetId, 10)
      switchTab(index); //switchPanel
    });

  
  })

}

function statusWrite( textContent ){
    if (_footer_status){ 
      _footer_status.textContent = textContent 
    }
    else{
        console.log("STATUS :: " + textContent)
    }    
}


document.addEventListener("DOMContentLoaded", () => {

  setPageRef() //definit les references aux elements dom

  initSidebar() // event + bus handlers 
  initArticlesNavigation()
  initArticleTabsNavigation()
  initTabsButtonNaviagtion()
  initPagination()

  _header_actions_btn_theme.addEventListener("click", themeSwitch );// Gestion du thème - click header
  _header_actions_btn_fullscreen.addEventListener("click", fullscreenSwitch );// Gestion du plein écran


}) //document.addEventListener("DOMContentLoaded", () => {
