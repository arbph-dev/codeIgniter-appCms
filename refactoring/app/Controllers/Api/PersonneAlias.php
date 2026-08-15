<?php

namespace App\Controllers\Api;

use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class PersonneAlias extends ResourceController
{
    use ApiResponse;

    protected $modelName = 'App\Models\PersonneAliasModel';
    protected $format    = 'json';

    /**
     * GET /api/personne-aliases
     * Possibilité de filtrer par ?personne_id=XX
     */
    public function index(): ResponseInterface
    {
        $personneId = $this->request->getGet('personne_id');
        $perPage    = (int) ($this->request->getGet('per_page') ?? 50);
        $page       = (int) ($this->request->getGet('page') ?? 1);

        $model = model($this->modelName);

        if ($personneId) {
            $model->where('personne_id', (int) $personneId);
        }

        $data = $model->orderBy('is_principal', 'DESC')
                      ->orderBy('alias', 'ASC')
                      ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager, 'Liste des alias');
    }

    /**
     * GET /api/personne-aliases/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $item = model($this->modelName)->find($id);

        if (! $item) {
            return $this->apiNotFound("Alias #{$id} introuvable.");
        }

        return $this->apiOk($item, null, 'Détail de l\'alias');
    }

    /**
     * POST /api/personne-aliases
     */
    public function create(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $model = model($this->modelName);

        if (! $model->insert($data)) {
            return $this->apiValidationError(
                $model->errors() ?: ['error' => 'Erreur lors de la création'],
                'Impossible de créer l\'alias.'
            );
        }

        $item = $model->find($model->getInsertID());

        return $this->apiCreated($item, 'Alias créé avec succès.');
    }

    /**
     * PUT /api/personne-aliases/{id}
     */
    public function update($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $data  = $this->request->getJSON(true) ?? $this->request->getRawInput();
        $model = model($this->modelName);

        if (! $model->find($id)) {
            return $this->apiNotFound("Alias #{$id} introuvable.");
        }

        if (! $model->update($id, $data)) {
            return $this->apiValidationError(
                $model->errors() ?: ['error' => 'Erreur lors de la mise à jour'],
                'Impossible de mettre à jour l\'alias.'
            );
        }

        return $this->apiOk($model->find($id), null, 'Alias mis à jour avec succès.');
    }

    /**
     * DELETE /api/personne-aliases/{id}
     */
    public function delete($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $model = model($this->modelName);

        if (! $model->find($id)) {
            return $this->apiNotFound("Alias #{$id} introuvable.");
        }

        if (! $model->delete($id)) {
            return $this->apiBadRequest('Impossible de supprimer l\'alias.');
        }

        return $this->apiDeleted('Alias supprimé avec succès.');
    }
}