## Accidents
- [ ] Quelle structure finale pour Adresse?
- [ ] valider migration create_accidents_table

### Adresse pour Accidents - Obligatoire ?
Dans le CSV :
- `com` : commune INSEE (toujours présent)
- `adr` : texte libre (parfois vide)
- `lat`/`long` : coordonnées (souvent présentes)
**Stratégie d'import** :
**Option A - Créer adresses systématiquement** :
```
Pour chaque accident :
  Si adr existe → parser → créer Adresse
  Sinon → créer Adresse minimale (commune + GPS)
```
✅ Toutes adresses normalisées  
❌ Beaucoup d'adresses "vides"
**Option B - Adresse optionnelle** :
```
accidents.adresse_id (nullable)
accidents.commune_id (obligatoire)
accidents.adresse_texte (texte brut CSV)
accidents.lat / long (direct)
```
✅ Pragmatique  
✅ Moins de lignes en base
**👉 Quelle approche ?**

**Proposition hybride** :
```
accidents
├─ num_acc (PK)
├─ commune_id (FK obligatoire) → commune INSEE
├─ adresse_id (FK nullable) → si adresse parsée/créée
├─ adresse_brute (text nullable) → texte CSV original
├─ latitude (decimal nullable) → coordonnées directes
├─ longitude (decimal nullable)
├─ ... (autres champs caracteristiques)
````
**Avantages** :
- ✅ Toujours lié à une commune (stats départementales faciles)
- ✅ Adresse normalisée si possible
- ✅ Garde texte brut pour référence
- ✅ GPS direct (pas besoin de géocoder)


## Model

app/Models/Accident.php
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accident extends Model
{
    protected $primaryKey = 'num_acc';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'num_acc','an','mois','jour','hrmn','lum','agg','inter','atm','col','com','adr','gps','lat','long','dep','domain'
    ];

    protected $casts = [
        'lat' => 'decimal:5',
        'long' => 'decimal:5',
        'an' => 'integer',
        'mois' => 'integer',
        'col' => 'integer',
    ];

    public function lieu() { return $this->hasOne(Lieu::class,'num_acc','num_acc'); }
    public function vehicules() { return $this->hasMany(Vehicule::class,'num_acc','num_acc'); }
    public function usagers() { return $this->hasMany(Usager::class,'num_acc','num_acc'); }
    public function presse() { return $this->hasMany(InformationPresse::class,'num_acc','num_acc'); }
    public function pointsNoirs() { return $this->belongsToMany(PointNoir::class,'accident_point_noir','num_acc','point_noir_id','num_acc','id'); }
}

```

---
# 🧪 5. Contrôleurs pour API JSON
- AccidentService ,Service API Laravel
- AccidentController (index + show)
## AccidentController
app/Http/Controllers/Api/AccidentController.php
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AccidentService;
use Illuminate\Http\Request;

class AccidentController extends Controller
{
    protected $service;
    public function __construct(AccidentService $service) { $this->service = $service; }

    public function index(Request $request)
    {
        $filters = $request->only(['annee','mois','jour','dep','col','catv','ville','com']);
        $perPage = $request->get('per_page', 100);
        return response()->json($this->service->liste($filters, $perPage));
    }

    public function show($num_acc)
    {
        return response()->json($this->service->detail($num_acc));
    }
}

```

---
### AccidentService


app/Services/AccidentService.php
```php
<?php
namespace App\Services;

use App\Models\Accident;

class AccidentService
{
    public function liste(array $filters = [], $perPage = 100)
    {
        $q = Accident::query();

        if (!empty($filters['annee'])) $q->where('an', $filters['annee']);
        if (!empty($filters['mois'])) $q->where('mois', $filters['mois']);
        if (!empty($filters['jour'])) $q->where('jour', $filters['jour']);
        if (!empty($filters['dep'])) $q->where('dep', $filters['dep']);
        if (!empty($filters['col'])) $q->where('col', $filters['col']);
        if (!empty($filters['catv'])) $q->whereHas('vehicules', function($qq) use ($filters){
            $qq->where('catv', $filters['catv']);
        });
        if (!empty($filters['ville']) || !empty($filters['com'])) {
            $q->where(function($qq) use ($filters){
                if (!empty($filters['ville'])) $qq->where('adr','like','%'.$filters['ville'].'%');
                if (!empty($filters['com'])) $qq->where('com', $filters['com']);
            });
        }

        return $q->with(['lieu','vehicules','usagers','presse'])->paginate($perPage);
    }

    public function detail(string $numAcc)
    {
        return Accident::with(['lieu','vehicules.usagers','usagers','presse','pointsNoirs'])->where('num_acc', $numAcc)->firstOrFail();
    }
}

```

