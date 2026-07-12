<?php
// app/Libraries/Components/Renderers/ThreeRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class ThreeRenderer implements ComponentRendererInterface
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id = htmlspecialchars(
            $descriptor->get('id', uniqid('THREE_')),
            ENT_QUOTES,
            'UTF-8'
        );

        $options = $descriptor->get('options', []);

        // Compatibilité : si options n'est pas un tableau
        if (!is_array($options)) {
            $options = [];
        }
        
        $optionsJson = json_encode(
            $options,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        if ($optionsJson === false) {
            $optionsJson = '{}';
        }

        $optionsJson = htmlspecialchars(
            $optionsJson,
            ENT_QUOTES,
            'UTF-8'
        );

        return <<<HTML
<div
    id="{$id}"
    class="cp_threejs"
    data-options="{$optionsJson}">
</div>
HTML;
    }
}
