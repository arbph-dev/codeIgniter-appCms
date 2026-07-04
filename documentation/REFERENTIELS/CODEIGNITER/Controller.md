En CodeIgniter, les contrôleurs sont des classes qui gèrent les requêtes HTTP et orchestrent la logique métier avant de retourner une réponse (souvent une vue). Il n’y a pas de fonctions « standard » imposées par le framework, mais certaines méthodes sont couramment utilisées par convention pour structurer les contrôleurs, notamment :

---

## Fonctions courantes dans un contrôleur CodeIgniter

|Fonction|Description|Paramètres typiques|
|---|---|---|
|**index()**|Méthode par défaut appelée si aucune autre méthode n’est spécifiée dans l’URL.|Aucun paramètre ou parfois des paramètres optionnels (ex: pagination)|
|**show($id)**|Affiche un élément spécifique (ex: un article, une rubrique) identifié par un identifiant ou slug.|`$id` ou `$slug` : identifiant ou slug de l’élément à afficher|
|**create()**|Affiche un formulaire pour créer un nouvel élément.|Généralement aucun paramètre|
|**store()**|Traite la soumission du formulaire de création et sauvegarde les données.|Données POST généralement récupérées via `$this->request->getPost()`|
|**edit($id)**|Affiche un formulaire pour modifier un élément existant.|`$id` : identifiant de l’élément à modifier|
|**update($id)**|Traite la soumission du formulaire d’édition et met à jour l’élément.|`$id` : identifiant, données POST via `$this->request->getPost()`|
|**delete($id)**|Supprime un élément identifié.|`$id` : identifiant de l’élément à supprimer|

---

## Détails sur les méthodes les plus utilisées

### 1. `index()`

- Point d’entrée par défaut d’un contrôleur.
- Exemple d’URL : `/rubrique` appelle `Rubrique::index()`.
- Peut afficher une liste d’éléments (ex: toutes les rubriques).
- Peut accepter des paramètres optionnels (ex: page pour pagination).

### 2. `show($id)`

- Affiche un élément précis.
- Exemple d’URL : `/article/29` appelle `Article::show(29)`.
- `$id` peut être un identifiant numérique ou un slug (chaîne).

### 3. `create()` et `store()`

- `create()` affiche un formulaire vide.
- `store()` traite la soumission du formulaire (POST).
- Souvent utilisés ensemble pour la création d’éléments.

### 4. `edit($id)` et `update($id)`

- `edit($id)` affiche un formulaire pré-rempli pour modifier un élément.
- `update($id)` traite la soumission du formulaire (POST) pour mettre à jour.

### 5. `delete($id)`

- Supprime un élément.
- Peut être déclenché via une requête POST ou DELETE.

---

## Exemple simple d’un contrôleur avec ces méthodes

```php
namespace App\Controllers;

use App\Models\ArticleModel;

class Article extends BaseController
{
    public function index()
    {
        $model = new ArticleModel();
        $articles = $model->findAll();
        return view('article/index', ['articles' => $articles]);
    }

    public function show($slug)
    {
        $model = new ArticleModel();
        $article = $model->where('slug', $slug)->first();
        if (!$article) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
        return view('article/show', ['article' => $article]);
    }

    public function create()
    {
        return view('article/create');
    }

    public function store()
    {
        $model = new ArticleModel();
        $data = $this->request->getPost();
        $model->insert($data);
        return redirect()->to('/article');
    }

    public function edit($id)
    {
        $model = new ArticleModel();
        $article = $model->find($id);
        return view('article/edit', ['article' => $article]);
    }

    public function update($id)
    {
        $model = new ArticleModel();
        $data = $this->request->getPost();
        $model->update($id, $data);
        return redirect()->to('/article');
    }

    public function delete($id)
    {
        $model = new ArticleModel();
        $model->delete($id);
        return redirect()->to('/article');
    }
}
```

---

## En résumé

- **index()** : liste ou page d’accueil du contrôleur, sans paramètre obligatoire.
- **show($id)** : affiche un élément précis, paramètre obligatoire.
- **create(), store()** : création d’éléments.
- **edit(id),update(id)** : modification d’éléments.
- **delete($id)** : suppression d’éléments.

Ces méthodes ne sont pas imposées par CodeIgniter, mais sont des conventions largement adoptées pour structurer proprement vos contrôleurs.

---

