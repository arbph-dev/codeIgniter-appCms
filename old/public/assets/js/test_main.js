/* */
import { DOM } from './core/domRefs.js'

import { bus } from './core/eventBus.js'

import { initSidebar } from './ihm/sidebar.js'
import { initTabs } from './ihm/tabsPage.js'

import { initCodeVal } from './ihm/codeval.js'
import { initCallout } from './ihm/callout.js'

import { initCarousel } from './ihm/carousel.js'
	/*
	gestion carousel, 3 fichiers 
	- le module js/ihm/carousel.js qui exploite un CarouselManager
	- js/ihm/carousel/CarouselManager.js
	- js/ihm/carousel/Carousel.js 
	*/

import { initApex } from './plugins/apex.js'
import mermaid from './plugins/mermaid.js'

import { initLeaflet } from './plugins/mapleaflet.js'
import { initSvg } from './ihm/svg.js'
import { initThreejs } from './ihm/3js.js'

//2026-04-01
import { initDialog } from './ihm/dialog.js'
import { initForms } from './ihm/formsManager.js'

import { initArticleLoader } from './data/articleLoader.js'
import { initArticleRenderer } from './data/articleRenderer.js'  // ✨ NOUVEAU

//2026-04-06
import { initMotForm } from './features/mot/mot.form.js'  
import { initMotController } from './features/mot/mot.controller.js'  
import { initMotRenderer } from './features/mot/mot.renderer.js'  

function outTest() {
  console.log("tester:out - Sortie console")
}


export function initTester() {
    bus.subscribe('tester:out', outTest)
}

//sidebar
window.openNav = () => { bus.publish('sidebar:open') }

window.closeNav = () => { bus.publish('sidebar:close') }

//----------------------------------------------------------------
// cette fonction permet de gere la navigation entre page et onglet de page
// voir  
// - js/ihm/tabs/tabsPage.js
// - app\Views\layouts\nav.php
window.openPage = (pageName, elmnt) => { 
  
  let urlA = elmnt.href
  let urlWH = window.location.href // Page location is https://www.w3schools.com/js/js_window_location.asp
  let urlWP = window.location.pathname // Page path is /js/js_window_location.asp
  console.log( `openPage :  ${pageName} element.href ${urlA} location.href ${urlWH} location.pathname ${urlWP} ` )

  if (urlA === 'javascript:void(0)'){
    //on apelle le script pour changer l'onglet
    bus.publish('tabs:switch', { name : pageName , elm : elmnt } )
    console.log( `Lien interne a la page `)
  }
  else{
    //on redirige la fenetre
    console.log( `Lien externe a la page `)
    //window.Location.assign( elmnt.href )
  }

  
  //debugger

  bus.publish('tabs:switch', { name : pageName , elm : elmnt } )

}

//--------------------------------------------
// carousel
  //bus.publish('carousel:prev', '1')
window.ihmCarouselPrev = (id) => bus.publish('carousel:prev', id)
  //bus.publish('carousel:next', '1')
window.ihmCarouselNext = (id) => bus.publish('carousel:next', id)
//--------------------------------------------
// Leaflet
window.testLeafelt = initLeaflet
//--------------------------------------------
// Threejs
window.threeList = () => { bus.publish('threejs:list') }
window.threeStart = (id ) => { bus.publish('threejs:start', id ) }
window.threeStop = (id ) => { bus.publish('threejs:stop', id )  }



//--------------------------------------------
// forms
window.validateForm = (evt) => {
    /*
    if ( evt.tagName === "FORM" ){

        const formData = new FormData(evt.currentTarget);

        let n = evt.elements.length;
        console.log(`Validation Formulaire : elements ${n}`)
        
        console.log(document.forms.length)

        console.log(document.forms[0][0].value)
        console.log(document.forms[0]["firstname"].value)

        console.log(evt["firstname"].value)
        console.log(evt.firstname.value)


    }
    */
    //evt.preventDefault()
    bus.publish('forms:submit', evt)


    return false
}

//----------------------------------------------
// XHR

window.cmdListArticle = () => bus.publish('data:articles:list')




//--------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

  console.log("System - DOM Content Loaded")
  
  DOM.init()

  initTester()
  initSidebar()
  initTabs()

  initCodeVal()
  initCallout()

  initApex()

  initCarousel()


  //2026-04-01
  initDialog()
  initForms()

})



/* 2026-04-21 =====================  on  prépare l'authentification  


let ihmIsLoaded = false
let ihmStateLoading = 'onload'
let appInitialized = false // empêche double init complète


*/
let safeLoadDone = false // SafeLoad exécuté une fois


window.securityLogged = false
window.currentUser = null
// Variables globales
let loginAttempts = 0 // compteur tentatives login
const MAX_LOGIN_ATTEMPTS = 3
const LOGIN_COOLDOWN_MS = 30_000 // 30s
// ==========================================
// AUTHENTIFICATION
// ==========================================

/**
 * Vérifie si un provider est authentifié
 * @param {string} provider - Nom du provider (ex: 'zealot')
 * @returns {boolean}
 */
//export function isAuthenticated(provider = 'zealot') {
function isAuthenticated(provider = 'zealot') {
    const token = localStorage.getItem(`${provider}Token`)
    return !!token
}

/**
 * Récupère le token d'un provider
 * @param {string} provider
 * @returns {string|null}
 */
//export function getToken(provider = 'zealot') {
function getToken(provider = 'zealot') {
    return localStorage.getItem(`${provider}Token`)
}

/**
 * Stocke le token d'un provider
 * @param {string} provider
 * @param {string} token - Format: "Bearer xxxxx" ou "token_type access_token"
 */

