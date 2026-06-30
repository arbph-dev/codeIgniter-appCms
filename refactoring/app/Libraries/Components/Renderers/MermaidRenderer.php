<?php
// app/Libraries/Components/Renderers/MermaidRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class MermaidRenderer implements ComponentRendererInterface
{
    public function render( DescriptorDefinition $descriptor ): string {

        $id = $descriptor->get('id', uniqid('MM_'));

        $definition = $descriptor->get( 'definition', 'graph TD;A-->B' );

        return <<<HTML
<pre
    id="{$id}"
    class="mermaid">
{$definition}
</pre>
HTML;
    }
}
