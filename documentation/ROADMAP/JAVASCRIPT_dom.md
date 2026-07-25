# dom helpers

- createElement

- createSelect(id, options, attributes) - Créer un select

- createCheckboxList(baseId, items, options) - Liste de checkboxes
- getCheckboxValues(name) - Récupérer valeurs checkboxes
  
- createRadioGroup(name, items, options) - Groupe de radios
- getRadioValue(name) - Récupérer valeur radio

createLI,
createDIV,
sanitizeHTML,
createFromTemplate,
SafeListItem,
parseHTMLSafe,
createSelect, // V0.4.6.5 ✅ AJOUT
// Exemples    
exampleSimple,
exampleSafe,
exampleTemplate


## utilitaires DOM 
```js
export function clear(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}
```

```js
export function toggle(el, state) {
    el.style.display = state ? 'block' : 'none'
}
```

## sélecteurs du DOM
- qs
- qsa
- byId

```js
export function qs(sel, root = document) {
	return root.querySelector(sel)
}
```

```js
export function qsa(sel, root = document) {
	return [...root.querySelectorAll(sel)]
}
```

```js
export function byId(id) {
	return document.getElementById(id)
}
```

**exemple**
Un composant dispose d'elements rendus en html, il les référence en utilsant les selecteurs
```js
/*partie DOM ----   */
function getRoot(id) { return byId(`CODEVAL_${id}`) }
function getTextarea(id) { return qs('textarea', getRoot(id)) }
function getResult(id) { return qs('.result', getRoot(id)) }
function getScript(id) { return qs('.scriptcode', getRoot(id)) }
```



### createLI(id, htmlContent)
```js
// ./js/ihm/utils/dom-helpers.js
// Helpers pour manipulation DOM sécurisée

/** 
 * Crée un élément LI avec contenu HTML
 * @param {string} id - ID de l'élément
 * @param {string} htmlContent - Contenu HTML à insérer
 * @returns {HTMLLIElement}
 export function createLI(id, htmlContent) {
    const li = document.createElement('li')
    li.id = id
    li.innerHTML = sanitizeHTML(htmlContent)
    return li
}

*/
/** ✅ Version Dual render
 * Crée un élément LI avec contenu HTML
 * @param {string} id - ID de l'élément
 * @param {string} htmlContent - Contenu DOM direct ou String sanitizé
 * @returns {HTMLLIElement}
*/
export function createLI(id, htmlContent) {
    const li = document.createElement('li')
    li.id = id
    
    if (htmlContent instanceof HTMLElement) {
        li.appendChild(htmlContent)  
    } else {
        li.innerHTML = sanitizeHTML(htmlContent)  
    }
    return li
}
```

### createDIV(id, htmlContent)

```js
/**
 * Crée un élément DIV avec contenu HTML
 * @param {string} id - ID de l'élément
 * @param {string} htmlContent - Contenu HTML à insérer
 * @returns {HTMLDivElement}
 */
export function createDIV(id, htmlContent) {
    const div = document.createElement('div')
    div.id = id
    div.innerHTML = sanitizeHTML(htmlContent)
    return div
}
```

### createElement

```js
/**
 * Crée un élément avec contenu HTML
 * @param {string} tagName - Nom du tag (div, span, p, etc.)
 * @param {string} id - ID de l'élément
 * @param {string} htmlContent - Contenu HTML
 * @param {Object} attributes - Attributs additionnels
 * @returns {HTMLElement}
 */
export function createElement(tagName, id, htmlContent, attributes = {}) {
    const element = document.createElement(tagName)
    element.id = id
    element.innerHTML = sanitizeHTML(htmlContent)
    
    // Ajouter les attributs
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    })
    
    return element
}
```

avec callback 
```js
    createElement(tag, attrs = {}, callbacks = {}) {
        let el = document.createElement(tag);

        // Attributs standards
        for (let [key, val] of Object.entries(attrs)) {
            if (key === "text") {
                el.textContent = val;
            } else {
                el.setAttribute(key, val);
            }
        }

        // Callbacks (évènements)
        for (let [evt, fn] of Object.entries(callbacks)) {
            if (fn && typeof fn === "function") {
                el.addEventListener(evt, fn);
            } else {
                el.addEventListener(evt, () => console.log(`${tag} event: ${evt}`));
            }
        }

        return el;
    },
```

gere le type de contenu
```
export function create(tag, attrs = {}, events = {}) {
    const el = document.createElement(tag)

    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'text') el.textContent = v
        else if (k === 'html') el.innerHTML = v
        else el.setAttribute(k, v)
    })

    Object.entries(events).forEach(([evt, fn]) => {
        el.addEventListener(evt, fn)
    })

    return el
}

```



