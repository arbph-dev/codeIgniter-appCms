<?= $this->extend('layouts/cms') ?>

<?= $this->section('title') ?>Administration<?= $this->endSection() ?>

<?= $this->section('head') ?>
<script type="module">
import { bus }         from '/assets/js/core/eventBus.js'
import { initSidebar } from '/assets/js/ihm/sidebar.js'
import { initTabs }    from '/assets/js/ihm/tabspage.js'
import * as domhelper  from '/assets/js/core/domhelper.js'
import { initCallout } from '/assets/js/ihm/callout.js'

// ── Données PHP → JS ────────────────────────────────────────────────────────
const USERS = <?= json_encode($users ?? [], JSON_UNESCAPED_UNICODE) ?>;

// ── État ────────────────────────────────────────────────────────────────────
let currentFilter = ''
let currentSort   = { col: 'id', order: 'asc' }
let selectedUser  = null

// ── Utilitaires ─────────────────────────────────────────────────────────────
function sortUsers(data) {
    return [...data].sort((a, b) => {
        let va = a[currentSort.col] ?? ''
        let vb = b[currentSort.col] ?? ''
        if (typeof va === 'string') va = va.toLowerCase()
        if (typeof vb === 'string') vb = vb.toLowerCase()
        if (va < vb) return currentSort.order === 'asc' ? -1 : 1
        if (va > vb) return currentSort.order === 'asc' ?  1 : -1
        return 0
    })
}

function filterUsers(data) {
    const q = currentFilter.toLowerCase()
    if (!q) return data
    return data.filter(u =>
        (u.username  ?? '').toLowerCase().includes(q) ||
        (u.email     ?? '').toLowerCase().includes(q) ||
        (u.groups    ?? []).join(' ').toLowerCase().includes(q)
    )
}

function badgeGroups(groups) {
    if (!groups?.length) return '<span class="adm-badge adm-badge--none">—</span>'
    return groups.map(g =>
        `<span class="adm-badge adm-badge--${g}">${g}</span>`
    ).join(' ')
}

function statusDot(active) {
    return active
        ? '<span class="adm-dot adm-dot--ok" title="Actif"></span>'
        : '<span class="adm-dot adm-dot--off" title="Inactif"></span>'
}

// ── Rendu tableau ────────────────────────────────────────────────────────────
function renderTable() {
    const tbody = document.querySelector('#admUsersTable tbody')
    if (!tbody) return

    const data = sortUsers(filterUsers(USERS))

    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="adm-empty">Aucun résultat</td></tr>'
        return
    }

    tbody.innerHTML = data.map(u => `
        <tr class="adm-row ${selectedUser?.id === u.id ? 'adm-row--selected' : ''}"
            data-id="${u.id}">
            <td>${statusDot(u.active)}</td>
            <td><strong>${u.username ?? '—'}</strong></td>
            <td>${u.email ?? '—'}</td>
            <td>${badgeGroups(u.groups)}</td>
            <td><button class="adm-btn adm-btn--sm" data-action="detail" data-id="${u.id}">
                <i class="fa fa-eye"></i>
            </button></td>
        </tr>
    `).join('')

    // Clic ligne
    tbody.querySelectorAll('.adm-row').forEach(tr => {
        tr.addEventListener('click', (e) => {
            if (e.target.closest('[data-action]')) return
            const id   = parseInt(tr.dataset.id)
            const user = USERS.find(u => u.id === id)
            if (user) showDetail(user)
        })
    })

    // Clic bouton détail
    tbody.querySelectorAll('[data-action="detail"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id   = parseInt(btn.dataset.id)
            const user = USERS.find(u => u.id === id)
            if (user) showDetail(user)
        })
    })
}

// ── Panneau détail ───────────────────────────────────────────────────────────
function showDetail(user) {
    selectedUser = user
    const panel = document.getElementById('admUserDetail')
    if (!panel) return

    const perms = user.permissions?.length
        ? user.permissions.map(p => `<span class="adm-badge">${p}</span>`).join(' ')
        : '<span class="adm-badge adm-badge--none">—</span>'

    panel.innerHTML = `
        <div class="adm-detail-header">
            <div class="adm-avatar">${(user.username?.[0] ?? '?').toUpperCase()}</div>
            <div>
                <h3>${user.username ?? '—'}</h3>
                <p>${user.email ?? '—'}</p>
            </div>
            <button class="adm-btn adm-btn--ghost" id="admCloseDetail">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <dl class="adm-dl">
            <dt>ID</dt>           <dd>${user.id}</dd>
            <dt>Statut</dt>       <dd>${user.active ? '✓ Actif' : '✗ Inactif'}</dd>
            <dt>Créé le</dt>      <dd>${user.created_at ?? '—'}</dd>
            <dt>Groupes</dt>      <dd>${badgeGroups(user.groups)}</dd>
            <dt>Permissions</dt>  <dd>${perms}</dd>
        </dl>
    `

    panel.style.display = 'block'

    document.getElementById('admCloseDetail')?.addEventListener('click', () => {
        panel.style.display = 'none'
        selectedUser = null
        renderTable()
    })

    renderTable() // met à jour la surbrillance
}

