// js/ihm/formsManager.js
// 2026-04-01 suppression DOM et ajout const DEBUG

import { bus } from '../core/eventBus.js'

const DEBUG = true

/* -------------------------------------    Validation    ----------------------------------------------------------------------- */
// Validation longueur minimale

function validateMinLength( str , min) {
    if (str.length < min) {
        console.log( `Minimum ${min} caractères requis` )
        return false 
    }
    return true
}

// Validation longueur maximale
function validateMaxLength( str  , max) {
    if (str.length > max) { 
        console.log( `Maximum ${max} caractères autorisés` )
        return false 
    }
    return true
}

// Validation adresse mail
function validateMail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validation password
function isStrongPassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password);
}


/*
el => <div class="radio">

const languageOptions = ["Python", "Javascript", "C++", "Java"]


GenerateRadio( el , 'language' , languageOptions )

function GenerateRadiolist( el , sName , arChoices ){

el.innerHTML = languageOptions.map((language) => `<label>${language}<input type="radio" name="${sName}" value="${language}"></label>`).join('\r\n');
}
*/

/* -------------------------------------    Idendification    ----------------------------------------------------------------------- */

function ValidateBasic( data ){
    let n = data.length;
    
    let strTmp = '{ '
    for( let i=0 ; i < n ; i++ ){
        const key = data[i][0] //key aka field name
        const value = data[i][1] // value 
        if (i > 0 ){
            strTmp += ' , '
        }                
        strTmp += `"${key}" : "${value}"`

    }

    strTmp +=  '}'
    
    return strTmp
}

function ValidateUser(data){
        let n = data.length;
    
    let strTmp = '{ '
    for( let i=0 ; i < n ; i++ ){
        const key = data[i][0] //key aka field name
        const value = data[i][1] // value 
        if (i > 0 ){
            strTmp += ' , '
        }                
        strTmp += `"${key}" : "${value}"`

    }

    strTmp +=  '}'
    
    console.log( 'ValidateUser ' + strTmp ) 
}


function ValidateMajor(data){
        let n = data.length;
    
    let strTmp = '{ '
    for( let i=0 ; i < n ; i++ ){
        const key = data[i][0] //key aka field name
        const value = data[i][1] // value 
        if (i > 0 ){
            strTmp += ' , '
        }                
        strTmp += `"${key}" : "${value}"`

    }

    strTmp +=  '}'
    
    console.log( 'ValidateMajor ' +  strTmp ) 
}

/* -------------------------------------------------------------------------------------------------------------------------------- */
//console.log(Object.keys(object1))
//{ "username" : "arbph" , "ecailles" : "on" , "plumes" : "on"}


/**
 * 
 * @param {*} f form 
 * @param {*} o object 
 * @param {*} d data
 */
function ValidateFields( f , o , d ){

    let valid = true
    let vsucceed
    let vErrorPM
    
    let n = f.elements.length;
    // Lecture form en detail a déplacer apres 
    // - recuperation data formData
    // - idientifciation du form

    //avec les radio button on arrive à 13 elements
    /*
    on a 6 champs avec 2 cjhamp radio de 4 valeurs et un submit 
    soit 6 -2 = 4 champs de base text, number, date
    2 champs radio de 4 valeurs soit 4+4 = 8 
    1 champ ubmit  donc 1
    on a bien 4 champs d ebase + 8 valers radios + 1 submit = 13
    */


//{ "username" : "arbph" , "ecailles" : "on" , "plumes" : "on"}


/*
    for( let i = 0 ; i < n ; i++ ){
        vsucceed = f[ i ].validity.valid
        //vErrorPM = f[ i ].validity.patternMismatch // utiliser sur autre event mais pas avec submit
        console.log(`Validation Formulaire :  ${f.id}: element ${i} de type ${f[ i ]} valid ${vsucceed} patternMismatch ${vErrorPM}`)
    }
*/

    var keys = Object.keys(o)
    let varTmp 

    for( let j = 0 ; j < keys.length ; j++ ){    //keys[i] for key //dictionary[keys[i]] for the value
        
        console.log( keys[j] )

        for( let i = 0 ; i < n ; i++ ){
            if ( f[ i ].name === keys[j]  ) {
                console.log(`Match field Formulaire :  ${f.id}: element ${i} de type ${f[ i ].type}`)
                
                if ( f[ i ].type === 'text' ){ 
                    varTmp = f[ i ].value 
                    valid = validateMaxLength(varTmp , 25)
                    valid = validateMinLength(varTmp , 2)

                    if (valid){
                        o[ keys[j] ] = varTmp
                    }
                }
                if ( f[ i ].type === 'checkbox' ){ 
                    console.log('checkbox found')

                    if ( f[ i ].checked ) {
                        o[ keys[j] ] = true
                    }
                    else{
                        o[ keys[j] ] = false                       
                    }
                }
                

            /*
                switch(keys[j]){
                    case 'username':
                        if ( f[ i ].type === 'text' ){ 
                            varTmp = f[ i ].value 
                            o[ keys[j] ] = 
                            validateMaxLength
                        }
                        else{
                            valid = false
                        }
                        break
                    default:
                        break    
                }*/                

            }
            
        }
        console.log( keys[j] )
    }
    console.log( o )
}



