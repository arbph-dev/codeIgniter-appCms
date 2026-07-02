<?php
//app/Services/CmsService.php

namespace App\Services;

use App\Models\CmsCategoryModel;
use App\Models\CmsArticleModel;
use App\Models\CmsSectionModel;
use App\Models\CmsPartModel;

use App\Libraries\Components\DescriptorMapper;
use App\Libraries\Components\ComponentRenderer;
use App\Libraries\Components\AdminComponentRenderer;


class CmsService
{
    protected CmsCategoryModel $categories;
    protected CmsArticleModel $articles;
    protected CmsSectionModel $sections;
    protected CmsPartModel $parts;

    protected DescriptorMapper $mapper;
    protected ComponentRenderer $renderer;
    protected AdminComponentRenderer $adminRenderer;

    public function __construct()
    {
        $this->categories = new CmsCategoryModel();
        $this->articles   = new CmsArticleModel();
        $this->sections   = new CmsSectionModel();
        $this->parts      = new CmsPartModel();

        $this->mapper     = new DescriptorMapper();
        $this->renderer   = new ComponentRenderer();
        $this->adminRenderer = new AdminComponentRenderer();
    }

    // ----------------------------------------------------
    // CATEGORIES
    // ----------------------------------------------------

    public function getCategory(string $slug): ?array
    {
        return $this->categories
            ->where('slug', $slug)
            ->first();
    }
    // --- CATEGORY TREE
    public function getFullCategory(string $slug): array
    {
        $category = $this->getCategory($slug);

        if (!$category) { return []; }

        $category['articles'] = $this->getArticlesByCategory( $category['id'] );

        return $category;
    }
    // ----------------------------------------------------
    // ARTICLES
    // ----------------------------------------------------

    public function getArticle(string $slug): ?array
    {
        return $this->articles
            ->where('slug', $slug)
            ->first();
    }

    // ----------------------------------------------------
    // SECTIONS
    // ----------------------------------------------------

    public function getSection(string $slug): ?array
    {
        return $this->sections
            ->where('slug', $slug)
            ->first();
    }

    // ----------------------------------------------------
    // PARTS
    // ----------------------------------------------------

    public function getParts(int $sectionId): array
    {
        return $this->parts
            ->where('section_id', $sectionId)
            ->where('is_published', 1)
            ->orderBy('position')
            ->findAll();
    }
    
    
    public function getAllParts(): array
    {
        return $this->parts
            ->orderBy('section_id')
            ->orderBy('position')
            ->findAll();
    }
    // ----------------------------------------------------
    // DESCRIPTORS
    // ----------------------------------------------------

    public function loadDescriptors(int $sectionId): array
    {
        $descriptors = [];

        foreach ($this->getParts($sectionId) as $part)
        {
            $descriptors[] = $this->mapper->map($part);
        }

        return $descriptors;
    }

    // ----------------------------------------------------
    // RENDER
    // ----------------------------------------------------
    public function renderPart(array $part): string
    {
        $descriptor = $this->mapper->map($part);
        $content = $this->renderer->render( $descriptor );
    
        return view( 'cms/part', [ 'part'    => $part, 'content' => $content ] );
    }
    
    public function renderPartEditor(array $part): string
    {
        $descriptor = $this->mapper->map($part);
        return $this->adminRenderer->render($descriptor);
    }


    // ----------------------------------------------------
    protected function enrichPart(array $part): array
    {
        static $types = null;

        // Chargement du catalogue une seule fois
        if ($types === null)
        {
            $types = [];

            foreach ((new \App\Models\ComponentTypeModel())->findAll() as $type)
            {
                $types[$type['id']] = $type;
            }
        }

        $type = $types[$part['type_id']] ?? null;

        if (!$type)
        {
            $part['type_name']  = 'unknown';
            $part['type_label'] = 'Inconnu';
            $part['type_icon']  = '❓';
            $part['type_class'] = 'unknown';

            return $part;
        }

        $part['type_name']  = $type['name'];

        switch ($type['name'])
        {
            case 'raw':
                $part['type_label'] = 'Texte';
                $part['type_icon']  = '📝';
                break;

            case 'codeval':
                $part['type_label'] = 'CodeVal';
                $part['type_icon']  = '💻';
                break;

            case 'apex':
                $part['type_label'] = 'Apex';
                $part['type_icon']  = '📈';
                break;

            case 'mermaid':
                $part['type_label'] = 'Mermaid';
                $part['type_icon']  = '🧭';
                break;

            default:
                $part['type_label'] = ucfirst($type['name']);
                $part['type_icon']  = '🧩';
        }

        $part['type_class'] = 'component-' . $type['name'];

        return $part;
    }

