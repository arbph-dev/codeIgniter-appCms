<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Comptespcg extends ResourceController
{
    protected $modelName = 'App\Models\ComptespcgModel';
    protected $format    = 'json';

    /**
     * 📄 Liste des comptes + recherche
     * GET /api/comptespcg?q=banque&classe=5&page=1
     */
    public function index()
    {
        $q       = $this->request->getGet('q');
        $classe  = $this->request->getGet('classe');
        $perPage = (int) ($this->request->getGet('perPage') ?? 50);

        $builder = $this->model;

        // 🔎 Recherche texte
        if ($q) {
            $builder = $builder
                ->groupStart()
                    ->like('nom', $q)
                    ->orLike('numpcg', $q)
                ->groupEnd();
        }

        // 📚 Filtre par classe
        if ($classe) {
            $builder->where('classe', $classe);
        }

        $data = $builder
            ->orderBy('numpcg', 'ASC')
            ->paginate($perPage);

        return $this->respond([
            'data'  => $data,
            'pager' => $this->model->pager->getDetails(),
        ]);
    }

    /**
     * 🔎 Détail d’un compte
     * GET /api/comptespcg/401
     */
    public function show($id = null)
    {
        $item = $this->model->find($id);

        if (!$item) {
            return $this->failNotFound('Compte introuvable');
        }

        return $this->respond($item);
    }

    /**
     * ➕ Création d’un compte
     * POST /api/comptespcg
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respondCreated([
            'message' => 'Compte créé',
            'id'      => $data['numpcg'] ?? null,
        ]);
    }

    /**
     * ✏️ Modification
     * PUT/PATCH /api/comptespcg/401
     */
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond([
            'message' => 'Compte mis à jour',
        ]);
    }

    /**
     * ❌ Suppression
     * DELETE /api/comptespcg/401
     */
    public function delete($id = null)
    {
        $item = $this->model->find($id);

        if (!$item) {
            return $this->failNotFound('Compte introuvable');
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'message' => 'Compte supprimé',
        ]);
    }

    /**
     * 🌿 Enfants directs
     * GET /api/comptespcg/401/children
     */
    public function children($numpcg)
    {
        $children = $this->model
            ->where('parentnum', $numpcg)
            ->orderBy('numpcg', 'ASC')
            ->findAll();

        return $this->respond($children);
    }

    /**
     * 🌳 Hiérarchie vers la racine
     * GET /api/comptespcg/401/hierarchy
     */
    public function hierarchy($numpcg)
    {
        $hierarchy = $this->model->getHierarchy($numpcg);

        return $this->respond($hierarchy);
    }

    /**
     * 🌲 Arbre complet
     * GET /api/comptespcg/tree
     */
    public function tree()
    {
        $all = $this->model
            ->orderBy('numpcg', 'ASC')
            ->findAll();

        $indexed = [];

        foreach ($all as $item) {
            $item['children'] = [];
            $indexed[$item['numpcg']] = $item;
        }

        $tree = [];

        foreach ($indexed as $numpcg => &$node) {

            if (
                $node['parentnum']
                && isset($indexed[$node['parentnum']])
            ) {
                $indexed[$node['parentnum']]['children'][] = &$node;
            } else {
                $tree[] = &$node;
            }
        }

        return $this->respond($tree);
    }
}
