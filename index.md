# Refactor

---
# Liste des fichiers
```
app/
  Controllers/
    Api/
```

## app/Controllers/
```sh
find app/Controllers/ -name "*.php" | sort
```
app/Controllers/BaseController.php

app/Controllers/CmsController.php
app/Controllers/Admin/CmsPart.php
app/Controllers/Admin/CmsTree.php

app/Controllers/Admin/ModelWorkbench.php

app/Controllers/Admin.php
app/Controllers/Cms.php
app/Controllers/User.php


app/Controllers/Home.php
app/Controllers/Informatique.php
app/Controllers/Portal.php

app/Controllers/Dbtest.php
app/Controllers/Sendtestmail.php

app/Controllers/Api/Ping2.php
app/Controllers/Api/Ping.php

app/Controllers/Chimie.php
app/Controllers/Technologies.php


app/Controllers/TestController.php
app/Controllers/TestDescriptor.php



### app/Controllers/Api/
(Regroupés par Domaine)

- app/Controllers/Api/Image.php
- app/Controllers/Api/Mot.php
- app/Controllers/Api/AuthController.php

#### Géographie
- app/Controllers/Api/Adresse.php
- app/Controllers/Api/CodePostal.php
- app/Controllers/Api/TypeVoie.php

#### Economie
- app/Controllers/Api/CodeNaf.php
- app/Controllers/Api/Comptespcg.php
- app/Controllers/Api/FormeJuridique.php

#### Entitées
- app/Controllers/Api/Organisation.php
- app/Controllers/Api/Entreprise.php

---

## app/Models/
```sh
find app/Models/ -name "*.php" | sort
```

app/Models/AdresseModel.php
app/Models/CmsArticleModel.php
app/Models/CmsCategoryModel.php
app/Models/CmsPartModel.php
app/Models/CmsSectionModel.php
app/Models/CodeNafModel.php
app/Models/CodePostalModel.php
app/Models/ComponentTypeModel.php
app/Models/ComptespcgModel.php
app/Models/EntrepriseModel.php
app/Models/FormeJuridiqueModel.php
app/Models/ImageModel.php
app/Models/MotModel.php
app/Models/OrganisationModel.php
app/Models/TypeVoieModel.php


## app/Config/
```sh
find app/Config/ -name "*.php" | sort
```
app/Config/App.php
app/Config/AuthGroups.php
app/Config/Auth.php
app/Config/AuthToken.php
app/Config/Autoload.php
app/Config/Boot/development.php
app/Config/Boot/production.php
app/Config/Boot/testing.php
app/Config/Cache.php
app/Config/Constants.php
app/Config/ContentSecurityPolicy.php
app/Config/Cookie.php
app/Config/Cors.php
app/Config/CURLRequest.php
app/Config/Database.php
app/Config/DocTypes.php
app/Config/Email.php
app/Config/Encryption.php
app/Config/Events.php
app/Config/Exceptions.php
app/Config/Feature.php
app/Config/Filters.php
app/Config/ForeignCharacters.php
app/Config/Format.php
app/Config/Generators.php
app/Config/Honeypot.php
app/Config/Hostnames.php
app/Config/Images.php
app/Config/Kint.php
app/Config/Logger.php
app/Config/Migrations.php
app/Config/Mimes.php
app/Config/Modules.php
app/Config/Optimize.php
app/Config/Pager.php
app/Config/Paths.php
app/Config/Publisher.php
app/Config/Routes.php
app/Config/Routing.php
app/Config/Security.php
app/Config/Services.php
app/Config/Session.php
app/Config/Toolbar.php
app/Config/UserAgents.php
app/Config/Validation.php
app/Config/View.php
app/Config/WorkerMode.php


---
## app/Libraries/
```sh
find app/Libraries/ -name "*.php" | sort
```

