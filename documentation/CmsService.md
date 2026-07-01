Le service CmsService est l'élément central de la gestion du CMS
Il permet de décharger les controleurs tout en centralisant les opérations sur les données

le code source : [app/Services/CmsService.php](/refactoring/app/Services/CmsService.php)

Les méthodes se répartissent selon les élments définis : 
- categories
- articles
- sections
- parts
- composants

## categories
- ‎CmsService.getCategory
- ‎CmsService.getFullCategory
- CmsService.renderCategory
‎
## articles
‎- CmsService.getArticle‎
‎- ‎CmsService.getArticlesByCategory‎
‎- ‎CmsService.getPublishedArticle
‎- ‎CmsService.getArticleTree‎
‎- ‎CmsService.getFullArticle *
‎- ‎CmsService.renderArticle‎

## sections
‎- CmsService.getSection‎
‎- CmsService.getAllSections‎
‎- ‎CmsService.getSectionsByArticle
‎- ‎CmsService.getPublishedSection
‎- CmsService.renderSection‎
‎- ‎CmsService.renderSectionBySlug‎
‎
## parts
‎- CmsService.getPart
‎- CmsService.getParts‎
‎- CmsService.getAllParts‎
‎- ‎CmsService.getPartsBySection
‎- CmsService.renderPart‎
‎- ‎CmsService.renderPartEditor‎
‎- ‎CmsService.enrichPart‎ * 
‎‎- ‎CmsService.newPart
‎- ‎CmsService.insertPart‎
‎- ‎CmsService.createPart
‎‎- CmsService.updatePart
‎‎- CmsService.deletePart‎
‎- ‎CmsService.swapPosition‎
‎- ‎CmsService.movePartUp‎
  -> CmsService.swapPosition‎
‎- ‎CmsService.movePartDown‎
-> CmsService.swapPosition‎
‎
## Composants et utilitaires
- CmsService.loadDescriptors 
‎- ‎CmsService.getComponentTypes
‎- ‎CmsService.adminLinks‎
‎- ‎CmsService.getCmsTree







use App\Models\CmsCategoryModel;
use App\Models\CmsArticleModel;
use App\Models\CmsSectionModel;
use App\Models\CmsPartModel;

use App\Libraries\Components\DescriptorMapper;
use App\Libraries\Components\ComponentRenderer;
use App\Libraries\Components\AdminComponentRenderer;


        // $service  = new \App\Services\CmsService();

    //$service = new CmsService();   // use App\Services\CmsService
  
        // $category = $service->getCategory('test-cat');  
        // print_r( $service->getArticlesByCategory( $category['id'] ) );        
        
        // $article = $service->getArticle('test-art');
        // print_r( $service->getSectionsByArticle( $article['id'] ) );

        // $section = $service->getSection('test-sec');
        // print_r( $service->getPartsBySection( $section['id'] ) );        

        //print_r( $service->getFullArticle('test-art') );

        //return $service->renderArticle('test-art');
