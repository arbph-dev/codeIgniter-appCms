<?php
// app/Libraries/Components/AdminRenderers/ThreeAdminRenderer.php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;

class ThreeAdminRenderer
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id = htmlspecialchars(
            $descriptor->get('id', ''),
            ENT_QUOTES,
            'UTF-8'
        );

        $options = $descriptor->get('options', []);

        if (!is_array($options)) {
            $options = [];
        }

        $type = htmlspecialchars(
            $options['type'] ?? 'viewer',
            ENT_QUOTES,
            'UTF-8'
        );

        $resource = htmlspecialchars(
            $options['resource'] ?? '',
            ENT_QUOTES,
            'UTF-8'
        );

        return <<<HTML

<div class="cp_admin_form">

    <table class="form">

        <tr>
            <th>Identifiant</th>
            <td>
                <input
                    type="text"
                    name="config[id]"
                    value="{$id}">
            </td>
        </tr>

        <tr>
            <th>Type</th>
            <td>

                <select name="config[options][type]">

                    <option value="viewer" {$this->selected($type,'viewer')}>Viewer</option>
                    <option value="editor" {$this->selected($type,'editor')}>Editor</option>
                    <option value="simulation" {$this->selected($type,'simulation')}>Simulation</option>

                </select>

            </td>
        </tr>

        <tr>
            <th>Ressource</th>
            <td>

                <input
                    type="text"
                    name="config[options][resource]"
                    value="{$resource}"
                    placeholder="cube">

            </td>
        </tr>

    </table>

</div>

HTML;

    }

    protected function selected($a, $b): string
    {
        return $a === $b ? 'selected' : '';
    }
}