// ── Tri colonnes ─────────────────────────────────────────────────────────────
function initSort() {
    document.querySelectorAll('#admUsersTable thead th[data-col]').forEach(th => {
        th.addEventListener('click', () => {
            const col = th.dataset.col
            if (currentSort.col === col) {
                currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc'
            } else {
                currentSort = { col, order: 'asc' }
            }
            document.querySelectorAll('#admUsersTable thead th[data-col]').forEach(t => {
                t.querySelector('.sort-icon').textContent =
                    (t.dataset.col === col)
                        ? (currentSort.order === 'asc' ? ' ▲' : ' ▼')
                        : ' ▲'
            })
            renderTable()
        })
    })
}

// ── Stats cards ──────────────────────────────────────────────────────────────
function renderStats() {
    const total   = USERS.length
    const active  = USERS.filter(u => u.active).length
    const admins  = USERS.filter(u => (u.groups ?? []).includes('admin') || (u.groups ?? []).includes('superadmin')).length

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val }
    set('statTotal',  total)
    set('statActive', active)
    set('statAdmins', admins)
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSidebar()
    initTabs()
    domhelper.init()
    initCallout()

    renderStats()
    renderTable()
    initSort()

    // Filtre
    document.getElementById('admFilter')?.addEventListener('input', (e) => {
        currentFilter = e.target.value
        renderTable()
    })
})
</script>

<style>
/* ── Admin styles ─────────────────────────────────────────────────────────── */
.adm-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}
.adm-stat-card {
    flex: 1 1 120px;
    background: var(--col-E, #fff);
    border: 2px solid var(--textcolor, darkblue);
    border-radius: 10px;
    padding: 14px 18px;
    text-align: center;
}
.adm-stat-card .adm-stat-val {
    font-size: 2rem;
    font-weight: bold;
    color: var(--textcolor, darkblue);
    display: block;
}
.adm-stat-card .adm-stat-lbl {
    font-size: 0.8rem;
    opacity: 0.7;
}

/* Filtre */
.adm-filter-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
}
.adm-filter-row input {
    flex: 1 1 200px;
    padding: 7px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
}

/* Table */
#admUsersTable {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}
#admUsersTable th {
    background: var(--textcolor, darkblue);
    color: var(--bgcolor, lightblue);
    padding: 8px 12px;
    text-align: left;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
