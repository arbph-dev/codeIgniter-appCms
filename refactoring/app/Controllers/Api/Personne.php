<?php

/*


$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {

    $routes->resource('personnes', [
        'controller' => 'Personne',
        'only'       => ['index', 'show', 'create', 'update', 'delete'],
    ]);

    // Fusion
    $routes->post('personnes/(:num)/merge/(:num)', 'Personne::merge/$1/$2');
});
Le controller respecte parfaitement ton trait (`apiOk`, `apiCreated`, `apiDeleted`, `apiNotFound`, `apiValidationError`, `apiBadRequest`…).

*/

// App/Controllers/Api/Personne.php
namespace App\Controllers\Api;

use App\Services\PersonneService;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class Personne extends ResourceController
{
    use ApiResponse;

    protected $modelName = 'App\Models\PersonneModel';
    protected $format    = 'json';

    protected PersonneService $service;

    public function __construct()
    {
        $this->service = service('personne');
    }

    /**
     * GET /api/personnes
     */
    public function index(): ResponseInterface
    {
        $search  = $this->request->getGet('q');
        $perPage = (int) ($this->request->getGet('per_page') ?? 20);
        $page    = (int) ($this->request->getGet('page') ?? 1);

        $model = model($this->modelName);

        if ($search) {
            $data = $this->service->search($search, $perPage);
            return $this->apiOk($data, null, 'Liste des personnes (recherche)');
        }

        $data = $model->orderBy('nom_complet', 'ASC')
                      ->paginate($perPage, 'default', $page);

        return $this->apiOk($data, $model->pager, 'Liste des personnes');
    }

    /**
     * GET /api/personnes/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $result = $this->service->findWithRelations((int) $id);

        if (! $result) {
            return $this->apiNotFound("Personne #{$id} introuvable.");
        }

        return $this->apiOk($result, null, 'Détail de la personne');
    }

    /**
     * POST /api/personnes
     */
    public function create(): ResponseInterface
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $aliases = $payload['aliases'] ?? [];
        unset($payload['aliases']);

        $personne = $this->service->create($payload, $aliases);

        if (! $personne) {
            $errors = model($this->modelName)->errors();
            return $this->apiValidationError(
                $errors ?: ['error' => 'Erreur lors de la création'],
                'Impossible de créer la personne.'
            );
        }

        return $this->apiCreated($personne, 'Personne créée avec succès.');
    }

    /**
     * PUT /api/personnes/{id}
     * PATCH /api/personnes/{id}
     */
    public function update($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getRawInput();
        $aliases = $payload['aliases'] ?? null;
        unset($payload['aliases']);

        $personne = $this->service->update((int) $id, $payload, $aliases);

        if (! $personne) {
            $errors = model($this->modelName)->errors();
            return $this->apiValidationError(
                $errors ?: ['error' => 'Erreur lors de la mise à jour'],
                'Impossible de mettre à jour la personne.'
            );
        }

        return $this->apiOk($personne, null, 'Personne mise à jour avec succès.');
    }

    /**
     * DELETE /api/personnes/{id}
     */
    public function delete($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        if (! $this->service->delete((int) $id)) {
            return $this->apiBadRequest('Impossible de supprimer la personne.');
        }

        return $this->apiDeleted('Personne supprimée avec succès.');
    }

    /**
     * POST /api/personnes/{sourceId}/merge/{targetId}
     */
    public function merge($sourceId = null, $targetId = null): ResponseInterface
    {
        if (! $sourceId || ! $targetId) {
            return $this->apiBadRequest('IDs source et cible requis.');
        }

        $ok = $this->service->merge((int) $sourceId, (int) $targetId);

        if (! $ok) {
            return $this->apiBadRequest('Échec de la fusion des personnes.');
        }

        return $this->apiOk(null, null, 'Personnes fusionnées avec succès.');
    }
}
