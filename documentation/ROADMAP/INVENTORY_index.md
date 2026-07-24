


# Routes

## Routes Publiques
GET / :  Cms::index (Accueil du portail)
GET /cms/category/{segment} : CmsController::category()
GET /cms/article/{segment} : CmsController::article()
GET /cms/section/{num} : CmsController::section()
GET /cms/part/{num} : CmsController::part()
GET /technologies : Technologies::index
GET /technologies/{segment} : Technologies::rubrique()
GET /technologies/{segment}/{segment} : Technologies::show()
GET /informatique : Informatique::index
GET /portal : Portal::index
GET /chimie : Chimie::index

## Routes Admin
GET /admin : Admin::index
GET /admin/modelworkbench : Admin\ModelWorkbench::index
Groupe admin/cmspart :
- Index, Create, Edit, Insert, Update, Delete, Up, Down

## Routes API
Groupe /api/auth 
- login, profile, me, logout
Groupe /api (très riche) :
- mot
- codesnaf, comptespcg, image, formejuridique, typevoie, codepostal, adresse, organisation, entreprise
Beaucoup de méthodes like, tree, hierarchy, children

## Autres
Plusieurs routes de test (test/components, test/service, etc.)
service('auth')->routes() (génère les routes d’authentification)

---

# Analyse de la Board Admin (version old/)


## 1. Partie Serveur (CodeIgniter + Shield)Fichier : old/app/Controllers/Admin.phpMéthodes principales :

|Méthode|Rôle|Réutilisable ?|Commentaire|
|---|---|---|---|
|requireAdmin()|Vérification admin/superadmin|Oui (fortement)|Très utile pour tous les contrôleurs admin|
|isSuperAdmin()|Test superadmin|Oui|Simple et clair|
|extractEmail()|Extraction email depuis Shield identities|Oui|Utile car Shield stocke les identités séparément|
|index()|Page principale|Partiellement|Logique de récupération des users|
|buildDebugData()|Construction données debug|Très réutilisable|Statique + bien fait → à mettre dans un Service ou Trait|

Points forts à réemployer :

- Gestion propre de Shield (auth()->user(), inGroup(), getProvider())
- buildDebugData() → très utile pour tous les workbenches (debug overlay)
- Bonne séparation des préoccupations (requireAdmin en private)

Points à améliorer :

- Le contrôleur fait trop de choses (récupération + formatage données + debug)
- Pas d’injection de dépendances (à faire évoluer vers Services)

---

## 2. Partie Client (DOM + CSS + JS)Fichier : old/app/Views/cms/admin.phpStructure globale :

- Layout : layouts/cms
- Sidebar + Header + Contenu principal
- Tableau des utilisateurs avec filtre, tri, et panneau détail latéral

Éléments intéressants à réemployer dans les Workbenches :JS utile :

- domhelper.init() → indispensable
- Utilisation de eventBus
- Système de table dynamique (filtre + tri + rendu via template string)
- Panneau détail latéral (pattern très réutilisable)
- Stats cards en haut
- Badges et status dots (design system naissant)

CSS utile :

- .adm-stats, .adm-stat-card
- .adm-badge, .adm-dot
- .adm-row, .adm-row--selected
- .adm-detail-header, .adm-dl

Idées d’architecture pour les futurs Workbenches :

- Créer un AdminWorkbench ou GenericWorkbench qui inclut :
    - Sidebar
    - Header + StatusBar
    - Zone de contenu principale
    - Système de tabs
    - Overlay debug (en utilisant buildDebugData)

---

Recommandations pour la refonteCe qu’il faut garder / capitaliser :

1. buildDebugData() + debug overlay
2. requireAdmin() → à transformer en Filter ou Middleware
3. Pattern tableau + panneau détail
4. domhelper (même s’il doit être refondu)
5. Système de badges + status visuels
6. Utilisation de l’eventBus

Ce qu’il faut faire évoluer :

