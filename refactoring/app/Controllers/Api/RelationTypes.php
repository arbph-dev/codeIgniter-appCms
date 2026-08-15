<?php

namespace App\Controllers\Api;

use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * GET /api/relation-types
 * GET /api/relation-types/{id}
 *
 * Référentiel en lecture seule.
 *
 * Filtres disponibles sur index :
 *   ?code=employe
 *   ?source_type=personne
 *   ?target_type=organisation
 *   ?source_type=personne&target_type=organisation  ← cas principal
 */
class RelationTypes extends ResourceController
{
    use ApiResponse;

    protected $modelName = 'App\Models\RelationTypeModel';
    protected $format    = 'json';

    /**
     * GET /api/relation-types
     */
    public function index(): ResponseInterface
    {
        $code       = $this->request->getGet('code');
        $sourceType = $this->request->getGet('source_type');
        $targetType = $this->request->getGet('target_type');

        $model = model($this->modelName);

        // Résolution directe par code
        if ($code) {
            $item = $model->findByCode($code);
            return $item
                ? $this->apiOk($item, null, 'Type de relation trouvé')
                : $this->apiNotFound("Type de relation '{$code}' introuvable.");
        }

        // Filtre par paire source/target — cas d'usage principal
        if ($sourceType && $targetType) {
            $data = $model->findApplicable($sourceType, $targetType);
            return $this->apiOk($data, null, "Types applicables {$sourceType}→{$targetType}");
        }

        // Filtre partiel
        if ($sourceType) {
            $model->where('source_type', $sourceType);
        }
        if ($targetType) {
            $model->where('target_type', $targetType);
        }

        $data = $model->orderBy('label', 'ASC')->findAll();

        return $this->apiOk($data, null, 'Liste des types de relation');
    }

    /**
     * GET /api/relation-types/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $item = model($this->modelName)->find($id);

        if (! $item) {
            return $this->apiNotFound("Type de relation #{$id} introuvable.");
        }

        return $this->apiOk($item, null, 'Détail du type de relation');
    }
}
