

https://zealot.fr/admin/modelworkbench
https://zealot.fr/cms/article/test-art
https://zealot.fr/workbench/mot
https://zealot.fr/workbench/component-catalog

```md
|Workbench|Rôle actuel|Ce qu'il apporte|Ce qu'il faut en faire|
|---|---|---|---|
|`/admin/modelworkbench`|Prototype Three.js|Viewer, scènes, ressources 3D|Conserver comme laboratoire du moteur 3D|
|`/cms/article/test-art`|CmsArticleWorkbench|Intégration CMS complète, composants, édition|À démanteler progressivement pour extraire les briques communes|
|`/workbench/mot`|Référence Runtime|CRUD, pagination, recherche, Panels|Conserver comme Workbench de référence|
|`/workbench/component-catalog`|Référence Builder|Catalogue des composants, descripteurs|Faire évoluer vers l'atelier de conception des composants|
```

D'ailleurs, cette répartition correspond presque exactement aux familles que tu avais commencé à dessiner.

```
Workbench

            Runtime                       Builder
    ──────────────────────       ─────────────────────────

    MotWorkbench                 ComponentCatalogWorkbench
    ImageWorkbench               CarouselWorkbench
    ImageTaggerWorkbench         MathGraphWorkbench
    KnowledgeWorkbench           SceneWorkbench
                                 ModelWorkbench
```

Je ne mettrais plus `ModelWorkbench` dans Runtime.

|Responsabilité|Mot|ComponentCatalog|Model|CMS|Destination|
|---|:-:|:-:|:-:|:-:|---|
|Layout|✓|✓|✓|✓|`WorkbenchView`|
|Panels|✓|✓|✓|✓|`PanelBase` + `ui/panels`|
|Formulaires|✓|✓|✓|✓|`shared/Form.js`|
|Templates|△|△|✓|✓|`shared/templates`|
|Validation|✓|△|△|✓|`shared/validation`|
|Composants (Three, Carousel, Apex...)|✗|✓|✓|✓|`ui/widgets` + `components/`|
|Bus / callbacks|✓|✓|✓|✓|Architecture cible|



---


## Ordre de développement recommandé

Je suivrais cet ordre, qui limite les refactorings :

Phase	Objectif	Priorité
A	Génération du formulaire	✅ Terminée
B	Validation (rules + validator)	✅ Terminée
C	Extraction de FieldFactory	⭐ Très haute
D	Extraction de ValueCaster	⭐ Très haute
E	Extraction de FormBinder	Haute
F	Extraction de ComputeEngine	Haute
G	Gestion d'état (FormState)	Moyenne
H	API événementielle	Moyenne
I	Nouveaux types de champs	Progressive




---

# FieldFactory

L'objectif est que Form ne sache plus construire un champ. Il saura uniquement demander un champ.
La création du DOM quitte complètement Form.
L'objectif est que cette étape soit strictement mécanique : déplacer uniquement la construction des champs, sans modifier le comportement. 
Ainsi, les tests existants continueront de passer, et les étapes suivantes (ValueCaster, FormBinder) pourront être réalisées indépendamment.

Aujourd'hui :
```
Form
 ├── render()
 ├── _createField()
 └── ...
```

```
Form
 ├── render()
 └── ...
FieldFactory
 └── create(property)
```


## Étape 1 — Nouveau fichier
assets/js/ui/shared/form/FieldFactory.js

Responsabilité unique :
- Construire un champ à partir d'un PropertySet.
- Aucune validation.
- Aucune extraction.
- Aucune logique métier.

Uniquement du DOM.

## Étape 2 — API

une API simple.
```js
FieldFactory.create(property)
```
retourne
```
{
    wrapper,
    input,
    error
}
```

## Étape 3 — Contrat

Le contrat devient :
```js
const field = FieldFactory.create(prop)

field.wrapper
field.input
field.error

```


## Étape 4 — Déplacement du code

la méthode _createField(prop) sera déplacée quasiment à l'identique dans FieldFactory.

## Étape 5 — Form.render()

Il deviendra beaucoup plus simple.

```js
for (const prop of this._ps)
{
    const field = FieldFactory.create(prop);

    this._inputs.set(prop.name, field.input);
    this._errorEls.set(prop.name, field.error);

    this.element.appendChild(field.wrapper);
}
```

Toute la connaissance HTML disparaît de Form.

## Étape 6 — Préparer les futurs types

```js
switch(prop.type)
{
    case 'textarea':
    case 'checkbox':
    case 'select':
    case 'color':
    case 'file':
}
```


## Étape 7 — Arborescence

```
shared/
    form/
        FieldFactory.js
```


Plus tard :
```
shared/
    form/
        FieldFactory.js
        fields/
            TextField.js
            NumberField.js
            DateField.js
            SelectField.js
            CheckboxField.js
```

Pas besoin de créer les classes maintenant.Quand il dépassera une centaine de lignes, on découpera.
Le Factory pourra déjà utiliser un switch.

---

# ValueCaster

ValueCaster n'a a que trois types (text, number, date), mais dans un éditeur de ressources il faudra gérer des boolean, enum, json, color, file, etc.

