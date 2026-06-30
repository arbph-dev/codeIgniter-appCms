<?php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;

class ApexAdminRenderer
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id     = $descriptor->get('id', '');
        $chart  = $descriptor->get('chart', 'line');
        $height = $descriptor->get('height', 350);

        return <<<HTML

<div class="cp_admin_form">

    <table class="form">

        <tr>
            <th>Identifiant</th>
            <td>
                <input
                    type="text"
                    name="cfg[id]"
                    value="{$id}">
            </td>
        </tr>

        <tr>
            <th>Type de graphique</th>
            <td>

                <select name="cfg[chart]">

                    <option value="line"        {$this->selected($chart,'line')}>Line</option>
                    <option value="bars"        {$this->selected($chart,'bars')}>Bars</option>
                    <option value="moteurCouple" {$this->selected($chart,'moteurCouple')}>Moteur Couple</option>

                </select>

            </td>
        </tr>

        <tr>

            <th>Hauteur</th>

            <td>

                <input
                    type="number"
                    name="cfg[height]"
                    value="{$height}">

            </td>

        </tr>

    </table>

</div>

HTML;

    }

    protected function selected($a,$b): string
    {
        return $a==$b ? 'selected' : '';
    }

}