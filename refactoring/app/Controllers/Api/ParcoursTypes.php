<?php
// app/Controllers/Api/ParcoursTypes.php
namespace App\Controllers\Api;

use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * GET /api/parcours-types
 * GET /api/parcours-types/{id}
 *
 * Référentiel en lecture seule.
 * La modification passe par l'administration, pas par cette API.
 */
class ParcoursTypes extends ResourceController
{
    use ApiResponse;

    protected $modelName = 'App\Models\ParcoursTypeModel';
    protected $format    = 'json';

    /**
     * GET /api/parcours-types
     * Paramètre optionnel : ?code=emploi
     */
    public function index(): ResponseInterface
    {
        $code  = $this->request->getGet('code');
        $model = model($this->modelName);

        if ($code) {
            $item = $model->findByCode($code);
            return $item
                ? $this->apiOk($item, null, 'Type de parcours trouvé')
                : $this->apiNotFound("Type de parcours '{$code}' introuvable.");
        }

        $data = $model->orderBy('label', 'ASC')->findAll();

        return $this->apiOk($data, null, 'Liste des types de parcours');
    }

    /**
     * GET /api/parcours-types/{id}
     */
    public function show($id = null): ResponseInterface
    {
        if (! $id) {
            return $this->apiBadRequest('ID manquant.');
        }

        $item = model($this->modelName)->find($id);

        if (! $item) {
            return $this->apiNotFound("Type de parcours #{$id} introuvable.");
        }

        return $this->apiOk($item, null, 'Détail du type de parcours');
    }
}
