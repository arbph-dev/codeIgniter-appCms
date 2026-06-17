<?php 
// app/Controllers/Api/Mot.php  — version standardisée avec ApiResponse
//
// Avant  : return $this->response->setJSON([...])  — structure variable
// Après  : return $this->apiOk($data, $this->model->pager)  — structure uniforme
//
// Réponse uniforme :
// { "status": 200, "message": "OK", "data": [...], "pager": { ... } }

namespace App\Controllers\Api;

use App\Models\MotModel;
use App\Traits\ApiResponse; // ajout
use CodeIgniter\RESTful\ResourceController; // ajout

class Mot extends ResourceController
{
    use ApiResponse;

    protected $modelName = MotModel::class;
    protected $format    = 'json';

    // GET /api/mot?q=alter&page=1&per_page=10
    // GET /api/mot?id=42
    public function index()
    {
        $id      = $this->request->getGet('id');
        $q       = $this->request->getGet('q');
        $page    = (int) ($this->request->getGet('page')     ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 10);

        if ($id) {
            $item = $this->model->find((int) $id);
            return $item
                ? $this->apiOk($item)
                : $this->apiNotFound("Mot #$id introuvable.");
        }

        if ($q) {
            $data = $this->model
                ->like('mot_lbl', $q)
                ->paginate($perPage, 'default', $page);

            return $this->apiOk($data, $this->model->pager);
        }

        $data = $this->model->paginate($perPage, 'default', $page);
        return $this->apiOk($data, $this->model->pager);
    }

    // POST /api/mot
    public function create()
    {
        $lbl = trim($this->request->getJSON(true)['mot_lbl'] ?? '');

        if ($lbl === '') {
            return $this->apiBadRequest('Le champ mot_lbl est requis.');
        }

        // Doublon ?
        $exists = $this->model->where('mot_lbl', $lbl)->first();
        if ($exists) {
            return $this->apiValidationError(
                ['mot_lbl' => "Le mot « $lbl » existe déjà."],
                'Doublon détecté.'
            );
        }

        $id = $this->model->insert(['mot_lbl' => $lbl]);
        if (! $id) {
            return $this->apiValidationError($this->model->errors());
        }

        return $this->apiCreated($this->model->find($id), "Mot « $lbl » créé.");
    }

    // PUT /api/mot/:id
    public function update($id = null)
    {
        $item = $this->model->find((int) $id);
        if (! $item) return $this->apiNotFound("Mot #$id introuvable.");

        $lbl = trim($this->request->getJSON(true)['mot_lbl'] ?? '');
        if ($lbl === '') return $this->apiBadRequest('mot_lbl requis.');

        $this->model->update((int) $id, ['mot_lbl' => $lbl]);
        return $this->apiOk($this->model->find((int) $id), null, "Mot #$id mis à jour.");
    }

    // DELETE /api/mot/:id
    public function delete($id = null)
    {
        $item = $this->model->find((int) $id);
        if (! $item) return $this->apiNotFound("Mot #$id introuvable.");

        $this->model->delete((int) $id);
        return $this->apiDeleted("Mot #$id supprimé.");
    }

    // GET /api/mot/:id  (optionnel — index gère déjà ?id=)
    public function show($id = null)
    {
        $item = $this->model->find((int) $id);
        return $item
            ? $this->apiOk($item)
            : $this->apiNotFound("Mot #$id introuvable.");
    }

    
    // GET /api/mot/like?q=alt&len=5
    // Réponse ultra-légère pour autocomplete : juste id + label
    public function like()
    {
        $q   = $this->request->getGet('q')   ?? '';
        $len = min((int) ($this->request->getGet('len') ?? 10), 50);

        if (strlen($q) < 2) return $this->apiOk([]);

        $data = $this->model
            ->select('mot_id, mot_lbl')
            ->like('mot_lbl', $q)
            ->limit($len)
            ->find();

        return $this->apiOk($data);
    }

}