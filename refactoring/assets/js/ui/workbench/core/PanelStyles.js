// assets/js/ui/workbench/core/PanelStyles.js
// ─────────────────────────────────────────────────────────────────────────────
// Jetons CSS structurels des Panels Workbench.
//
// - Noms de classes uniquement (pas de couleurs).
// - Theming clair/sombre → variables CSS (--wb-*), pas ce module.
// - Override partiel via createPanelStyles(defaults, override).
// ─────────────────────────────────────────────────────────────────────────────

/** Canon ListPanel — plus de wb_mot_*. */
export const DEFAULT_LIST_STYLES = Object.freeze({
    root        : 'wb_list_panel',
    header      : 'wb_panel_header',
    btn         : 'wb-btn',
    btnNew      : 'wb-btn',
    search      : 'wb_list_search',
    searchInput : 'wb_list_search_input',
    searchBtn   : 'wb_list_search_btn',
    body        : 'wb_list_body',
    pager       : 'wb_list_pager',
    table       : 'cp_table',
    selected    : 'selected',
})

/** Canon DetailPanel (préparation). */
export const DEFAULT_DETAIL_STYLES = Object.freeze({
    root   : 'wb_detail_panel',
    header : 'wb_panel_header',
    body   : 'wb_panel_body',
    btn    : 'wb-btn',
})

/**
 * Fusion shallow : override gagne.
 * @param {object} defaults
 * @param {object} [override]
 * @returns {Readonly<object>}
 */
export function createPanelStyles(defaults = {}, override = {})
{
    return Object.freeze({ ...defaults, ...override })
}

export default {
    DEFAULT_LIST_STYLES,
    DEFAULT_DETAIL_STYLES,
    createPanelStyles,
}