app/Libraries/Cms/ComponentRegistry.php
app/Libraries/Cms/DescriptorDefinition.php
app/Libraries/Cms/DescriptorFactory.php
app/Libraries/Components/AdminComponentRegistry.php
app/Libraries/Components/AdminComponentRenderer.php
app/Libraries/Components/AdminRenderers/ApexAdminRenderer.php
app/Libraries/Components/AdminRenderers/CalloutAdminRenderer.php
app/Libraries/Components/AdminRenderers/CodeValAdminRenderer.php
app/Libraries/Components/AdminRenderers/LeafletAdminRenderer.php
app/Libraries/Components/AdminRenderers/MermaidAdminRenderer.php
app/Libraries/Components/AdminRenderers/RawAdminRenderer.php
app/Libraries/Components/AdminRenderers/ThreeAdminRenderer.php
app/Libraries/Components/ComponentRegistry.php
app/Libraries/Components/ComponentRenderer.php
app/Libraries/Components/DescriptorDefinition.php
app/Libraries/Components/DescriptorMapper.php
app/Libraries/Components/Renderers/ApexRenderer.php
app/Libraries/Components/Renderers/CalloutRenderer.php
app/Libraries/Components/Renderers/CodeValRenderer.php
app/Libraries/Components/Renderers/ComponentRendererInterface.php
app/Libraries/Components/Renderers/LeafletRenderer.php
app/Libraries/Components/Renderers/MermaidRenderer.php
app/Libraries/Components/Renderers/RawRenderer.php
app/Libraries/Components/Renderers/ThreeRenderer.php

---
## app/Services/
ls -la app/Services/
```sh
find app/Services/ -name "*.php" | sort
```
app/Services/CmsService.php

## app/Traits/
```sh
find app/Traits/ -name "*.php" | sort
```
app/Traits/ApiResponse.php

## app/Views/
```sh
find app/Views/ -name "*.php" | sort
```

app/Views/admin/cmspart/edit.php
app/Views/admin/cmspart/index.php
app/Views/admin/cmstree/index.php
app/Views/admin/cmstree/node.php
app/Views/admin/modelworkbench.php
app/Views/admin/tree.php
app/Views/cms/admin.php
app/Views/cms/article.php
app/Views/cms/category.php
app/Views/cms/components/cp_base.php
app/Views/cms/components/cp_edit.php
app/Views/cms/components/debug_overlay.php
app/Views/cms/components/user_list2.php
app/Views/cms/components/user_list.php
app/Views/cms/index.php
app/Views/cms/libs.php
app/Views/cms/part.php
app/Views/cms/section.php
app/Views/cms/tree.php
app/Views/cms/userboard.php
app/Views/components/apex.php
app/Views/components/codeval.php
app/Views/components/mermaid.php
app/Views/errors/cli/error_404.php
app/Views/errors/cli/error_exception.php
app/Views/errors/cli/production.php
app/Views/errors/html/error_400.php
app/Views/errors/html/error_404.php
app/Views/errors/html/error_exception.php
app/Views/errors/html/production.php
app/Views/home_index.php
app/Views/layouts/cms_bs52.php
app/Views/layouts/cms_css.php
app/Views/layouts/cms.php
app/Views/layouts/cms_w3c.php
app/Views/layouts/footer.php
app/Views/layouts/header.php
app/Views/layouts/layout_main.php
app/Views/layouts/layout_nonav.php
app/Views/layouts/nav.php
app/Views/pages/chimie/corrosions.php
app/Views/pages/chimie/equipements.php
app/Views/pages/chimie_main.php
app/Views/pages/chimie/purges.php
app/Views/pages/chimie/unites.php
app/Views/pages/home.php
app/Views/pages/info_main.php
app/Views/pages/informatique/apex.php
app/Views/pages/informatique/callout.php
app/Views/pages/informatique/carousel.php
app/Views/pages/informatique/codeval.php
app/Views/pages/informatique/devlogs.php
app/Views/pages/informatique/devone.php
app/Views/pages/informatique/formdialog.php
app/Views/pages/informatique/formfeatures.php
app/Views/pages/informatique/forms.php
app/Views/pages/informatique/langages.php
app/Views/pages/informatique/leaflet.php
app/Views/pages/informatique/mermaid.php
app/Views/pages/informatique/threejs.php
app/Views/pages/informatique/xhr.php
app/Views/pages/phpinfo.php
app/Views/pages/portal/contact.php
app/Views/pages/portal.php
app/Views/pages/technologies/acp/index.php
app/Views/pages/technologies/acp/presentation.php
app/Views/pages/technologies/aut/index.php
app/Views/pages/technologies/chf/bois.php
app/Views/pages/technologies/chf/index.php
app/Views/pages/technologies/chf/remeha.php
app/Views/pages/technologies/chf/varblok.php
app/Views/pages/technologies/chf/varmax.php
app/Views/pages/technologies/com/ethernet.php
app/Views/pages/technologies/com/index.php
app/Views/pages/technologies/com/lora.php
app/Views/pages/technologies/com/rs485.php
app/Views/pages/technologies/eau/index.php
app/Views/pages/technologies/ecs/index.php
app/Views/pages/technologies/eln/arduino.php
app/Views/pages/technologies/eln/index.php
app/Views/pages/technologies/eln/interruptions.php
app/Views/pages/technologies/gaz/index.php
app/Views/pages/technologies/hyd/index.php
app/Views/pages/technologies/index.php
app/Views/pages/technologies/sec/index.php
app/Views/pages/technologies/vap/index.php
app/Views/pages/technologies/vap/requalification.php
app/Views/pages/technologies/wrk/index.php
app/Views/pages/template_article.php
app/Views/pages/template_rubrique.php
app/Views/view_base.php
app/Views/welcome_message.php


