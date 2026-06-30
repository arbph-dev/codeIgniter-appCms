<?php
// app/Libraries/Components/Renderers/RawRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class RawRenderer implements ComponentRendererInterface
{
    public function render(
        DescriptorDefinition $descriptor
    ): string {

        return $descriptor->get('content', '');
    }
}