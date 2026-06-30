<?php
// app/Libraries/Components/ComponentRenderer.php

namespace App\Libraries\Components;

class ComponentRenderer
{
    protected ComponentRegistry $registry;

    public function __construct()
    {
        $this->registry = new ComponentRegistry();
    }

    public function render( DescriptorDefinition $descriptor ): string {

        $renderer = $this->registry->getRenderer($descriptor->type);

        if (!$renderer) {
            return <<<HTML
<div class="alert alert-danger">
Composant inconnu : {$descriptor->type}
</div>
HTML;
        }

        return $renderer->render($descriptor);
    }
}