<?php
// app/Views/workbench/mot.php
// Banc de test — MotWorkbench
// URL : /workbench/mot
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workbench — Mot</title>

    <!-- Styles applicatifs existants -->
    <link rel="stylesheet" href="/assets/css/components/workbench.css">

    <!-- ── Stub minimal si le CSS workbench n'existe pas encore ── -->
    <style>
        body { margin: 0; padding: 1rem; font-family: sans-serif; }

        /* Layout deux colonnes */
        .wb_mot_layout {
            display        : grid;
            grid-template-columns : 360px 1fr;
            gap            : 1rem;
            height         : calc(100vh - 2rem);
        }

        .wb_mot_left,
        .wb_mot_right {
            overflow : auto;
        }

        /* Panels */
        .wb_mot_list_panel,
        .wb_mot_detail_panel {
            border        : 1px solid #ddd;
            border-radius : 6px;
            overflow      : hidden;
            height        : 100%;
            display       : flex;
            flex-direction: column;
        }

        .wb_panel_header {
            background : #f5f5f5;
            padding    : .5rem 1rem;
            border-bottom : 1px solid #ddd;
        }

        .wb_panel_header h2 { margin: 0; font-size: 1rem; }

        .wb_panel_body { padding: 1rem; flex: 1; overflow: auto; }

        /* Search */
        .wb_mot_search {
            display : flex;
            gap     : .5rem;
            padding : .5rem 1rem;
            border-bottom : 1px solid #eee;
        }

        .wb_mot_search_input { flex: 1; padding: .3rem .5rem; }
        .wb_mot_search_btn   { padding: .3rem .75rem; cursor: pointer; }

        /* Table */
        .wb_mot_table { flex: 1; overflow: auto; padding: .5rem; }
        .wb_mot_pager { padding: .5rem 1rem; border-top: 1px solid #eee; }

        /* États */
        .wb_empty  { color: #888; font-style: italic; padding: 1rem; }
    </style>
</head>
<body>

    <div id="motWorkbench"></div>

    <script type="module">
        import MotWorkbench from '/assets/js/ui/workbench/mot/MotWorkbench.js';

        const wb = new MotWorkbench();
        await wb.init('#motWorkbench');
    </script>

</body>
</html>