    // ----------------------------------------------------
    // CRUD PART
    // ----------------------------------------------------

    public function getPart(int $id): ?array
    {
        return $this->parts->find($id);
    }

    public function createPart(array $data): int
    {
        return (int) $this->parts->insert($data);
    }

    public function updatePart(int $id, array $data): bool
    {
        $part = $this->parts->find($id);

        if (!$part) { return false; }

        $config = $data['config'] ?? [];

        return $this->parts->update(
            $id,
            [
                'title'  => $data['title']  ?? '',
                'aside'  => $data['aside']  ?? '',
                'config' => json_encode(
                    $config,
                    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
                )
            ]
        );
    }

    public function deletePart(int $id): bool
    {
        return $this->parts->delete($id);
    }
    // ----------------------------------------------------
    // PARTS - SWAP POSITION 
    // ----------------------------------------------------
    // Gestion de la position
    // Les déplacements sont réalisés par permutation des
    // valeurs "position" entre deux Parts appartenant à la
    // même section.
    // ----------------------------------------------------
    private function swapPosition(array $a, array $b): void
    {
        $db = $this->parts->db;
        $db->transStart();
        // Libère la position de destination
        $this->parts->update( $b['id'], [ 'position' => 0 ] );
        // Déplace A
        $this->parts->update( $a['id'], [ 'position' => $b['position'] ] );
        // Déplace B
        $this->parts->update( $b['id'], [ 'position' => $a['position'] ] );
        $db->transComplete();

        if (! $db->transStatus())
        {
            throw new \RuntimeException( 'Erreur lors de l\'échange des positions.' );
        }
    }

    public function movePartUp(int $id): void
    {
        $part = $this->parts->find($id);

        if (!$part)
        {
            return;
        }

        $previous = $this->parts
            ->where('section_id', $part['section_id'])
            ->where('position <', $part['position'])
            ->orderBy('position', 'DESC')
            ->first();

        if ($previous)
        {
            $this->swapPosition($part, $previous);
        }
    }

    public function movePartDown(int $id): void
    {
        $part = $this->parts->find($id);

        if (!$part)
        {
            return;
        }

        $next = $this->parts
            ->where('section_id', $part['section_id'])
            ->where('position >', $part['position'])
            ->orderBy('position', 'ASC')
            ->first();

        if ($next)
        {
            $this->swapPosition($part, $next);
        }
    }
    // ----------------------------------------------------
    // CATALOGUES
    // ----------------------------------------------------

    public function getComponentTypes(): array
    {
        return (new \App\Models\ComponentTypeModel())
            ->orderBy('id')
            ->findAll();
    }

    public function getAllSections(): array
    {
        return $this->sections
            ->orderBy('article_id')
            ->orderBy('position')
            ->findAll();
    }

    // ----------------------------------------------------
    // NEW PART
    // ----------------------------------------------------

    public function newPart(int $sectionId): array
    {
        $position = $this->parts
            ->where('section_id', $sectionId)
            ->selectMax('position')
            ->first();

        return [
            'id'            => 0,
            'section_id'    => $sectionId,
            'type_id'       => 1,
            'title'         => '',
            'aside'         => '',
            'config'        => '{}',
            'position'      => ((int)($position['position'] ?? 0)) + 1,
            'is_published'  => 1
        ];
    }

    // ----------------------------------------------------
    // INSERT
    // ----------------------------------------------------

    public function insertPart(array $data): int
    {
        return (int)$this->parts->insert($data);
    }


    // ----------------------------------------------------
    // RENDER renderSection
    // ----------------------------------------------------

    public function renderSection(int $sectionId): string
    {
        $section = $this->sections->find($sectionId);

        if (!$section)
        {
            return '';
        }

        $html = '';

        /*
        foreach ($this->loadDescriptors($sectionId) as $descriptor)
        {
            $html .= $this->renderer->render($descriptor);
        }
        */
        foreach ($this->getPartsBySection($sectionId) as $part)
        {
            $html .= $this->renderPart($part);
        }

        return view(
            'cms/section',
            [
                'section' => $section,
                'content' => $html
            ]
        );
    }

    public function renderSectionBySlug(string $slug): string
    {
        $section = $this->getSection($slug);

        if (!$section)
        {
            return '';
        }

        return $this->renderSection($section['id']);
    }


    public function renderArticle(string $slug): string
    {
        $article = $this->getFullArticle($slug);// contient sections + parts

        $html = '';

        foreach ($article['sections'] as $section)
        {
            $html .= $this->renderSection(
                $section['id']
            );
        }

        return $html;
    }

