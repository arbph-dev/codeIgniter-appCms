<?php
// app/Controllers/Api/MotImage.php
namespace App\Controllers\Api;

use App\Services\ImageMotService;
use App\Traits\ApiResponse;
use CodeIgniter\RESTful\ResourceController;
use RuntimeException;

class MotImage extends ResourceController
{
    use ApiResponse;

    protected $format = 'json';
    protected ImageMotService $service;

    public function __construct()
    {
        $this->service = new ImageMotService();
    }

    /** GET /api/mot/:id/images */
    public function index($motId = null)
    {
        try {
            $images = $this->service->getImages((int) $motId);
            return $this->apiOk($images);
        } catch (RuntimeException $e) {
            if ((int) $e->getCode() === 404) {
                return $this->apiNotFound($e->getMessage());
            }
            return $this->apiError($e->getMessage());
        }
    }
}