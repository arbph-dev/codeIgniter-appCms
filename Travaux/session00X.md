# Pause réflexive. 

## Clarification des trois couches

### CMS Components
→ renderers de contenu dans les articles
  (Leaflet IN un article, Apex, Mermaid…) géré par ComponentRegistry / CmsArticleWorkbench

### Panel Widgets
→ outils UI embarqués dans une zone de Workbench 
  (MapPanel, futur CalendarPanel…)

**ils ne sont pas des composants CMS, ils sont des PanelBase spécialisés**

### Pickers / Dialogs
→ sélection modale d'une entité
  - (RelationPickerDialog → FK scalaire)
  - (AdressePickerDialog  → entité complète)

Le glissement vient du fait que MapPanel ressemble à un "widget" CMS alors qu'il est simplement un PanelBase qui délègue à Leaflet via le bus.
Le terme widget peut disparaître — c'est soit un Panel, soit un Composant CMS, selon le contexte.

## AdressePickerDialog vs RelationPickerDialog
```
RelationPickerDialog     AdressePickerDialog
────────────────────     ───────────────────
fetchFn + columns        fetchAdresse() + colonnes fixes
retourne item brut       retourne adresse complète
générique                spécialisé
                         + mini-map optionnelle
                         + filtres cp / commune
```

RelationPickerDialog est un picker scalaire — il retourne un FK. 

AdressePickerDialog serait un picker d'entité complète, potentiellement plus riche :
Il peut étendre RelationPickerDialog ou le composer. La décision se prendra en écrivant OrganisationWorkbench — on verra alors ce dont on a réellement besoin.



# Plan proposé pour la prochaine session

1. Form.js v4    radio + checkbox
                 radio  → groupe de boutons (type_organisation, statut…)
                 checkbox → booléen unique (is_active) ou groupe multi-valeurs

2. TabSystem.js  review + adaptation Workbench
                 usage actuel = lazy-load sections CMS
                 usage futur  = navigation entre vues d'une même entité
                 ajouter : selectTab(id) programmatique
                           badge dirty state (optionnel)

3. OrganisationWorkbench
                 sources à fournir : Model + Enums + schema API
                 tabs : Informations / Adresses / Contacts
                 AdressePickerDialog émerge naturellement ici

4. Backend (session ultérieure)
                 INSEE → enrichissement SIREN/SIRET
                 INPI  → données entreprise

