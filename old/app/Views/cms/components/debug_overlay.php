<?php
// app/Views/cms/components/debug_overlay.php
// Inclure dans le layout cms.php :
// Visible uniquement pour admin/superadmin OU en environment development

$showOverlay = isset($debugData) && (
    (auth()->loggedIn() && (
        auth()->user()->inGroup('admin') ||
        auth()->user()->inGroup('superadmin')
    )) || ENVIRONMENT === 'development'
);

if (!$showOverlay) return;

$d = $debugData ?? [];
?>

<!-- ── Debug Overlay ───────────────────────────────────────────────────────── -->
<style>
#dbg-toggle {
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 9998;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.55);
    color: #ffe066;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: background 0.2s;
}
#dbg-toggle:hover { background: rgba(0,0,0,0.8); }

#dbg-panel {
    position: fixed;
    bottom: 62px;
    right: 16px;
    z-index: 9999;
    width: 320px;
    max-height: 70vh;
    overflow-y: auto;
    background: #1a1a2e;
    color: #e0e0e0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.6);
    display: none;
    flex-direction: column;
}
#dbg-panel.open { display: flex; }

#dbg-header {
    background: #16213e;
    color: #ffe066;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 13px;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #0f3460;
    flex-shrink: 0;
}
#dbg-body {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.dbg-section { border-bottom: 1px solid #0f3460; padding-bottom: 8px; }
.dbg-section:last-child { border-bottom: none; padding-bottom: 0; }
.dbg-label {
    color: #ffe066;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}
.dbg-row { display: flex; gap: 8px; margin-bottom: 2px; }
.dbg-key   { color: #7fdbff; min-width: 100px; flex-shrink: 0; }
.dbg-val   { color: #e0e0e0; word-break: break-all; }
.dbg-val.ok   { color: #2ecc71; }
.dbg-val.warn { color: #e67e22; }
.dbg-val.err  { color: #e74c3c; }
.dbg-badge {
    display: inline-block;
    background: #0f3460;
    color: #7fdbff;
    border-radius: 3px;
    padding: 1px 6px;
    margin: 1px 2px 1px 0;
    font-size: 11px;
}
.dbg-badge.admin     { background: #c0392b; color: #fff; }
.dbg-badge.superadmin{ background: #8e44ad; color: #fff; }
</style>

<button id="dbg-toggle" title="Debug overlay (Ctrl+D)" aria-label="Debug">
    <i class="fa fa-bug"></i>
</button>

<div id="dbg-panel" role="complementary" aria-label="Debug panel">

    <div id="dbg-header">
        <span><i class="fa fa-bug"></i> Debug</span>
        <span style="font-size:10px;color:#7fdbff;"><?= esc(ENVIRONMENT) ?></span>
    </div>

    <div id="dbg-body">

        <!-- Utilisateur -->
        <div class="dbg-section">
            <div class="dbg-label">Utilisateur</div>
            <div class="dbg-row">
                <span class="dbg-key">id</span>
                <span class="dbg-val"><?= esc($d['id'] ?? '—') ?></span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">username</span>
                <span class="dbg-val"><?= esc($d['username'] ?? '—') ?></span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">actif</span>
                <span class="dbg-val <?= ($d['active'] ?? false) ? 'ok' : 'err' ?>">
                    <?= ($d['active'] ?? false) ? '✓ oui' : '✗ non' ?>
                </span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">créé le</span>
                <span class="dbg-val"><?= esc($d['created_at'] ?? '—') ?></span>
            </div>
        </div>

        <!-- Groupes -->
        <div class="dbg-section">
            <div class="dbg-label">Groupes</div>
            <div>
                <?php if (!empty($d['groups'])): ?>
                    <?php foreach ($d['groups'] as $g): ?>
                        <span class="dbg-badge <?= esc($g) ?>"><?= esc($g) ?></span>
                    <?php endforeach; ?>
                <?php else: ?>
                    <span class="dbg-val warn">aucun groupe</span>
                <?php endif; ?>
            </div>
        </div>

        <!-- Permissions -->
        <div class="dbg-section">
            <div class="dbg-label">Permissions</div>
            <div>
                <?php if (!empty($d['permissions'])): ?>
                    <?php foreach ($d['permissions'] as $p): ?>
                        <span class="dbg-badge"><?= esc($p) ?></span>
                    <?php endforeach; ?>
                <?php else: ?>
                    <span class="dbg-val" style="opacity:0.5">—</span>
                <?php endif; ?>
            </div>
        </div>

        <!-- Session / Serveur -->
        <div class="dbg-section">
            <div class="dbg-label">Session &amp; Serveur</div>
            <div class="dbg-row">
                <span class="dbg-key">session_id</span>
                <span class="dbg-val" style="font-size:10px;"><?= esc(substr($d['session_id'] ?? '—', 0, 20)) ?>…</span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">PHP</span>
                <span class="dbg-val"><?= esc($d['php_version'] ?? '—') ?></span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">CI</span>
                <span class="dbg-val"><?= esc($d['ci_version'] ?? '—') ?></span>
            </div>
            <div class="dbg-row">
                <span class="dbg-key">env</span>
                <span class="dbg-val <?= (($d['environment'] ?? '') === 'production') ? 'warn' : 'ok' ?>">
                    <?= esc($d['environment'] ?? '—') ?>
                </span>
            </div>
        </div>

    </div><!-- /dbg-body -->
</div><!-- /dbg-panel -->

<script>
(function () {
    const btn   = document.getElementById('dbg-toggle')
    const panel = document.getElementById('dbg-panel')
    if (!btn || !panel) return

    btn.addEventListener('click', () => panel.classList.toggle('open'))

    // Raccourci Ctrl+D
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault()
            panel.classList.toggle('open')
        }
    })
})()
</script>
