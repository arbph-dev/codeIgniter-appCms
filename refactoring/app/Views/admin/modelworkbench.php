<?php
/**
 *  app/Views/admin/modelworkbench.php
 * --------------------------------------------------------------------
 * ModelWorkbench
 * Phase 0 - Commit 1
 *
 * Vue d'administration du ModelWorkbench.
 * --------------------------------------------------------------------
 */
?>
<!DOCTYPE html>

<html lang="fr">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>ModelWorkbench</title>

    <!-- Bibliothèques externes -->
    <?= view('cms/libs') ?>

</head>

<body>

<div id="modelworkbench" style="height: 700px;"></div>

<script type="module">

    import { initModelWorkbench } from '/assets/js/components/modelworkbench/admin/index.js';

    import { bus } from '/assets/js/core/eventBus.js';

    window.eventBusPublish = (evt, evtName, page) =>
        bus.publish(evtName, page);

    document.addEventListener('DOMContentLoaded', initModelWorkbench);


</script>

</body>

</html>
