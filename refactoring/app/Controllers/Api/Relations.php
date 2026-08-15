<?php

namespace App\Controllers\Api;

use App\Services\RelationService;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class Relations extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';

    protected RelationService $service;

    public function __construct()
    {
        $this->service = service('relation');
    }

    // =====================================================================
    // LECTURE
    // =====================================================================

    /**
     * GET /api/relations
     *
     * Trois modes de filtrage, par ordre de priorité :
     *
     * 1. Bidirectionnel  ?entity_type=personne&entity_id=12
     *    → toutes les relations où la personne est source OU cible.
     *    Cas d'usage : fiche personne, fiche organisation.
     *
     * 2. Sortant         ?source_type=personne&source_id=12
     *    → relations dont l'entité est la source.
     *
     * 3. Entrant         ?target_type=organisation&target_id=5
     *    → relations dont l'entité est la cible.
     *
     * Filtre optionnel cumulable : &relation_type_id=3
     */
    public function index(): ResponseInterface
    {
        $entityType     = $this->request->getGet('entity_type');
        $entityId       = (int) $this->request->getGet('entity_id');
        $sourceType     = $this->request->getGet('source_type');
        $sourceId       = (int) $this->request->getGet('source_id');
        $targetType     = $this->request->getGet('target_type');
        $targetId       = (int) $this->request->getGet('target_id');
        $relationTypeId = (int) $this->request->getGet('relation_type_id') ?: null;

        // Mode 1 — bidirectionnel
        if ($entityType && $entityId) {
            $data = $this->service->getForEntity($entityType, $entityId);
            return $this->apiOk($data, null, "Relations de {$entityType} #{$entityId}");
        }

        // Mode 2 — sortant
        if ($sourceType && $sourceId) {
            $data = $this->service->getBySource($sourceType, $sourceId, $relationTypeId);
            return $this->apiOk($data, null, "Relations sortantes de {$sourceType} #{$sourceId}");
        }

        // Mode 3 — entrant
        if ($targetType && $targetId) {
            $data = $this->service->getByTarget($targetType, $targetId, $relationTypeId);
            return $this->apiOk($data, null, "Relations entrantes vers {$targetType} #{$targetId}");
        }

        return $this->apiBadRequest(
            'Paramètres requis : entity_type+entity_id, source_type+source_id, ou target_type+target_id.'
        );
    }

    /**
     * GET /api/relations/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $item = $this->service->find((int) $id);

        if (! $item) {
            return $this->apiNotFound("Relation #{$id} introuvable.");
        }

        return $this->apiOk($item, null, 'Détail de la relation');
    }

    // =====================================================================
    // ÉCRITURE
    // =====================================================================

    /**
     * POST /api/relations
     *
     * Payload minimal :
     * {
     *   "relation_type_id": 3,
     *   "source_type": "personne",
     *   "source_id": 12,
     *   "target_type": "organisation",
     *   "target_id": 5,
     *   "etablissement_id": 7   ← optionnel, bascule target sur etablissement
     * }
     */
    public function create(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $relation = $this->service->create($data);

        if (! $relation) {
            $errors = model('App\Models\RelationModel')->errors();
            return $this->apiValidationError(
                $errors ?: ['error' => 'Erreur lors de la création'],
                'Impossible de créer la relation.'
            );
        }

        return $this->apiCreated($relation, 'Relation créée avec succès.');
    }

    /**
     * PUT /api/relations/{id}
     */
    public function update($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $relation = $this->service->update((int) $id, $data);

        if (! $relation) {
            $errors = model('App\Models\RelationModel')->errors();
            return $this->apiValidationError(
                $errors ?: ['error' => 'Erreur lors de la mise à jour'],
                'Impossible de mettre à jour la relation.'
            );
        }

        return $this->apiOk($relation, null, 'Relation mise à jour avec succès.');
    }

    /**
     * DELETE /api/relations/{id}
     * Suppression physique — préférer deactivate() pour l'historique.
     */
    public function delete($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        if (! $this->service->delete((int) $id)) {
            return $this->apiNotFound("Relation #{$id} introuvable ou déjà supprimée.");
        }

        return $this->apiDeleted('Relation supprimée avec succès.');
    }

    /**
     * PATCH /api/relations/{id}/deactivate
     *
     * Désactivation douce : actif = 0.
     * Conserve l'historique — à préférer à DELETE pour les relations passées.
     */
    public function deactivate($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        if (! $this->service->find((int) $id)) {
            return $this->apiNotFound("Relation #{$id} introuvable.");
        }

        if (! $this->service->deactivate((int) $id)) {
            return $this->apiBadRequest('Impossible de désactiver la relation.');
        }

        return $this->apiOk(null, null, 'Relation désactivée avec succès.');
    }
}
