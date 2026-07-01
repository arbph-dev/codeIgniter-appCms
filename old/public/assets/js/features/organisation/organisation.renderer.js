// js/features/organisation/organisation.renderer.js
import { bus }                                     from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice }              from '/assets/js/core/domhelper.js'

const ORG_TYPES = [
    { value:'',  label:'— tous —' },
    { value:'1', label:'Entreprise' },
    { value:'2', label:'Association' },
    { value:'3', label:'Coopérative' },
    { value:'4', label:'Établissement public' },
    { value:'5', label:'Établissement scolaire' },
    { value:'6', label:'Collectivité' },
    { value:'7', label:'Musée / Site culturel' },
]

function makeSelect(name, options, val='') {
    const sel = create('select', { name })
    options.forEach(({value,label}) => {
        const o = create('option', {value, text:label})
        if (String(value)===String(val)) o.setAttribute('selected','')
        sel.appendChild(o)
    })
    return sel
}

function buildButtons(sel) {
    const f = document.createDocumentFragment()
    f.append(
        btn({label:'Rechercher',icon:'fa-search', busEvent:'org:mode',busArg:'list'}),
        btn({label:'Nouveau',   icon:'fa-plus',   variant:'primary', busEvent:'org:mode',busArg:'form'}),
        btn({label:'Modifier',  icon:'fa-pencil', busEvent:'org:mode',busArg:'form', disabled:!sel}),
        btn({label:'Supprimer', icon:'fa-trash',  variant:'danger',
             onClick:()=>sel&&bus.publish('org:delete',sel.id), disabled:!sel}),
    )
    return f
}

function buildSearchForm() {
    const form = create('form',{id:'orgSearchForm',class:'cp_form',onsubmit:'return validateForm(this)'})
    form.append(
        create('label',{text:'Nom / SIREN'}),
        create('input',{type:'text',name:'orgq',placeholder:'Hénaff, Verlingue…'}),
        create('label',{text:'Type'}),
        makeSelect('orgtype', ORG_TYPES),
    )
    const a = create('div',{class:'cp_form_actions'})
    a.appendChild(btn({label:'Rechercher',icon:'fa-search',variant:'primary',attrs:{type:'submit'}}))
    form.appendChild(a)
    return form
}

function buildEditForm(o) {
    const isNew = !o?.id
    const x = o || {}
    const form = create('form',{id:'orgEditForm',class:'cp_form',onsubmit:'return validateForm(this)'})
    form.appendChild(create('input',{type:'hidden',name:'org_id',value:x.id??''}))
    form.append(
        create('label',{text:'Nom *'}),
        create('input',{type:'text',name:'nom',value:x.nom??'',required:'',maxlength:'255'}),
        create('label',{text:'Type'}),
        makeSelect('organisation_type_id', ORG_TYPES, x.organisation_type_id??''),
        create('label',{text:'SIREN'}),
        create('input',{type:'text',name:'siren',value:x.siren??'',maxlength:'9',pattern:'\\d{0,9}',placeholder:'9 chiffres'}),
        create('label',{text:'Site web'}),
        create('input',{type:'url',name:'site_web',value:x.site_web??'',placeholder:'https://…'}),
        create('label',{text:'Lien annuaire (urlreg)'}),
        create('input',{type:'url',name:'urlreg',value:x.urlreg??'',placeholder:'https://annuaire-entreprises.data.gouv.fr/…'}),
        create('label',{text:'Email'}),
        create('input',{type:'email',name:'email',value:x.email??''}),
        create('label',{text:'Téléphone'}),
        create('input',{type:'text',name:'telephone',value:x.telephone??''}),
        create('label',{text:'Facebook'}),
        create('input',{type:'url',name:'lien_facebook',value:x.lien_facebook??''}),
        create('label',{text:'Instagram'}),
        create('input',{type:'url',name:'lien_instagram',value:x.lien_instagram??''}),
        create('label',{text:'LinkedIn'}),
        create('input',{type:'url',name:'lien_linkedin',value:x.lien_linkedin??''}),
        create('label',{text:'Description'}),
        Object.assign(create('textarea',{name:'description',rows:'4'}),{textContent:x.description??''}),
    )
    const a = create('div',{class:'cp_form_actions'})
    a.append(
        btn({label:'Enregistrer',icon:'fa-floppy-o',variant:'primary',attrs:{type:'submit'}}),
        btn({label:'Annuler',icon:'fa-times',busEvent:'org:mode',busArg:'list'}),
    )
    form.appendChild(a)
    return form
}

