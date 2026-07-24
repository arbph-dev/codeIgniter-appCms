


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

##### 1. personTemplate (Contacts/Personnes)

```javascript
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