- Passer d’un contrôleur monolithique à un AdminController de base + Services
- Créer un Workbench Base côté JS qui absorbe domRef et une partie de domHelper
- Uniformiser le design system (classes adm-xxx → wb-xxx ou ui-xxx)

---

# Script 

## autocomplete
```javascript
import { autocomplete } from '/assets/js/core/domhelper.js'

// Dans DOMContentLoaded (les panels doivent exister dans le DOM)
document.addEventListener('DOMContentLoaded', () => {
    // ... inits existants ...

    // ── Test autocomplete ────────────────────────────────────────────────
    const acField = document.getElementById('acTestField')
    if (acField) {
        const ac = autocomplete({
            id          : 'acMot',
            name        : 'mot_id',
            placeholder : 'Rechercher un mot…',
            busRequest  : 'mot:ui:like',
            busResponse : 'mot:ui:response',
            labelKey    : 'mot_lbl',
            valueKey    : 'mot_id',
            onSelect    : (item) => {
                document.getElementById('acTestValue').textContent = item.mot_lbl
                document.getElementById('acTestId').textContent    = item.mot_id
            }
        })
        acField.appendChild(ac.wrapper)
    }
})
```
---

## PropertySet
On définit 2 objets pour gérer les formulaires en création , validation et calculs après validation
- PersonPropertySet
- PersonComputePropertySet


```javascript
// Dans metadata.js
export const InvoicePropertySet = [
    {
        name: 'number',
        type: 'text',
        description: 'Numéro de facture',
        default: '',
        validate: (value) => /^INV-\d{4}-\d{4}$/.test(value) || 'Format invalide',
        options: {
            pattern: "INV-\\d{4}-\\d{4}",
            placeholder: 'INV-2025-0001'
        }
    },
    {
        name: 'amount',
        type: 'number',
        description: 'Montant HT',
        default: 0,
        validate: (value) => value > 0 || 'Montant invalide',
        options: {
            min: '0',
            step: '0.01',
            placeholder: '0.00'
        }
    }
]
```


```js
import { PersonPropertySet , PersonComputePropertySet } from 'https://elfennel.fr/public/js/mods/metadata.js'

export const PersonPropertySet = [
    { 
        name: 'firstname' ,
        type: 'text' ,
        description: 'Prénom' ,
        default : '' ,
        validate: function(value) { console.log(this) ;return validateMail(value) },
        options : { placeholder : 'saisir un nom mail ;)'}
    },
    { 
        name: 'lastname',
        type: 'text',
        description: 'Nom' ,
        default : '',
        validate: (value) => validateTest(value), // test
        options : { pattern : "[a-z]{4,8}" ,  placeholder : 'saisir un nom'}
    },
    { 
        name: 'birthdate',
        type: 'date',
        description: 'Date de naissance',
        default : '',
        validate: (value) => validateDateInput(value), // test
        options : { pattern : "^\d{2}/\d{2}/\d{4}$" ,  placeholder : 'saisir une  date'}     
    }
  ];
  
  

// PropertySet pour les risques chimiques (depuis vos notes)
export const ChemicalRiskCategory_PropertySet = [
    { name: 'id', type: 'number', description: 'identifiant pour db', default: -1 },
    { name: 'logo', type: 'text', description: 'logo selon norme ou nomenclature', default: '' },
    { name: 'nom', type: 'text', description: 'Nom courant', default: '' },
    { name: 'puce', type: 'text', description: 'symbole pour les listes', default: '⚠️' },
    { name: 'risque', type: 'text', description: 'risque caractèristique', default: '' },
    { name: 'uind', type: 'text', description: 'identifiant selon norme ou nomenclature', default: '' }
];  
```


```js
export const PersonComputePropertySet = [
    { 
        name: 'age',
        type: 'number', 
        description: 'age de la personne',
        calculate :  (objZt) => { return computeAge( objZt ) } 
    },

    { 
        name: 'daystobirthday',
        type: 'number', 
        description: 'jours restant avant anniversaire',
        calculate : ( objZt ) => { return daysUntilBirthday( objZt ) }
    }

  ]; 
```