## Sources à préparer pour OrganisationWorkbench :
- app/Models/OrganisationModel.php
- app/Enums/*.php  (type_organisation, statut…)
- app/Controllers/Api/Organisation.php  (routes + réponses)
- schema des relations : organisation → adresse(s), contacts…


## Session Stage 4

### Préparation
- [project/daily/2026-08-09.md](/project/daily/2026-08-09.md)

### 4.1 contrat event workbench / Panel / Dialog
Workbench maître de ses panels pour bindEvents
- Plutot gérer par callback que par le bus, voir pour les dialogs lequel est plus adapté
- AdresseWorkbench sera a reprendre pour suivre le contrat evenment
 
Contrat à verrouiller
```
Workbench
   ├── crée
   ├── configure
   ├── bindEvents()
   └── détruit
        │
        ├── Panel
        │     └── callbacks → Workbench
        └── Dialog
              └── résultat → appelant
```

Règles :
- Panel ne connaît pas son Workbench.
- Panel ne publie pas d'événements métier sur le bus.
- Workbench branche les callbacks des Panels.
- Dialog retourne son résultat au demandeur, idéalement par callback/promise.
- EventBus reste réservé aux événements réellement transversaux ou nécessitant un découplage inter-composants.
- destroy() doit supprimer les listeners/callbacks propres au composant.

### 4.3
#### Models / Controllers

Le principe : **on récupère les règles métier, pas l'architecture legacy**.

| Élément               | À conserver                                                 | À écarter                          |
| --------------------- | ----------------------------------------------------------- | ---------------------------------- |
| `OrganisationModel`   | validation, slug, relations utiles, `suggest()`             | `withRelations()` comme contrat UI |
| `EntrepriseModel`     | validation SIRET, relations NAF/form juridique, `suggest()` | agrégation SQL pour le Workbench   |
| `AdresseModel`        | règles de validation + format d'affichage                   | logique UI legacy                  |
| `ImageModel`          | validation + métadonnées                                    | gestion UI legacy                  |
| `CodeNafModel`        | recherche / autocomplete                                    | logique de rendu                   |
| `FormeJuridiqueModel` | recherche / autocomplete                                    | logique de rendu                   |
| Controllers           | endpoints, paramètres, validations métier                   | orchestration DOM / ancienne UI    |

##### Règles métier déjà identifiées

**Organisation**

- `nom` obligatoire.
- `siren` contrôlé lorsqu'il est renseigné.
- `slug` généré à partir du nom.
- relations optionnelles : type, adresse, logo, cover.

**Entreprise**

- `organisation_id` obligatoire et valide.
- `siret` facultatif mais contrôlé sur **14 chiffres**.
- `codenaf_id` et `forme_juridique_id` sont des FK.

**Suggestions**

- Organisation : recherche par nom.
- Entreprise : recherche par nom/SIRET.
- Les endpoints `like` sont adaptés à nos futurs `RelationField`/pickers.

##### Conclusion

Le legacy nous apporte surtout des **règles de domaine et des contrats de recherche**.

Il ne faut **rien importer directement dans `OrganisationWorkbench`**.


#### Models et relations
```
Organisation
├── organisation_type_id → organisation_types
├── adresse_id            → adresses       [0..1]
├── logo_id               → images         [0..1]
└── cover_id              → images         [0..1]
        │
        │ 1 — 1
        ▼
Entreprise
├── codenaf_id            → codesnaf
├── forme_juridique_id    → formesjuridiques
└── 1 — N
     │
     ▼
Établissements
│
└── adresse_id            → adresses [0..1]
```
 
Le 1–1 Organisation → Entreprise est imposé par UNIQUE(organisation_id) avec ON DELETE CASCADE sur les relations enfant.
Entreprise est une extension 1–1 ; les Établissements, eux, sont une collection.

#### AdressePickerDialog

Concevoir un picker Adresse générique, mais sans encore le spécialiser métier.
AdressePickerDialog aura au moins deux usages distincts :
- Organisation.adresse_id
- Etablissement.adresse_id


#### contrats API

Les deux API sont suffisamment définies pour fixer le contrat du Workbench.

##### Organisation
- GET    /api/organisation
- GET    /api/organisation/like
- GET    /api/organisation/:id
- POST   /api/organisation
- PUT    /api/organisation/:id
- DELETE /api/organisation/:id

Liste : pagination + q + filtre type.

like : autocomplétion q ≥ 2 caractères.

show : Organisation + relations enrichies (type, adresse, logo, cover).

Create/update : FK uniquement (organisation_type_id, adresse_id, logo_id, cover_id).

Delete : soft delete.

##### Entreprise
- GET    /api/entreprise
- GET    /api/entreprise/like
- GET    /api/entreprise/:id
- POST   /api/entreprise
- PUT    /api/entreprise/:id
- DELETE /api/entreprise/:id

Recherche par nom / SIRET / SIREN.

show : Entreprise + Organisation + Code NAF + Forme juridique.

Écriture : organisation_id, siret, codenaf_id, forme_juridique_id, capital et effectifs.

Relation explicitement 1:1.

---

Entreprise ne doit donc pas être chargée automatiquement par Organisation.show() : elle possède son propre endpoint et son propre CRUD. Le Workbench pourra la charger à la demande lorsque l'organisation sélectionnée est concernée

Le prochain point est donc les anciennes features JS, pour écrire 
- Workbench
- Panels
- Form.js + properties 





