<?php
// ============================================================================
// app/Controllers/Api/ComponentCatalogController.php
// 2026-08-02-001 : Stage 1
//
// API du catalogue des composants.
// ============================================================================

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Components\ComponentCatalog;

class ComponentCatalogController extends BaseController
{
    /**
     * Retourne le catalogue des composants au format JSON.
     */
    public function index()
    {
        $catalog = new ComponentCatalog();

        $definitions = array_map(
            static fn($definition) => $definition->toArray(),
            $catalog->all()
        );

        return $this->response->setJSON($definitions);
    }
}
