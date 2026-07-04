```php

use App\Http\Controllers\Api\FormeJuridiqueController;

// ==========================================
// ROUTES FORMES JURIDIQUES (lecture seule)
// ==========================================
Route::prefix('formesjuridiques')->group(function () {
    Route::get('/', [FormeJuridiqueController::class, 'index']); // Liste paginée
    Route::get('/search', [FormeJuridiqueController::class, 'search']); // Recherche avec pagination
    Route::get('/count', [FormeJuridiqueController::class, 'count']); // Compteur total
    Route::get('/codes', [FormeJuridiqueController::class, 'codes']); // Liste codes uniquement
    Route::get('/{id}', [FormeJuridiqueController::class, 'show']); // Par code spécifique
});
```