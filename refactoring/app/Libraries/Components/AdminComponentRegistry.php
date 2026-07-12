<?php
// app/Libraries/Components/AdminComponentRegistry.php

namespace App\Libraries\Components;

use App\Libraries\Components\AdminRenderers\RawAdminRenderer;
use App\Libraries\Components\AdminRenderers\ApexAdminRenderer;
use App\Libraries\Components\AdminRenderers\CodeValAdminRenderer;
use App\Libraries\Components\AdminRenderers\MermaidAdminRenderer;
use App\Libraries\Components\AdminRenderers\CalloutAdminRenderer;  // ← ajout

class AdminComponentRegistry
{
    protected array $renderers = [
        'raw'      => RawAdminRenderer::class,
        'apex'     => ApexAdminRenderer::class,
        'codeval'  => CodeValAdminRenderer::class,
        'mermaid'  => MermaidAdminRenderer::class,
        'callout'  => CalloutAdminRenderer::class,   // ← ajout
    ];

    public function getRenderer(string $type): ?object
    {
        if (!isset($this->renderers[$type])) {
            return null;
        }

        $class = $this->renderers[$type];

        return new $class();
    }
}
