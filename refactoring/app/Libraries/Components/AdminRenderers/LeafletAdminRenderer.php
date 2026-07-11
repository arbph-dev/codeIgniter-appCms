<?php
// app/Libraries/Components/AdminRenderers/LeafletAdminRenderer.php

namespace App\Libraries\Components\AdminRenderers;

use App\Libraries\Components\DescriptorDefinition;

class LeafletAdminRenderer
{
    public function render(DescriptorDefinition $descriptor): string
    {
        $id   = $descriptor->get('id', '');
        $lat  = $descriptor->get('lat', 47.82);
        $lng  = $descriptor->get('lng', -4.30);
        $zoom = $descriptor->get('zoom', 11);

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
            <th>Latitude</th>
            <td>
                <input
                    type="number"
                    name="config[lat]"
                    step="0.000001"
                    value="{$lat}">
            </td>
        </tr>

        <tr>
            <th>Longitude</th>
            <td>
                <input
                    type="number"
                    name="config[lng]"
                    step="0.000001"
                    value="{$lng}">
            </td>
        </tr>

        <tr>
            <th>Zoom</th>
            <td>
                <input
                    type="number"
                    name="config[zoom]"
                    min="0"
                    max="22"
                    value="{$zoom}">
            </td>
        </tr>

    </table>

</div>

HTML;
    }
}