```js
/**
 * Valide  la propriete si la property a une propriete validate
 * //	on verifie les contraintes de saisie
 *          on valide la saisie si validate est défini pour cette Property du PropertySet	
                echec de validation les fonctions validate renvoie true ou une chaine error 
                la saisie doit etre différente de la valuer par défaut (si pattern de saisie non défini)
            si validate n'est pas défini on force pour pouvoir vérifier pattern
        // resultat la validation par pattern a reussie ? la fonction validate de Property a reussie ?
        //return ( vOK && propValidation ) // on valide pour continuer

 * @param {*} proP property de PropertySet
 * @param {*} refIn input.value, valeur de champ de formulaire
 * @returns 
 */

    checkPropertySetValue( proP , refIn , refobjData  ) {
        let vsucceed = false
        let vErrorPM = false 
        let vOK = false
        let propValidation = false
        let refError = ''
        	
        vsucceed  = refIn.validity.valid
        vErrorPM  = refIn.validity.patternMismatch

        if( !vsucceed && !vErrorPM  ) { refError += `Champ ${proP.name} : ${refIn.validationMessage} `}
        if( !vsucceed && vErrorPM  ) { refError += `Champ ${proP.name} pattern invalide : ${refIn.validationMessage} `}
        if ( vsucceed && !vErrorPM ) { vOK = true }

            if (proP.validate) {
                const result = proP.validate( refIn.value );

                if( (result != true) || refIn.value === proP.default ) {
                    refError += result 
                    propValidation = false 
                }
                else{
                    propValidation = true // validation succeed
                }    
            }
        else{
            propValidation = true
        }

        if (vOK && propValidation ) {           
            return { success: true, errors : 'none' }
        }	
        else { return { success: false, errors : refError } }
    }

```


```js
/**
 * gere la vlaidation des input selon le PS
 * des essais a prévoir 
 *  sur switch bValid = false et return  suite modif
 * @returns 
this.errorMessage = ''
on va modifier checkPropertySetValue poure renvoie objet { success: false, errors : 'none' } , { success: true, errors : 'none' }
a = checkPropertySetValue if (a.success === true)
    // conversion casting selon le type 
    // TODO améliorer int, float
    // la property et le type de champ form correpsonde mais ne sont pas géré ->  la configuration du PropertySet est incorrecte
 */
    extractFields( ){
        let refInput
        let zt = {}
        let bValid = true
        let a 
        this.errorMessage = '' //reset error N007

        this.PropertySet.forEach( property => {

            if (bValid != true ){ return } // sortie boucle for            
            
            refInput = this.getformInput( property )              
            let ipn_type = refInput.type

            switch(ipn_type){

                case 'number' : 
                    a = this.checkPropertySetValue( property , refInput , null )
                    if( a.success === true ){ zt[ property.name]  = parseInt( refInput.value ) }
                    bValid = a.success
                    break

                case 'text' :
                    a = this.checkPropertySetValue( property , refInput , null )
                    if( a.success === true ){ zt[ property.name ] = refInput.value ; } 
                    bValid = a.success
                    break

                case 'date' :
                    a = this.checkPropertySetValue( property , refInput , zt )
                    if( a.success === true ){
                        const [ year , month , day ] = refInput.value.split('-').map( Number )
                        zt[ property.name ] = new Date( year , month - 1 , day );      
                    }
                    bValid = a.success
                    break

                default: 
                    console.error('type property unknow :: extractFields conversion objet ' + property.name)
                    bValid = false 
                    return //break;     
            } //fin switch

        }) // 

        if (bValid != true ){  
            this.errorMessage = a.errors ;
            return // renvoie null
        } 
        else{ 

            this.ComputePropertySet.forEach( property => {

                if (property.calculate) { //calculate : (o) => computeAge(o)
                        const result = property.calculate( zt  );// on passe obejt construit
                        zt[property.name] = result
                }
            })
            return zt 
        }
    }
```