Je partirais sur un composant complètement indépendant du DOM.

## Responsabilité
Le formulaire ne saura plus comment convertir les valeurs ; il se contentera de déléguer.
Une seule responsabilité : convertir une valeur brute provenant d'un champ HTML vers une valeur JavaScript.

Il ne fait :
- aucune validation ;
- aucune manipulation du DOM ;
- aucun accès au formulaire ;
- aucun calcul métier.

## Nouveau fichier
assets/js/ui/shared/form/ValueCaster.js


## API
Une API minimale suffit.
ValueCaster.cast(value, type)

Exemple :
```
ValueCaster.cast("42", "number")
// → 42
ValueCaster.cast("2026-08-07", "date")
// → Date(...)
ValueCaster.cast("bonjour", "text")
// → "bonjour"
```


## Contrat

Le caster retourne **toujours** une valeur JavaScript.
Jamais :
- un objet.
- un booléen de validation.

## Implémentation

Au début, seulement les types déjà présents dans Form.
```
switch(type)
{
    case 'number':
    case 'date':
    default:
}
```
C'est exactement ce que fait actuellement _castValue().

## Évolution prévue

Le switch pourrait grandir progressivement : text , number , float , date , datetime , time , checkbox , boolean , select , textarea , email , url , json ,color ,file


## Extension

### API complète proposée
```
ValueCaster
├── cast(value, type)
├── has(type)
├── register(type, caster)
└── unregister(type)
```

Prévoir dès le départ :
- ValueCaster.register(type, fn)

Ainsi un Workbench pourra faire :
```js
ValueCaster.register( 'vector3', value => new Vector3(...) )
ValueCaster.register('uuid', value => UUID.fromString(value) )
```

Utilisation dans Form
```js
data[prop.name] = ValueCaster.cast( input.value, prop.type );
```

C'est un bon investissement architectural : Form orchestre, Validator valide, FieldFactory construit le DOM, et ValueCaster devient l'unique point de conversion entre les valeurs HTML et les objets JavaScript.


Il faut éviter le switch et construire une table de conversion.

```js
const CASTERS =
{
    text    : value => value,
    number  : value => parseInt(value,10),
    date    : value =>
    {
        const [y,m,d] = value.split('-').map(Number);
        return new Date(y,m-1,d);
    }
}
```
Puis
```
cast(value,type)
{
    return (CASTERS[type] ?? CASTERS.text)(value);
}
```

---

# Priorité

Nous allons faire fonctionner une relation réelle dans Adresse, avec :
- CodePostal
- autocomplete
- dialog
- liste + filtre
- sélection
- retour dans le formulaire

le même travail est à réalisé pour TypeVoie.

À l'issue de ces deux implémentations, nous aurons plus de matière pour extraire le contrat générique de FieldFactory.



## API

Le portail historique contient déjà les briques. Il faut maintenant les extraire et les confronter à l'architecture actuelle.

Le portail chargeait explicitement les trois features concernées : typevoie, codepostal et adresse, chacune avec son controller, renderer et form.

les API ont été testée et validé depuis le portail actuel

la vue principale propose les librairies et les scripts dont "autocomplete"
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Views/cms/index.php

le document est structuré depuis le contrôleur
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/app/Controllers/Cms.php

les apis en relation avec adresse ont chacune un features, structuré avec controller, form, renderer, service et store
Les services historiques et les "API de relation" possèdent déjà deux niveaux d'accès :

TypeVoie (CRUD complet) : 
- recherche paginée fetchTv()
- recherche fetchTvLike() pour autocomplete
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/features/typevoie/typevoie.service.js

CodePostal (read only car référentiel)
- recherche paginée avec q, codepostal, codeinsee
- fetchCpLike() pour autocomplete.
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/features/codepostal/codepostal.service.js


bien qu'obsolete la gestion des formulaires et dialog du portail actuel peut comporter des éléments a considérer
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/ihm/formsManager.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/old/public/assets/js/ihm/dialog.js




## Dialog

Le portail historique est particulièrement intéressant pour dialog. Le vieux dialog.js est rudimentaire, mais il contient déjà une idée architecturale intéressante :
```
DialogManager
    ├── registre des <dialog>
    ├── getById()
    ├── show()
    └── close()
```

Les dialogues sont enregistrés depuis le DOM et stockés dans une Map. Le bus sert ensuite à demander dialog:show et dialog:close.
- Le dialogue comme une infrastructure IHM indépendante du formulaire.
- Le scénario Adresse → sélection CodePostal correspond parfaitement à cette infrastructure.

Il y a aussi un détail très intéressant dans formsManager

L'ancien gestionnaire détectait explicitement si un <form> était contenu dans un <dialog> :

FORM
 └── parentElement
       └── DIALOG

et distinguait alors le contexte formulaire normal du contexte formulaire dans dialogue. Mais le formulaire reste le propriétaire de la valeur finale.
Cela signifie que Form et Dialog ne doivent probablement pas être deux mondes indépendants.
```
Form
 ├── champ simple
 ├── champ autocomplete
 └── champ relation
       ├── saisie/autocomplete
       └── ouverture Dialog
              ├── recherche
              ├── liste
              └── sélection
```

