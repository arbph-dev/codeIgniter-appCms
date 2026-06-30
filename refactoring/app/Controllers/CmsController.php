<?php
// app/Controllers/CmsController.php
namespace App\Controllers;

use App\Services\CmsService;

class CmsController extends BaseController
{
    protected CmsService $cms;

    public function __construct()
    {
        $this->cms = new CmsService();
    }

    /** Visualisation UNE ET UNE SEULE Category
    * path : /cms/category/test-cat
    */
    public function category(string $slug)
    {
        $category = $this->cms->getFullCategory($slug);

        if (!$category)
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        return view( 'cms/category', [ 'category' => $category ] );
    }

    /** Visualisation UN ET UN SEUL Article
    * parametre string $slug
     * /cms/article/test-art
     */
    public function article(string $slug)
    {
        //return $this->cms->renderArticle($slug);
        $article = $this->cms->getArticle($slug);

        if (!$article)
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        return view(
            'cms/article',
            [
                'article' => $article,
                'content' => $this->cms->renderArticle($slug)
            ]
        );
    
    }

    /**
     * /cms/section/999
     */
    public function section(int $id)
    {
        return $this->cms->renderSection($id);
    }


    /**  Visualisation UNE ET UNE SEULE Part
    * /cms/part/123
    */
    public function part(int $id)
    {
        $part = $this->cms->getPart($id);

        if (!$part)
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        return $this->cms->renderPart($part);
    }


}
