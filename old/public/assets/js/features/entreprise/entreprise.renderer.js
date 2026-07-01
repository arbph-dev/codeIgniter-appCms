// js/features/entreprise/entreprise.renderer.js
// Formulaire avec 3 autocompletes : CodeNAF, FormeJuridique, Adresse
import { bus }                                       from '../../core/eventBus.js'
import { create, table, clear, btn,
         detail, pagination, notice, autocomplete }  from '/assets/js/core/domhelper.js'

const ORG_TYPES = [
    {value:'1',label:'Entreprise'},{value:'2',label:'Association'},
    {value:'3',label:'Coopérative'},{value:'4',label:'Établissement public'},
    {value:'5',label:'Établissement scolaire'},{value:'6',label:'Collectivité'},
]

function makeSelect(name,options,val='') {
    const sel = create('select',{name})
    options.forEach(({value,label})=>{
        const o=create('option',{value,text:label})
        if(String(value)===String(val)) o.setAttribute('selected','')
        sel.appendChild(o)
    })
    return sel
}

function buildButtons(sel) {
    const f = document.createDocumentFragment()
    f.append(
        btn({label:'Rechercher',icon:'fa-search',busEvent:'ent:mode',busArg:'list'}),
        btn({label:'Nouvelle',  icon:'fa-plus',  variant:'primary',busEvent:'ent:mode',busArg:'form'}),
        btn({label:'Modifier',  icon:'fa-pencil',busEvent:'ent:mode',busArg:'form',disabled:!sel}),
        btn({label:'Supprimer', icon:'fa-trash', variant:'danger',
             onClick:()=>sel&&bus.publish('ent:delete',sel.id),disabled:!sel}),
    )
    return f
}

function buildSearchForm() {
    const form = create('form',{id:'entSearchForm',class:'cp_form',onsubmit:'return validateForm(this)'})
    form.append(
        create('label',{text:'Nom, SIREN ou SIRET'}),
        create('input',{type:'text',name:'entq',placeholder:'Hénaff, 402978639…'}),
    )
    const a=create('div',{class:'cp_form_actions'})
    a.appendChild(btn({label:'Rechercher',icon:'fa-search',variant:'primary',attrs:{type:'submit'}}))
    form.appendChild(a)
    return form
}

function buildEditForm(e) {
    const x = e || {}
    const form = create('form',{id:'entEditForm',class:'cp_form',onsubmit:'return validateForm(this)'})
    form.appendChild(create('input',{type:'hidden',name:'ent_id',value:x.id??''}))

    // ── Champs Organisation ──────────────────────────────────
    form.append(
        create('label',{text:'Nom *'}),
        create('input',{type:'text',name:'nom',value:x.nom??'',required:'',maxlength:'255'}),
        create('label',{text:'Type'}),
        makeSelect('organisation_type_id',ORG_TYPES,x.organisation_type_id??'1'),
        create('label',{text:'SIREN (9 chiffres)'}),
        create('input',{type:'text',name:'siren',value:x.siren??'',maxlength:'9',pattern:'\\d{0,9}'}),
        create('label',{text:'Site web'}),
        create('input',{type:'url',name:'site_web',value:x.site_web??'',placeholder:'https://…'}),
        create('label',{text:'Annuaire institutionnel'}),
        create('input',{type:'url',name:'urlreg',value:x.urlreg??'',placeholder:'https://annuaire-entreprises.data.gouv.fr/…'}),
        create('label',{text:'Email'}),
        create('input',{type:'email',name:'email',value:x.email??''}),
        create('label',{text:'Téléphone'}),
        create('input',{type:'text',name:'telephone',value:x.telephone??''}),
    )

    // ── Autocomplete CodeNAF ─────────────────────────────────
    form.append(create('label',{text:'Code NAF / APE'}))
    const nafAc = autocomplete({
        id:'acEntNaf', name:'codenaf_id',
        placeholder:'10.20Z — Transformation poisson…',
        busRequest:'naf:ui:like', busResponse:'naf:ui:response',
        labelKey:'nom', valueKey:'codenaf',
    })
    if (x.codenaf_nom) nafAc.input.value  = `${x.codenaf_id} — ${x.codenaf_nom}`
    if (x.codenaf_id)  nafAc.hidden.value = x.codenaf_id
    const nafW = create('div',{}); nafW.appendChild(nafAc.wrapper); form.appendChild(nafW)

    // ── Autocomplete Forme Juridique ──────────────────────────
    form.append(create('label',{text:'Forme juridique'}))
    const fjAc = autocomplete({
        id:'acEntFj', name:'forme_juridique_id',
        placeholder:'SARL, SAS, SA…',
        busRequest:'fj:ui:like', busResponse:'fj:ui:response',
        labelKey:'description', valueKey:'id',
    })
    if (x.forme_juridique_nom) fjAc.input.value  = x.forme_juridique_nom
    if (x.forme_juridique_id)  fjAc.hidden.value = x.forme_juridique_id
    const fjW = create('div',{}); fjW.appendChild(fjAc.wrapper); form.appendChild(fjW)

    // ── Champs Entreprise ────────────────────────────────────
    form.append(
        create('label',{text:'SIRET (14 chiffres)'}),
        create('input',{type:'text',name:'siret',value:x.siret??'',maxlength:'14',pattern:'\\d{0,14}'}),
        create('label',{text:'Capital (€)'}),
        create('input',{type:'number',name:'capital',value:x.capital??'',min:'0',step:'0.01'}),
        create('label',{text:'Effectif min'}),
        create('input',{type:'number',name:'effectif_min',value:x.effectif_min??'',min:'0'}),
        create('label',{text:'Effectif max'}),
        create('input',{type:'number',name:'effectif_max',value:x.effectif_max??'',min:'0'}),
        create('label',{text:'Description'}),
        Object.assign(create('textarea',{name:'description',rows:'3'}),{textContent:x.description??''}),
    )

    const a=create('div',{class:'cp_form_actions'})
    a.append(
        btn({label:'Enregistrer',icon:'fa-floppy-o',variant:'primary',attrs:{type:'submit'}}),
        btn({label:'Annuler',icon:'fa-times',busEvent:'ent:mode',busArg:'list'}),
    )
    form.appendChild(a)
    return form
}

