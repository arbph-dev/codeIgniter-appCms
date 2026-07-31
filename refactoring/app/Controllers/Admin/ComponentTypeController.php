<?php
// app/Controllers/Admin/ComponentTypeController.php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\ComponentTypeModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class ComponentTypeController extends BaseController
{
    protected ComponentTypeModel $model;

    public function __construct()
    {
        $this->model = new ComponentTypeModel();
    }

    /**
     * Liste des types de composants.
     */
    public function index()
    {
        return view(
            'admin/component_types/index',
            [
                'componentTypes' => $this->model
                    ->orderBy('id', 'ASC')
                    ->findAll()
            ]
        );
    }

    /**
     * Création.
     */
    public function create()
    {
        return view(
            'admin/component_types/create',
            [
                'componentType' => [
                    'id'          => null,
                    'name'        => '',
                    'view'        => '',
                    'description' => '',
                    'is_active'   => 1,
                ]
            ]
        );
    }

    /**
     * Insertion.
     */
    public function insert()
    {
        $this->model->insert($this->request->getPost());

        return redirect()->to('/admin/component-types');
    }

    /**
     * Edition.
     */
    public function edit(int $id)
    {
        $componentType = $this->model->find($id);

        if (!$componentType)
        {
            throw PageNotFoundException::forPageNotFound();
        }

        return view(
            'admin/component_types/edit',
            [
                'componentType' => $componentType
            ]
        );
    }

    /**
     * Mise à jour.
     */
    public function update(int $id)
    {
        if (!$this->model->find($id))
        {
            throw PageNotFoundException::forPageNotFound();
        }

        $this->model->update(
            $id,
            $this->request->getPost()
        );

        return redirect()->to("/admin/component-types/edit/{$id}");
    }
}