#admUsersTable th:hover { opacity: 0.85; }
#admUsersTable td {
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: middle;
}
.adm-row { cursor: pointer; transition: background 0.15s; }
.adm-row:hover { background: #f0f4ff; }
.adm-row--selected { background: #ddeeff !important; }
.adm-empty { text-align: center; padding: 20px; opacity: 0.5; }

/* Badges */
.adm-badge {
    display: inline-block;
    background: #e8eaf6;
    color: #3949ab;
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 0.78rem;
    margin: 1px;
}
.adm-badge--none    { background: transparent; color: #aaa; }
.adm-badge--admin   { background: #c0392b; color: #fff; }
.adm-badge--superadmin { background: #8e44ad; color: #fff; }

/* Dot statut */
.adm-dot {
    display: inline-block;
    width: 10px; height: 10px;
    border-radius: 50%;
}
.adm-dot--ok  { background: #2ecc71; }
.adm-dot--off { background: #bdc3c7; }

/* Boutons */
.adm-btn {
    padding: 5px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85rem;
    background: var(--textcolor, darkblue);
    color: var(--bgcolor, lightblue);
    transition: opacity 0.2s;
}
.adm-btn:hover   { opacity: 0.8; }
.adm-btn--sm     { padding: 3px 8px; font-size: 0.8rem; }
.adm-btn--ghost  {
    background: transparent;
    color: var(--textcolor, darkblue);
    border: 1px solid currentColor;
    margin-left: auto;
}

/* Panneau détail */
#admUserDetail {
    display: none;
    background: var(--col-E, #fff);
    border: 2px solid var(--textcolor, darkblue);
    border-radius: 10px;
    padding: 16px;
    margin-top: 16px;
}
.adm-detail-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
}
.adm-avatar {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--textcolor, darkblue);
    color: var(--bgcolor, lightblue);
    font-size: 1.4rem;
    font-weight: bold;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.adm-detail-header h3 { margin: 0; }
.adm-detail-header p  { margin: 2px 0 0; opacity: 0.6; font-size: 0.85rem; }

.adm-dl {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 6px 12px;
    font-size: 0.9rem;
}
.adm-dl dt { font-weight: 600; opacity: 0.7; }
.adm-dl dd { margin: 0; }
</style>
<?= $this->endSection() ?>


<!-- ── Nav ────────────────────────────────────────────────────────────────── -->
<?= $this->section('nav') ?>
<nav id="sidebar">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
</nav>
<?= $this->endSection() ?>


<!-- ── Header ─────────────────────────────────────────────────────────────── -->
<?= $this->section('header') ?>
<header>
    <div class="header-top">
        <button class="rwdnav" onclick="openNav()" aria-label="Menu">
            <i class="fa fa-bars"></i>
        </button>
        <div class="header-titles">
            <h1><i class="fa fa-cog"></i> Administration</h1>
            <p>Gestion des utilisateurs · <?= esc(auth()->user()->username) ?></p>
        </div>
        <div class="header-auth">
            <a class="auth-link" href="/"><i class="fa fa-home"></i><span>Portail</span></a>
            <a class="auth-link" href="/user"><i class="fa fa-user"></i><span>Profil</span></a>
            <a class="auth-link auth-logout" href="/logout"><i class="fa fa-sign-out"></i><span>Logout</span></a>
        </div>
    </div>
</header>
<?= $this->endSection() ?>


<!-- ── Main ───────────────────────────────────────────────────────────────── -->
<?= $this->section('main') ?>
<main>

    <article id="tab1" class="cp_soft-card" style="display:block;">

        <header>
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble des comptes utilisateurs</p>
        </header>

        <!-- Section : stats -->
        <section>
            <h2>Statistiques</h2>
            <div>
                <div>
                    <div class="adm-stats">
                        <div class="adm-stat-card">
                            <span class="adm-stat-val" id="statTotal">—</span>
                            <span class="adm-stat-lbl">Utilisateurs</span>
                        </div>
                        <div class="adm-stat-card">
                            <span class="adm-stat-val" id="statActive">—</span>
                            <span class="adm-stat-lbl">Actifs</span>
                        </div>
                        <div class="adm-stat-card">
                            <span class="adm-stat-val" id="statAdmins">—</span>
                            <span class="adm-stat-lbl">Admins</span>
                        </div>
                    </div>
                </div>
                <aside>
                    <?php if ($isSuperAdmin ?? false): ?>
                    <div class="cp_callout note">
                        <div class="titre">Super Admin</div>
                        <div class="content">
                            Vous avez les droits superadmin.<br>
                            Gestion complète des groupes et permissions.
                        </div>
                    </div>
                    <?php else: ?>
                    <div class="cp_callout info">
                        <div class="titre">Admin</div>
                        <div class="content">
                            Droits d'administration standard.<br>
                            Consultation des utilisateurs et groupes.
                        </div>
                    </div>
                    <?php endif; ?>
                </aside>
            </div>
        </section>

        <!-- Section : liste utilisateurs -->
        <section>
            <h2>Utilisateurs</h2>
            <div>
                <div>
                    <div class="adm-filter-row">
                        <input type="search" id="admFilter"
                               placeholder="Filtrer par nom, email, groupe…"
                               autocomplete="off">
                    </div>

                    <table id="admUsersTable">
                        <thead>
                            <tr>
                                <th style="width:30px;"></th>
                                <th data-col="username">Nom <span class="sort-icon">▲</span></th>
                                <th data-col="email">Email <span class="sort-icon">▲</span></th>
                                <th>Groupes</th>
                                <th style="width:50px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="5" class="adm-empty">Chargement…</td></tr>
                        </tbody>
                    </table>

                    <div id="admUserDetail"></div>
                </div>
                <aside>
                    <div class="cp_callout warning">
                        <div class="titre">Légende</div>
                        <div class="content">
                            <span class="adm-dot adm-dot--ok"></span> Actif<br>
                            <span class="adm-dot adm-dot--off"></span> Inactif<br><br>
                            <span class="adm-badge adm-badge--superadmin">superadmin</span><br>
                            <span class="adm-badge adm-badge--admin">admin</span><br>
                            <span class="adm-badge">user</span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>

    </article>
    <?= view('cms/components/cp_base') ?>
</main>
<?= $this->endSection() ?>


<!-- ── Footer ─────────────────────────────────────────────────────────────── -->
<?= $this->section('footer') ?>
<footer>
    Administration · CodeIgniter <?= \CodeIgniter\CodeIgniter::CI_VERSION ?>
</footer>
<?= $this->endSection() ?>
