<?php
// app/Controllers/Api/ImageMot.php
namespace App\Controllers\Api;

use App\Services\ImageMotService;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use RuntimeException;

class ImageMot extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';
    protected ImageMotService $service;

    public function __construct()
    {
        $this->service = new ImageMotService();
    }

    /** GET /api/image/:id/mots */
    public function index($imageId = null)
    {
        try {
            $mots = $this->service->getMots((int) $imageId);
            return $this->apiOk($mots);
        } catch (RuntimeException $e) {
            return $this->fromException($e);
        }
    }

    /** POST /api/image/:id/mots  body: { "mot_id": 1 } */
    public function attach($imageId = null)
    {
        $body  = $this->request->getJSON(true) ?? [];
        $motId = (int) ($body['mot_id'] ?? 0);

        if ($motId < 1) {
            return $this->apiBadRequest('mot_id requis (entier > 0).');
        }

        try {
            $result = $this->service->attach((int) $imageId, $motId);

            if ($result['already']) {
                return $this->apiOk( $result, null, 'Association déjà existante.');
            }

            return $this->apiCreated( $result, 'Mot associé à l\'image.');

        } catch (RuntimeException $e) {
            return $this->fromException($e);
        }
    }

    /** PUT /api/image/:id/mots  body: { "ids": [1,3,5] } */
    public function sync($imageId = null)
    {
        $body = $this->request->getJSON(true) ?? [];
        $ids  = $body['ids'] ?? null;

        if (! is_array($ids)) {
            return $this->apiBadRequest('ids doit être un tableau d\'entiers.');
        }

        try {
            $mots = $this->service->sync((int) $imageId, $ids);
            return $this->apiOk($mots, null, 'Tags synchronisés.');
        } catch (RuntimeException $e) {
            return $this->fromException($e);
        }
    }

    /** DELETE /api/image/:id/mots/:motId */
    public function detach($imageId = null, $motId = null)
    {
        try {
            $ok = $this->service->detach((int) $imageId, (int) $motId);

            if (! $ok) {
                // association absente — idempotent
                return $this->apiOk(null, null, 'Association absente.');
            }

            return $this->apiDeleted('Association supprimée.');
        } catch (RuntimeException $e) {
            return $this->fromException($e);
        }
    }

    protected function fromException(RuntimeException $e)
    {
        $code = (int) $e->getCode();
        if ($code === 404) {
            return $this->apiNotFound($e->getMessage());
        }
        return $this->apiError($e->getMessage());
    }
}