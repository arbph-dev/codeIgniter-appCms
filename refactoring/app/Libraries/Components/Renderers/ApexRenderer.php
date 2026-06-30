<?php
// app/Libraries/Components/Renderers/ApexRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class ApexRenderer implements ComponentRendererInterface
{
    public function render(
        DescriptorDefinition $descriptor
    ): string {

        $id     = $descriptor->get('id', uniqid('APEX_'));
        $chart  = $descriptor->get('chart', '');
        $height = $descriptor->get('height', 350);

        return <<<HTML
<div
    id="{$id}"
    class="cp_apex"
    data-chart="{$chart}"
    data-height="{$height}">
</div>
HTML;
    }
}