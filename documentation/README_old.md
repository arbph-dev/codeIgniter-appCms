



# Documentation

La documentation historique (documentation/) mélange CMS widgets et digressions architecturales.

Elle est en cours de réorganisation autour de :
- Vision — Versatile Knowledge Base  
- Architecture Workbench & Panel Contract  
- Features (workbenches, knowledge base)  
- Conventions dev (JS, CSS, services)  
- Roadmap

Les notes quotidiennes (project/daily/) contiennent les décisions récentes non encore consolidées.

----

# [Workbench](/documentation/WORKBENCH/Workbench.md)

La mise en œuvre [backend](/documentation/WORKBENCH/BACKEND/index.md) est détaillé dans des exemples : 
- [imageworkbench-backend](/documentation/WORKBENCH/BACKEND/index.md#imageworkbench-backend)

Documentation a mettre en forme en priorité

## Taches

### Arborescence
- [ ] Détailler les éléments clefs des Workbench dans [WORKBENCH/ARCHITECTURE](/documentation/WORKBENCH/ARCHITECTURE)
- [ ] Ajuster l'arborescence

### Les contrats

#### [Workbench](/documentation/WORKBENCH/ARCHITECTURE/WORKBENCH_CONTRACT.md)

- [WorkbenchBase](/documentation/WORKBENCH/ARCHITECTURE/WorkbenchBase.md)
- [WorkbenchView](/documentation/WORKBENCH/ARCHITECTURE/WorkbenchView.md)
- [LayoutDescriptor](/documentation/WORKBENCH/ARCHITECTURE/LayoutDescriptor.md) décrit la structure physique d'un Workbench.
- [PanelBase](/documentation/WORKBENCH/ARCHITECTURE/PanelBase.md)
  - [contrat ](/documentation/WORKBENCH/ARCHITECTURE/PanelBase.md#contrat)
- [Données](/documentation/WORKBENCH/ARCHITECTURE/DATA_CONTRACT.md)
  - [PropertySet](/documentation/WORKBENCH/ARCHITECTURE/PropertySet.md)
- [Form](/documentation/WORKBENCH/ARCHITECTURE/Form.md)

---

a détailler usage : 
- [DialogManager](/documentation/WORKBENCH/ARCHITECTURE/DialogManager.md)
- [domhelper](/documentation/WORKBENCH/ARCHITECTURE/domhelper.md)
- [Formatters](/documentation/WORKBENCH/ARCHITECTURE/Formatters.md) - /assets/js/ui/shared/format.js
- [RelationPickerDialog](/documentation/WORKBENCH/ARCHITECTURE/RelationPickerDialog.md) - vide
- [TabSystem](/documentation/WORKBENCH/ARCHITECTURE/TabSystem.md)
- [toolbar.template](/documentation/WORKBENCH/ARCHITECTURE/toolbar.template.md) utilisé dans les panels
- [Validation-rules](/documentation/WORKBENCH/ARCHITECTURE/Validation-rules.md)
- [Validation-validator](/documentation/WORKBENCH/ARCHITECTURE/Validation-validator.md)

## Les workbench
- [MotWorkbench](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/MotWorkbench.md)
- [ImageWorkbench](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ImageWorkbench.md)
- [AdresseWorkbench](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/AdresseWorkbench.md)
- [OrganisationWorkbench](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/OrganisationWorkbench.md)
- [ImageTaggerWorkbench](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ImageTaggerWorkbench.md)


# Synthèse comparative — Workbenches

|Critère|Mot|Image|Adresse|Organisation|ImageTagger|
|---|---|---|---|---|---|
|Zones|2|3|3|2|3|
|Pagination|bus|?|bus|**callback**|bus|
|Dialogs|—|—|doc≠code|**oui**|— (autocomplete)|
|TabSystem|—|—|—|**oui**|—|
|Optimiste|—|—|—|—|**oui**|
|Relation|—|—|1-N (doc)|1-N|**N-N**|
|Alignement CONTRACT|Moyen|Moyen|Moyen|**Élevé**|Moyen-élevé|
|Qualité doc .md|Faible|Moyenne|**Élevée**|Élevée|Moyenne|


## Dettes techniques

| Dette                             | Détail                                                                                     | Priorité                           |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| **Hors refactoring**              | Auth uniquement dans old/ ; les Workbenches banc de test tournent sans couche auth unifiée | **Haute**                          |
| **Double mode Session + Token**   | Complexité Shield (login sans session, me hybride, logout double)                          | Moyenne (fonctionne, mais fragile) |
| **Token en sessionStorage**       | XSS-sensible ; pas de HttpOnly cookie pour le PAT                                          | Haute (sécurité)                   |
| **Bus-everything**                | Pattern explicitement abandonné dans WORKBENCH_CONTRACT pour le métier                     | Conceptuelle                       |
| **Pas de filtre route documenté** | Protection des /workbench/* et /api/* non visible dans l’audit front                       | Haute (à vérifier côté CI Filters) |
| **Register désactivé**            | Pas de self-service                                                                        | Basse                              |
| **CSS inline dans le renderer**   | Style injecté au runtime                                                                   | Basse                              |
| **main.js old**                   | N’initialise pas explicitement auth dans le snippet lu (init ailleurs / layout PHP)        | Moyenne (point d’entrée flou)      |
| **RBAC front only**               | can() / isAdmin() côté client — la vraie autorité doit rester serveur                      | À rappeler                         |
## 1. Cartographie des dettes par priorité

### P0 — Bloquant pour la consolidation documentaire / cohérence runtime

|#|Dette|Bloc|Nature|
|---|---|---|---|
|**D01**|RelationPickerDialog.md vide alors que le code et les Workbenches l’utilisent massivement|2|Doc|
|**D02**|Pagination forcée au bus (domhelper.pagination) — seul Organisation a basculé vers onPage(fn)|1, 2, 3|Technique + contrat|
|**D03**|Écart doc/code **AdresseWorkbench** : dialogs relation décrits, absents du source actuel|3|Doc/code|
|**D04**|PropertySet.md = exemples uniquement, pas de contrat formel des types|1|Doc|
|**D05**|Relations N-N + pattern include / attach-detach absents de DATA_CONTRACT|1, 3|Doc|

### P1 — Structurant (architecture / onboarding / dette active)

|#|Dette|Bloc|Nature|
|---|---|---|---|
|**D06**|WorkbenchBase.md trop minimal vs code commenté|1|Doc|
|**D07**|Double WorkbenchBase (core/ vs racine workbench/)|4|Technique|
|**D08**|CmsArticleWorkbench nommé dans un commentaire, inexistant|4|Clarification produit|
|**D09**|Auth uniquement dans old/, aucun pont avec Workbenches refactoring/|5|Architecture|
|**D10**|TabSystem doc = notes d’itération, pas d’architecture|2|Doc|
|**D11**|Pattern optimiste (ImageTagger) non formalisé dans le CONTRACT|3|Doc|
|**D12**|Signature onSave hétérogène (Mot: id, lbl vs autres: id, data)|3|Contrat runtime|
|**D13**|Token auth en sessionStorage (XSS) + dual Session/Token Shield|5|Sécurité|

### P2 — Amélioration / hygiène

|#|Dette|Bloc|Nature|
|---|---|---|---|
|**D14**|Resélection / highlight après load() (Adresse, probablement d’autres)|3|UX|
|**D15**|result.data conditionnel après save → UI stale (map, preview)|3|UX/API|
|**D16**|Naming _createPanels vs createPanels|3|Style|
|**D17**|console.log debug dans TabSystem|2|Hygiène|
|**D18**|Form.js vs validator.js pas pleinement unifiés (relation/file)|2|Technique|
|**D19**|Formatters non centralisés|2|Différé (politique OK)|
|**D20**|ComponentCatalogWorkbench hors CONTRACT (layout manuel, ancien Base)|4|Migration|
|**D21**|Deux modes sélection relation (RelationPicker vs autocomplete inline) sans guideline|3|Doc|
|**D22**|Doc CMS isolée de WORKBENCH|4|Arborescence|
|**D23**|Protection routes /workbench/* / /api/* non cartographiée|5|Sécurité|

---

## 2. Synthèse par thème

text

```
DOCUMENTATION          TECHNIQUE              PRODUIT / SÉCURITÉ
─────────────────      ─────────────────      ─────────────────
D01 RelationPicker     D02 Pagination bus     D08 CmsArticle ?
D03 Adresse doc≠code   D07 Double Base        D09 Auth isolée
D04 PropertySet        D12 onSave             D13 Token storage
D05 DATA_CONTRACT N-N  D18 Form/validator     D23 Routes protégées
D06 WorkbenchBase.md   D16 Naming
D10 TabSystem.md       D17 console.log
D11 Pattern optimiste  D20 Catalog legacy
D21 Guideline select
D22 CMS ↔ WORKBENCH
```

---

## Travaux

### D01 - RelationPickerDialog
- [RelationPickerDialog](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ARCHITECTURE/RelationPickerDialog.md)
- [RelationPickerDialog / Contrat fetchFn](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ARCHITECTURE/RelationPickerDialog-Contrat-fetchFn.md)

### D02 Pagination bus
- voir [domhelper](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/core/domhelper.js#L338)
- utiliser onPage(fn)
- Revoir les notes :
  - [`2026-08-09 / todo`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/project/daily/2026-08-09.md#todo)
  - [`WORKBENCH_CONTRACT / limitation-actuelle--pagination`](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ARCHITECTURE/WORKBENCH_CONTRACT.md#5-limitation-actuelle--pagination)


### D09 - Auth isolée
[authentification](https://github.com/arbph-dev/codeIgniter-appCms/blob/main/documentation/WORKBENCH/ARCHITECTURE/authentification.md)
