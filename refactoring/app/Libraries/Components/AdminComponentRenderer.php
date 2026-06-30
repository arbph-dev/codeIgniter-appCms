<?php
// app/Libraries/Components/AdminComponentRenderer.php

namespace App\Libraries\Components;

class AdminComponentRenderer
{
    protected AdminComponentRegistry $registry;

    public function __construct()
    {
        $this->registry = new AdminComponentRegistry();
    }

    public function render(DescriptorDefinition $descriptor): string
    {
        $renderer = $this->registry->getRenderer($descriptor->type);

        if (!$renderer) {
            return <<<HTML
<div class="alert alert-danger">
Composant admin inconnu : {$descriptor->type}
</div>
HTML;
        }

        return $renderer->render($descriptor);
    }
}