---

## 🎨 Templates

### Templates prédéfinis (8 types)

| Type        | Usage                          | Niveau       |
| ----------- | ------------------------------ | ------------ |
| `default`   | Général, 3 premiers champs     | Basique      |
| `compact`   | Liste dense, nom seulement     | Basique      |
| `detailed`  | Tous les champs avec labels    | Détaillé     |
| `card`      | Type carte, visuellement riche | Moderne      |
| `badge`     | Avec badge status/compteur     | Moderne      |
| `tableRow`  | Format tableau, 5 champs       | Structuré    |
| `withIcons` | Avec emojis automatiques       | Visuel       |
| `custom`    | Votre fonction                 | Personnalisé |

---

#### 1. **default** (par défaut)
Affiche les 3 premiers champs du PropertySet

```javascript
// Exemple de rendu
"Prénom: Jean | Nom: Dupont | Email: jean@example.com"
```

**Utilisation :**
```javascript
const section = new SectionPanels(tab, 'Contacts', data, ContactPropertySet)
// Pas besoin de configuration, c'est le défaut
```

---

#### 2. **compact**
Affiche uniquement le nom/titre principal

```javascript
// Exemple de rendu
"Jean Dupont"
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'compact' }  // ✅ Configuration
)
```

---

#### 3. **detailed**
Affiche tous les champs avec leurs labels

```javascript
// Exemple de rendu (HTML)
<strong>Prénom:</strong> Jean<br>
<strong>Nom:</strong> Dupont<br>
<strong>Email:</strong> <a href="mailto:jean@example.com">jean@example.com</a><br>
<strong>Téléphone:</strong> 06 12 34 56 78
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'detailed' }
)
```

---

#### 4. **card**
Affichage type carte avec titre, sous-titre et détails

```javascript
// Exemple de rendu (HTML)
<div class="template-card">
    <div class="card-title">Jean Dupont</div>
    <div class="card-subtitle">jean@example.com</div>
    <div class="card-details">06 12 34 56 78 • Directeur</div>
</div>
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'card' }
)
```

**CSS suggéré :**
```css
.template-card {
    padding: 8px;
}

.card-title {
    font-weight: bold;
    font-size: 1.1em;
}

.card-subtitle {
    color: #666;
    font-size: 0.9em;
}

.card-details {
    margin-top: 4px;
    font-size: 0.85em;
    color: #888;
}
```

---

#### 5. **badge**
Affichage compact avec badge (statut, compteur)

```javascript
// Exemple de rendu (HTML)
<span class="template-badge-main">Jean Dupont</span>
<span class="template-badge">Actif</span>
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'badge' }
)
```

---

#### 6. **tableRow**
Format ligne de tableau (5 premiers champs)

```javascript
// Exemple de rendu (HTML)
<span class="table-cell">Jean</span>
<span class="table-cell">Dupont</span>
<span class="table-cell">jean@example.com</span>
<span class="table-cell">06 12 34 56 78</span>
<span class="table-cell">Directeur</span>
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'tableRow' }
)
```

---

#### 7. **withIcons**
Affichage avec icônes/emojis automatiques

```javascript
// Exemple de rendu
"👤 Jean Dupont • 📧 jean@example.com • 📞 06 12 34 56 78 • 💼 Directeur"
```

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    { type: 'withIcons' }
)
```

---

#### 8. **custom**
Template personnalisé avec votre fonction

**Utilisation :**
```javascript
const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    {
        type: 'custom',
        custom: (item, factory) => {
            // Votre logique personnalisée
            return `
                <div class="my-template">
                    <img src="${item.avatar || 'default.png'}" alt="Avatar">
                    <strong>${item.firstname} ${item.lastname}</strong>
                    <br>
                    <small>${factory.formatEmail(item.email)}</small>
                </div>
            `
        }
    }
)
```


### 🎨 Templates version 2

Le module `templates.js` fournit des templates prêts à l'emploi :

```js
// ==========================================
// TEMPLATES DE LISTE

