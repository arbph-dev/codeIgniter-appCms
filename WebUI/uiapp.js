"use strict"
import { bus } from '/assets/js/core/eventBus.js'

// variables gloables

//onglet
let pages = ["Tableau de bord", "Paramètres", "Diagnostic"]
let currentTheme = "marine"

let stack = null
let sidebarList = null
let panels = null
let sidebar = null
let panelLinks = null
let statusBar = null
let themeBtn = null
let fullscreenBtn = null

// Gestion du thème
function themeSwitch(){
  currentTheme = currentTheme === "marine" ? "nature" : "marine";
  //document.documentElement.setAttribute("data-theme", currentTheme);
  document.documentElement.dataset.theme = currentTheme;  
  themeBtn.textContent = currentTheme === "marine" ? "Thème nature" : "Thème marine";
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
    
    console.log(e.target.parentElement.nodeName) // The nodeName property returns the name of a node:
    console.log(e.target.parentElement.id) //The id property sets or returns the value of an element's id attribute.
    console.log(e.target.parentElement.className) //The className property sets or returns an element's class attribute.
    console.log(e.target.parentElement.classList) // classList property returns (DOMTokenList) the CSS classnames of an element
  /*
  classList Properties and Methods
    add() Adds one or more tokens to the list
    contains()  Returns true if the list contains a class
    entries() Returns an Iterator with key/value pairs from the list
    forEach() Executes a callback function for each token in the list
    item()  Returns the token at a specified index
    keys()  Returns an Iterator with the keys in the list
    length  Returns the number of tokens in the list
    remove()  Removes one or more tokens from the list
    replace() Replaces a token in the list
    supports()  Returns true if a token is one of an attribute's supported tokens
    toggle()  Toggles between tokens in the list
    value Returns the token list as a string
    values()  Returns an Iterator with the values in the list
  */
    switchTab(index)
  }
}

//-------------------------------------------------------------------------------------------------
// Changement d'onglet de navigation

function switchTab(index) {
  //const items = sidebarList.querySelectorAll("li");
  const panels = stack.querySelectorAll(".panel-card");

  sidebarList.forEach((item, i) => { item.classList.toggle("active", i === index)  })

  panels.forEach((panel, i) => { panel.classList.toggle("hidden", i !== index) })

  statusBar.textContent = `Onglet actif : ${pages[index]}`;
}

/* OBSOLETE
function fullscreenSwitch(){
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } 
  else {
    if (document.exitFullscreen) { document.exitFullscreen(); }
  }
}
*/
async function fullscreenSwitch() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }
  catch (e) { console.warn("Plein écran indisponible :", e);}
}



function setPageRef(){

  stack = document.getElementById("stack")


  // nav-article 
  /* nav#sidebar > div.nav-article > div.nav-header-row > a.nav-title */
  // sidebarList = document.getElementById("sidebarList"); //document.querySelector("#sidebar > div > div > a") 
  // sidebarList = document.querySelectorAll(".nav-article ")
  sidebarList = document.querySelectorAll("nav#sidebar > div.nav-article > div.nav-header-row > a.nav-title")
  console.log(sidebarList[0].innerText)

// ligne 12 - 13
  sidebar = document.getElementById("sidebar")

  // let panelLinks = null
  sidebarList = document.querySelectorAll("ul.nav-toc > li > a")

  statusBar = document.getElementById("statusBar")
  themeBtn = document.getElementById("themeBtn")
  fullscreenBtn = document.getElementById("fullscreenBtn")

  if (!stack || !sidebar) {
    console.error("uiapp.js : #stack ou #sidebar introuvable");
    return;
  }

  panels = stack.querySelectorAll(".panel-card");


  
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



document.addEventListener("DOMContentLoaded", () => {

  setPageRef() //definit les references aux elements dom

  initSidebar() // event + bus handlers 
  initArticlesNavigation()
  initArticleTabsNavigation()
  initTabsButtonNaviagtion()
  initPagination()

  themeBtn.addEventListener("click", themeSwitch );// Gestion du thème - click header
  fullscreenBtn.addEventListener("click", fullscreenSwitch );// Gestion du plein écran


}) //document.addEventListener("DOMContentLoaded", () => {
