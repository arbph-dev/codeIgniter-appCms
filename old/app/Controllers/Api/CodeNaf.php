<?php
// app/Controllers/Api/CodeNaf.php
// Ajout : like() pour autocomplete dans le formulaire Entreprise
// Nouvelle route à ajouter AVANT (:segment) :
//   $routes->get('codesnaf/like', 'CodeNaf::like');

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class CodeNaf extends ResourceController
{
    protected $modelName = 'App\Models\CodeNafModel';
    protected $format    = 'json';

    // GET /api/codesnaf?q=industrie&page=1
    public function index()
    {
        $q       = $this->request->getGet('q');
        $code    = $this->request->getGet('code');
        $perPage = (int) ($this->request->getGet('perPage') ?? 20);

        if ($code) {
            return $this->show($code);
        }

        if ($q) {
            $data = $this->model->like('nom', $q)->paginate($perPage);
            return $this->respond([
                'data'  => $data,
                'pager' => $this->model->pager->getDetails()
            ]);
        }

        $data = $this->model->paginate($perPage);
        return $this->respond([
            'data'  => $data,
            'pager' => $this->model->pager->getDetails()
        ]);
    }

    // GET /api/codesnaf/:code
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) return $this->failNotFound("Code NAF introuvable");
        return $this->respond($item);
    }

    // GET /api/codesnaf/like?q=assur&len=10
    // Autocomplete léger — codenaf + nom uniquement
    public function like()
    {
        $q   = trim($this->request->getGet('q') ?? '');
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) {
            return $this->respond(['data' => []]);
        }

        $data = $this->model
            ->select('codenaf, nom')
            ->groupStart()
                ->like('nom',     $q)
                ->orLike('codenaf', $q, 'after')
            ->groupEnd()
            ->orderBy('codenaf', 'ASC')
            ->limit($len)
            ->findAll();

        return $this->respond(['data' => $data]);
    }

    // GET /api/codesnaf/:code/children
    public function children($code)
    {
        $children = $this->model->where('parentcode', $code)->findAll();
        return $this->respond($children);
    }

    // GET /api/codesnaf/:code/hierarchy
    public function hierarchy($code)
    {
        return $this->respond($this->model->getHierarchie($code));
    }

    // GET /api/codesnaf/tree
    public function tree()
    {
        $all     = $this->model->findAll();
        $indexed = [];
        foreach ($all as $item) {
            $item['children'] = [];
            $indexed[$item['codenaf']] = $item;
        }
        $tree = [];
        foreach ($indexed as $code => &$node) {
            if ($node['parentcode'] && isset($indexed[$node['parentcode']])) {
                $indexed[$node['parentcode']]['children'][] = &$node;
            } else {
                $tree[] = &$node;
            }
        }
        return $this->respond($tree);
    }
}
