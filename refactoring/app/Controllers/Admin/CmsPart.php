<?php
// app/Controllers/Admin/CmsPart.php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Services\CmsService;

class CmsPart extends BaseController
{
    protected CmsService $cms;

    public function __construct()
    {
        $this->cms = new CmsService();
    }

    /**
     * Liste des Parts
     */
    public function index()
    {
        return view( 'admin/cmspart/index', [ 'parts' => $this->cms->getAllParts() ] );
    }

    /**
     * Edition d'une Part
     */
    public function edit(int $id)
    {
        $part = $this->cms->getPart($id);

        if (!$part)
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        return view(
            'admin/cmspart/edit',
            [
                'part'   => $part,
                'editor' => $this->cms->renderPartEditor($part)
            ]
        );
    }

    /**
     * Sauvegarde
     */
    public function update(int $id)
    {
        //$this->cms->updatePart( $id , $this->request->getPost() );
        if (! $this->cms->updatePart( $id, $this->request->getPost() ) )
        {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
        return redirect()->to( "/admin/cmspart/edit/{$id}" );
        // return redirect()->to('/admin/cmstree');
    }

    /**
     * Nouvelle Part
     */
    public function create(int $sectionId)
    {
        return view(
            'admin/cmspart/edit',
            [
                'part' => $this->cms->newPart($sectionId),
                'componentTypes' => $this->cms->getComponentTypes(),
                'sections' => $this->cms->getAllSections()
            ]
        );
    }

    /**
     * Insertion
     */
    public function insert()
    {
        $this->cms->insertPart(
            $this->request->getPost()
        );

        return redirect()->to('/admin/cmstree');
    }

    /**
     * Suppression
     */
    public function delete(int $id)
    {
        $this->cms->deletePart($id);

        return redirect()->to('/admin/cmstree');
    }

    /**
     * Déplacement vers le haut
     */
    public function up(int $id)
    {
        $this->cms->movePartUp($id);
        return redirect()->to('/admin/cmstree');
    }

    /**
     * Déplacement vers le bas
     */
    public function down(int $id)
    {
        $this->cms->movePartDown($id);
        return redirect()->to('/admin/cmstree');
    }
}
