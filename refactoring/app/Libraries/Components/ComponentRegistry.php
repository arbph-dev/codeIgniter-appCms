<?php
// app/Libraries/Components/ComponentRegistry.php

namespace App\Libraries\Components;

use App\Libraries\Components\Renderers\RawRenderer;
use App\Libraries\Components\Renderers\ApexRenderer;
use App\Libraries\Components\Renderers\CodeValRenderer;
use App\Libraries\Components\Renderers\MermaidRenderer;

class ComponentRegistry
{
    protected array $renderers = [
        'raw'      => RawRenderer::class,
        'apex'     => ApexRenderer::class,
        'codeval'  => CodeValRenderer::class,
        'mermaid'  => MermaidRenderer::class,
        'callout'  => CalloutRenderer::class,
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
