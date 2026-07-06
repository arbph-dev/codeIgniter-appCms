<?php
// app/Libraries/Components/AdminRenderers/CalloutAdminRenderer.php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;
use App\Libraries\Components\Renderers\ComponentRendererInterface;

class CalloutAdminRenderer implements ComponentRendererInterface
{
    private const TYPES = ['info', 'warning', 'danger', 'tip'];

    public function render(DescriptorDefinition $descriptor): string
    {
        $id      = htmlspecialchars($descriptor->get('id', 'CO_' . uniqid()), ENT_QUOTES, 'UTF-8');
        $type    = $descriptor->get('type', 'info');
        $title   = htmlspecialchars($descriptor->get('title',   ''), ENT_QUOTES, 'UTF-8');
        $content = htmlspecialchars($descriptor->get('content', ''), ENT_QUOTES, 'UTF-8');

        $options = implode("\n", array_map(
            fn(string $t) => sprintf(
                '                    <option value="%s"%s>%s</option>',
                $t,
                $type === $t ? ' selected' : '',
                ucfirst($t)
            ),
            self::TYPES
        ));

        return <<<HTML

<div class="cp_admin_form">

    <table class="form">

        <tr>
            <th style="width:180px">Identifiant</th>
            <td>
                <input type="text" name="config[id]" value="{$id}">
            </td>
        </tr>

        <tr>
            <th>Type</th>
            <td>
                <select name="config[type]">
{$options}
                </select>
            </td>
        </tr>

        <tr>
            <th>Titre</th>
            <td>
                <input type="text" name="config[title]" value="{$title}" style="width:100%">
            </td>
        </tr>

        <tr>
            <th>Contenu</th>
            <td>
                <textarea
                    name="config[content]"
                    rows="8"
                    class="cp_wysedit_textarea">{$content}</textarea>
            </td>
        </tr>

    </table>

</div>

HTML;
    }
}
