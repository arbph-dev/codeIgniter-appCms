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

