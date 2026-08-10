# 02-FEATURES


# liste des Workbench
( par ordre d'implémentation)

- [MotWorkbench](/documentation/WORKBENCH/MotWorkbench.md)
- [ImageWorkbench](/documentation/WORKBENCH/ImageWorkbench.md)
- [AdresseWorkbench](/documentation/WORKBENCH/AdresseWorkbench.md)

---


## définitions

- Workbench = orchestrateur  
- WorkbenchView = layout + montage uniquement  
- Panels = UI + callbacks onXxx  
- Services = API




|Workbench|Rôle actuel|Ce qu'il apporte|Ce qu'il faut en faire|
|---|---|---|---|
|`/admin/modelworkbench`|Prototype Three.js|Viewer, scènes, ressources 3D|Conserver comme laboratoire du moteur 3D|
|`/cms/article/test-art`|CmsArticleWorkbench|Intégration CMS complète, composants, édition|À démanteler progressivement pour extraire les briques communes|
|`/workbench/mot`| Runtime|CRUD, pagination, recherche, Panels|Conserver comme Workbench de référence|
|`/workbench/component-catalog`|Référence Builder|Catalogue des composants, descripteurs|Faire évoluer vers l'atelier de conception des composants|
|`workbench/image`| Runtime | Galerie d'image|Faire évoluer vers ImageTaggerWorkbench|
|`workbench/adresse`| Référence Runtime | Carnet d'adresse|Faire évoluer vers un widget AdressePickerDialog|

cette répartition correspond à 2 familles.

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




