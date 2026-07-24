
# evolution - prenom

```sql
CREATE TABLE prenom (
    prenom_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    fk_mot_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (prenom_id),
    CONSTRAINT fk_prenom_mot FOREIGN KEY (fk_mot_id) REFERENCES mots(mot_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

```

### Modèle Prenom (app/Models/PrenomModel.php)

```php
<?php namespace App\Models;

use CodeIgniter\Model;

class PrenomModel extends Model
{
    protected $table = 'prenom';
    protected $primaryKey = 'prenom_id';
    protected $allowedFields = ['fk_mot_id'];
    protected $returnType = 'array';

    // Recherche par id
    public function getById(int $id)
    {
        return $this->find($id);
    }

    // Recherche par fk_mot_id
    public function getByMotId(int $motId)
    {
        return $this->where('fk_mot_id', $motId)->findAll();
    }
}
```

### Contrôleur Prenom (app/Controllers/Api/Prenom.php)

```php
<?php namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\PrenomModel;

class Prenom extends BaseController
{
    protected $prenomModel;

    public function __construct()
    {
        $this->prenomModel = new PrenomModel();
    }

    // Retourne un prénom par id ou par fk_mot_id (query param 'mot_id')
    public function index()
    {
        $id = $this->request->getGet('id');
        $motId = $this->request->getGet('mot_id');

        if ($id) {
            $prenom = $this->prenomModel->getById((int)$id);
            if ($prenom) {
                return $this->response->setJSON($prenom);
            }
            return $this->response->setStatusCode(404, 'Prenom not found');
        }

        if ($motId) {
            $prenoms = $this->prenomModel->getByMotId((int)$motId);
            return $this->response->setJSON($prenoms);
        }

        return $this->response->setStatusCode(400, 'Missing parameter id or mot_id');
    }
}
```

### Routes API (fichier `app/Config/Routes.php`)

Ajoutez ces routes pour exposer les API :

```php
$routes->group('api', function($routes) {
    ...
    $routes->get('prenom', 'Api\Prenom::index');
    ...
});
```

### Utilisation des API

- Pour récupérer un mot par id :  
    `GET /api/mot?id=123`
    
- Pour rechercher des mots par label partiel :  
    `GET /api/mot?q=exemple`
    
- Pour récupérer un prénom par id :  
    `GET /api/prenom?id=456`
    
- Pour récupérer tous les prénoms liés à un mot :  
    `GET /api/prenom?mot_id=123`
