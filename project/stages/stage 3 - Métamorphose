

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