### sanitizeHTML(html)

```js
/**
 * Sanitize HTML basique pour éviter XSS
 * Permet : <strong>, <em>, <b>, <i>, <u>, <br>, <span>
 * Bloque : <script>, <iframe>, événements onclick, etc.
 * @param {string} html - Chaîne HTML à nettoyer
 * @returns {string}
 */
export function sanitizeHTML(html) {
    // Créer un élément temporaire
    const temp = document.createElement('div')
    temp.textContent = html // D'abord échapper tout
    
    let sanitized = temp.innerHTML
    
    // Liste blanche des balises autorisées
    const allowedTags = [ 'img', 'div', 'strong', 'b', 'em', 'i', 'u', 'br', 'span', 'small', 'mark', 'del', 'ins', 'sub', 'sup', 'code' ]
    
    // Ré-autoriser les balises de la liste blanche
    allowedTags.forEach(tag => {
        const openRegex = new RegExp(`&lt;${tag}&gt;`, 'gi')
        const closeRegex = new RegExp(`&lt;/${tag}&gt;`, 'gi')
        sanitized = sanitized.replace(openRegex, `<${tag}>`)
        sanitized = sanitized.replace(closeRegex, `</${tag}>`)
    })
    
    // Autoriser les attributs basiques sur span
    sanitized = sanitized.replace(
        /&lt;span class=&quot;([^&]+)&quot;&gt;/gi,
        '<span class="$1">'
    )
    
    return sanitized
}
```

### createFromTemplate(template)

```js
/**
 * Version plus stricte : crée des éléments DOM au lieu de HTML strings
 * Recommandé pour sécurité maximale
 * @param {Object} template - Template structuré
 * @returns {HTMLElement}
 */
export function createFromTemplate(template) {
    const container = document.createElement(template.tag || 'div')
    
    if (template.id) container.id = template.id
    if (template.className) container.className = template.className
    
    // Ajouter les enfants
    if (template.children) {
        template.children.forEach(child => {
            if (typeof child === 'string') {
                // Texte brut
                container.appendChild(document.createTextNode(child))
            } else if (child.tag) {
                // Élément DOM récursif
                container.appendChild(createFromTemplate(child))
            }
        })
    } else if (template.text) {
        // Texte simple
        container.textContent = template.text
    }
    
    return container
}
```

### class SafeListItem

```js
/**
 * Helper pour créer un template de liste sécurisé
 * Exemple d'usage pour éviter innerHTML
 */
export class SafeListItem {
    constructor(id) {
        this.li = document.createElement('li')
        this.li.id = id
        this.parts = []
    }
    
    addText(text) {
        this.parts.push({ type: 'text', content: text })
        return this
    }
    
    addStrong(text) {
        this.parts.push({ type: 'strong', content: text })
        return this
    }
    
    addEm(text) {
        this.parts.push({ type: 'em', content: text })
        return this
    }
    
    addIcon(emoji) {
        this.parts.push({ type: 'text', content: emoji })
        return this
    }
    
    build() {
        this.parts.forEach(part => {
            let element
            
            switch(part.type) {
                case 'text':
                    element = document.createTextNode(part.content)
                    break
                case 'strong':
                    element = document.createElement('strong')
                    element.textContent = part.content
                    break
                case 'em':
                    element = document.createElement('em')
                    element.textContent = part.content
                    break
            }
            
            this.li.appendChild(element)
        })
        
        return this.li
    }
}
```

### parseHTMLSafe(htmlString)

```js
/**
 * Convertit un template HTML string en éléments DOM sécurisés
 * @param {string} htmlString - Template HTML
 * @returns {DocumentFragment}
 */
export function parseHTMLSafe(htmlString) {
    const template = document.createElement('template')
    template.innerHTML = sanitizeHTML(htmlString)
    return template.content
}

```

### exampleSimple()

```js
// ==========================================
// EXEMPLES D'UTILISATION
// ==========================================

/**
 * Exemple 1 : Version simple avec innerHTML sanitizé
 */
export function exampleSimple() {
    const li = createLI('item-1', '👤 <strong>John Doe</strong> - john@example.com')
    return li
}

```

### createSelect(id, options = [], attributes = {})

