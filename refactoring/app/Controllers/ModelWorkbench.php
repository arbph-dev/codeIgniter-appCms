<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;

/**
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Contrôleur d'administration du ModelWorkbench.
 *
 * Responsabilité :
 *  - afficher le Workbench.
 * --------------------------------------------------------------------
 */
class ModelWorkbench extends BaseController
{
    /**
     * Affiche le ModelWorkbench.
     */
    public function index()
    {
        return view('admin/modelworkbench');
    }
}