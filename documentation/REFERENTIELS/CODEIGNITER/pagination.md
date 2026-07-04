la pagination dans CodeIgniter :

- **CodeIgniter** proposent une bibliothèque de pagination simple à configurer et flexible.
- Elle permet de générer automatiquement les liens de pagination (numéros de pages, liens "Précédent", "Suivant", etc.).
- La pagination s’intègre facilement avec les requêtes sur les modèles ou Query Builder, en définissant la limite (`limit`) et l’offset.
- Vous pouvez personnaliser le style des liens de pagination pour l’adapter à votre design.
- La bibliothèque gère aussi la détection automatique du numéro de page dans l’URL.


### Exemple rapide (CodeIgniter 4) :

```php
$pager = \Config\Services::pager();

$model = new MotModel();
$data = [
    'mots' => $model->paginate(10),  // 10 résultats par page
    'pager' => $model->pager
];

return view('mots_list', $data);
```

Dans la vue, vous affichez les liens de pagination avec :

```php
<?= $pager->links() ?>
```

---

### En résumé

- Oui, CodeIgniter a une gestion intégrée de la pagination.
- Elle est simple à utiliser et personnalisable.
- Compatible avec les modèles et Query Builder.

Si vous souhaitez, je peux vous fournir un exemple complet d’implémentation de pagination dans un contrôleur et une vue CodeIgniter. Voulez-vous ?

Suivi

Propose un contrôleur mot qui gère la pagination pour une api

Voici un exemple complet d’un contrôleur API `Mot` en CodeIgniter 4 qui gère la pagination pour retourner les mots par page au format JSON.

---

## Contrôleur API Mot avec pagination (app/Controllers/Api/Mot.php)

```php
<?php namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\MotModel;

class Mot extends BaseController
{
    protected $motModel;

    public function __construct()
    {
        $this->motModel = new MotModel();
    }

    /**
     * Retourne une liste paginée de mots au format JSON.
     * Paramètres GET :
     * - page : numéro de la page (par défaut 1)
     * - per_page : nombre d'éléments par page (par défaut 10)
     */
    public function index()
    {
        $page = (int) $this->request->getGet('page') ?? 1;
        $perPage = (int) $this->request->getGet('per_page') ?? 10;

        // Récupération paginée via le modèle
        $mots = $this->motModel->paginate($perPage, 'default', $page);

        // Informations de pagination
        $pager = $this->motModel->pager;

        $response = [
            'data' => $mots,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'per_page' => $perPage,
                'total_pages' => $pager->getPageCount(),
                'total_items' => $pager->getTotal(),
                'has_next' => $pager->hasNext(),
                'has_previous' => $pager->hasPrevious(),
            ]
        ];

        return $this->response->setJSON($response);
    }
}
```

---

## Explications

- La méthode `paginate()` du modèle récupère les résultats paginés.
- Le troisième argument de `paginate($perPage, $group, $page)` permet de spécifier la page actuelle.
- L’objet `$pager` fournit des informations utiles sur la pagination (nombre total de pages, page courante, etc.).
- La réponse JSON contient les données et un objet `pagination` avec les métadonnées.

---

## Exemple d’appel API

```ini
GET /api/mot?page=2&per_page=5
```

Réponse JSON :

```json
{
  "data": [
    {"mot_id": 6, "mot_lbl": "exemple6"},
    {"mot_id": 7, "mot_lbl": "exemple7"},
    {"mot_id": 8, "mot_lbl": "exemple8"},
    {"mot_id": 9, "mot_lbl": "exemple9"},
    {"mot_id": 10, "mot_lbl": "exemple10"}
  ],
  "pagination": {
    "current_page": 2,
    "per_page": 5,
    "total_pages": 4,
    "total_items": 20,
    "has_next": true,
    "has_previous": true
  }
}
```

---

Si vous souhaitez, je peux aussi vous aider à gérer la recherche avec pagination ou d’autres fonctionnalités dans ce contrôleur.

Suivi

Peut tu me produire une page html minimaliste avec un formulaire, un div de retour. On affiche le json ou une erreur. Utilise xmlhttprequest

Voici une page HTML minimaliste avec un formulaire permettant de saisir un `id` ou un `mot` pour interroger l’API `/api/mot`. La réponse JSON ou un message d’erreur s’affiche dans un div. La requête est réalisée avec `XMLHttpRequest`.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Recherche Mot API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2em; }
        label, input, button { font-size: 1em; margin: 0.5em 0; }
        #result { margin-top: 1em; white-space: pre-wrap; background: #f0f0f0; padding: 1em; border-radius: 4px; }
        .error { color: red; }
    </style>
</head>
<body>

<h2>Recherche Mot API</h2>

<form id="motForm">
    <label for="idInput">ID (optionnel) :</label><br />
    <input type="number" id="idInput" name="id" min="1" /><br />

    <label for="qInput">Mot (optionnel) :</label><br />
    <input type="text" id="qInput" name="q" /><br />

    <button type="submit">Rechercher</button>
</form>

<div id="result"></div>

<script>
document.getElementById('motForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('idInput').value.trim();
    const q = document.getElementById('qInput').value.trim();

    if (!id && !q) {
        showResult('Veuillez saisir un ID ou un mot.', true);
        return;
    }

    let url = '/api/mot?';
    if (id) {
        url += 'id=' + encodeURIComponent(id);
    } else {
        url += 'q=' + encodeURIComponent(q);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const resultDiv = document.getElementById('result');
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    showResult(JSON.stringify(json, null, 2), false);
                } catch (err) {
                    showResult('Erreur lors du parsing de la réponse JSON.', true);
                }
            } else {
                showResult('Erreur ' + xhr.status + ': ' + xhr.statusText, true);
            }
        }
    };

    xhr.send();
});

function showResult(message, isError) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    if (isError) {
        resultDiv.classList.add('error');
    } else {
        resultDiv.classList.remove('error');
    }
}
</script>

</body>
</html>
```

---

### Fonctionnement :

- L’utilisateur peut saisir un `id` ou un `mot` (champ `q`).
- Le formulaire envoie une requête GET à `/api/mot` avec le paramètre correspondant.
- La réponse JSON est affichée joliment formatée dans le div `#result`.
- En cas d’erreur (réponse HTTP non 2xx ou JSON invalide), un message d’erreur s’affiche en rouge.
