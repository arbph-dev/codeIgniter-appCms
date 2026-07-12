<?php
// app/Libraries/Components/ComponentRegistry.php

namespace App\Libraries\Components;

use App\Libraries\Components\Renderers\RawRenderer;
use App\Libraries\Components\Renderers\ApexRenderer;
use App\Libraries\Components\Renderers\CodeValRenderer;
use App\Libraries\Components\Renderers\MermaidRenderer;
use App\Libraries\Components\Renderers\CalloutRenderer;  // ← ajout
use App\Libraries\Components\Renderers\LeafletRenderer; //2026-07-12
use App\Libraries\Components\Renderers\ThreeRenderer; //2026-07-13


class ComponentRegistry
{
    protected array $renderers = [
        'raw'      => RawRenderer::class,
        'apex'     => ApexRenderer::class,
        'codeval'  => CodeValRenderer::class,
        'mermaid'  => MermaidRenderer::class,
        'callout'  => CalloutRenderer::class,
        'leaflet'  => LeafletRenderer::class,
        'threejs' => ThreeRenderer::class,
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