```js
/**
 * Crée un élément SELECT avec options
 * @param {string} id - ID du select
 * @param {Array} options - [{value, text, selected?}]
 * @param {Object} attributes - Attributs additionnels
 * @returns {HTMLSelectElement}
 * 
 * Exemple:
 * createSelect('user-select', [
 *   {value: '1', text: 'User 1', selected: true},
 *   {value: '2', text: 'User 2'}
 * ], {class: 'form-select'})
 */
export function createSelect(id, options = [], attributes = {}) {
    const select = document.createElement('select')
    select.id = id
    
    // Ajouter les attributs
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            select.className = value
        } else {
            select.setAttribute(key, value)
        }
    })
    
    // Ajouter les options
    options.forEach(opt => {
        const option = document.createElement('option')
        option.value = opt.value
        option.textContent = opt.text || opt.value
        
        if (opt.selected) {
            option.selected = true
        }
        
        if (opt.disabled) {
            option.disabled = true
        }
        
        select.appendChild(option)
    })
    
    return select
}

```

### createCheckboxList(baseId, items = [], options = {})

```js
/**
 * Crée une liste de checkboxes
 * @param {string} baseId - ID de base (sera suffixé par l'index)
 * @param {Array} items - [{value, label, checked?, name?}]
 * @param {Object} options - {wrapper: 'div'|'ul', class: '...'}
 * @returns {HTMLElement}
 * 
 * Exemple:
 * createCheckboxList('filter', [
 *   {value: 'active', label: 'Actifs', checked: true},
 *   {value: 'inactive', label: 'Inactifs'}
 * ], {wrapper: 'div', class: 'checkbox-group'})
 */
export function createCheckboxList(baseId, items = [], options = {}) {
    const wrapperTag = options.wrapper || 'div'
    const container = document.createElement(wrapperTag)
    container.id = baseId + '-container'
    
    if (options.class) {
        container.className = options.class
    }
    
    items.forEach((item, index) => {
        // Conteneur pour chaque checkbox
        const itemWrapper = document.createElement(wrapperTag === 'ul' ? 'li' : 'div')
        itemWrapper.className = 'checkbox-item'
        
        // Checkbox
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `${baseId}-${index}`
        checkbox.value = item.value
        checkbox.name = item.name || baseId
        
        if (item.checked) {
            checkbox.checked = true
        }
        
        if (item.disabled) {
            checkbox.disabled = true
        }
        
        // Label
        const label = document.createElement('label')
        label.htmlFor = checkbox.id
        label.textContent = item.label || item.value
        
        // Assembler
        itemWrapper.appendChild(checkbox)
        itemWrapper.appendChild(label)
        container.appendChild(itemWrapper)
    })
    
    return container
}

/**
 * Crée un groupe radio buttons
 * @param {string} name - Nom du groupe (partagé)
 * @param {Array} items - [{value, label, checked?}]
 * @param {Object} options - {wrapper: 'div'|'ul', class: '...'}
 * @returns {HTMLElement}
 * 
 * Exemple:
 * createRadioGroup('status', [
 *   {value: 'active', label: 'Actif', checked: true},
 *   {value: 'inactive', label: 'Inactif'}
 * ])
 */
export function createRadioGroup(name, items = [], options = {}) {
    const wrapperTag = options.wrapper || 'div'
    const container = document.createElement(wrapperTag)
    container.id = name + '-radio-container'
    
    if (options.class) {
        container.className = options.class
    }
    
    items.forEach((item, index) => {
        const itemWrapper = document.createElement(wrapperTag === 'ul' ? 'li' : 'div')
        itemWrapper.className = 'radio-item'
        
        // Radio
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.id = `${name}-${index}`
        radio.value = item.value
        radio.name = name
        
        if (item.checked) {
            radio.checked = true
        }
        
        if (item.disabled) {
            radio.disabled = true
        }
        
        // Label
        const label = document.createElement('label')
        label.htmlFor = radio.id
        label.textContent = item.label || item.value
        
        itemWrapper.appendChild(radio)
        itemWrapper.appendChild(label)
        container.appendChild(itemWrapper)
    })
    
    return container
}

/**
 * Récupère les valeurs sélectionnées d'une checkbox list
 * @param {string} name - Nom du groupe
 * @returns {Array<string>}
 */
export function getCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`)
    return Array.from(checkboxes).map(cb => cb.value)
}

/**
 * Récupère la valeur sélectionnée d'un radio group
 * @param {string} name - Nom du groupe
 * @returns {string|null}
 */