//export function setToken(provider, token) {
function setToken(provider, token) {
    localStorage.setItem(`${provider}Token`, token)
    console.log(`✅ Token stocké pour ${provider}`)
}

/**
 * Supprime le token d'un provider (logout)
 * @param {string} provider
 */
//export function clearToken(provider = 'zealot') {
function clearToken(provider = 'zealot') {
    localStorage.removeItem(`${provider}Token`)
    console.log(`🚪 Token supprimé pour ${provider}`)
}

/**
 * Authentification utilisateur
 * @param {string} email
 * @param {string} password
 * @param {Function} successCallback
 * @param {Function} errorCallback
 */

//export function login(email, password, successCallback, errorCallback) {
 function login(email, password, successCallback, errorCallback) {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
    fetch('https://zealot.fr/api/login', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
        }
        return response.json()
    })
    .then(data => {
        // Stocker le token
        const token = `${data.token}`
        setToken('zealot', token)
        
        // Marquer comme authentifié
        window.securityLogged = true
        
        console.log('✅ Authentification réussie')
        

        // Émettre événement via EventBus (si disponible)
        /*
        if (window.eventBus) {
            window.eventBus.emit('user:authenticated', data)
        }
        */
        
        if (successCallback) {
            successCallback(data)
        }
    })
    .catch(error => {
        console.error('❌ Erreur authentification:', error.message)
        window.securityLogged = false
        
        if (errorCallback) {
            errorCallback(error)
        }
    })
}
//---------------------------------------------------------------------------
function showLoginForm() {

	if (document.getElementById('login-overlay')) return 						
    const loginHtml = `
        <div id="login-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h2 style="margin-bottom: 20px; text-align: center;">Connexion</h2>
                
                <form id="login-form">
                    <div style="margin-bottom: 15px;">
                        <label for="login-email" style="display: block; margin-bottom: 5px;">Email:</label>
                        <input 
                            type="email" 
                            id="login-email" 
                            value="arbph@sfr.fr"
                            required
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                box-sizing: border-box;
                            "
                        >
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="login-password" style="display: block; margin-bottom: 5px;">Mot de passe:</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            value="password"
                            required
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                box-sizing: border-box;
                            "
                        >
                    </div>
                    
                    <div id="login-error" style="
                        color: red;
                        margin-bottom: 10px;
                        display: none;
                    "></div>
                    
                    <button type="submit" style="
                        width: 100%;
                        padding: 12px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    `
    
	// -----CODE HTML-----
	document.body.insertAdjacentHTML('beforeend', loginHtml)
	
	const form = document.getElementById('login-form')
	const errorDiv = document.getElementById('login-error')

	form.addEventListener('submit', (e) => { e.preventDefault()

        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            errorDiv.textContent = `Trop de tentatives. Réessayez dans ${Math.round(LOGIN_COOLDOWN_MS/1000)}s.`
            errorDiv.style.display = 'block'
            return
        }

        const email = document.getElementById('login-email').value
        const password = document.getElementById('login-password').value

        loginAttempts++

        login( email, password, (data) => {
            const overlay = document.getElementById('login-overlay') ;
            if (overlay) { overlay.remove() } // supprimer overlay
            loginAttempts = 0
            window.securityLogged = true
            
            if (!safeLoadDone) { SafeLoad() }
            // Récupérer profil puis initialiser l'app complète
            /*getCurrentUserPromise()
            .then(user => { 
                window.currentUser = user 
                if (!safeLoadDone) { SafeLoad() }
                initializeAppIfNeeded() 



            })
            .catch(err => { 
                // Erreur
                errorDiv.textContent = `Erreur: ${err.message}`
                errorDiv.style.display = 'block'                
                showLoginForm()	
            })
            */
        })
    })
}

/**
 * Déconnexion
 * @param {string} provider
 */
//export function logout(provider = 'elfennel') {
function logout(provider = 'zealot') {
    clearToken(provider)
    window.securityLogged = false
    
    // Émettre événement via EventBus (si disponible)
    /*if (window.eventBus) {
        window.eventBus.emit('user:logout')
    }
    */
    console.log('🚪 Déconnexion réussie')
}


function SafeLoad() {
	safeLoadDone =true
	
}
// ---------------- AUTHENTIFICATION  ---------------------------------------
/* Vérifie l'authentification au démarrage V2
  - ✅ Token trouvé, vérification en cours...
  - ⚠️ Aucun token, affichage du formulaire de login 
*/
function checkAuthentication() {
    if (isAuthenticated('zealot')) {
        window.securityLogged = true
    } else {
        window.securityLogged = false
        showLoginForm()
    }
}



// ---------------- window.load  ---------------------------------------
window.addEventListener('load', () => {


  console.log("System - Document loaded")  
  
  checkAuthentication()

  console.log("System - Authentification") 
  



  console.log("System - Runnig application")  
  
  bus.publish('tester:out')

  bus.publish('carousel:glen', '1') // Longueur d'un carousel (debug) voir js/ihm/carousel/CarouselManager.js

	bus.publish('carousel:run', '1')
//  bus.publish('carousel:run', '2')

	//bus.publish('carousel:run:all')
	//bus.publish('carousel:stop' , '2') // a tester avec bouton
	//bus.publish('carousel:colmin','1') // ??
  
  initSvg()
  //initLeaflet()
  initThreejs()

  //2026-04-06 -> comment
  //initDialog()
  // initForms()

  //2026-04-06 -> comment
  initArticleLoader()
  initArticleRenderer()
  
  //2026-04-06
  initMotForm()  
  initMotController()  
  initMotRenderer()
})