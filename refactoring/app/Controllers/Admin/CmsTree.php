<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Services\CmsService;

class CmsTree extends BaseController
{
    protected CmsService $cms;

    public function __construct()
    {
        $this->cms = new CmsService();
    }

    public function index()
    {

        $treeArray = $this->cms->getCmsTree();

        return view(
            'admin/cmstree/index',
            [
                'tree' => $treeArray,
            ]
        );        

    }


}