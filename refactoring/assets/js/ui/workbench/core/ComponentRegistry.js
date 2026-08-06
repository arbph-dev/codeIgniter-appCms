// assets/js/ui/workbench/core/ComponentRegistry.js
// ─────────────────────────────────────────────────────────────────────────────
// Registre et orchestrateur d'initialisation des composants embarqués
// (apex, mermaid, leaflet, three, codeval…).
//
// Chaque composant expose une fonction initXxx(root?) :
//   • sans argument  → scan du document entier (mode flat ou bootstrap bus)
//   • avec root      → scan ciblé dans root uniquement (mode tabs, par pane)
//
// Le comportement de initAll() dépend de l'état du DOM au moment de l'appel,
// pas de la méthode elle-même :
//   • panes vides     → seules les bus subscriptions sont enregistrées
//   • panes peuplés   → composants réellement initialisés
//
// ─────────────────────────────────────────────────────────────────────────────

export class ComponentRegistry
{
    /**
     * @param {string} [name]  Nom affiché dans les logs (facultatif)
     */
    constructor(name = 'ComponentRegistry')
    {
        this._name = name
        this._map  = new Map()   // nom → initFn
    }

    // ── API publique ──────────────────────────────────────────────────────────

    /**
     * Enregistre un composant.
     *
     * @param {string}   name    Identifiant (ex. 'apex', 'mermaid')
     * @param {Function} initFn  Fonction d'initialisation (root?) => void
     * @returns {this}           Chaînable
     */
    register(name, initFn)
    {
        this._map.set(name, initFn)
        return this
    }

    /**
     * Initialise tous les composants sans racine ciblée.
     *
     * Mode flat  : le contenu est déjà dans le DOM → init réelle.
     * Mode tabs  : les panes sont vides → seules les bus subscriptions
     *              sont enregistrées, aucun élément DOM n'est trouvé.
     */
    initAll()
    {
        for (const [name, fn] of this._map)
        {
            try
            {
                fn()
            }
            catch (e)
            {
                console.error(`[${this._name}] initAll — "${name}"`, e)
            }
        }
    }

    /**
     * Initialise les composants uniquement dans la racine fournie.
     * Utilisé en mode tabs : chaque pane est initialisé à son chargement,
     * les panes déjà rendus ne sont pas affectés.
     *
     * @param {HTMLElement} root  Élément racine du pane courant
     */
    initIn(root)
    {
        for (const [name, fn] of this._map)
        {
            try
            {
                fn(root)
            }
            catch (e)
            {
                console.error(`[${this._name}] initIn — "${name}"`, e)
            }
        }
    }

    /**
     * Retourne les noms des composants enregistrés.
     * @returns {IterableIterator<string>}
     */
    keys()
    {
        return this._map.keys()
    }

    /**
     * Libère toutes les références.
     */
    destroy()
    {
        this._map.clear()
    }
}

export default ComponentRegistry