export function getRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`)
    return radio ? radio.value : null
}


/**
 * Exemple 2 : Version sécurisée maximale avec DOM
 */
export function exampleSafe() {
    const builder = new SafeListItem('item-2')
    builder
        .addIcon('👤 ')
        .addStrong('John Doe')
        .addText(' - ')
        .addText('john@example.com')
    
    return builder.build()
}

/**
 * Exemple 3 : Template structuré
 */
export function exampleTemplate() {
    return createFromTemplate({
        tag: 'li',
        id: 'item-3',
        children: [
            { tag: 'span', text: '👤 ' },
            { tag: 'strong', text: 'John Doe' },
            ' - ',
            { tag: 'em', text: 'john@example.com' }
        ]
    })
}

// ==========================================
// EXPORT PAR DÉFAUT
// ==========================================

export default {
    createLI,
    createDIV,
    createElement,
    sanitizeHTML,
    createFromTemplate,
    SafeListItem,
    parseHTMLSafe,
    createSelect, // V0.4.6.5 ✅ AJOUT
    createCheckboxList, // V0.4.6.5 ✅ AJOUT
    createRadioGroup, // V0.4.6.5 ✅ AJOUT
    getCheckboxValues,// V0.4.6.5 ✅ AJOUT
    getRadioValue, // V0.4.6.5 ✅ AJOUT
    // Exemples    
    exampleSimple,
    exampleSafe,
    exampleTemplate
}
```

### table( { id = null,  data = [],  columns = null, attrs = {}, onRowClick = null,  onCellClick = null } = {})
```js
/**
 * 
 * columns = null, // [{key:'id', label:'ID'}]  
 * 🔹 Colonnes auto si non fournies  
 * 
  */
export function table( { id = null,  data = [],  columns = null, attrs = {}, onRowClick = null,  onCellClick = null } = {}) {  
  
    const table = create("table", { id, ...attrs  } )  

    if (!data || data.length === 0) {  return table  }  

    if (!columns) {      // 🔹 Colonnes auto si non fournies  
        columns = Object.keys(data[0]).map(k => ({ key: k, label: k }))  
    }  
  
    // 🔹 THEAD  
    const thead = create("thead")  
    const trHead = create("tr")  
    
    // columns = [ {key:'id', label:'ID'} ]  
    columns.forEach(col => {  
        const th = create("th")  
        th.textContent = col.label  
        trHead.appendChild(th)  
    })  
  
    thead.appendChild(trHead)  
    table.appendChild(thead)  
  
    // 🔹 TBODY  
    const tbody = create("tbody")  
  
    data.forEach(row => {  
  
        const tr = create("tr")  
        //gestion callback
        if (onRowClick) {  
            tr.addEventListener("click", () => onRowClick(row))  
        }  
  
        columns.forEach(col => {  
            const td = create("td")  
            td.textContent = row[col.key]  
  
            if (onCellClick) {  
                td.addEventListener("click", (e) => {  
                    e.stopPropagation()  
                    onCellClick(row, col.key)  
                })  
            }  
  
            tr.appendChild(td)  
        })  
  
        tbody.appendChild(tr)  
    })  
  
    table.appendChild(tbody)  
  
    return table  
}
```





## Panel CRUD

doit permettre CRUD complet et Liste filtrée avec pagination

- **Create** : Bouton "Create" → Formulaire → POST
- **Read** : Bouton "Read" → Vue détaillée
- **Update** : Sélection + "Update" → Formulaire pré-rempli → PUT
- **Delete** : Sélection + "Delete" → DELETE


### Version 1

**Pps** est un objet PropertySet
ne gere pas les boutons

