
    - TemplateFactory
    - personTemplate
    - companyTemplate
    - documentTemplate
    - productTemplate
    - imageTemplate
    - productWithImageTemplate



```
// ==========================================
// templates.js
// Système de templates dynamiques pour les listes
// ==========================================

/**
 * TemplateFactory - Génère des templates HTML pour les listes
 */
export class TemplateFactory {
    constructor(propertySet, computePropertySet = []) {
        this.propertySet = propertySet
        this.computePropertySet = computePropertySet
        this.allProperties = [...propertySet, ...computePropertySet]
    }
    
    // ==========================================
    // TEMPLATES PRÉDÉFINIS
    // ==========================================
    
    /**
     * Template par défaut : affiche les 3 premiers champs
     */
    default(item) {
        const fields = this.propertySet
            .slice(0, 3)
            .map(prop => {
                const value = this.formatValue(item[prop.name], prop.type)
                return `${prop.description}: ${value}`
            })
            .join(' | ')
        
        return fields
    }
    
    /**
     * Template compact : affiche uniquement le nom/titre principal
     */
    compact(item) {
        // Chercher un champ 'name', 'title', 'firstname+lastname', ou 'id'
        const nameField = this.propertySet.find(p => 
            p.name.includes('name') || 
            p.name.includes('title') ||
            p.name.includes('label')
        )
        
        if (nameField) {
            return this.formatValue(item[nameField.name], nameField.type)
        }
        
        // Fallback: firstname + lastname
        if (item.firstname && item.lastname) {
            return `${item.firstname} ${item.lastname}`
        }
        
        // Fallback: premier champ disponible
        const firstProp = this.propertySet[0]
        return this.formatValue(item[firstProp.name], firstProp.type)
    }
    
    /**
     * Template détaillé : tous les champs avec labels
     */
    detailed(item) {
        const html = this.allProperties
            .map(prop => {
                const label = prop.description
                const value = this.formatValue(item[prop.name], prop.type)
                return `<strong>${label}:</strong> ${value}`
            })
            .join('<br>')
        
        return html
    }
    
    /**
     * Template card : affichage type carte
     */
    card(item) {
        const title = this.getMainField(item)
        const subtitle = this.getSecondaryField(item)
        const details = this.propertySet
            .slice(2, 4)
            .map(prop => this.formatValue(item[prop.name], prop.type))
            .filter(v => v && v !== 'N/A')
            .join(' • ')
        
        return `
            <div class="template-card">
                <div class="card-title">${title}</div>
                ${subtitle ? `<div class="card-subtitle">${subtitle}</div>` : ''}
                ${details ? `<div class="card-details">${details}</div>` : ''}
            </div>
        `
    }
    
    /**
     * Template table-row : format ligne de tableau
     */
    tableRow(item) {
        return this.propertySet
            .slice(0, 5)
            .map(prop => {
                const value = this.formatValue(item[prop.name], prop.type)
                return `<span class="table-cell">${value}</span>`
            })
            .join('')
    }
    
    /**
     * Template badge : affichage compact avec badge
     */
    badge(item) {
        const main = this.getMainField(item)
        const badge = this.getBadgeInfo(item)
        
        return `
            <span class="template-badge-main">${main}</span>
            ${badge ? `<span class="template-badge">${badge}</span>` : ''}
        `
    }
    
    /**
     * Template custom : utilise une fonction fournie
     */
    custom(item, templateFn) {
        if (typeof templateFn !== 'function') {
            console.error('Template custom : fonction requise')
            return this.default(item)
        }
        
        return templateFn(item, this)
    }
    
    // ==========================================
    // HELPERS - FORMATAGE
    // ==========================================
    
    /**
     * Formate une valeur selon son type
     */
    formatValue(value, type) {
        if (value === null || value === undefined || value === '') {
            return 'N/A'
        }
        
        switch(type) {
            case 'date':
                return this.formatDate(value)
            
            case 'datetime':
                return this.formatDateTime(value)
            
            case 'number':
                return this.formatNumber(value)
            
            case 'currency':
                return this.formatCurrency(value)
            
            case 'email':
                return this.formatEmail(value)
            
            case 'tel':
            case 'phone':
                return this.formatPhone(value)
            
            case 'url':
                return this.formatUrl(value)
            
            case 'boolean':
                return this.formatBoolean(value)
            
            case 'percent':
                return this.formatPercent(value)
            
            default:
                return this.escapeHtml(String(value))
        }
    }
    
    /**
     * Formate une date
     */
    formatDate(date) {
        try {
            return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
        } catch (e) {
            return String(date)
        }
    }
    
    /**
     * Formate une date avec heure
     */
    formatDateTime(date) {
        try {
            return new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(new Date(date))
        } catch (e) {
            return String(date)
        }
    }
    
    /**
     * Formate un nombre
     */
    formatNumber(value) {
        const num = parseFloat(value)
        if (isNaN(num)) return String(value)
        
        return new Intl.NumberFormat('fr-FR').format(num)
    }
    
    /**
     * Formate une valeur monétaire
     */
    formatCurrency(value, currency = 'EUR') {
        const num = parseFloat(value)
        if (isNaN(num)) return String(value)
        
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(num)
    }
    
    /**
     * Formate un email
     */
    formatEmail(email) {
        return `<a href="mailto:${email}" class="template-email">${this.escapeHtml(email)}</a>`
    }
    
    /**
     * Formate un téléphone
     */
    formatPhone(phone) {
        const cleaned = String(phone).replace(/\D/g, '')
        
        // Format français : 06 12 34 56 78
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ')
        }
        
        return phone
    }
    
    /**
     * Formate une URL
     */
    formatUrl(url) {
        return `<a href="${url}" target="_blank" class="template-url">${this.escapeHtml(url)}</a>`
    }
    
    /**
     * Formate un booléen
     */
    formatBoolean(value) {
        return value ? '✅ Oui' : '❌ Non'
    }
    
    /**
     * Formate un pourcentage
     */
    formatPercent(value) {
        const num = parseFloat(value)
        if (isNaN(num)) return String(value)
        
        return `${num}%`
    }
    
    /**
     * Échappe le HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }
    
    // ==========================================
    // HELPERS - EXTRACTION CHAMPS
    // ==========================================
    
    /**
     * Récupère le champ principal (nom, titre, etc.)
     */
    getMainField(item) {
        // Chercher firstname + lastname
        if (item.firstname && item.lastname) {
            return `${item.firstname} ${item.lastname}`
        }
        
        // Chercher name, title, label
        const mainProp = this.propertySet.find(p => 
            p.name === 'name' || 
            p.name === 'title' || 
            p.name === 'label'
        )
        
        if (mainProp) {
            return this.formatValue(item[mainProp.name], mainProp.type)
        }
        
        // Fallback: premier champ
        const firstProp = this.propertySet[0]
        return this.formatValue(item[firstProp.name], firstProp.type)
    }
    
    /**
     * Récupère le champ secondaire
     */
    getSecondaryField(item) {
        // Chercher email, phone, description
        const secondaryProp = this.propertySet.find(p => 
            p.name === 'email' || 
            p.name === 'phone' || 
            p.name === 'description' ||
            p.name === 'subtitle'
        )
        
        if (secondaryProp) {
            const value = item[secondaryProp.name]
            if (value) {
                return this.formatValue(value, secondaryProp.type)
            }
        }
        
        // Fallback: deuxième champ
        if (this.propertySet.length > 1) {
            const secondProp = this.propertySet[1]
            return this.formatValue(item[secondProp.name], secondProp.type)
        }
        
        return null
    }
    
    /**
     * Récupère l'info pour badge (statut, compteur, etc.)
     */
    getBadgeInfo(item) {
        // Chercher status, state, count
        const badgeProp = this.propertySet.find(p => 
            p.name === 'status' || 
            p.name === 'state' || 
            p.name === 'count' ||
            p.name === 'badge'
        )
        
        if (badgeProp) {
            const value = item[badgeProp.name]
            if (value) {
                return this.formatValue(value, badgeProp.type)
            }
        }
        
        return null
    }
    
    // ==========================================
    // GESTION ICÔNES/EMOJIS
    // ==========================================
    
    /**
     * Récupère une icône basée sur le type ou le contenu
     */
    getIcon(item, prop) {
        // Icônes par type
        const iconMap = {
            'email': '📧',
            'phone': '📞',
            'tel': '📞',
            'date': '📅',
            'datetime': '🕐',
            'url': '🔗',
            'currency': '💰',
            'percent': '📊'
        }
        
        if (iconMap[prop.type]) {
            return iconMap[prop.type]
        }
        
        // Icônes par nom de champ
        const fieldIconMap = {
            'firstname': '👤',
            'lastname': '👤',
            'name': '👤',
            'address': '🏠',
            'city': '🏙️',
            'country': '🌍',
            'company': '🏢',
            'position': '💼',
            'age': '🎂'
        }
        
        return fieldIconMap[prop.name] || ''
    }
    
    /**
     * Template avec icônes
     */
    withIcons(item) {
        return this.propertySet
            .slice(0, 4)
            .map(prop => {
                const icon = this.getIcon(item, prop)
                const value = this.formatValue(item[prop.name], prop.type)
                return `${icon} ${value}`
            })
            .join(' • ')
    }
}

// ==========================================
// TEMPLATES PRÉDÉFINIS POUR CAS D'USAGE COURANTS
// ==========================================

/**
 * // V0.4.6.5 ✅ AJOUT Template pour images
 */
export function imageTemplateV1(item, factory) {
    const filename = item.filename || 'image.jpg'
    const path = item.path || ''
    const w = item.w || 0
    const h = item.h || 0
    const description = item.description || ''
    
    // Calculer ratio si dimensions disponibles
    const ratio = (w && h) ? (w / h).toFixed(2) : null
    
    return `
        <div class="image-template">
            <div class="image-preview" style="
                background-image: url('${factory.escapeHtml(path)}');
                background-size: cover;
                background-position: center;
                width: 60px;
                height: 60px;
                border-radius: 4px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
            "></div>
            <div style="display: inline-block; vertical-align: middle;">
                <strong>🖼️ ${factory.escapeHtml(filename)}</strong>
                ${w && h ? `<br><small>📐 ${w}×${h}px${ratio ? ` (${ratio})` : ''}</small>` : ''}
                ${description ? `<br><small>${factory.escapeHtml(description)}</small>` : ''}
            </div>
        </div>
    `
}

export function imageTemplate(item, factory) {
    const filename = item.filename || 'image.jpg'
    const path = item.path || ''
    const w = item.w || 0
    const h = item.h || 0
    const description = item.description || ''
    
    const ratio = (w && h) ? (w / h).toFixed(2) : null
    
    return `
        <div class="image-template" style="display: flex; align-items: center; gap: 10px;">
            <img src="${path}" 
                 alt="${factory.escapeHtml(filename)}"
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            <div>
                <strong>🖼️ ${factory.escapeHtml(filename)}</strong>
                ${w && h ? `<br><small>📐 ${w}×${h}px${ratio ? ` (${ratio})` : ''}</small>` : ''}
                ${description ? `<br><small>${factory.escapeHtml(description)}</small>` : ''}
            </div>
        </div>
    `
}

/**
 * // V0.4.6.5 ✅ AJOUT Template pour produits avec image
 */
export function productWithImageTemplate(item, factory) {
    const name = item.name || 'Sans nom'
    const price = item.price ? factory.formatCurrency(item.price) : ''
    const stock = item.stock !== undefined ? item.stock : null
    const imgSrc = item.image || item.path || 'placeholder.png'
    
    // Statut stock
    let stockStatus = ''
    let stockColor = '#6b7280'
    
    if (stock !== null) {
        if (stock > 10) {
            stockStatus = '✅ En stock'
            stockColor = '#16a34a'
        } else if (stock > 0) {
            stockStatus = '⚠️ Stock faible'
            stockColor = '#f59e0b'
        } else {
            stockStatus = '❌ Rupture'
            stockColor = '#dc2626'
        }
    }
    
    return `
        <div class="product-card" style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fff;
        ">
            <img 
                src="${factory.escapeHtml(imgSrc)}" 
                alt="${factory.escapeHtml(name)}"
                style="
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 6px;
                    background: #f3f4f6;
                "
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo image%3C/text%3E%3C/svg%3E'"
            >
            <div style="flex: 1;">
                <strong style="font-size: 1.1em; color: #1f2937;">
                    ${factory.escapeHtml(name)}
                </strong>
                ${price ? `
                    <div style="margin-top: 4px; font-size: 1.2em; color: #3b82f6; font-weight: 600;">
                        ${price}
                    </div>
                ` : ''}
                ${stock !== null ? `
                    <div style="margin-top: 4px; font-size: 0.9em; color: ${stockColor};">
                        ${stockStatus} ${stock > 0 ? `(${stock})` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `
}