    //-- renderCategory
    public function renderCategory(string $slug): string
    {
        $category = $this->getFullCategory($slug);

        if (!$category)
        {
            return '';
        }

        return view(
            'cms/category',
            [
                'category' => $category
            ]
        );
    }    
    // ----------------------------------------------------  
    // RELATIONS  
    // ----------------------------------------------------  
    
    public function getArticlesByCategory(int $categoryId): array  
    {  
        return $this->articles  
        ->where('cat_id', $categoryId)  
        ->where('is_published', 1)  
        ->findAll();  
    }  
  
  
    public function getSectionsByArticle(int $articleId): array  
    {  
        return $this->sections  
        ->where('article_id', $articleId)  
        ->where('is_published', 1)  
        ->orderBy('position', 'ASC')  
        ->findAll();  
    }  
  
  
    public function getPartsBySection(int $sectionId): array  
    {  
        return $this->parts  
        ->where('section_id', $sectionId)  
        ->where('is_published', 1)  
        ->orderBy('position', 'ASC')  
        ->findAll();  
    }

    // ----------------------------------------------------  
    // SLUG  
    // ----------------------------------------------------  

    public function getPublishedArticle(string $slug): ?array  
    {  
        return $this->articles  
        ->where('slug', $slug) 
        ->where('is_published', 1)  
        ->first();  
    }  
    
    
    public function getPublishedSection(string $slug): ?array  
    {  
        return $this->sections  
        ->where('slug', $slug)  
        ->where('is_published', 1)  
        ->first();  
    }
    // ----------------------------------------------------  
    public function getArticleTree(string $slug): array
    {
        $article = $this->getArticle($slug);

        if (!$article) { return []; }

        $article['sections'] = $this->getSectionsByArticle($article['id']);
        return $article;
    }

    // ----------------------------------------------------  
    public function getFullArticle(string $slug): array
    {
        $article = $this->getArticle($slug);

        if (!$article)
        {
            return [];
        }

        $sections = $this->getSectionsByArticle(
            $article['id']
        );

        foreach ($sections as &$section)
        {
            $section['parts'] =
                $this->getPartsBySection(
                    $section['id']
                );
        }

        $article['sections'] = $sections;

        return $article;
    }
    // ----------------------------------------------------  


    protected function adminLinks(array &$node): void
    {
        switch ($node['_type'])
        {
            case 'category':

                $node['_admin'] = [
                    'edit' => '/admin/cmscategory/edit/'.$node['id']
                ];

                break;

            case 'article':

                $node['_admin'] = [
                    'edit' => '/admin/cmsarticle/edit/'.$node['id']
                ];

                break;

            case 'section':

                $node['_admin'] = [
                    'edit' => '/admin/cmssection/edit/'.$node['id']
                ];

                break;

            case 'part':

                $node['_admin'] = [
                    'edit' => '/admin/cmspart/edit/'.$node['id'],
                    'delete' => '/admin/cmspart/delete/'.$node['id'],
                    'up' => '/admin/cmspart/up/'.$node['id'],
                    'down' => '/admin/cmspart/down/'.$node['id']

                ];

                break;
        }
    }


    public function getCmsTree(): array
    {
        $tree = [];

        $categories = $this->categories
            ->orderBy('position', 'ASC')
            ->findAll();

        foreach ($categories as $category)
        {
            $category['_type']     = 'category';
            $category['node_icon'] = '📁';
            $category['node_title'] = $category['title'];

            $this->adminLinks($category);

            $category['children'] = [];

            foreach ($this->getArticlesByCategory($category['id']) as $article)
            {
                $article['_type']      = 'article';
                $article['node_icon']  = '📄';
                $article['node_title'] = $article['title'];

                $this->adminLinks($article);

                $article['children'] = [];

                foreach ($this->getSectionsByArticle($article['id']) as $section)
                {
                    $section['_type']      = 'section';
                    $section['node_icon']  = '📑';
                    $section['node_title'] = $section['title'];

                    $this->adminLinks($section);

                    $section['children'] = [];

                    foreach ($this->getPartsBySection($section['id']) as $part)
                    {
                        $part = $this->enrichPart($part);

                        $part['_type']      = 'part';
                        $part['node_icon']  = $part['type_icon'];
                        $part['node_title'] = $part['type_label'] . ' — ' . $part['title'];

                        $this->adminLinks($part);

                        $section['children'][] = $part;
                    }

                    $article['children'][] = $section;
                }

                $category['children'][] = $article;
            }

            $tree[] = $category;
        }

        return $tree;
    }


}