```js
let label = DOM.domCreat_Label( strNAMID , Pps.description ) 

createformInput(  Pps ) {
	let input
	let strNAMID = this.strid_Form + '-' + Pps.name // =>  ObjetSection8-panel-Edit-content-Form
	let divWrapper = document.createElement('div')
	let label = DOM.domCreat_Label( strNAMID , Pps.description ) 
	// N007 gestion option de PS
	//on doit géer des options selon les types 
	// on peut ajouter un property evtype pour gérer des champs particuliers ??
	switch ( Pps.type ){
		case 'text': 
			//20251020 : pattern : "[a-z]" => "[a-zA-Z]{3,20}"
			if ( ! Pps.options){ Pps.options = { pattern : "[a-zA-Z]{3,20}" ,  placeholder : 'saisir '+ Pps.description} }
			// pas d'options on force standard, sinon on laisse Pps.options
			input = DOM.domCreat_Input( strNAMID , Pps.type , Pps.default , Pps.options  ) 
			// strNAMID =>  ObjetSection8-panel-Edit-content-Form-firstanme 
			break
		case 'date':
			if ( ! Pps.options){ Pps.options = { pattern : "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$" ,  placeholder : 'saisir une date dd/mm/yyyy'} }
		   input = DOM.domCreat_Input( strNAMID , Pps.type , Pps.default , Pps.options  ) 
			break
		default:
			input = DOM.domCreat_Input( strNAMID , Pps.type , Pps.default  ) // strNAMID =>  ObjetSection8-panel-Edit-content-Form-firstanme 
			break
	}
	strNAMID = 'inp_'+ Pps.name // pour accéder par ref pour lecture  => strNAMID = 'inp_firstname'
	this[strNAMID] = input
	divWrapper.appendChild(label)
	divWrapper.appendChild(input)
	return divWrapper
}



RenderDialog(elmParent ){

		let strNAMID = elmParent.id  + '-Dialog'
		let elmDialog = DOM.domCreat_Dialog(strNAMID , {}, {}) 
		let elmDialogDiv = DOM.domCreat_Div(strNAMID + '-Div', {text:'hello'} , {} )


		let elmDialogForm = DOM.domCreat_Form( 
			strNAMID + '-Form' ,
			{ method: "dialog" } ,
			{ submit: (e) => { 
				e.preventDefault()
				console.log( strNAMID + '-Form submitted!')
				}
			}
		)

		let elmDialogFormCloseBt = DOM.domCreat_Input( 
			strNAMID + '-Form-BtClose' , // id a conserver => non
			"button",
			"close dlg",
			{},
			{ click: () => {
				console.log("close dlg clicked") 
				elmDialog.close()
				}
			}
		)

		elmDialogForm.appendChild( elmDialogFormCloseBt )

		elmDialog.appendChild( elmDialogDiv )
		elmDialog.appendChild( elmDialogForm )

		elmParent.appendChild(elmDialog)
		return[ elmDialog , elmDialogDiv]
}	

RenderRead(){
            let pProp
            let rspProp
            let strNAMID
            let strPROPID

            let paneldivView =  this.getPanelDiv('View') 
            // on récupère le node => ObjetSection8-panel-View-content
            this.clearElement( paneldivView ) // on efface le contenu    

            
            this.PropertySet.forEach( property => {
                strNAMID = paneldivView.id + '-' + property.name // =>  ObjetSection8-panel-View-content-firstname

                pProp = DOM.domCreat_P()
                pProp.textContent = property.name + ' : '
                rspProp = DOM.domCreat_Span( strNAMID, {} , {} )
                rspProp.textContent = property.default
                console.log('=== RenderRead  => creation element => id '  + rspProp.id)

                strPROPID  = 'rsp_' + property.name  // => strNAMID = 'rsp__firstname'    
                // pour accéder par ref pour ecriture  (rsp : read span)
                this[strPROPID] = rspProp
                console.log( '=== RenderRead  => creation reference this.' + strNAMID  + ' sur ' + rspProp.id )

                pProp.appendChild(rspProp);
                
                paneldivView.appendChild(pProp);

            });
            // ajout des CPS

            this.ComputePropertySet.forEach( property => {
                strNAMID = paneldivView.id + '-' + property.name // =>  ObjetSection8-panel-View-content-firstname
                
                pProp = DOM.domCreat_P()
                pProp.textContent = property.name + ' : '
                
                rspProp = DOM.domCreat_Span( strNAMID, {} , {} )
                rspProp.textContent = 'non evaluée'

                strPROPID  = 'rsp_' + property.name  // => strNAMID = 'rsp__firstname'    
                this[strPROPID] = rspProp

                pProp.appendChild(rspProp);
                
                paneldivView.appendChild(pProp);

            })

            //ajout du bouton de retour
            let panelView =  this.getPanel('View') 
            panelView.appendChild( this.addbutton_BackList(panelView) );

            //construit dialog 
            let aoT = this.RenderDialog( panelView ) 
            this.dialogRead = aoT[0] // pour afficher dialog
            this.dialogReadDiv = aoT[1] // pour modifier dialog
            
            this.RefreshDialog(this.dialogReadDiv)

            //bouton ouverture dialog
            let OpendlgBtn = DOM.domCreat_Input( 
                panelView.id + '-btOpendlg' , // id a conserver => non
                "button",
                "open dlg",
                {},
                { click: () => { this.dialogRead.showModal() } } 
            )
            console.log( '========  creation =========== id  ' +  panelView.id + '-btOpendlg' )            
            panelView.appendChild( OpendlgBtn );
    }

RenderTable(){
		let paneldivTable =  this.getPanelDiv('Table') // on récupère le node
		this.clearElement(paneldivTable)
		//let arkeys a employe rpour selectionner les champs du tableau a passer en arguments ?
		//let arkeys = ['firstname' , 'lastname' , 'birthdate' ,  'age' , 'daystobirthday'] //a remplir avec PS et CPS

		let table = document.createElement("table");
		table.id =   paneldivTable.id  + '-Table'

		if ( this.SectionData && this.SectionData[0] ){

			let row = table.insertRow() //entete du tableau
			// ajout une colone idx index dans la liste
			const cell = row.insertCell()
			cell.style.padding = "10px"; cell.style.margin = "10px";
			cell.textContent = 'idx'

			const colNames = Object.keys( this.SectionData[0] )

				colNames.forEach((colName) => {

				const cell = row.insertCell()
				cell.style.padding = "10px" ; cell.style.margin = "10px"
				cell.textContent = colName

				})
			
			this.SectionData.forEach((item , i) => {

				row = table.insertRow()
				// index                     
				const cell = row.insertCell()
				cell.style.padding = "10px" ; cell.style.margin = "10px"
				cell.textContent = i

				colNames.forEach((colName) => {

					const cell = row.insertCell()
					cell.style.padding = "10px"
					cell.style.margin = "10px"
					//ajouter test item.type ??
					// fonction date
					if (colName === 'birthdate'){
						cell.textContent = new Intl.DateTimeFormat().format( item[colName] )
					}
					else{
						cell.textContent = item[colName]
					}

				})

			})

		}



		paneldivTable.appendChild(table);

		let panelTable =  this.getPanel('Table') //ajout bouton comme read
		panelTable.appendChild( this.addbutton_BackList(panelTable) );
}

```
---

