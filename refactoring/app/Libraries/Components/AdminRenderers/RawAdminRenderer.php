<?php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;
use App\Libraries\Components\Renderers\ComponentRendererInterface;

class RawAdminRenderer implements ComponentRendererInterface
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $content = htmlspecialchars(
            $descriptor->get('content', ''),
            ENT_QUOTES,
            'UTF-8'
        );

        return <<<HTML

<div
    id="RAW_EDITOR"
    class="cp_wysedit_zone">

    <div class="cp_toolbar">

        <button
            type="button"
            class="cp_wysedit_toggle">
            Aperçu
        </button>

    </div>

    <textarea
        name="config[content]"
        rows="20"
        class="cp_wysedit_textarea">{$content}</textarea>

    <div class="cp_wysedit_view"></div>

</div>

HTML;
    }
}
