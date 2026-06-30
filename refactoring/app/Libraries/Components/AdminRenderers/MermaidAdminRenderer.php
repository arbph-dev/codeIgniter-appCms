<?php
// app/Libraries/Components/AdminRenderers/MermaidAdminRenderer.php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;
use App\Libraries\Components\Renderers\ComponentRendererInterface;

class MermaidAdminRenderer implements ComponentRendererInterface
{
    public function render( DescriptorDefinition $descriptor ): string
    {
        $id = htmlspecialchars( $descriptor->get('id', 'MM_' . uniqid()), ENT_QUOTES, 'UTF-8' );
        $definition = htmlspecialchars( $descriptor->get('definition', ''), ENT_QUOTES, 'UTF-8' );
        $autorun = $descriptor->get('autorun', false);
        $checked = $autorun ? 'checked' : '';
        return <<<HTML

<div class="cp_mermaid_editor">
    <table>
        <tr>
            <th>ID</th>
            <td>
                <input type="text" name="config[id]" value="{$id}">
            </td>
        </tr>
        <tr>
            <th>Autorun</th>
            <td>
                <input type="checkbox" name="config[autorun]" value="1" {$checked}>
            </td>
        </tr>
        <tr>
            <th>Diagramme Mermaid</th>
            <td>
                <textarea id="MERMAID_{$id}_SOURCE" name="config[definition]" rows="20" cols="100">{$definition}</textarea>
            </td>
        </tr>
    </table>
</div>

<pre id="MERMAID_{$id}_RESULT" class="mermaid">
</pre>

<div class="cp_toolbar">
    <button type="button" onclick="adminRenderMermaid('{$id}')">Render</button>
</div>  
HTML;
    }
}