function buildDetail(o) {
    if (!o) return document.createDocumentFragment()
    const f = document.createDocumentFragment()
    f.appendChild(detail([
        {label:'ID',          value:o.id},
        {label:'Nom',         value:o.nom},
        {label:'Type',        value:o.type_label||'—'},
        {label:'SIREN',       value:o.siren||'—'},
        {label:'Site web',    value:o.site_web ? `<a href="${o.site_web}" target="_blank">${o.site_web}</a>` : '—'},
        {label:'Annuaire',    value:o.urlreg   ? `<a href="${o.urlreg}"  target="_blank">Voir</a>` : '—'},
        {label:'Email',       value:o.email    ||'—'},
        {label:'Téléphone',   value:o.telephone||'—'},
        {label:'Facebook',    value:o.lien_facebook  ? `<a href="${o.lien_facebook}"  target="_blank">↗</a>` : '—'},
        {label:'Instagram',   value:o.lien_instagram ? `<a href="${o.lien_instagram}" target="_blank">↗</a>` : '—'},
        {label:'LinkedIn',    value:o.lien_linkedin  ? `<a href="${o.lien_linkedin}"  target="_blank">↗</a>` : '—'},
        {label:'Description', value:o.description||'—'},
    ]))
    const a = create('div',{class:'cp_form_actions'})
    a.append(
        btn({label:'Modifier', icon:'fa-pencil',variant:'primary',busEvent:'org:mode',busArg:'form'}),
        btn({label:'Supprimer',icon:'fa-trash', variant:'danger', onClick:()=>bus.publish('org:delete',o.id)}),
        btn({label:'← Liste', icon:'fa-list',  busEvent:'org:mode',busArg:'list'}),
    )
    f.appendChild(a)
    return f
}

export function initOrgRenderer() {
    const container = document.getElementById('orgContainer')
    if (!container) return
    const panels = {
        buttons    : container.querySelector('.cp_panel_buttons'),
        form       : container.querySelector('.cp_panel_form'),
        detail     : container.querySelector('.cp_panel_detail'),
        table      : container.querySelector('.cp_panel_table'),
        pagination : container.querySelector('.cp_panel_pagination'),
    }
    function applyMode(store) {
        const {mode,selected,data,pagination:pager} = store
        clear(panels.buttons); panels.buttons.appendChild(buildButtons(selected))
        panels.form.style.display   = (mode==='list'||mode==='form') ? '' : 'none'
        panels.detail.style.display = (mode==='detail') ? '' : 'none'
        if (mode==='list')   { clear(panels.form);   panels.form.appendChild(buildSearchForm()) }
        if (mode==='form')   { clear(panels.form);   panels.form.appendChild(buildEditForm(selected)) }
        if (mode==='detail') { clear(panels.detail); panels.detail.appendChild(buildDetail(selected)) }
        if (mode!=='list') return
        clear(panels.table); clear(panels.pagination)
        if (!data?.length) { panels.table.appendChild(notice('empty')); return }
        panels.table.appendChild(table({
            id:'orgTable', data,
            columns:[
                {key:'id',         label:'ID'},
                {key:'nom',        label:'Nom'},
                {key:'type_label', label:'Type'},
                {key:'siren',      label:'SIREN'},
                {key:'site_web',   label:'Site'},
            ],
            attrs:{class:'cp_table'},
            onRowClick:(row)=>bus.publish('org:select',row),
        }))
        if (pager) panels.pagination.appendChild(pagination({pager,busEvent:'org:page',style:'compact',maxVisible:7}))
    }
    bus.subscribe('org:render',  applyMode)
    bus.subscribe('org:loading', (l)=>{if(!l)return;clear(panels.table);panels.table.appendChild(notice('loading'))})
    bus.subscribe('org:loaded',  (s)=>{s.mode='list';applyMode(s)})
    bus.subscribe('org:error',   (m)=>{clear(panels.table);panels.table.appendChild(notice('error',m))})
    bus.publish('org:render',{mode:'list',selected:null,data:[],pagination:null})
}
