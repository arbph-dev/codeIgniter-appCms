<?php
// app/Libraries/Components/Renderers/ComponentRendererInterface.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

interface ComponentRendererInterface
{
    public function render(
        DescriptorDefinition $descriptor
    ): string;
}