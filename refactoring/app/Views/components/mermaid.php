<?php
// app/Views/components/mermaid.php

$config = $config ?? [];

$id         = $config['id'] ?? uniqid('MM_');
$definition = $config['definition'] ?? '';

?>

<div
    id="<?= esc($id) ?>"
    class="mermaid">
<?= esc($definition) ?>
</div>