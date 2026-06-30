<?php

namespace App\Libraries\Components\AdminRenderers;

//use App\Libraries\Components\ComponentRendererInterface;
use App\Libraries\Components\Renderers\ComponentRendererInterface;

use App\Libraries\Components\DescriptorDefinition;

class CodeValAdminRenderer implements ComponentRendererInterface
{
    public function render( DescriptorDefinition $descriptor ): string {
        $id     = $descriptor->get('id', uniqid('CV_'));
        $rows   = $descriptor->get('rows', 10);
        $script = htmlspecialchars( $descriptor->get('script', ''), ENT_QUOTES );

        return <<<HTML
<div class="cp_admin_config">
    <table class="table">
        <tr>
            <th style="width:180px">Identifiant</th>
            <td>
                <input type="text" name="config[id]" value="{$id}">
            </td>
        </tr>

        <tr>
            <th>Nombre de lignes</th>
            <td>
                <input type="number" name="config[rows]" value="{$rows}">
            </td>
        </tr>
    </table>
</div>

<div id="CODEVAL_{$id}" class="cp_codeval">
    <div id="CODEVAL_{$id}_SCRIPTCODE" class="scriptcode">
        <textarea name="config[script]" rows="{$rows}" class="cp_wysedit_textarea">{$script}</textarea>
    </div>
    <div id="CODEVAL_{$id}_RESULT" class="result">
    </div>

    <div class="cp_toolbar">
        <button type="button" onclick="window.eventBusPublish(event,'codeval:toggle','{$id}')">
            Show
        </button>
        <button type="button" onclick="window.eventBusPublish(event,'codeval:eval','{$id}')">
            Run
        </button>
    </div>

</div>

HTML;
    }
}