/**
 * Template pour afficher un client dans une liste
 */
export function client_TemplateLi(client) {
    return `🏢 ${client.name} - ${client.city || 'Ville non renseignée'} - ${client.phone || 'Pas de téléphone'}`
}

/**
 * Template pour afficher un contact dans une liste
 */
export function contact_TemplateLi(contact) {
    return `📧 ${contact.firstname} ${contact.lastname} - ${contact.position || 'Poste non renseigné'} - ${contact.email || 'Pas d\'email'}`
}

```
##### 1. personTemplate (Contacts/Personnes)

```javascript
/**
 * Template pour afficher une personne dans une liste
 */
export function person_TemplateLi(person) {
    const birthdate = person.birthdate 
        ? new Intl.DateTimeFormat('fr-FR').format(new Date(person.birthdate))
        : 'Non renseignée'
    
    return `👤 ${person.firstname} ${person.lastname} - Né(e) le ${birthdate}`
}

import { personTemplate } from '../utils/templates.js'

const section = new SectionPanels(
    tab, 
    'Contacts', 
    data, 
    ContactPropertySet,
    [],
    {
        type: 'custom',
        custom: personTemplate
    }
)
```

**Rendu :**
```html
<div class="person-template">
    <strong>👤 Jean Dupont</strong>
    <br><small>📧 jean@example.com • 📞 06 12 34 56 78</small>
</div>
```

---

##### 2. companyTemplate (Entreprises/Clients)

```javascript
import { companyTemplate } from '../utils/templates.js'

const section = new SectionPanels(
    tab, 
    'Clients', 
    data, 
    ClientPropertySet,
    [],
    {
        type: 'custom',
        custom: companyTemplate
    }
)
```

**Rendu :**
```html
<div class="company-template">
    <strong>🏢 ACME Corp</strong> - Paris
    <br><small>📞 01 23 45 67 89</small>
</div>
```

---

##### 3. documentTemplate (Factures/Documents)

```javascript
import { documentTemplate } from '../utils/templates.js'

const section = new SectionPanels(
    tab, 
    'Factures', 
    data, 
    InvoicePropertySet,
    [],
    {
        type: 'custom',
        custom: documentTemplate
    }
)
```

**Rendu :**
```html
<div class="document-template">
    <strong>📄 INV-2025-0001</strong> - 29/10/2025 - 1 250,00 €
</div>
```

---

##### 4. productTemplate (Produits)

```javascript

/** '../utils/templates.js' - Template pour produits */
export function productTemplate(item, factory) {
    const name = item.name || 'Sans nom'
    const price = item.price ? factory.formatCurrency(item.price) : ''
    const stock = item.stock !== undefined ? `Stock: ${item.stock}` : ''
    
    return `
        <div class="product-template">
            <strong>🛒 ${factory.escapeHtml(name)}</strong>
            ${price ? ` - ${price}` : ''}
            ${stock ? `<br><small>${stock}</small>` : ''}
        </div>
    `
}


import { productTemplate } from '../utils/templates.js'

const section = new SectionPanels(
    tab, 
    'Produits', 
    data, 
    ProductPropertySet,
    [],
    {
        type: 'custom',
        custom: productTemplate
    }
)
```

**Rendu :**
```html
<div class="product-template">
    <strong>🛒 Ordinateur portable</strong> - 899,00 €
    <br><small>Stock: 12</small>
</div>
```

---

#### 🛠️ Créer votre propre template

##### Structure de base

```javascript
function myCustomTemplate(item, factory) {
    // item = objet de données
    // factory = instance TemplateFactory avec méthodes utilitaires
    
    // Utiliser factory pour formater les valeurs
    const name = factory.escapeHtml(item.name)
    const email = factory.formatEmail(item.email)
    const date = factory.formatDate(item.created_at)
    
    // Retourner le HTML
    return `
        <div class="my-custom">
            <h4>${name}</h4>
            <p>${email}</p>
            <small>${date}</small>
        </div>
    `
}

