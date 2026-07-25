// ==========================================
// spanel.js - SectionPanels COMPLET Phase 3
// Version : 0.4.5.8 (Templates + Délégation + Lifecycle)
// ==========================================

// IMPORTS
import * as DOM from '../domcreat.js'
import { SectionNode } from './snode.js'
import { TemplateFactory } from '../utils/templates.js'
import { EventDelegator } from '../../utils/event-delegator.js'
// SectionPanels js\ihm\sections\spanel.js
import { createLI } from '../utils/dom-helpers.js'

// V0.4.7.0 ✅ AJOUT
import { BaseCollection } from '../../utils/BaseCollection.js'
import { RessourceManager } from '../../utils/ressource-manager.js' // ✅ 

// CONFIGURATION PANELS CRUD
const panelCRUD = [
    { name: 'List', class: 'cp_soft-card', display: 'block' },
    { name: 'Edit', class: 'cp_soft-card', display: 'none' },
    { name: 'View', class: 'cp_soft-card', display: 'none' },
    { name: 'Table', class: 'cp_soft-card', display: 'none' },
    { name: 'Grid', class: 'cp_soft-card', display: 'none' }
]

const moduleDEBUG = false

// ==========================================
// CLASSE PRINCIPALE
// ==========================================

export class SectionPanels extends SectionNode {
    /**
     * Constructeur SectionPanels
     * 
     * @param {object} ObjTab - Objet Tab parent
     * @param {string} SectionName - Nom de la section
     * @param {Array} SectionData - Données initiales
     * @param {Array} PS - PropertySet (définition champs)
     * @param {Array} CPS - ComputePropertySet (champs calculés)
     * @param {object} templateConfig - Configuration templates
     *   {
     *     type: 'default' | 'compact' | 'detailed' | 'card' | 'badge' | 'tableRow' | 'withIcons' | 'custom',
     *     custom: function(item, factory) { return html }
     *   }
     */
    constructor(ObjTab, SectionName, SectionData, PS = [], CPS = [], templateConfig = {}) {
        super(ObjTab, SectionName)


        // ✅ Initialiser le gestionnaire de ressources (DIFFÉRENT du lifecycle !)
        this.resources = new RessourceManager(SectionName)

        // Panels CRUD
        this.arrayPanels = panelCRUD
        
        if (this.arrayPanels) {
            this.addButton()
            this.addPanel()
        }
       
        // DONNÉES
        SectionData ? this.SectionDataOriginal = SectionData : this.SectionDataOriginal = Array()
        this.SectionData = [...this.SectionDataOriginal]
        
        this.PropertySet = PS
        this.ComputePropertySet = CPS
        
        // PHASE 3.1 : TEMPLATES
        this.templateFactory = new TemplateFactory(PS, CPS)
        this.templateType = templateConfig.type || 'default'
        this.customTemplate = templateConfig.custom || null
        // V0.4.6.5 ✅ AJOUT
        this.selectionKey = 'selected' + this.SectionName.replace(/[^a-zA-Z0-9]/g, '')
        // PHASE 3.2 : DÉLÉGATION
        this.listDelegator = null
        this.formDelegator = null
        
        // PHASE 3.3 : LIFECYCLE

        
        
        // LISTE
        this.ul = null
        this.SelectionIdx = -1
        this.confMultipleSelection = false
        
        // FILTRE
        this.hasFilter = false
        this.currentFilter = null
        
        // FORMULAIRE
        this.formUpdate = false
        this.strid_Form = ''
        
        // DIALOG
        this.dialogRead = null
        this.dialogReadDiv = null
        
        // ERREURS
        this.errorMessage = ''
        
        // CONSTRUCTION UI
        this.RenderForm()
        this.RenderList()
        this.RenderRead()

        // ✅ Initialiser le cycle de vie (hooks)
        this.initLifecycle()

            // Différer légèrement l'initialisation du lifecycle
/*        setTimeout(() => {
        if (!this.isDestroyed) { this.initLifecycle() }}, 0)
*/
    }
    

    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onInit() {
        console.log('🚀 SectionPanels: Initialisation')
       // this.loadUsersData()
    }
    // ✅ V0.4.7.1 Implémenter les hooks nécessaires
    onError(error) {
        console.error('❌ SectionPanels:', error)
        this.setTabInfobar({
            titre: 'Erreur',
            texte: error.message,
            type: 'error'
        })
        this.showTabInfobar()
    }

// ✅ V0.4.7.2 Implémenter les hooks 
    onMount() {
        console.log('📍 SectionPanels: Montée dans le DOM')
        // Activer les listeners d'événements
        //this.attachEventListeners() pas dans spanel
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUnmount() {
        console.log('📤 SectionPanels: Démontage du DOM')
        // Nettoyer les listeners
        //this.removeEventListeners() //pas dans spanel
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onDestroy() {
        console.log('💥 SectionPanels: Destruction')
        // Libérer les ressources
        this.SectionData = null //dans spanel
    }
// ✅ V0.4.7.2 Implémenter les hooks     
    onUpdate(data) {
        console.log('🔄 SectionPanels: Mise à jour', data)
        this.RefreshList() //dans spanel
    }








    // ==========================================
    // PHASE 3.1 - TEMPLATES
    // ==========================================
    
    /**
     * Génère le contenu HTML d'un élément de liste selon le template configuré
     * @param {object} item - Objet de données
     * @returns {string} - HTML formaté
     */
    generateListItemContent(item) {
        try {
            switch(this.templateType) {
                case 'compact':
                    return this.templateFactory.compact(item)
                
                case 'detailed':
                    return this.templateFactory.detailed(item)
                
                case 'card':
                    return this.templateFactory.card(item)
                
                case 'badge':
                    return this.templateFactory.badge(item)
                
                case 'tableRow':
                    return this.templateFactory.tableRow(item)
                
                case 'withIcons':
                    return this.templateFactory.withIcons(item)
                
                case 'custom':
                    if (this.customTemplate) {
                        return this.templateFactory.custom(item, this.customTemplate)
                    }
                    console.warn('Template custom défini mais fonction manquante, utilisation default')
                    return this.templateFactory.default(item)
                
                case 'default':
                default:
                    return this.templateFactory.default(item)
            }
        } catch (error) {
            console.error('Erreur génération template:', error)
            return JSON.stringify(item)
        }
    }
    
    /**
     * Change le type de template et rafraîchit l'affichage
     * @param {string} type - Type de template
     */
    setTemplateType(type) {
        const validTypes = ['default', 'compact', 'detailed', 'card', 'badge', 'tableRow', 'withIcons', 'custom']
        
        if (!validTypes.includes(type)) {
            console.warn(`Type de template invalide: ${type}. Utilisation de 'default'`)
            type = 'default'
        }
        
        this.templateType = type
        this.RefreshList()
        
        console.log(`✅ Template changé: ${type}`)
    }
    
    /**
     * Définit un template personnalisé
     * @param {function} templateFn - Fonction template
     */
    setCustomTemplate(templateFn) {
        if (typeof templateFn !== 'function') {
            console.error('setCustomTemplate: fonction requise')
            return
        }
        
        this.templateType = 'custom'
        this.customTemplate = templateFn
        this.RefreshList()
        
        console.log('✅ Template personnalisé défini')
    }
    
    // ==========================================
    // PHASE 3.3 - LIFECYCLE (Méthodes wrappées)
    // ==========================================
    
    /** setTimeout avec tracking automatique     */
    setTimeout(callback, delay, ...args) { return this.resources.setTimeout(callback, delay, ...args) }
    
    /** setInterval avec tracking automatique     */
    setInterval(callback, interval, ...args) { return this.resources.setInterval(callback, interval, ...args) }
    
    /** clearTimeout  */
    clearTimeout(timerId) { this.resources.clearTimeout(timerId) }
    
    /** clearInterval */
    clearInterval(intervalId) { this.resources.clearInterval(intervalId) }
    
    /** fetch avec tracking automatique  */
    fetch(url, options) { return this.resources.fetch(url, options) }
    
    // V0.4.7.0 ✅ AJOUT
    loadPaginatedData(url) {
        return this.fetch(url)
            .then(r => r.json())
            .then(laravelResponse => {
                const collection = new BaseCollection(laravelResponse)
                this.SectionDataOriginal = collection.getItems()
                this.SectionData = [...this.SectionDataOriginal]
                this.pagination = collection
                return collection
            })
    }



    /**
     * Enregistre un observer
     */
    registerObserver(observer, name) {
        this.resources.registerObserver(observer, name)
    }
    
    /**
     * Enregistre une ressource custom
     */
    registerResource(name, resource, cleanupFn) {
        this.resources.registerResource(name, resource, cleanupFn)
    }
    
    // ==========================================
    // GESTION PANELS
    // ==========================================
    
    /**
     * Ajoute les boutons d'affichage des panels
     */
    addButton() {
        let strBtId = this.SectionName + '-ib-'
        let divBar = DOM.domCreat_Div(this.SectionName + '-buttonBar')

        this.arrayPanels.forEach((Panel, i) => {
            let inBt = DOM.domCreat_Input(
                strBtId + Panel.name,
                'button',
                Panel.name,
                {},
                { click: () => { this.Show(Panel.name) } }
            )
            divBar.appendChild(inBt)
        })

        this.setNodeContentDiv(divBar)
    }
    
    /**
     * Ajoute tous les panels définis
     */
    addPanel() {
        let strPanelId = this.SectionName + '-panel-'

        this.arrayPanels.forEach((Panel, i) => {
            let divPanel = DOM.domCreat_Div(strPanelId + Panel.name, { class: Panel.class })
            Panel.namid = divPanel.id

            Panel.contentid = Panel.namid + '-content'
            let divPanelContent = DOM.domCreat_Div(Panel.contentid, { class: 'PanelContent' }, { click: super.evt_Click })
            divPanelContent.innerHTML = `<h2>${Panel.name}</h2><p>panel ${Panel.name}</p>`

            divPanel.appendChild(divPanelContent)
            divPanel.style.display = Panel.display
            
            this.setNodeContentDiv(divPanel)
        })
    }
    
    /**
     * Affiche un panel spécifique
     * @param {string} panelName - Nom du panel
     */
    Show(panelName) {
        let tmpPanel
        let strPanelId = this.SectionName + '-panel-' + panelName

        this.arrayPanels.forEach((Panel, i) => {
            tmpPanel = document.getElementById(Panel.namid)
            if (tmpPanel && (Panel.namid === strPanelId)) {
                tmpPanel.style.display = "block"
                Panel.display = "block"
            } else {
                tmpPanel.style.display = "none"
                Panel.display = "none"
            }
        })
    }
    
    /**
     * Retourne le div contenu d'un panel
     * @param {string} panelName
     * @returns {HTMLElement}
     */
    getPanelDiv(panelName) {
        let filterKey = 'name'
        let filterVal = panelName

        let arTmp = this.arrayPanels.filter((panel) => panel[filterKey] === filterVal)
        
        if (arTmp && arTmp.length === 1) {
            return document.getElementById(arTmp[0].contentid)
        }
    }

    /**
     * Retourne le div container d'un panel
     * @param {string} panelName
     * @returns {HTMLElement}
     */
    getPanel(panelName) {
        let filterKey = 'name'
        let filterVal = panelName

        let arTmp = this.arrayPanels.filter((panel) => panel[filterKey] === filterVal)
        
        if (arTmp && arTmp.length === 1) {
            return document.getElementById(arTmp[0].namid)
        }
    }
    
    // ==========================================
    // GESTION LISTE
    // ==========================================
    
    /**
     * Active les boutons CRUD de la liste
     */
    enableListButtons() {
        this.inCrudR.disabled = false
        this.inCrudU.disabled = false
        this.inCrudD.disabled = false
    }
    
    /**
     * Désactive les boutons CRUD de la liste
     */
    disableListButtons() {
        this.inCrudR.disabled = true
        this.inCrudU.disabled = true
        this.inCrudD.disabled = true
    }
    
    /**
     * Ajoute la barre de filtrage
     */
    addlistFilterBar(PL, debug = moduleDEBUG) {
        let strNAMID = PL.id + '-Filterbar'
        let divFilterBar = DOM.domCreat_Div(strNAMID)
        
        if (debug) { console.log('création id', strNAMID) }
        
        let labelFilter = DOM.domCreat_Label(strNAMID + '-inptxt', "Filtre :")
        this.inpFilter = DOM.domCreat_Input(strNAMID + '-inptxt', "text")
        
        // Select pour choisir le champ à filtrer
        let selectField = document.createElement('select')
        selectField.id = strNAMID + '-select'
        this.PropertySet.forEach(prop => {
            let option = document.createElement('option')
            option.value = prop.name
            option.textContent = prop.description
            selectField.appendChild(option)
        })
        
        let filterBtn = DOM.domCreat_Input(
            strNAMID + '-btFilter',
            "button",
            "Filtrer",
            {},
            {
                click: () => {
                    this.currentFilter = {
                        key: selectField.value,
                        value: this.inpFilter.value
                    }
                    this.hasFilter = true
                    this.RefreshList()
                }
            }
        )
        
        let clearfilterBtn = DOM.domCreat_Input(
            strNAMID + '-btClearfilter',
            "button",
            "Effacer",
            {},
            {
                click: () => {
                    this.hasFilter = false
                    this.currentFilter = null
                    this.inpFilter.value = ''
                    this.RefreshList()
                }
            }
        )
        
        divFilterBar.appendChild(labelFilter)
        divFilterBar.appendChild(selectField)
        divFilterBar.appendChild(this.inpFilter)
        divFilterBar.appendChild(filterBtn)
        divFilterBar.appendChild(clearfilterBtn)
        
        return divFilterBar
    }
    
    renderPaginationUI() {
        const paginationDiv = document.createElement('div')
        paginationDiv.className = 'pagination-controls'
        paginationDiv.innerHTML = `
            <button data-action="prev">◀ Précédent</button>
            <span class="page-info">Page <span id="current-page">1</span> / <span id="total-pages">1</span></span>
            <button data-action="next">Suivant ▶</button>
        `
        return paginationDiv
    }
    /**
     * Ajoute la barre CRUD
     */
    addlistCrudBar(PL, debug = moduleDEBUG) {
        let strNAMID = PL.id + '-Crudbar'
        let divCrudBar = DOM.domCreat_Div(strNAMID)
        
        if (debug) { console.log('création id', strNAMID) }
        
        // CREATE
        let inCrudC = DOM.domCreat_Input(
            strNAMID + '-C',
            'button',
            'Create',
            {},
            { click: () => { this.createRecord() } }
        )

        // READ
        this.inCrudR = DOM.domCreat_Input(
            strNAMID + '-R',
            'button',
            'Read',
            { disabled: true },
            { click: () => { this.UpdateView() } }
        )
        
        // UPDATE
        this.inCrudU = DOM.domCreat_Input(
            strNAMID + '-U',
            'button',
            'Update',
            { disabled: true },
            { click: () => { this.UpdateEdit() } }
        )
        
        // DELETE
        this.inCrudD = DOM.domCreat_Input(
            strNAMID + '-D',
            'button',
            'Delete',
            { disabled: true },
            { click: (evt) => { this.deleteSeleted(evt) } }
        )

        // IMPORT
        let inCrudI = DOM.domCreat_Input(
            strNAMID + '-I',
            'button',
            'Import',
            {},
            { click: (evt) => { console.log("Import clicked") } }
        )
       
        // EXPORT
        let inCrudX = DOM.domCreat_Input(
            strNAMID + '-X',
            'button',
            'Export',
            {},
            { click: (evt) => { console.log("Export clicked") } }
        )

        divCrudBar.appendChild(inCrudC)
        divCrudBar.appendChild(this.inCrudR)
        divCrudBar.appendChild(this.inCrudU)
        divCrudBar.appendChild(this.inCrudD)
        divCrudBar.appendChild(inCrudI)
        divCrudBar.appendChild(inCrudX)

        return divCrudBar
    }
    
    /**
     * PHASE 3.2 : Construit la liste avec délégation d'événements
     */

    // ./js/ihm/sections/spanel.js
// Méthode RenderList()

    RenderList() {
        let paneldivList = this.getPanelDiv('List')
        
        // Créer <ul>
        let strNAMID = paneldivList.id + '-List'
        this.ul = DOM.domCreat_UL(strNAMID)
        this.strid_List = this.ul.id
        
        // PHASE 3.2 : Créer le delegator
        this.listDelegator = new EventDelegator(this.ul)
        
        // PHASE 3.2 : Délégation pour les <li>
        this.listDelegator.on('li', 'click', (evt, target) => {
            const index = parseInt(target.dataset.index, 10)
            
            if (isNaN(index) || index < 0 || index >= this.SectionData.length) {
                console.warn('Index invalide dans <li>:', index)
                return
            }
            
            // ✅ CORRECTION : Récupérer l'item depuis SectionData
            const item = this.SectionData[index]
            
            // GESTION SÉLECTION MULTIPLE
            // V0.4.6.5 ✅ REVUE GESTION SÉLECTION MULTIPLE
            if (this.confMultipleSelection) {
                target.classList.toggle("done")
                
                // ✅ MODIFICATION : Utiliser selectionKey dynamique
                const multiKey = this.selectionKey + 'Multiple'
                
                if (target.classList.contains("done")) {
                    if (!window[multiKey]) {
                        window[multiKey] = []
                    }
                    window[multiKey].push(item)
                } else {
                    if (window[multiKey]) {
                        const idx = window[multiKey].findIndex(
                            c => JSON.stringify(c) === JSON.stringify(item)
                        )
                        if (idx !== -1) {
                            window[multiKey].splice(idx, 1)
                        }
                    }
                }
                
                if (window[multiKey] && window[multiKey].length > 0) {
                    this.enableListButtons()
                } else {
                    this.disableListButtons()
                }
                
                console.log('📋 Sélection multiple:', window[multiKey])
            }
            else {
                // V0.4.6.5 ✅ REVUE GESTION SÉLECTION SIMPLE
                this.ul.querySelectorAll('li.done').forEach(li => {
                    li.classList.remove('done')
                })
                
                target.classList.add("done")
                this.enableListButtons()
                this.SelectionIdx = index
                
                // ✅ MODIFICATION : Utiliser selectionKey unique
                window[this.selectionKey] = item
                console.log(`📌 ${this.SectionName} sélectionné:`, item)
            }
        })
        
        // Remplir la liste
        this.UpdateList()
        
        // Ajouter les barres
        paneldivList.appendChild(this.addlistCrudBar(paneldivList))
        paneldivList.appendChild(this.addlistFilterBar(paneldivList))
        paneldivList.appendChild(this.ul)
    }
    
    /**
     * PHASE 3.1 + 3.2 : Met à jour la liste (templates + délégation)
     */
    UpdateList() {
        let strNAMID = this.ul.id + '-li-'
        
        this.SectionData.forEach((item, i) => {
            // PHASE 3.1 : Génération via template
            const content = this.generateListItemContent(item)
            
            // PHASE 3.2 : Plus de listener, c'est géré par délégation
            //let li = DOM.domCreat_LI(strNAMID + i, content)
            // ✅ Utiliser createLI qui gère innerHTML
            let li = createLI(strNAMID + i, content)
            // PHASE 3.2 : Stocker l'index dans data-attribute
            li.dataset.index = i
            
            this.ul.appendChild(li)
        })
    }
    
    /**
     * Rafraîchit la liste (filtre + réaffichage)
     */
    RefreshList() {
        // Vider la liste (garder le delegator)
        while (this.ul.firstChild) {
            this.ul.removeChild(this.ul.firstChild)
        }
        
        this.resetFormFields()
        
        // Appliquer filtre si actif
        if (this.hasFilter === true && this.currentFilter) {
            const filterKey = this.currentFilter.key || 'nom'
            const filterVal = this.currentFilter.value || ''
            
            if (filterVal.trim() === '') {
                this.SectionData = [...this.SectionDataOriginal]
            } else {
                const regex = new RegExp(filterVal, "i")
                this.SectionData = this.SectionDataOriginal.filter(
                    item => regex.test(item[filterKey])
                )
            }
        } else {
            this.SectionData = [...this.SectionDataOriginal]
        }
        
        // Remplir (delegator toujours actif)
        this.UpdateList()
        this.disableListButtons()
        this.SelectionIdx = -1
    }
    
    /**
     * CREATE : Affiche le formulaire vide
     */
    createRecord() {
        this.resetFormFields()
        this.formUpdate = false
        this.Show('Edit')
    }
    
    /**
     * UPDATE : Affiche le formulaire pré-rempli
     */
    UpdateEdit() {
        let refInput

        if (this.SelectionIdx != -1) {
            let item = this.SectionData[this.SelectionIdx]
            
            this.PropertySet.forEach(property => {
                refInput = this.getformInput(property)

                if (property.type === 'date') {
                    refInput.valueAsDate = item[property.name]
                } else {
                    refInput.value = item[property.name]
                }
            })
        }
        
        this.formUpdate = true
        this.Show('Edit')
    }
    
    /**
     * DELETE : Supprime l'élément sélectionné
     */
    deleteSeleted(evt) {
        if (this.SelectionIdx != -1) {
            this.deleteFromOriginalData(this.SelectionIdx)
            evt.preventDefault()
        }
    }
    
    // ==========================================
    // GESTION FORMULAIRE
    // ==========================================
    
    /**
     * Crée un input de formulaire depuis PropertySet
     */
    createformInput(Pps) {
        let input
        let strNAMID = this.strid_Form + '-' + Pps.name

        let divWrapper = document.createElement('div')
        let label = DOM.domCreat_Label(strNAMID, Pps.description)

        switch (Pps.type) {
            case 'text':
                if (!Pps.options) {
                    Pps.options = {
                        pattern: "[a-zA-Z]{3,20}",
                        placeholder: 'saisir ' + Pps.description
                    }
                }
                input = DOM.domCreat_Input(strNAMID, Pps.type, Pps.default, Pps.options)
                break

            case 'date':
                if (!Pps.options) {
                    Pps.options = {
                        pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$",
                        placeholder: 'saisir une date dd/mm/yyyy'
                    }
                }
                input = DOM.domCreat_Input(strNAMID, Pps.type, Pps.default, Pps.options)
                break

            default:
                input = DOM.domCreat_Input(strNAMID, Pps.type, Pps.default)
                break
        }

        strNAMID = 'inp_' + Pps.name
        this[strNAMID] = input

        divWrapper.appendChild(label)
        divWrapper.appendChild(input)

        return divWrapper
    }
    
    /**
     * Récupère un input de formulaire
     */
    getformInput(Pps) {
        let strNAMID = 'inp_' + Pps.name
        return this[strNAMID]
    }
    
    /**
     * Ajoute bouton retour liste
     */
    addbutton_BackList(PL, debug = moduleDEBUG) {
        let strNAMID = PL.id

        let cancelBtn = DOM.domCreat_Input(
            strNAMID + '-cancel',
            "reset",
            "Cancel",
            {},
            {
                click: (evt) => {
                    evt.preventDefault()
                    this.RefreshList()
                    this.Show('List')
                }
            }
        )
        
        if (debug) {
            console.log('création id', strNAMID + '-cancel')
        }

        return cancelBtn
    }
    
    /**
     * Construit le formulaire
     */
    RenderForm(debug = moduleDEBUG) {
        let paneldivEdit = this.getPanelDiv('Edit')
        this.clearElement(paneldivEdit)
        
        let strNAMID = paneldivEdit.id + '-Form'
        this.strid_Form = strNAMID
        
        let form = DOM.domCreat_Form(
            strNAMID,
            { enctype: "multipart/form-data" },
            {
                submit: (e) => {
                    if (debug) {
                        console.log("Form submitted!")
                    }
                    e.preventDefault()
                }
            }
        )

        // Création des inputs depuis PropertySet
        this.PropertySet.forEach(property => {
            form.appendChild(this.createformInput(property))
        })

        let confirmBtn = DOM.domCreat_Input(
            strNAMID + '-confirm',
            "submit",
            "Confirm",
            {},
            {
                click: (evt) => {
                    let resultValid = null
                    let stateValid = true
                    
                    if (this.formUpdate === true) {
                        // MODIFICATION
                        if (this.SelectionIdx != -1) {
                            resultValid = this.extractFields()
                            if (resultValid) {
                                const itemToUpdate = this.SectionData[this.SelectionIdx]
                                const originalIdx = this.SectionDataOriginal.findIndex(
                                    item => JSON.stringify(item) === JSON.stringify(itemToUpdate)
                                )
                                
                                if (originalIdx !== -1) {
                                    this.SectionDataOriginal[originalIdx] = resultValid
                                }
                            } else {
                                this.setTabInfobar({
                                    "titre": "Modification",
                                    "texte": this.errorMessage,
                                    "type": "warning"
                                })
                                this.showTabInfobar()
                                stateValid = false
                            }
                        }
                        this.formUpdate = false
                    } else {
                        // CRÉATION
                        resultValid = this.extractFields()
                        if (resultValid) {
                            this.SectionDataOriginal.push(resultValid)
                        } else {
                            this.setTabInfobar({
                                "titre": "Creation",
                                "texte": this.errorMessage,
                                "type": "warning"
                            })
                            this.showTabInfobar()
                            stateValid = false
                        }
                    }
                    
                    if (stateValid) {
                        this.setTabInfobar({
                            "titre": "Formulaire",
                            "texte": "Validation réussie",
                            "type": "success"
                        })
                        this.showTabInfobar()
                        this.setTimeout(() => {
                            this.hideTabInfobar()
                        }, 3500)

                        this.RefreshList()
                        this.RenderTable()
                        this.RenderGrid()
                        this.Show('List')
                    }
                }
            }
        )
        
        if (debug) {
            console.log('création id', strNAMID + '-confirm')
        }
        
        form.appendChild(this.addbutton_BackList(form))
        form.appendChild(confirmBtn)
       
        paneldivEdit.appendChild(form)
    }
    
    /**
     * Réinitialise les champs du formulaire
     */
    resetFormFields() {
        let refInput

        this.PropertySet.forEach(property => {
            refInput = this.getformInput(property)
            refInput.value = property.default
        })
    }
    
    /**
     * Valide une propriété
     */
    checkPropertySetValue(proP, refIn, refobjData) {
        let vsucceed = false
        let vErrorPM = false
        let vOK = false
        let propValidation = false
        let refError = ''
        
        vsucceed = refIn.validity.valid
        vErrorPM = refIn.validity.patternMismatch

        if (!vsucceed && !vErrorPM) {
            refError += `Champ ${proP.name} : ${refIn.validationMessage} `
        }
        if (!vsucceed && vErrorPM) {
            refError += `Champ ${proP.name} pattern invalide : ${refIn.validationMessage} `
        }
        if (vsucceed && !vErrorPM) {
            vOK = true
        }

        if (proP.validate) {
            const result = proP.validate(refIn.value)

            if ((result != true) || refIn.value === proP.default) {
                refError += result
                propValidation = false
            } else {
                propValidation = true
            }
        } else {
            propValidation = true
        }

        if (vOK && propValidation) {
            return { success: true, errors: 'none' }
        } else {
            return { success: false, errors: refError }
        }
    }
    
    /**
     * Extrait et valide les champs du formulaire
     */
    extractFields() {
        let refInput
        let zt = {}
        let bValid = true
        let a
        this.errorMessage = ''

        this.PropertySet.forEach(property => {
            if (bValid != true) {
                return
            }
            
            refInput = this.getformInput(property)
            let ipn_type = refInput.type

            switch (ipn_type) {
                case 'number':
                    a = this.checkPropertySetValue(property, refInput, null)
                    if (a.success === true) {
                        zt[property.name] = parseInt(refInput.value)
                    }
                    bValid = a.success
                    break

                case 'text':
                    a = this.checkPropertySetValue(property, refInput, null)
                    if (a.success === true) {
                        zt[property.name] = refInput.value
                    }
                    bValid = a.success
                    break

                case 'date':
                    a = this.checkPropertySetValue(property, refInput, zt)
                    if (a.success === true) {
                        const [year, month, day] = refInput.value.split('-').map(Number)
                        zt[property.name] = new Date(year, month - 1, day)
                    }
                    bValid = a.success
                    break

                default:
                    console.error('type property unknow :: extractFields conversion objet ' + property.name)
                    bValid = false
                    return
            }
        })

        if (bValid != true) {
            this.errorMessage = a.errors
            return
        } else {
            this.ComputePropertySet.forEach(property => {
                if (property.calculate) {
                    const result = property.calculate(zt)
                    zt[property.name] = result
                }
            })
            return zt
        }
    }
    
    // ==========================================
    // GESTION VIEW (Lecture seule)
    // ==========================================
    
    /**
     * Récupère un span de lecture
     */
    getviewSpan(Pps) {
        let strPROPID = 'rsp_' + Pps
        return this[strPROPID]
    }
    
    /**
     * Construit le panel de lecture
     */
    RenderRead() {
        let pProp
        let rspProp
        let strNAMID
        let strPROPID

        let paneldivView = this.getPanelDiv('View')
        this.clearElement(paneldivView)

        this.PropertySet.forEach(property => {
            strNAMID = paneldivView.id + '-' + property.name

            pProp = DOM.domCreat_P()
            pProp.textContent = property.name + ' : '
            rspProp = DOM.domCreat_Span(strNAMID, {}, {})
            rspProp.textContent = property.default

            strPROPID = 'rsp_' + property.name
            this[strPROPID] = rspProp

            pProp.appendChild(rspProp)
            paneldivView.appendChild(pProp)
        })

        // Ajout des ComputePropertySet
        this.ComputePropertySet.forEach(property => {
            strNAMID = paneldivView.id + '-' + property.name
            
            pProp = DOM.domCreat_P()
            pProp.textContent = property.name + ' : '
            
            rspProp = DOM.domCreat_Span(strNAMID, {}, {})
            rspProp.textContent = 'non évaluée'

            strPROPID = 'rsp_' + property.name
            this[strPROPID] = rspProp

            pProp.appendChild(rspProp)
            paneldivView.appendChild(pProp)
        })

        // Ajout du bouton de retour
        let panelView = this.getPanel('View')
        panelView.appendChild(this.addbutton_BackList(panelView))

        // Construit dialog
        let aoT = this.RenderDialog(panelView)
        this.dialogRead = aoT[0]
        this.dialogReadDiv = aoT[1]
        
        this.RefreshDialog(this.dialogReadDiv)

        // Bouton ouverture dialog
        let OpendlgBtn = DOM.domCreat_Input(
            panelView.id + '-btOpendlg',
            "button",
            "open dlg",
            {},
            { click: () => { this.dialogRead.showModal() } }
        )
        panelView.appendChild(OpendlgBtn)
    }
    
    /**
     * Met à jour la vue avec les données sélectionnées
     */
    UpdateView() {
        let refInput

        if (this.SelectionIdx != -1) {
            let item = this.SectionData[this.SelectionIdx]

            this.PropertySet.forEach(property => {
                refInput = this.getviewSpan(property.name)

                if (property.type === 'date') {
                    refInput.textContent = new Intl.DateTimeFormat().format(item[property.name])
                } else {
                    refInput.textContent = item[property.name]
                }
            })

            this.ComputePropertySet.forEach(property => {
                refInput = this.getviewSpan(property.name)
                refInput.textContent = item[property.name]
            })
        }

        this.Show('View')
    }
    
    /**
     * Crée un dialog
     */
    RenderDialog(elmParent) {
        let strNAMID = elmParent.id + '-Dialog'
        let elmDialog = DOM.domCreat_Dialog(strNAMID, {}, {})
        let elmDialogDiv = DOM.domCreat_Div(strNAMID + '-Div', { text: 'hello' }, {})

        let elmDialogForm = DOM.domCreat_Form(
            strNAMID + '-Form',
            { method: "dialog" },
            {
                submit: (e) => {
                    e.preventDefault()
                    console.log(strNAMID + '-Form submitted!')
                }
            }
        )

        let elmDialogFormCloseBt = DOM.domCreat_Input(
            strNAMID + '-Form-BtClose',
            "button",
            "close dlg",
            {},
            {
                click: () => {
                    console.log("close dlg clicked")
                    elmDialog.close()
                }
            }
        )

        elmDialogForm.appendChild(elmDialogFormCloseBt)
        elmDialog.appendChild(elmDialogDiv)
        elmDialog.appendChild(elmDialogForm)
        elmParent.appendChild(elmDialog)
        
        return [elmDialog, elmDialogDiv]
    }
    
    /**
     * Rafraîchit le contenu du dialog
     */
    RefreshDialog(elmDialogDiv) {
        elmDialogDiv.innerHTML = `
        <h1>SimpleDialog</h1>
        <h3>Message</h3>
        <p>Ce dialogue permet d'afficher un message.</p>
        `
    }
    
    // ==========================================
    // GESTION TABLE
    // ==========================================
    
    /**
     * Construit le tableau
     */
    RenderTable() {
        let paneldivTable = this.getPanelDiv('Table')
        this.clearElement(paneldivTable)

        let table = document.createElement("table")
        table.id = paneldivTable.id + '-Table'

        if (this.SectionData && this.SectionData[0]) {
            let row = table.insertRow()
            
            // Colonne index
            const cell = row.insertCell()
            cell.style.padding = "10px"
            cell.style.margin = "10px"
            cell.textContent = 'idx'

            const colNames = Object.keys(this.SectionData[0])

            colNames.forEach((colName) => {
                const cell = row.insertCell()
                cell.style.padding = "10px"
                cell.style.margin = "10px"
                cell.textContent = colName
            })
            
            this.SectionData.forEach((item, i) => {
                row = table.insertRow()
                
                // Index
                const cell = row.insertCell()
                cell.style.padding = "10px"
                cell.style.margin = "10px"
                cell.textContent = i

                colNames.forEach((colName) => {
                    const cell = row.insertCell()
                    cell.style.padding = "10px"
                    cell.style.margin = "10px"

                    if (colName === 'birthdate') {
                        cell.textContent = new Intl.DateTimeFormat().format(item[colName])
                    } else {
                        cell.textContent = item[colName]
                    }
                })
            })
        }

        paneldivTable.appendChild(table)

        let panelTable = this.getPanel('Table')
        panelTable.appendChild(this.addbutton_BackList(panelTable))
    }
    
    // ==========================================
    // GESTION GRID
    // ==========================================
    
    /**
     * Construit la grille
     */
    RenderGrid() {
        let paneldivGrid = this.getPanelDiv('Grid')
        this.clearElement(paneldivGrid)
        paneldivGrid.className = "grid-container"

        this.SectionData.forEach((item, i) => {
            let divChild = DOM.domCreat_Div(paneldivGrid.id + '-div-' + i)

            for (const [key, val] of Object.entries(item)) {
                const span = document.createElement("span")

                if (key === 'birthdate') {
                    span.textContent = key + " " + new Intl.DateTimeFormat().format(val)
                } else {
                    span.textContent = key + " " + val
                }

                divChild.appendChild(span)
                divChild.appendChild(document.createElement("br"))
            }

            paneldivGrid.appendChild(divChild)
        })
    }
    
    // ==========================================
    // GESTION DONNÉES
    // ==========================================
    
    /**
     * Ajoute un enregistrement aux données originales
     */
    addToOriginalData(newItem) {
        this.SectionDataOriginal.push(newItem)
        this.RefreshList()
    }

    /**
     * Mise à jour d'un enregistrement dans les données originales
     */
    updateOriginalData(idx, updatedItem) {
        if (idx >= 0 && idx < this.SectionDataOriginal.length) {
            this.SectionDataOriginal[idx] = updatedItem
            this.RefreshList()
        }
    }

    /**
     * Suppression d'un enregistrement des données originales
     */
    deleteFromOriginalData(idx) {
        if (idx >= 0 && idx < this.SectionData.length) {
            const itemToDelete = this.SectionData[idx]
            const originalIdx = this.SectionDataOriginal.findIndex(
                item => JSON.stringify(item) === JSON.stringify(itemToDelete)
            )
            
            if (originalIdx !== -1) {
                this.SectionDataOriginal.splice(originalIdx, 1)
                this.RefreshList()
            }
        }
    }
    
    // ==========================================
    // NETTOYAGE
    // ==========================================
    
    /**
     * PHASE 3.2 + 3.3 : Détruit le contenu d'un élément
     */
    clearElement(elmRef) {
        if (!elmRef) return
        
        // Si c'est la liste, nettoyer le delegator
        if (this.listDelegator && elmRef === this.ul) {
            this.listDelegator.offAll()
        }
        
        // Vider le contenu
        while (elmRef.firstChild) {
            elmRef.removeChild(elmRef.firstChild)
        }
        
        // Force garbage collection
        elmRef.innerHTML = ''
    }
    
    /**
     * PHASE 3.2 + 3.3 : Détruit complètement la section
     */
    destroy() {
        console.log(`🗑️ Destruction section ${this.SectionName}`)
        
        // 1. Nettoyer les delegators (Phase 3.2)
        if (this.listDelegator) {
            this.listDelegator.destroy()
            this.listDelegator = null
        }
        
        if (this.formDelegator) {
            this.formDelegator.destroy()
            this.formDelegator = null
        }
        
        // 2. Nettoyer les ressources (timers, fetch, observers)
        if (this.resources) {  // ✅ CHANGER
            this.resources.destroy()  // ✅ CHANGER
            this.resources = null  // ✅ CHANGER
        }
        
        // 3. Déclencher le hook onDestroy du lifecycle
        if (this.lifecycle) {  // ✅ Celui de snode.js (hooks)
            this.lifecycle.triggerDestroy()
            //this.lifecycle = null
        }

            
        
        
        // 3. Nettoyer les panels
        this.arrayPanels.forEach(panel => {
            const panelDiv = document.getElementById(panel.namid)
            if (panelDiv) {
                this.clearElement(panelDiv)
            }
        })
        
        // 4. Réinitialiser les propriétés
        this.SectionData = null
        this.SectionDataOriginal = null
        this.PropertySet = null
        this.ul = null
        this.templateFactory = null
        
        console.log(`✅ Section ${this.SectionName} détruite`)
    }
}

// ==========================================
// EXPORT
// ==========================================

export default SectionPanels