### Version 2

#### Organisation des contrôleurs

Chaque contrôleur doit gérer les actions liées à sa feature, par exemple :

```php
class FeatureX extends CI_Controller {

    public function index() {
        // Chargement de la vue principale avec toolbar et liste affichée
        $this->load->view('featureX_view');
    }

    public function get_list() {
        // Retourne les données de la liste en JSON (API)
        $data = $this->featureX_model->get_list_data();
        echo json_encode($data);
    }

    public function get_detail($id) {
        // Retourne les détails d'un élément en JSON (API)
        $detail = $this->featureX_model->get_detail($id);
        echo json_encode($detail);
    }

    public function save_form() {
        // Traitement des données du formulaire (POST)
        $postData = $this->input->post();
        $result = $this->featureX_model->save_data($postData);
        echo json_encode(['success' => $result]);
    }
}
```

#### vue


```html
<div id="container-panel">

    <div id="toolbar">
        <!-- Contenu fixe de la toolbar -->
        <button id="btn-show-list">Liste</button>
        <button id="btn-show-detail">Détail</button>
        <button id="btn-show-form">Formulaire</button>
    </div>

    <div id="liste" style="display:block;">
        <!-- Liste affichée par défaut -->
        <div id="list-content"></div>
    </div>

    <div id="detail" style="display:none;">
        <!-- Détail affiché à la demande -->
        <div id="detail-content"></div>
    </div>

    <div id="form" style="display:none;">
        <!-- Formulaire affiché à la demande -->
        <form id="form-featureX">
            <!-- Champs du formulaire -->
            <input type="text" name="name" placeholder="Nom">
            <button type="submit">Enregistrer</button>
        </form>
    </div>

</div>
```

#### Script JS

##### Script panel 1
```js
document.addEventListener('DOMContentLoaded', function() {

    const panels = ['liste', 'detail', 'form'];
    const btnShowList = document.getElementById('btn-show-list');
    const btnShowDetail = document.getElementById('btn-show-detail');
    const btnShowForm = document.getElementById('btn-show-form');
    const listContent = document.getElementById('list-content');
    const detailContent = document.getElementById('detail-content');
    const formFeatureX = document.getElementById('form-featureX');

    function showPanel(panelId) {
        panels.forEach(id => {
            document.getElementById(id).style.display = (id === panelId) ? 'block' : 'none';
        });
    }

    // Chargement de la liste via fetch API
    function loadList() {
        fetch('featureX/get_list')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                listContent.innerHTML = '';
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'list-item';
                    div.textContent = item.name;
                    div.dataset.id = item.id;
                    div.style.cursor = 'pointer';
                    div.addEventListener('click', () => {
                        showPanel('detail');
                        loadDetail(item.id);
                    });
                    listContent.appendChild(div);
                });
            })
            .catch(error => {
                listContent.innerHTML = '<p>Erreur lors du chargement de la liste.</p>';
                console.error('Fetch error:', error);
            });
    }

    // Chargement du détail via fetch API
    function loadDetail(id) {
        fetch('featureX/get_detail/' + id)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                detailContent.innerHTML = `<p>Nom: ${data.name}</p>`;
            })
            .catch(error => {
                detailContent.innerHTML = '<p>Erreur lors du chargement du détail.</p>';
                console.error('Fetch error:', error);
            });
    }

    // Soumission du formulaire via fetch API
    formFeatureX.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(formFeatureX);

        fetch('featureX/save_form', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Données enregistrées avec succès.');
                showPanel('liste');
                loadList();
                formFeatureX.reset();
            } else {
                alert('Erreur lors de l\'enregistrement.');
            }
        })
        .catch(error => {
            alert('Erreur réseau lors de l\'enregistrement.');
            console.error('Fetch error:', error);
        });
    });

    // Gestion des boutons toolbar
    btnShowList.addEventListener('click', () => {
        showPanel('liste');
        loadList();
    });

    btnShowDetail.addEventListener('click', () => {
        // Par défaut, on peut charger un détail spécifique ou afficher un message
        showPanel('detail');
        detailContent.innerHTML = '<p>Sélectionnez un élément dans la liste pour voir le détail.</p>';
    });

    btnShowForm.addEventListener('click', () => {
        showPanel('form');
    });

    // Affichage initial
    showPanel('liste');
    loadList();

});
```
##### Script panel 2
Un manager recherche tous les éléments de classe .container-panel dans la page et leur attribue un ID unique (compteur simple).

