La structuration des API nécessitent quelques contrats.

On reprend différentes notes déjà réalisé sur ce sujet et on déterminera les contrats.

## Note d'architecture API — synthèse

### Principe directeur

Ne pas construire un `RelationService` universel avant d'avoir cartographié les relations métier concrètes. L'ordre : modèle de données → contrat des relations → API → composants UI. Ce que les travaux Personne/Organisation ont confirmé.

---

### Structure des routes — contrat standard

Chaque ressource expose ce jeu de routes :

```
GET    /api/{resource}              liste paginée
GET    /api/{resource}/like         autocomplete
GET    /api/{resource}/batch        résolution multi-IDs (lazy load)
GET    /api/{resource}/:id          détail
GET    /api/{resource}/:id/{rel}    sous-ressource (relation explicite)
POST   /api/{resource}
PUT    /api/{resource}/:id
DELETE /api/{resource}/:id
```

`include` sur le détail pour les relations optionnelles, whitelistées, jamais implicites :

```
GET /api/organisation/12?include=adresse,entreprises
```

---

### `meta` — à généraliser sur toutes les API

Remplace le `pager` CI brut. Echo des paramètres de la requête — utile pour le cache client et le débogage :

json

```json
"meta": {
    "page"     : 1,
    "per_page" : 20,
    "total"    : 150,
    "pages"    : 8,
    "q"        : "lilas",
    "sort"     : "nom",
    "order"    : "asc",
    "fields"   : ["id", "nom"],
    "has_more" : true
}
```

---

### Lazy loading — graphe explicite, jamais automatique

Le graphe métier se parcourt niveau par niveau :

```
GET /organisation/:id
        → GET /organisation/:id/entreprises
                → GET /entreprise/:id/etablissements
                        → GET /etablissement/:id/services
```

Aucun `JOIN` massif par défaut. Le backend ne reconstruit pas le graphe entier. Côté front, le `initFn` du TabSystem déclenche le fetch au premier clic sur l'onglet — zéro requête si l'onglet n'est jamais visité.

---

### Sparse fields & tri — paramètres standard

```
?fields=id,nom          colonnes retournées (whitelist)
?sort=nom&order=asc     tri contrôlé côté client (whitelist)
?q=...                  recherche
?len=10                 limite autocomplete
?ids=1,2,3              batch
```

---

### Entities — règle à poser maintenant

Tout modèle qui participe à une API doit avoir `$returnType` configuré sur son Entity. Sans ça : `->propriété` échoue silencieusement (tableau retourné à la place), les `$casts` (dates CI, booléens) ne s'appliquent pas, et `enrich()` doit faire de la détection défensive. C'est exactement ce qu'a révélé `OrganisationModel`.

---

### Versioning

Non traité dans les documents existants — à définir. Recommandation minimale : préfixe `/api/v1/` sur les nouvelles routes, les routes actuelles restant non versionnées pendant la période de transition.
