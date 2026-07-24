# dom helpers


- createSelect(id, options, attributes) - Créer un select
- createCheckboxList(baseId, items, options) - Liste de checkboxes
- createRadioGroup(name, items, options) - Groupe de radios
- getCheckboxValues(name) - Récupérer valeurs checkboxes
- getRadioValue(name) - Récupérer valeur radio

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





