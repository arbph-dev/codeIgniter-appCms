export const DOM = {
    ARTICLE_LIST : null,
    DEBUG :false, 


    init() {
        this.ARTICLE_LIST = document.getElementById('dataList_article')
        if (!this.ARTICLE_LIST) { console.error('⚠️ Container dataList_article introuvable') }

        if ( this.DEBUG ){ console.log("DOM refs initialized") }
        
        //this.getScreenProperties()

    },

    getScreenProperties(){
        //let sw = -1     ;
        let sh = -1         // Screen       Width Height
        let aw = -1     ;   let ah = -1         // Affichage    Width Height
        let cd = -1     ;   let cr = -1         // resolution

        //sw = screen.width
        this.SCREENWIDTH = screen.width
        sh = screen.height
        
        aw = screen.availWidth
        ah = screen.availHeight
        
        cd = screen.colorDepth
        cr = screen.pixelDepth
        
        if ( this.DEBUG ){ console.log(`W ${this.SCREENWIDTH} H ${sh} , aW ${aw} aH ${ah} , cD  ${cd} cR ${cr}`)  }

    },
    

    domCreat_Element(tag, attrs = {}, callbacks = {}) {
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

    domCreat_H1( Id, Title, attrs = {}, callbacks = {}) {
        if (Id === null){
            return DOM.domCreat_Element("h1", { text : Title, ...attrs }, callbacks);
        }
        else{
            return DOM.domCreat_Element("h1", { id : Id, name : Id , text : Title, ...attrs }, callbacks);
        }
        
    },

    domCreat_Img(src, alt = "", attrs = {}, callbacks = {}) {
        return DOM.domCreat_Element("img", { src, alt, ...attrs }, callbacks);
    },

    
// 2026-04-07 : Modification domCreat_Table => voir copie
// doit permettre de géré besoins 
// peut impacter  OVH\www\public\assets\js\data\articleRenderer.js
// dans le code ci dessous les colones sont a modifié
/*

        let table = DOM.domCreat_Table(
            "myTable",
            [ { id: 1, nom: "Alice", sexe : "f" }, { id: 2, nom: "Bob" ,  sexe : "h" } ] ,
            ["id", "nom" ,"sexe"]
        );
        DOM.ARTICLE_LIST.appendChild(table)

            ["id", "nom" ,"sexe"]
            =>     columns = [ {key:'id', label:'ID'} ,
            {key:'nom', label:'NOM'}, 
            {key:'sexe', label:'SEXE'}
            ]         

            => 

        let table = DOM.domCreat_Table(
            "myTable",
            [ { id: 1, nom: "Alice", sexe : "f" }, { id: 2, nom: "Bob" ,  sexe : "h" } ] ,
            [ {key:'id', label:'ID'} , {key:'nom', label:'NOM'}, {key:'sexe', label:'SEXE'} ]              
        );


*/

domClear(el) {  
    while (el.firstChild) {  
        el.removeChild(el.firstChild)  
    }  
},


domCreat_Table({  
    id = null,  
    data = [],  
    columns = null, // [{key:'id', label:'ID'}]  
    attrs = {},  
    onRowClick = null,  
    onCellClick = null  
} = {}) {  
  
    const table = this.domCreat_Element("table", {  
        id,  
        ...attrs  
    })  
  
    if (!data || data.length === 0) {  
        return table  
    }  
   // [{key:'id', label:'ID'}]  
    // 🔹 Colonnes auto si non fournies  
    if (!columns) {  
        columns = Object.keys(data[0]).map(k => ({ key: k, label: k }))  
    }  
  
    // 🔹 THEAD  
    const thead = document.createElement("thead")  
    const trHead = document.createElement("tr")  
    // columns = [ {key:'id', label:'ID'} ]  
    columns.forEach(col => {  
        const th = document.createElement("th")  
        th.textContent = col.label  
        trHead.appendChild(th)  
    })  
  
    thead.appendChild(trHead)  
    table.appendChild(thead)  
  
    // 🔹 TBODY  
    const tbody = document.createElement("tbody")  
  
    data.forEach(row => {  
  
        const tr = document.createElement("tr")  
        //gestion callback
        if (onRowClick) {  
            tr.addEventListener("click", () => onRowClick(row))  
        }  
  
        columns.forEach(col => {  
            const td = document.createElement("td")  
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


}