/**
 * Template pour contacts/personnes
 */
export function personTemplate(item, factory) {
    const name = item.firstname && item.lastname 
        ? `${item.firstname} ${item.lastname}`
        : item.name || 'Sans nom'
    
    const email = item.email 
        ? factory.formatEmail(item.email)
        : ''
    
    const phone = item.phone 
        ? factory.formatPhone(item.phone)
        : ''
    
    const details = [email, phone].filter(Boolean).join(' • ')
    
    return `
        <div class="person-template">
            <strong>👤 ${factory.escapeHtml(name)}</strong>
            ${details ? `<br><small>${details}</small>` : ''}
        </div>
    `
}

/**
 * Template pour entreprises/clients
 */
export function companyTemplate(item, factory) {
    const name = item.name || 'Sans nom'
    const city = item.city || ''
    const phone = item.phone ? factory.formatPhone(item.phone) : ''
    
    return `
        <div class="company-template">
            <strong>🏢 ${factory.escapeHtml(name)}</strong>
            ${city ? ` - ${factory.escapeHtml(city)}` : ''}
            ${phone ? `<br><small>📞 ${phone}</small>` : ''}
        </div>
    `
}

/**
 * Template pour documents/factures
 */
export function documentTemplate(item, factory) {
    const number = item.number || item.id || 'N/A'
    const date = item.date ? factory.formatDate(item.date) : ''
    const amount = item.amount ? factory.formatCurrency(item.amount) : ''
    
    return `
        <div class="document-template">
            <strong>📄 ${factory.escapeHtml(String(number))}</strong>
            ${date ? ` - ${date}` : ''}
            ${amount ? ` - ${amount}` : ''}
        </div>
    `
}

/**
 * Template pour produits
 */
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

// ==========================================
// EXPORT PAR DÉFAUT
// ==========================================

export default {
    TemplateFactory,
    personTemplate,
    companyTemplate,
    documentTemplate,
    productTemplate,
    imageTemplate, // V0.4.6.5 ✅ AJOUT
    productWithImageTemplate // V0.4.6.5 ✅ AJOUT
}
```