function buildDetail(e) {
    if (!e) return document.createDocumentFragment()
    const f=document.createDocumentFragment()
    f.appendChild(detail([
        {label:'ID',              value:e.id},
        {label:'Nom',             value:e.nom},
        {label:'Type',            value:e.type_label||'—'},
        {label:'SIREN',           value:e.siren||'—'},
        {label:'SIRET',           value:e.siret||'—'},
        {label:'Code NAF',        value:e.codenaf_id ? `${e.codenaf_id} — ${e.codenaf_nom||''}` : '—'},
        {label:'Forme juridique', value:e.forme_juridique_nom||'—'},
        {label:'Capital',         value:e.capital ? `${Number(e.capital).toLocaleString('fr-FR')} €` : '—'},
        {label:'Effectif',        value:(e.effectif_min||e.effectif_max) ? `${e.effectif_min||'?'} – ${e.effectif_max||'?'}` : '—'},
        {label:'Site web',        value:e.site_web ? `<a href="${e.site_web}" target="_blank">${e.site_web}</a>` : '—'},
        {label:'Annuaire',        value:e.urlreg   ? `<a href="${e.urlreg}"  target="_blank">Voir fiche</a>` : '—'},
        {label:'Email',           value:e.email    ||'—'},
        {label:'Téléphone',       value:e.telephone||'—'},
    ]))
    const a=create('div',{class:'cp_form_actions'})
    a.append(
        btn({label:'Modifier', icon:'fa-pencil',variant:'primary',busEvent:'ent:mode',busArg:'form'}),
        btn({label:'Supprimer',icon:'fa-trash', variant:'danger', onClick:()=>bus.publish('ent:delete',e.id)}),
        btn({label:'← Liste', icon:'fa-list',  busEvent:'ent:mode',busArg:'list'}),
    )
    f.appendChild(a)
    return f
}

export function initEntRenderer() {
    const container = document.getElementById('entContainer')
    if (!container) return
    const panels = {
        buttons    :container.querySelector('.cp_panel_buttons'),
        form       :container.querySelector('.cp_panel_form'),
        detail     :container.querySelector('.cp_panel_detail'),
        table      :container.querySelector('.cp_panel_table'),
        pagination :container.querySelector('.cp_panel_pagination'),
    }
    function applyMode(store) {
        const {mode,selected,data,pagination:pager}=store
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
            id:'entTable', data,
            columns:[
                {key:'id',              label:'ID'},
                {key:'nom',             label:'Nom'},
                {key:'siren',           label:'SIREN'},
                {key:'codenaf_id',      label:'NAF'},
                {key:'forme_juridique_nom', label:'Forme jur.'},
                {key:'type_label',      label:'Type'},
            ],
            attrs:{class:'cp_table'},
            onRowClick:(row)=>bus.publish('ent:select',row),
        }))
        if (pager) panels.pagination.appendChild(pagination({pager,busEvent:'ent:page',style:'compact',maxVisible:7}))
    }
    bus.subscribe('ent:render',  applyMode)
    bus.subscribe('ent:loading', (l)=>{if(!l)return;clear(panels.table);panels.table.appendChild(notice('loading'))})
    bus.subscribe('ent:loaded',  (s)=>{s.mode='list';applyMode(s)})
    bus.subscribe('ent:error',   (m)=>{clear(panels.table);panels.table.appendChild(notice('error',m))})
    bus.publish('ent:render',{mode:'list',selected:null,data:[],pagination:null})
}