// Utiliser
const section = new SectionPanels(
    tab, 
    'MySection', 
    data, 
    MyPropertySet,
    [],
    {
        type: 'custom',
        custom: myCustomTemplate
    }
)
```

#### 💡 Exemples avancés

##### Template conditionnel

```javascript
function statusTemplate(item, factory) {
    const statusColors = {
        'active': '#28a745',
        'pending': '#ffc107',
        'inactive': '#dc3545'
    }
    
    const color = statusColors[item.status] || '#6c757d'
    
    return `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="
                width: 10px; 
                height: 10px; 
                border-radius: 50%; 
                background: ${color};
            "></span>
            <strong>${factory.escapeHtml(item.name)}</strong>
            <small style="color: #666;">${item.status}</small>
        </div>
    `
}
```

##### Template avec avatar

```javascript
function avatarTemplate(item, factory) {
    const initials = item.firstname && item.lastname
        ? `${item.firstname[0]}${item.lastname[0]}`.toUpperCase()
        : '??'
    
    const avatarUrl = item.avatar || null
    
    return `
        <div style="display: flex; align-items: center; gap: 12px;">
            ${avatarUrl 
                ? `<img src="${avatarUrl}" alt="Avatar" style="
                    width: 40px; 
                    height: 40px; 
                    border-radius: 50%;
                    object-fit: cover;
                  ">`
                : `<div style="
                    width: 40px; 
                    height: 40px; 
                    border-radius: 50%; 
                    background: #007bff; 
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                  ">${initials}</div>`
            }
            <div>
                <strong>${item.firstname} ${item.lastname}</strong>
                <br>
                <small>${factory.formatEmail(item.email)}</small>
            </div>
        </div>
    `
}
```

##### Template avec données calculées

```javascript
function personWithAgeTemplate(item, factory) {
    // Utiliser ComputePropertySet si disponible
    const age = item.age || 'N/A'
    const daysToB birthday = item.daystobirthday || null
    
    return `
        <div>
            <strong>👤 ${item.firstname} ${item.lastname}</strong>
            <br>
            <small>
                🎂 ${age} ans
                ${daysTobirthday ? ` • 🎉 Anniversaire dans ${daysTobirthday} jours` : ''}
            </small>
        </div>
    `
}
```




---

#### 🔧 Changer de template dynamiquement

##### Méthode 1 : Avec `setTemplateType()`

```javascript
// Dans votre section
const section = new SectionPanels(tab, 'Contacts', data, ContactPropertySet)

// Changer le template
section.setTemplateType('card')      // Type carte
section.setTemplateType('detailed')  // Type détaillé
section.setTemplateType('compact')   // Type compact
```

##### Méthode 2 : Avec `setCustomTemplate()`

```javascript
// Définir un nouveau template custom
section.setCustomTemplate((item, factory) => {
    return `🎉 ${item.firstname} - ${factory.formatEmail(item.email)}`
})
```

##### Exemple : Bouton pour changer de vue

```javascript
// Ajouter un bouton dans votre UI
const btnChangeView = document.createElement('button')
btnChangeView.textContent = 'Changer vue'
btnChangeView.addEventListener('click', () => {
    // Cycle entre les types
    const types = ['default', 'compact', 'detailed', 'card']
    const currentIndex = types.indexOf(section.templateType)
    const nextIndex = (currentIndex + 1) % types.length
    
    section.setTemplateType(types[nextIndex])
    btnChangeView.textContent = `Vue: ${types[nextIndex]}`
})
```


## Formatage automatique