La gestion des événements est déléguée au container-panel lui-même, qui agit comme un contrôleur central pour toute la logique (clicks sur boutons, interactions dans les panels, etc.).

Cette approche facilite la gestion de plusieurs panels indépendants sur la même page.

Exemple

```js

document.addEventListener('DOMContentLoaded', () => {

    // Manager qui attribue un ID unique à chaque container-panel
    const containerPanels = document.querySelectorAll('.container-panel');
    containerPanels.forEach((container, index) => {
        container.dataset.panelId = `container-panel-${index + 1}`;
        initContainerPanel(container);
    });

    // Fonction d'initialisation d'un container-panel (contrôleur)
    function initContainerPanel(container) {
        const panels = container.querySelectorAll('.panel');
        const toolbar = container.querySelector('.toolbar');

        // Fonction pour afficher un panel donné et cacher les autres
        function showPanel(panelName) {
            panels.forEach(panel => {
                panel.style.display = (panel.dataset.panel === panelName) ? 'block' : 'none';
            });
            // On peut ici publier un événement custom si besoin
            // ex: container.dispatchEvent(new CustomEvent('panelChanged', {detail: panelName}));
        }

        // Gestionnaire d'événements délégué sur le container (toolbar buttons, liste items, etc.)
        container.addEventListener('click', (event) => {
            const target = event.target;

            // Boutons toolbar avec data-target
            if (target.matches('.btn-show[data-target]')) {
                const panelToShow = target.dataset.target;
                showPanel(panelToShow);

                if(panelToShow === 'liste') {
                    loadList();
                } else if(panelToShow === 'detail') {
                    // Par défaut, message ou chargement spécifique
                    const detailContent = container.querySelector('.detail-content');
                    detailContent.innerHTML = '<p>Sélectionnez un élément dans la liste pour voir le détail.</p>';
                }
                return;
            }

            // Clic sur un élément de la liste (délégué)
            if (target.matches('.list-item')) {
                const id = target.dataset.id;
                showPanel('detail');
                loadDetail(id);
                return;
            }
        });

        // Gestion de la soumission du formulaire (déléguée via event submit)
        container.addEventListener('submit', (event) => {
            if (!event.target.matches('.form-featureX')) return;
            event.preventDefault();

            const form = event.target;
            const nameInput = form.querySelector('input[name="name"]');

            // Validation simple
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                alert('Le nom doit contenir au moins 3 caractères.');
                return;
            }

            const formData = new FormData(form);

            fetch('featureX/save_form', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Enregistré avec succès');
                    showPanel('liste');
                    loadList();
                    form.reset();
                } else {
                    alert('Erreur enregistrement');
                }
            })
            .catch(() => {
                alert('Erreur réseau');
            });
        });

        // Fonctions pour charger la liste et le détail via fetch API
        function loadList() {
            const listContent = container.querySelector('.list-content');
            fetch('featureX/get_list')
                .then(res => res.json())
                .then(data => {
                    listContent.innerHTML = '';
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.textContent = item.name;
                        div.classList.add('list-item');
                        div.dataset.id = item.id;
                        div.style.cursor = 'pointer';
                        listContent.appendChild(div);
                    });
                })
                .catch(() => {
                    listContent.innerHTML = '<p>Erreur chargement liste</p>';
                });
        }

        function loadDetail(id) {
            const detailContent = container.querySelector('.detail-content');
            fetch(`featureX/get_detail/${id}`)
                .then(res => res.json())
                .then(data => {
                    detailContent.innerHTML = `<p>Nom: ${data.name}</p>`;
                })
                .catch(() => {
                    detailContent.innerHTML = '<p>Erreur chargement détail</p>';
                });
        }

        // Initialisation : afficher liste par défaut et charger les données
        showPanel('liste');
        loadList();
    }

});
```


