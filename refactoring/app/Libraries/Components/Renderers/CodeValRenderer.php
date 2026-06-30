<?php
// app/Libraries/Components/Renderers/CodeValRenderer.php
//
namespace App\Libraries\Components\Renderers;

use App\Libraries\Components\DescriptorDefinition;

class CodeValRenderer implements ComponentRendererInterface
{
    public function render(
        DescriptorDefinition $descriptor
    ): string {

        $id     = $descriptor->get('id', uniqid('CV_'));
        $rows   = $descriptor->get('rows', 10);
        $script = $descriptor->get('script', '');

        return <<<HTML
<div id="CODEVAL_{$id}" class="cp_codeval">
    <div id="CODEVAL_{$id}_SCRIPTCODE" class="scriptcode">
        <textarea rows="{$rows}">
{$script}
        </textarea>
    </div>

    <div id="CODEVAL_{$id}_RESULT" class="result"></div>

    <div class="cp_toolbar">
        <button
            onclick="window.eventBusPublish(event,'codeval:toggle','{$id}')">
            Show
        </button>

        <button
            onclick="window.eventBusPublish(event,'codeval:eval','{$id}')">
            Run
        </button>
    </div>
</div>
HTML;
    }
}