## public/assets/js/
```sh
find public/assets/js/ -name "*.js" | sort
```
public/assets/js/admin/bootstrap.js
public/assets/js/cms/bootstrap.js
public/assets/js/components/apex.js
public/assets/js/components/callout.js
public/assets/js/components/codeval.js
public/assets/js/components/leaflet.js
public/assets/js/components/mermaid.js
public/assets/js/components/modelworkbench/admin/index.js
public/assets/js/components/modelworkbench/core3js/AxisManager.js
public/assets/js/components/modelworkbench/core3js/GridManager.js
public/assets/js/components/modelworkbench/core3js/LightManager.js
public/assets/js/components/modelworkbench/core3js/SceneManager.js
public/assets/js/components/modelworkbench/data/copie-modelList.js
public/assets/js/components/modelworkbench/data/modelList.js
public/assets/js/components/modelworkbench/GeometryWorkbench.js
public/assets/js/components/modelworkbench/index.js
public/assets/js/components/modelworkbench/io/LoaderFactory.js
public/assets/js/components/modelworkbench/ModelWorkbench.js
public/assets/js/components/modelworkbench/services/AnimationAnalysis.js
public/assets/js/components/modelworkbench/services/GeometryAnalysis.js
public/assets/js/components/modelworkbench/services/HierarchyAnalysis.js
public/assets/js/components/modelworkbench/services/MaterialAnalysis.js
public/assets/js/components/modelworkbench/ui/Inspector.js
public/assets/js/components/modelworkbench/ui/ModelTreeView.js
public/assets/js/components/modelworkbench/ui/StatusBar.js
public/assets/js/components/modelworkbench/ui/Toolbar.js
public/assets/js/components/modelworkbench/ui/TreeView.js
public/assets/js/components/three/index.js
public/assets/js/components/three/resources/CubeResource.js
public/assets/js/core/apiFetch.js
public/assets/js/core/clientinfo.js
public/assets/js/core/ComponentFactory.js
public/assets/js/core/ComponentRegistry.js
public/assets/js/core/domhelper.js
public/assets/js/core/domRefs.js
public/assets/js/core/eventBus.js
public/assets/js/core/ResourceRegistry.js
public/assets/js/core/vox.js
public/assets/js/core/vox.listen.js
public/assets/js/core/vox.renderer.js
public/assets/js/data/articleLoader.js
public/assets/js/data/articleRenderer.js
public/assets/js/features/adresse/adresse.controller.js
public/assets/js/features/adresse/adresse.form.js
public/assets/js/features/adresse/adresse.renderer.js
public/assets/js/features/adresse/adresse.service.js
public/assets/js/features/adresse/adresse.store.js
public/assets/js/features/adresse/index.js
public/assets/js/features/auth/auth.controller.js
public/assets/js/features/auth/auth.renderer.js
public/assets/js/features/auth/auth.service.js
public/assets/js/features/auth/auth.store.js
public/assets/js/features/auth/index.js
public/assets/js/features/codenaf/codenaf.controller.js
public/assets/js/features/codenaf/codenaf.form.js
public/assets/js/features/codenaf/codenaf.renderer.js
public/assets/js/features/codenaf/codenaf.service.js
public/assets/js/features/codenaf/codenaf.store.js
public/assets/js/features/codenaf/index.js
public/assets/js/features/codepostal/codepostal.controller.js
public/assets/js/features/codepostal/codepostal.form.js
public/assets/js/features/codepostal/codepostal.renderer.js
public/assets/js/features/codepostal/codepostal.service.js
public/assets/js/features/codepostal/codepostal.store.js
public/assets/js/features/codepostal/index.js
public/assets/js/features/entreprise/entreprise.controller.js
public/assets/js/features/entreprise/entreprise.form.js
public/assets/js/features/entreprise/entreprise.renderer.js
public/assets/js/features/entreprise/entreprise.service.js
public/assets/js/features/entreprise/entreprise.store.js
public/assets/js/features/entreprise/index.js
public/assets/js/features/formejuridique/formejuridique.controller.js
public/assets/js/features/formejuridique/formejuridique.form.js
public/assets/js/features/formejuridique/formejuridique.renderer.js
public/assets/js/features/formejuridique/formejuridique.service.js
public/assets/js/features/formejuridique/formejuridique.store.js
public/assets/js/features/formejuridique/index.js
public/assets/js/features/image/image.controller.js
public/assets/js/features/image/image.form.js
public/assets/js/features/image/image.renderer copy.js
public/assets/js/features/image/image.renderer.js
public/assets/js/features/image/image.service.js
public/assets/js/features/image/image.store.js
public/assets/js/features/image/index.js
public/assets/js/features/mot/index.js
public/assets/js/features/mot/mot.controller.js
public/assets/js/features/mot/mot.form.js
public/assets/js/features/mot/mot.renderer.js
public/assets/js/features/mot/mot.service.js
public/assets/js/features/mot/mot.store.js
public/assets/js/features/organisation/index.js
public/assets/js/features/organisation/organisation.controller.js
public/assets/js/features/organisation/organisation.form.js
public/assets/js/features/organisation/organisation.renderer.js
public/assets/js/features/organisation/organisation.service.js
public/assets/js/features/organisation/organisation.store.js
public/assets/js/features/pcg/index.js
public/assets/js/features/pcg/pcg.controller.js
public/assets/js/features/pcg/pcg.renderer.js
public/assets/js/features/pcg/pcg.service.js
public/assets/js/features/pcg/pcg.store.js
public/assets/js/features/typevoie/index.js
public/assets/js/features/typevoie/typevoie.controller.js
public/assets/js/features/typevoie/typevoie.form.js
public/assets/js/features/typevoie/typevoie.renderer.js
public/assets/js/features/typevoie/typevoie.service.js
public/assets/js/features/typevoie/typevoie.store.js
public/assets/js/ihm/3js.js
public/assets/js/ihm/3js/terran_generator.js
public/assets/js/ihm/3js/ThreeManager.js
public/assets/js/ihm/3js/ThreeScene.js
public/assets/js/ihm/3js/util.js
public/assets/js/ihm/callout.js
public/assets/js/ihm/carousel/Carousel.js
public/assets/js/ihm/carousel/CarouselManager.js
public/assets/js/ihm/carousel.js
public/assets/js/ihm/codeval.js
public/assets/js/ihm/cp_scene_bg.js
public/assets/js/ihm/dialog.js
public/assets/js/ihm/formsManager.js
public/assets/js/ihm/sidebar.js
public/assets/js/ihm/svg.js
public/assets/js/ihm/tabspage.js
public/assets/js/ihm/tabsPage.js
public/assets/js/ihm/wysedit.js
public/assets/js/libs/physics.js
public/assets/js/main.js
public/assets/js/plugins/apex.js
public/assets/js/plugins/GpPluginLeaflet.js
public/assets/js/plugins/mapleaflet.js
public/assets/js/plugins/mermaid.js
public/assets/js/shared/three/ResourceLoader.js
public/assets/js/shared/three/resources/CubeResource.js
public/assets/js/shared/three/SceneTimer.js
public/assets/js/shared/three/SceneUtils.js
public/assets/js/shared/three/ThreeResourceRegistry.js
public/assets/js/shared/three/Viewer.js
public/assets/js/test_main.js


## public/assets/css/
```sh
find public/assets/css/ -name "*.css" | sort
```
public/assets/css/cms/article.css
public/assets/css/components/callout.css
public/assets/css/components/leaflet.css
public/assets/css/components/threejs.css
public/assets/css/components/workbench.css
public/assets/css/components/wysedit.css
public/assets/css/GpPluginLeaflet.css
public/assets/css/style.css
public/assets/css/test_style.css
public/assets/css/test_themeA.css
public/assets/css/test_themeB.css
