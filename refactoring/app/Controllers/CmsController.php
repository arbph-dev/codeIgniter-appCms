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

    /**
     * Visualisation UN ET UN SEUL Article
     * /cms/article/test-art
     *
     * Iter006.2.1
     *
     * Données transmises au JS (CmsArticleWorkbench) :
     *
     *   $article = [
     *       'id'           => 5,
     *       'title'        => '...',
     *       'slug'         => 'test-art',
     *       'description'  => '...',
     *       'published_at' => '...',
     *       'sections'     => [                    ← ajouté ici
     *           ['id'=>1, 'title'=>'Intro',  'position'=>1, 'slug'=>'intro',  ...],
     *           ['id'=>2, 'title'=>'Dev',    'position'=>2, 'slug'=>'dev',    ...],
     *           ['id'=>3, 'title'=>'Conclu', 'position'=>3, 'slug'=>'conclu', ...],
     *       ]
     *   ]
     *
     *   $content = HTML complet (toutes sections) — fallback mode plat
     *
     * ─────────────────────────────────────────────────────────────────────
     * ⚠ Points de vigilance (Iter006.2.1)
     *
     * [1] section.php — id HTML basé sur le slug de la section.
     *     Si deux sections d'articles différents ont le même slug,
     *     il y a collision d'id HTML dans la même page.
     *     → unicité des slugs à garantir en base ou au niveau du seed.
     *
     * [2] Triple lecture DB en mode tabs :
     *     lecture 1 : getPublishedArticle()       → article row
     *     lecture 2 : getSectionsByArticle()      → sections[]
     *     lecture 3 : renderArticle() / getFullArticle() → article + sections + parts
     *     $content n'est pas affiché si sections.length > 1 (mode tabs).
     *     Optimisation future : court-circuiter renderArticle() selon le mode.
     *     Prématuré ici — le fallback mode plat justifie les 3 lectures.
     *
     * [3] initRegisteredComponents() après fetchSection() scanne tout document.
     *     Risque de double-init des composants déjà rendus dans les panes précédents.
     *     → Résolution : initXxx(root = document) avec ciblage du pane — Iter007.
     * ─────────────────────────────────────────────────────────────────────
     */
    public function article(string $slug)
    {
        $article = $this->cms->getPublishedArticle($slug);

        if (!$article)
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        // getSectionsByArticle() : sections publiées, triées par position.
        // Pas de guard if(empty()) — on assigne toujours.
        // Article sans sections → [] → JS bascule automatiquement en mode plat.
        $article['sections'] = $this->cms->getSectionsByArticle($article['id']);

        return view(
            'cms/article2',
            [
                'article' => $article,
                'content' => $this->cms->renderArticle($slug)
            ]
        );
    }

    /**
     * /cms/section/999
     *
     * Fragment HTML retourné par renderSection() (view cms/section).
     * Consommé par CmsArticleWorkbench.fetchSection() via fetch() côté JS.
     */
    public function section(int $id)
    {
        return $this->cms->renderSection($id);
    }

    /**
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
