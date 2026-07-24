## Récursivité
tag : récursive, récursivité, récursif

```js
// Fonction récursive avec indentation
function renderNode(label, depth = 0) {
    const page = pageMap[label];
    if (!page) return "";

    const indent = "  ".repeat(depth); // ou "  " pour 2 espaces
    let output = `${indent}- [[${page.file.name}]]\n`;

    const children = pages
        .where(p => (p.cmp_PARENT || []).includes(label))
        .sort(p => p.cmp_ID);

    for (const child of children) {
        output += renderNode(child.cmp_LBL, depth + 1);
    }

    return output;
}

// Racines (pas de parent)
const rootPages = pages
    .where(p => !p.cmp_PARENT || p.cmp_PARENT.length === 0)
    .sort(p => p.cmp_ID);

// Génération texte indenté
let treeText = "";
for (const root of rootPages) {
    treeText += renderNode(root.cmp_LBL);
}
```
---

## Dates


```js
new Intl.DateTimeFormat().format( arg.birthdate )


/**
 * Calcule l'âge d'une personne
 */
export function computeAge(person) {
    if (!person.birthdate) return null
    
    const today = new Date()
    const birthDate = new Date(person.birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    
    return age
}

/**
 * Calcule les jours jusqu'au prochain anniversaire
 */
export function daysUntilBirthday(person) {
    if (!person.birthdate) return null
    
    const today = new Date()
    const birthDate = new Date(person.birthdate)
    const nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    )
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = nextBirthday - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
```

## PERSISTENCE
```js
//-----------------------------------------------------------------------------------------------------------
//
//                                              PERSISTENCE
//
function toLocal( itemName , itemValue ) {
	const itemJson = JSON.stringify( itemValue )
	localStorage.setItem( itemName , itemJson )
}

function fromLocal( itemName ) {
	const itemValue = localStorage.getItem(itemName)
	return JSON.parse(itemValue )
}


```


## UI

### Pagination
js\ihm\sections\SectionPicGallery.js

```js
// Ajouter après constructor
renderPaginationControls() {
    const info = this.collection.getPaginationInfo()
    const controls = document.createElement('div')
    controls.className = 'pagination-controls'
    controls.innerHTML = `
        <button data-action="prev" ${!this.collection.hasPrev() ? 'disabled' : ''}>◀ Précédent</button>
        <span>Page ${this.collection.currentPage}/${this.collection.lastPage} (${info})</span>
        <button data-action="next" ${!this.collection.hasNext() ? 'disabled' : ''}>Suivant ▶</button>
    `
    
    controls.querySelector('[data-action="prev"]').onclick = () => this.prevPage()
    controls.querySelector('[data-action="next"]').onclick = () => this.nextPage()
    
    return controls
}

// Dans loadPicsData après RefreshList
loadPicsData() {
    // ... existing code
    this.RefreshList()
    this.updatePaginationUI()
}

updatePaginationUI() {
    let existing = this.divContent.querySelector('.pagination-controls')
    if (existing) existing.remove()
    
    this.divContent.appendChild(this.renderPaginationControls())
}
```