**Types supportés :**
- `date` → "29/10/2025"
- `datetime` → "29/10/2025 14:30"
- `number` → "1 234 567"
- `currency` → "1 250,00 €"
- `email` → Lien cliquable
- `tel`/`phone` → "06 12 34 56 78"
- `url` → Lien externe
- `boolean` → "✅ Oui" / "❌ Non"



### Méthodes utilitaires
La `TemplateFactory` fournit ces méthodes dans less templates :

| Méthode                    | Description             | Exemple                                                        |
| -------------------------- | ----------------------- | -------------------------------------------------------------- |
| `formatValue(value, type)` | Formate selon le type   | `factory.formatValue(item.price, 'currency')`                  |
| `formatDate(date)`         | Formate une date        | `factory.formatDate(item.birthdate)`                           |
| `formatDateTime(date)`     | Date + heure            | `factory.formatDateTime(item.created_at)`                      |
| `formatNumber(num)`        | Nombre avec séparateurs | `factory.formatNumber(1234567)` → `1 234 567`                  |
| `formatCurrency(num)`      | Monétaire               | `factory.formatCurrency(99.99)` → `99,99 €`                    |
| `formatEmail(email)`       | Lien email              | `factory.formatEmail('test@ex.com')` → `<a href="mailto:...">` |
| `formatPhone(phone)`       | Téléphone formaté       | `factory.formatPhone('0612345678')` → `06 12 34 56 78`         |
| `formatUrl(url)`           | Lien URL                | `factory.formatUrl('https://...')` → `<a href="...">`          |
| `formatBoolean(bool)`      | Oui/Non                 | `factory.formatBoolean(true)` → `✅ Oui`                        |
| `formatPercent(num)`       | Pourcentage             | `factory.formatPercent(75)` → `75%`                            |
| `escapeHtml(text)`         | Échappe HTML            | `factory.escapeHtml('<script>')` → sécurisé                    |
| `getIcon(item, prop)`      | Icône automatique       | `factory.getIcon(item, prop)` → `📧`                           |

---

#### Formatage

```js
// ==========================================
// UTILITAIRES DE FORMATAGE
// ==========================================

/**
 * Formate une date en français
 */
export function formatDate(date) {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

/**
 * Formate une date et heure en français
 */
export function formatDateTime(date) {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(new Date(date))
}

/**
 * Parse une date string
 */
export function parseDate(dateString) {
    if (!dateString) return null
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
}

/**
 * Formate un numéro de téléphone français
 */
export function formatPhone(phone) {
    if (!phone) return ''
    // 0612345678 -> 06 12 34 56 78
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ')
}

/**
 * Formate un SIRET
 */
export function formatSiret(siret) {
    if (!siret) return ''
    // 12345678901234 -> 123 456 789 01234
    return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4')
}
```


## Validation

```js
// ==========================================
// FONCTIONS DE VALIDATION
// ==========================================

/**
 * Validation email
 */
export function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) {
        return 'Email invalide'
    }
    return true
}

/**
 * Validation téléphone français
 */
export function validatePhone(value) {
    const regex = /^0[1-9][0-9]{8}$/
    if (!regex.test(value)) {
        return 'Téléphone invalide (format: 0612345678)'
    }
    return true
}

/**
 * Validation SIRET
 */
export function validateSiret(value) {
    if (!/^\d{14}$/.test(value)) {
        return 'SIRET invalide (14 chiffres requis)'
    }
    return true
}

/**
 * Validation date
 */
export function validateDate(value) {
    if (!value) return 'Date requise'
    
    const date = new Date(value)
    if (isNaN(date.getTime())) {
        return 'Date invalide'
    }
    
    return true
}

/**
 * Validation longueur minimale
 */
export function validateMinLength(min) {
    return (value) => {
        if (value.length < min) {
            return `Minimum ${min} caractères requis`
        }
        return true
    }
}

/**
 * Validation longueur maximale
 */
export function validateMaxLength(max) {
    return (value) => {
        if (value.length > max) {
            return `Maximum ${max} caractères autorisés`
        }
        return true
    }
}
```