/*----------------------------------------------------------------------------------------------------------------------------------*/
let formDlg = false
let formId = null
let dlgId = null

function _isForm( f ){

    if ( f.tagName === "FORM" && f.id !== null ){

        if (f.parentElement.tagName === 'DIALOG' ){ formDlg = true }

        if (formDlg === true ){ 
            dlgId = f.parentElement.id //form de dialog
            console.log(`*** Interception : dlgs:submit => ${f.id} parent id ${f.parentElement.id}`)
        }
        else{
            formId = f.id //form de section
            console.log(`*** Interception : forms:submit => ${f.id}`)
        }
        return true
    }
    return false
}


function getFormData( f ) {

    
    if (_isForm( f ) ){
        const formData = new FormData(f)// creation FormData - declecnhe gestionnaire event voir initForms

        let fieldsNames = []//fieldsNames contient tous les champs du FormData (Request Ready)
        for (const [key, value] of formData) { fieldsNames.push(key) }
        
        const data = Array.from(formData) //recopie des données les value des input radio sont renvoye
        let strTmp = ValidateBasic(data)

        const isBasic = [ "firstname", "lastname", "country", "message" ].every( fieldName => fieldsNames.includes(fieldName) )
        if ( isBasic ) { console.log( 'ValidateBasic ' + strTmp ) }
        
        const isUser = ['username' , 'email' , 'age'].every( fieldName => fieldsNames.includes(fieldName) ) 
        if ( isUser && ( fieldsNames.length === 3 ) ) { console.log( 'ValidateUser ' + strTmp ) }

        const isMajor = ['username' , 'email' , 'password' , 'age' , 'browser' , 'language' ].every( fieldName => fieldsNames.includes(fieldName) )
        if ( isMajor && ( fieldsNames.length === 6 ) ) { console.log( 'ValidateMajor ' + strTmp ) }

        if ( !isBasic && !isUser && !isMajor){
            console.log( 'js/ihm/formsManager.js :: Cannot validate UNKNOW')
            
            //let a ={ username : "arbph" , ecailles : false , plumes : true }
            //ValidateFields(f , a , data )
            //fonctionne mais interfere avec motform
        }

    }

}

/*
        const fieldsNamesAll = Array.from( f.elements).map(el => el.name)
        const fieldsNames = fieldsNamesAll.filter(item => ( item !== null && item !== "" && item !== undefined ));
        console.log( fieldsNames)
        const fields = new Map();

  
       const btn = document.querySelector("#btn");
      const radioButtons = document.querySelectorAll('input[name="language"]');
      const output = document.getElementById("output");

      btn.addEventListener("click", () => {
        let selectedLanguage;
        for (const radioButton of radioButtons) {
          if (radioButton.checked) {
            selectedLanguage = radioButton.value;
            break;
          }
        }
        // Displaying the output:
        output.innerText = selectedLanguage
          ? `You selected ${selectedLanguage}`
          : `You haven't selected any language`;
      });

      
// Attaching Change Event Listeners
const radioButtons = document.querySelectorAll('input[name="language"]');
for (const radioButton of radioButtons) {
    radioButton.addEventListener('change', showSelectedlanguage);
}        

// Handling the Change Event
function showSelectedlanguage() {
    if (this.checked) {
        document.querySelector('#languageOutput').innerText = `You selected ${this.value}`;
    }
}      
*/

/* -------------------------------------    DEBUG    ----------------------------------------------------------------------- */

function checkRadio( val , fld ){ console.log(fld , val ) } //pour debug click bouton radio    
//recopie des données les value des input radio sont renvoye

// lecture des checkbox, seul les champs actif sont ajoute au form data


/* ----------------------------------------------------------------------------------------------------------------------- 
        Module
 ----------------------------------------------------------------------------------------------------------------------- */
export function initForms() {
    let i = 0
    const n = document.forms.length // liste TOUS les forms

    if ( DEBUG ){ 

        console.log(`init Module - Formulaire : ${n} formsulaire trouvés`)
 
        for( i=0 ; i<n ; i++ ){
            console.log( document.forms[ i ] )
        }

    }
 


    bus.subscribe('forms:submit', ( v ) => { getFormData(v)  } )

    // gestionnaire d'events
    window.addEventListener("formdata", (e) => { console.log(e) })
    
    // fonction pour ihm
    window.checkRadio = checkRadio

}