<?php
// app/Libraries/Components/Renderers/LeafletRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class LeafletRenderer implements ComponentRendererInterface
{
    public function render(
        DescriptorDefinition $descriptor
    ): string {

        $id   = $descriptor->get('id', uniqid('MAP_'));
        $lat  = $descriptor->get('lat', 47.82);
        $lng  = $descriptor->get('lng', -4.30);
        $zoom = $descriptor->get('zoom', 11);

        return <<<HTML
<div
    id="{$id}"
    class="cp_leaflet"
    data-lat="{$lat}"
    data-lng="{$lng}"
    data-zoom="{$zoom}">
</div>
HTML;
    }
}