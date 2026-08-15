<?php

namespace App\Controllers\Api;

use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class PersonneParcours extends ResourceController
{
    use ApiResponse;

    protected $modelName = 'App\Models\PersonneParcoursModel';
    protected $format    = 'json';

    /**
     * GET /api/personne-parcours
     * Filtres possibles : ?personne_id=XX  &type=XXX
     */
    public function index(): ResponseInterface
    {
        $personneId = $this->request->getGet('personne_id');
        $type       = $this->request->getGet('type');
        $perPage    = (int) ($this->request->getGet('per_page') ?? 30);
        $page       = (int) ($this->request->getGet('page') ?? 1);

        $model = model($this->modelName);

        if ($personneId) {
            $model->where('personne_id', (int) $personneId);
        }

        if ($type) {
            $model->where('type', $type);
        }

        $data = $model->orderBy('date_debut', 'DESC')
                      ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager, 'Liste des parcours');
    }

    /**
     * GET /api/personne-parcours/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $item = model($this->modelName)->find($id);

        if (! $item) {
            return $this->apiNotFound("Parcours #{$id} introuvable.");
        }

        return $this->apiOk($item, null, 'Détail du parcours');
    }

    /**
     * POST /api/personne-parcours
     */
    public function create(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $model = model($this->modelName);

        if (! $model->insert($data)) {
            return $this->apiValidationError(
                $model->errors() ?: ['error' => 'Erreur lors de la création'],
                'Impossible de créer le parcours.'
            );
        }

        $item = $model->find($model->getInsertID());

        return $this->apiCreated($item, 'Parcours créé avec succès.');
    }

    /**
     * PUT /api/personne-parcours/{id}
     */
    public function update($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $data  = $this->request->getJSON(true) ?? $this->request->getRawInput();
        $model = model($this->modelName);

        if (! $model->find($id)) {
            return $this->apiNotFound("Parcours #{$id} introuvable.");
        }

        if (! $model->update($id, $data)) {
            return $this->apiValidationError(
                $model->errors() ?: ['error' => 'Erreur lors de la mise à jour'],
                'Impossible de mettre à jour le parcours.'
            );
        }

        return $this->apiOk($model->find($id), null, 'Parcours mis à jour avec succès.');
    }

    /**
     * DELETE /api/personne-parcours/{id}
     */
    public function delete($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $model = model($this->modelName);

        if (! $model->find($id)) {
            return $this->apiNotFound("Parcours #{$id} introuvable.");
        }

        if (! $model->delete($id)) {
            return $this->apiBadRequest('Impossible de supprimer le parcours.');
        }

        return $this->apiDeleted('Parcours supprimé avec succès.');
    }
}