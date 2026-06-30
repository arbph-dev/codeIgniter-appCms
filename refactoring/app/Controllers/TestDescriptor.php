<?php

namespace App\Controllers;

use App\Libraries\Cms\ComponentRegistry;
use App\Libraries\Cms\DescriptorFactory;

class TestDescriptor extends BaseController
{
    public function index()
    {
        $descriptor = DescriptorFactory::fromArray(
            'apex',
            [
                'id'     => 'APEX_1',
                'chart'  => 'moteurCouple',
                'height' => 350
            ]
        );

        $registry = new ComponentRegistry();

        echo $registry->render(
            $descriptor
        );
    }
}