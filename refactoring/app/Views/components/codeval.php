<?php
// app/Views/components/codeval.php
$config = $config ?? [];

$id     = $config['id']     ?? uniqid('CV_');
$rows   = $config['rows']   ?? 10;
$script = $config['script'] ?? '';

?>

<div
    id="CODEVAL_<?= esc($id) ?>"
    class="cp_codeval">

    <textarea rows="<?= esc($rows) ?>">
<?= esc($script) ?>
    </textarea>

    <div class="result"></div>

</div>