---

## Pièces à construire 


1. DialogManager.js          
— infrastructure singleton, programmatic (pas de scan DOM)

register(id, el) / show / close / select → dialog:select

2. RelationPickerDialog.js
— dialog générique paramétré
{ id, title, fetchFn, columns, labelKey, valueKey }
crée le <dialog>, gère recherche + table + sélection

3. Form.js v3
 — nouveau type 'relation'
 [input readonly display] + [input hidden value] + [btn 🔍]
displayFn(data) dans options → fill() mode edit
_busHandlers[] → cleanup au destroy()

4. codepostal.service.js
 — adaptation minime de l'old

5. typevoie.service.js
— adaptation minime de l'old

6. adresse.properties.js
 — codepostal_id + voietype_id → type: 'relation'

7. AdresseWorkbench.js
— bootstrap() crée les deux dialogs via RelationPickerDialog

8. dialog.css
— styles <dialog> natif


## Décisions architecturales clés

type: 'relation' dans le PropertySet :

```js
{
    name       : 'codepostal_id',
    type       : 'relation',
    description: 'Code postal',
    options    : {
        dialogId   : 'dialog_cp',
        valueKey   : 'id',          // FK stockée
        labelKey   : 'label',       // clé retournée par le dialog
        displayFn  : (data) =>      // reconstruction du label en mode edit (fill)
            `${data.cp_codepostal ?? ''} ${data.cp_commune ?? ''}`.trim(),
        placeholder: 'Code postal…',
        required   : '',
    },
}
```


Le champ relation souscrit lui-même à dialog:select filtré sur dialogId 
— le Form reste propriétaire, le bus n'est qu'un tuyau.
Les handlers sont stockés dans _busHandlers[] et désabonnés au destroy().

RelationPickerDialog est générique 
— fetchFn reçoit la requête, renvoie items[]. 
columns définit la table. 

À l'issue des deux implémentations (cp + tv), le contrat pour FieldFactory sera lisible directement depuis ces deux usages.

Ce qui ne change pas : WorkbenchView, PanelBase, les Panels existants. 
Seul AdresseWorkbench.bootstrap() est modifié pour créer les deux dialogs.

assets/js/ui/shared/DialogManager.js

```
// assets/js/ui/shared/DialogManager.js
// ─────────────────────────────────────────────────────────────────────────────
// Infrastructure IHM pour les <dialog> natifs.
//
// Différences vs old/dialog.js :
//   • Pas de scan DOM à l'init — les dialogs sont créés programmatiquement
//     et enregistrés via register()
//   • select() publie dialog:select ET ferme — les champs relation n'ont
//     pas à connaître le DialogManager
//   • Pas de verrou activeDialog — plusieurs dialogs peuvent exister,
//     le navigateur gère la modale native
//   • Les <dialog> sont insérés dans document.body pour éviter les
//     problèmes de stacking context (overflow:hidden sur les parents)
//
// Export : dialogManager (singleton)
// Bus events entrants  : dialog:show (id), dialog:close (id)
// Bus events sortants  : dialog:select { sourceId, item }
// ─────────────────────────────────────────────────────────────────────────────

import { bus } from '/assets/js/core/eventBus.js'

class DialogManager
{
    constructor()
    {
        /** @type {Map<string, HTMLDialogElement>} */
        this._map = new Map()

        // Bus entrant — compatibilité avec les onclick inline éventuels
        bus.subscribe('dialog:show',  (id) => this.show(id))
        bus.subscribe('dialog:close', (id) => this.close(id))
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Enregistre un <dialog> déjà construit et l'insère dans document.body.
     * Appelé par RelationPickerDialog.render().
     *
     * @param {string}             id
     * @param {HTMLDialogElement}  el
     */
    register(id, el)
    {
        this._map.set(id, el)
        document.body.appendChild(el)
    }

    /**
     * Désenregistre et retire le <dialog> du DOM.
     * Appelé par RelationPickerDialog.destroy().
     *
     * @param {string} id
     */
    unregister(id)
    {
        const el = this._map.get(id)
        if (el)
        {
            if (el.open) el.close()
            el.remove()
            this._map.delete(id)
        }
    }

    /**
     * Ouvre le dialog en mode modal (showModal).
     * @param {string} id
     */
    show(id)
    {
        const el = this._map.get(id)
        if (!el) {
            console.warn(`[DialogManager] Dialog introuvable : "${id}"`)
            return
        }
        el.showModal()
    }

    /**
     * Ferme le dialog.
     * @param {string} id
     */
    close(id)
    {
        const el = this._map.get(id)
        if (el?.open) el.close()
    }

    /**
     * Publie dialog:select puis ferme.
     * Appelé par RelationPickerDialog quand l'utilisateur sélectionne un item.
     *
     * @param {string} id    — dialog source
     * @param {object} item  — item sélectionné (données brutes)
     */
    select(id, item)
    {
        bus.publish('dialog:select', { sourceId: id, item })
        this.close(id)
    }
}

export const dialogManager = new DialogManager()
```



