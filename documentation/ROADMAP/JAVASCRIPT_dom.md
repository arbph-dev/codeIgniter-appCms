# dom helpers


- createSelect(id, options, attributes) - Créer un select
- createCheckboxList(baseId, items, options) - Liste de checkboxes
- createRadioGroup(name, items, options) - Groupe de radios
- getCheckboxValues(name) - Récupérer valeurs checkboxes
- getRadioValue(name) - Récupérer valeur radio

## Panel CRUD

### Version 1

**Pps** est un objet PropertySet
ne gere pas le sboutons

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
