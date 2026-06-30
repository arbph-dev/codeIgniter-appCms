<?php

namespace App\Controllers;

use App\Libraries\Components\ComponentRenderer;
use App\Libraries\Components\DescriptorDefinition;
use App\Models\CmsPartModel;
use App\Models\ComponentTypeModel;
use App\Services\CmsService;



class TestController extends BaseController
{
    /* ---------------------------------------------------------- */
    public function components()
    {
        $partsModel = new CmsPartModel();
        $renderer   = new ComponentRenderer();

        $parts = $partsModel->findBySection(999);

        $html = '';

        foreach ($parts as $part)
        {
            $descriptor = $this->partToDescriptor($part);

            $html .= $renderer->render($descriptor);
        }

        return $html;
    }

    /* ---------------------------------------------------------- */
    public function hierarchy()
    {
        $catModel     = new \App\Models\CmsCategoryModel();
        $articleModel = new \App\Models\CmsArticleModel();
        $sectionModel = new \App\Models\CmsSectionModel();

        echo '<pre>';

        $cat = $catModel->find(999);

        print_r($cat);

        $articles = $articleModel->findByCategory(999);

        print_r($articles);

        $sections = $sectionModel->findByArticle(999);

        print_r($sections);

        echo '</pre>';
    }
    /* ---------------------------------------------------------- */
    private function partToDescriptor(array $part): DescriptorDefinition
    {
        $types = [
            1 => 'raw',
            2 => 'codeval',
            3 => 'apex',
            4 => 'mermaid'
        ];

        $config = [];

        if (!empty($part['config']))
        {
            $config = json_decode(
                $part['config'],
                true
            );
        }

        if ($types[$part['type_id']] === 'raw')
        {
            $config['content'] = $part['content'];
        }

        return DescriptorDefinition::fromArray([
            'type'   => $types[$part['type_id']],
            'config' => $config
        ]);
    }

    /* ---------------------------------------------------------- */
    public function service()
    {
        $service = new \App\Services\CmsService();

        echo '<pre>';

        print_r(
            $service->loadSection(999)
        );

        echo '</pre>';
    }

    /* ---------------------------------------------------------- */
    public function descriptors()
    {
        $cms = new \App\Services\CmsService();

        echo '<pre>';

        print_r(
            $cms->loadDescriptors(999)
        );

        echo '</pre>';
    }
    /* ---------------------------------------------------------- */
    public function cms()
    {
        
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
        
        $model = new ComponentTypeModel();
        print_r( $model->getTypeMap() );


    }

}