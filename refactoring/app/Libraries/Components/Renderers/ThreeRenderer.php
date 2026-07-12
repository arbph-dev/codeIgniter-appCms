<?php
// app/Libraries/Components/Renderers/ThreeRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class ThreeRenderer implements ComponentRendererInterface
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id     = htmlspecialchars($descriptor->get('id',     uniqid('THREE_')), ENT_QUOTES, 'UTF-8');
        $scene  = htmlspecialchars($descriptor->get('scene',  'cube'),           ENT_QUOTES, 'UTF-8');
        $width  = (int) ($descriptor->get('width',  800));
        $height = (int) ($descriptor->get('height', 400));
        $model  = htmlspecialchars($descriptor->get('model',  ''),               ENT_QUOTES, 'UTF-8');

        $modelAttr = $model ? " data-model=\"{$model}\"" : '';

        return <<<HTML
<div
    id="{$id}"
    class="cp_threejs"
    data-scene="{$scene}"
    data-width="{$width}"
    data-height="{$height}"{$modelAttr}>
</div>
HTML;
    }
}
