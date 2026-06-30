<?php
// app/Views/components/apex.php

$config = $config ?? [];

$id     = $config['id']     ?? uniqid('APEX_');
$chart  = $config['chart']  ?? 'line';
$height = $config['height'] ?? 350;

?>

<div
    id="<?= esc($id) ?>"
    class="cp_apex"
    data-chart="<?= esc($chart) ?>"
    data-height="<?= esc($height) ?>">
</div>