## Factory bouton 
pour les bouton de panel CRUD.
```js
    panels.buttons.append(
        btn({ label: 'Nouveau',  icon: 'fa-plus',    variant: 'primary', busEvent: 'mot:mode', busArg: 'form' }),
        btn({ label: 'Modifier', icon: 'fa-pencil',  busEvent: 'mot:mode', busArg: 'form', disabled: !selected }),
        btn({ label: 'Suppr.',   icon: 'fa-trash',   variant: 'danger',  busEvent: 'mot:mode', busArg: 'delete', disabled: !selected }),
    )
```

```js
/*
  btn()
  ─────────────────────────────────────────────────────────────────────────────
  Factory bouton rapide pour les panels de boutons.

  Options :
    label    {string}   Texte affiché
    icon     {string}   Classe FA  ex: 'fa-search'
    variant  {string}   '' | 'primary' | 'danger'
    disabled {boolean}
    onClick  {Function} handler click (priorité sur busEvent)
    busEvent {string}   event bus à publier
    busArg   {*}        argument du bus
    attrs    {object}   attributs HTML additionnels

  Exemple :
    panels.buttons.append(
        btn({ label: 'Nouveau',  icon: 'fa-plus',    variant: 'primary', busEvent: 'mot:mode', busArg: 'form' }),
        btn({ label: 'Modifier', icon: 'fa-pencil',  busEvent: 'mot:mode', busArg: 'form', disabled: !selected }),
        btn({ label: 'Suppr.',   icon: 'fa-trash',   variant: 'danger',  busEvent: 'mot:mode', busArg: 'delete', disabled: !selected }),
    )
*/
export function btn({
    label    = '',
    icon     = '',
    variant  = '',
    disabled = false,
    onClick  = null,
    busEvent = null,
    busArg   = null,
    attrs    = {},
} = {}) {

    const cssClass = ['cp_btn', variant ? `cp_btn--${variant}` : '']
        .filter(Boolean).join(' ')

    const el = create('button', { type: 'button', class: cssClass, ...attrs })
    if (disabled) el.setAttribute('disabled', '')

    if (icon) {
        el.appendChild(create('i', { class: `fa fa-fw ${icon}`, 'aria-hidden': 'true' }))
        el.appendChild(document.createTextNode(` ${label}`))
    } else {
        el.textContent = label
    }

    if (onClick) {
        el.addEventListener('click', onClick)
    } else if (busEvent) {
        el.addEventListener('click', () => bus.publish(busEvent, busArg))
    }

    return el
}
```

## vue detail
a adapter pour les données json 
```js
    panels.detail.appendChild(detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ]))
```

```js
/*
  detail()
  ─────────────────────────────────────────────────────────────────────────────
  Construit une <dl class="cp_detail"> depuis un tableau de { label, value }.

  Exemple :
    panels.detail.appendChild(detail([
        { label: 'ID',  value: selected.mot_id  },
        { label: 'Mot', value: selected.mot_lbl },
    ]))
*/
export function detail(fields = []) {
    const dl = create('dl', { class: 'cp_detail' })

    fields.forEach(({ label, value }) => {
        const dt = create('dt', { text: label })
        const dd = create('dd', { text: value ?? '—' })
        dl.append(dt, dd)
    })

    return dl
}
```
## notice
- doit employezr la fonction icone

```js
    clear(panels.table)
    panels.table.appendChild(notice('loading'))
    panels.table.appendChild(notice('error', 'HTTP 500'))
    panels.table.appendChild(notice('empty'))
```

```js
/*
  notice()
  ─────────────────────────────────────────────────────────────────────────────
  Message inline simple (loading / erreur / vide).
  type : 'loading' | 'error' | 'empty'

*/
const NOTICE_CFG = {
    loading : { icon: '⏳', text: 'Chargement…',    css: 'cp_notice cp_notice--loading' },
    error   : { icon: '❌', text: 'Erreur.',         css: 'cp_notice cp_notice--error'   },
    empty   : { icon: '🔍', text: 'Aucun résultat.', css: 'cp_notice cp_notice--empty'   },
}

export function notice(type = 'empty', msg = '') {
    const cfg = NOTICE_CFG[type] || NOTICE_CFG.empty
    const el  = create('p', { class: cfg.css })
    el.textContent = msg ? `${cfg.icon} ${msg}` : `${cfg.icon} ${cfg.text}`
    return el
}
```
