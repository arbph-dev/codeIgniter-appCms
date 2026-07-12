<?php
// app/Libraries/Components/AdminRenderers/ThreeAdminRenderer.php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;
use App\Libraries\Components\Renderers\ComponentRendererInterface;

class ThreeAdminRenderer implements ComponentRendererInterface
{
    private const SCENES = ['cube', 'terrain', 'galaxy', 'model', 'vectors'];

    public function render(DescriptorDefinition $descriptor): string
    {
        $id     = htmlspecialchars($descriptor->get('id',    'THREE_' . uniqid()), ENT_QUOTES, 'UTF-8');
        $scene  = $descriptor->get('scene',  'cube');
        $width  = (int) ($descriptor->get('width',  800));
        $height = (int) ($descriptor->get('height', 400));
        $model  = htmlspecialchars($descriptor->get('model', ''), ENT_QUOTES, 'UTF-8');

        $options = implode("\n", array_map(
            fn(string $s) => sprintf(
                '                    <option value="%s"%s>%s</option>',
                $s,
                $scene === $s ? ' selected' : '',
                ucfirst($s)
            ),
            self::SCENES
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
            <th>Scène</th>
            <td>
                <select name="config[scene]" id="threeSceneSelect"
                    onchange="document.getElementById('threeModelRow').style.display =
                        this.value === 'model' ? '' : 'none'">
{$options}
                </select>
            </td>
        </tr>

        <tr>
            <th>Largeur (px)</th>
            <td>
                <input type="number" name="config[width]"  value="{$width}"  min="200" max="1920">
            </td>
        </tr>

        <tr>
            <th>Hauteur (px)</th>
            <td>
                <input type="number" name="config[height]" value="{$height}" min="100" max="1080">
            </td>
        </tr>

        <tr id="threeModelRow" style="display:<?= $scene === 'model' ? '' : 'none' ?>">
            <th>Chemin modèle OBJ</th>
            <td>
                <input type="text" name="config[model]" value="{$model}"
                    placeholder="/assets/img/3js/model3d/..." style="width:100%">
            </td>
        </tr>

    </table>

</div>

HTML;
    }
}
