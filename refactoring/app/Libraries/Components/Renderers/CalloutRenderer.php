<?php
// app/Libraries/Components/Renderers/CalloutRenderer.php

namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class CalloutRenderer implements ComponentRendererInterface
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id      = htmlspecialchars($descriptor->get('id', uniqid('CO_')), ENT_QUOTES, 'UTF-8');
        $type    = htmlspecialchars($descriptor->get('type', 'info'),       ENT_QUOTES, 'UTF-8');
        $title   = htmlspecialchars($descriptor->get('title', ''),          ENT_QUOTES, 'UTF-8');
        $content = $descriptor->get('content', '');   // HTML brut autorisé, comme RawRenderer

        $titleHtml = $title
            ? "<strong class=\"cp_callout_title\">{$title}</strong>\n    "
            : '';

        return <<<HTML
<div id="{$id}" class="cp_callout cp_callout--{$type}">
    {$titleHtml}<div class="cp_callout_content">{$content}</div>
</div>
HTML;
    }
}
