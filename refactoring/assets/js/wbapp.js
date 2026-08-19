// assets/js/wbapp.js
// ─────────────────────────────────────────────────────────────────────────────
// Couche application — orchestre auth et cycle de vie des Workbenches.
//
// Convention vue :
//   <div id="organisationWorkbench" data-workbench="organisation"></div>
//   <script type="module" src="/assets/js/app.js"></script>
// ─────────────────────────────────────────────────────────────────────────────

import { bus }                from './core/eventBus.js'
import { initAuthController } from './features/auth/auth.controller.js'
import ToolbarAuthPanel       from './ui/workbench/auth/ToolbarAuthPanel.js'

const _wbs = []

// ── Auth ──────────────────────────────────────────────────────────────────────

function initAuth()
{
    initAuthController()
    new ToolbarAuthPanel().init()
}

// ── Workbenches ───────────────────────────────────────────────────────────────

async function mountWorkbenches()
{
    const zones = document.querySelectorAll('[data-workbench]')
    if (!zones.length) return

    for (const el of zones)
    {
        const type     = el.dataset.workbench
        const selector = `#${el.id}`

        try
        {
            const { default: Klass } = await import(
                `/assets/js/ui/workbench/${type}/${el.id}.js`
            )
            const wb = new Klass()
            wb.init(selector)
            _wbs.push(wb)
        }
        catch (err)
        {
            console.error(`[app] Workbench "${type}" introuvable.`, err)
        }
    }
}

function destroyWorkbenches()
{
    _wbs.forEach(wb => wb.destroy())
    _wbs.length = 0
}

// ── Boot ──────────────────────────────────────────────────────────────────────

function boot()
{
    initAuth()

    bus.subscribe('auth:success', () => mountWorkbenches())
    bus.subscribe('auth:guest',   () => destroyWorkbenches())

    bus.publish('auth:check')
}

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot)
else
    boot()
