# 📦 Installation Module Formes Juridiques

## Prérequis

- Laravel (version standard)
- Package `league/csv` installé
- Fichier CSV : `G:\DATA\DB\ECONOMIQUE\catjurique2022.csv`

### Installation league/csv (si nécessaire)

```bash
composer require league/csv
```

---
## 🚀 Étapes d'installation

### 1. Créer les fichiers
Créer les fichiers suivants dans votre projet Laravel :
#### Migrations
1. migration_formesjuridiques
	[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/migration_formesjuridiques_php]]
2. migration_add_formejuridique_entreprises
	[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/migration_add_formejuridique_entreprises_php]]
```bash
php artisan make:migration create_formesjuridiques_table

# php artisan make:migration migration_add_formejuridique_entreprises

database/migrations/XXXX_XX_XX_create_formesjuridiques_table.php

```
#### Models
1. A noter [[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/model_formejuridique _php]]
	- table est spécifié
	- incrementing = false 
	- keyType string
2. [[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/model_entreprise_update_php]]
```bash
php artisan make:model FormeJuridique

app/Models/FormeJuridique.php
# Mettre à jour : app/Models/Entreprise.php
```
#### Seeder
1. [[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/seeder_formejuridique_php]]
```bash
php artisan make:seeder FormeJuridiqueSeeder
"G:\DATA\DB\ECONOMIQUE\catjurique2022.csv" 
$csvPath = 'storage/app/import/catjurique2022.csv';
# $csv->setHeaderOffset(null); // Pas d en-tête dans le CSV 
$csv->setHeaderOffset(0); # comme importype voie et import_codespostaux
# database/seeders/FormeJuridiqueSeeder.php
```
#### Controller
1. [[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/controller_formejuridique_php]]
```bash
php artisan make:controller Api/FormeJuridiqueController

app/Http/Controllers/Api/FormeJuridiqueController.php
```


```
php artisan make:migration create_formesjuridiques_table
   INFO  Migration [database/migrations/2025_12_09_031518_create_formesjuridiques_table.php] created successfully.

php artisan make:model FormeJuridique
   INFO  Model [app/Models/FormeJuridique.php] created successfully.

php artisan make:seeder FormeJuridiqueSeeder
   INFO  Seeder [database/seeders/FormeJuridiqueSeeder.php] created successfully.

php artisan make:controller Api/FormeJuridiqueController
   INFO  Controller [app/Http/Controllers/Api/FormeJuridiqueController.php] created successfully.
```

[[PUBLICATION/Laravel/database/migrations/2025_12_09_031518_create_formesjuridiques_table.php]]
[[PUBLICATION/Laravel/app/Models/FormeJuridique.php]]
[[PUBLICATION/Laravel/database/seeders/FormeJuridiqueSeeder.php]]
[[PUBLICATION/Laravel/app/Http/Controllers/Api/FormeJuridiqueController.php]]


---
### 2. Exécuter la migration

```bash
php artisan migrate:status 	# on doit voir en pending
php artisan migrate   
```

**Résultat attendu :**
- Table `formesjuridiques` créée

**Reporté :**
- Colonne `formejuridique_id` ajoutée dans `entreprises`

---
### 3. Lancer le seeder

```bash
php artisan db:seed --class=FormeJuridiqueSeeder
```

**Résultat attendu :**
```
📂 Lecture du fichier : G:\DATA\DB\ECONOMIQUE\catjurique2022.csv
🗑️  Table formesjuridiques vidée
📊 XXX enregistrements trouvés
✅ 100/XXX importés...
✅ 200/XXX importés...
...
✨ Import terminé : XXX formes juridiques importées
📈 Total en base : XXX
```

---
#### Routes
Ajouter dans `routes/api.php`
[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/routes_formejuridique_php]]

### 4. Vérifier l'installation
[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/tests_curl_formejuridique_sh]]
```bash
# Compteur
curl https://elfennel.fr/api/formesjuridiques/count

# Liste paginée
curl https://elfennel.fr/api/formesjuridiques?page=1&per_page=5

# Détail SARL (code 5499)
curl https://elfennel.fr/api/formesjuridiques/5499
```

---
## 📚 Utilisation de l'API

### Endpoints disponibles

| Méthode | Endpoint                              | Description                        |
| ------- | ------------------------------------- | ---------------------------------- |
| GET     | `/api/formesjuridiques`               | Liste paginée (20/page par défaut) |
| GET     | `/api/formesjuridiques/search?q=SARL` | Recherche avec pagination          |
| GET     | `/api/formesjuridiques/{id}`          | Détail par code INSEE              |
| GET     | `/api/formesjuridiques/count`         | Compteur total                     |
| GET     | `/api/formesjuridiques/codes`         | Liste codes uniquement             |
|         |                                       |                                    |

### Paramètres de pagination

- `page` : Numéro de page (défaut: 1)
- `per_page` : Résultats par page (défaut: 20)
- `search` : Recherche dans id/nom/description
- `q` : Recherche via endpoint /search

### Exemples de réponse

**Liste paginée :**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": "5499",
      "nom": null,
      "description": "Société à responsabilité limitée (sans autre indication)",
      "created_at": "2025-12-08T...",
      "updated_at": "2025-12-08T..."
    }
  ],
  "first_page_url": "https://elfennel.fr/api/formesjuridiques?page=1",
  "from": 1,
  "last_page": 5,
  "per_page": 20,
  "total": 95
}
```

**Détail :**
```json
{
  "id": "1000",
  "nom": null,
  "description": "Entrepreneur individuel",
  "created_at": "2025-12-08T...",
  "updated_at": "2025-12-08T..."
}
```

**Compteur :**
```json
{
  "total": 95
}
```

---


---
# Entreprise
lors de la création il faudra gérer

	# php artisan make:migration migration_add_formejuridique_entreprises
[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/migration_add_formejuridique_entreprises_php]]
	
	# database/migrations/XXXX_XX_XX_add_formejuridique_id_to_entreprises_table.php
	# php artisan migrate:status 	# on doit voir en pending
	# php artisan migrate   

[[PROJETS/BACKEND/modules/ENTREPRISE/FORMEJURIDIQUE/model_entreprise_update_php]]

----
## 🔗 Utilisation dans Eloquent

### Récupérer la forme juridique d'une entreprise

```php
$entreprise = Entreprise::with('formeJuridique')->find(1);
echo $entreprise->formeJuridique->description;
// "Société à responsabilité limitée (sans autre indication)"
```

### Récupérer toutes les entreprises d'une forme juridique

```php
$sarl = FormeJuridique::with('entreprises')->find('5499');
foreach ($sarl->entreprises as $entreprise) {
    echo $entreprise->nom;
}
```

### Créer/Modifier une entreprise avec forme juridique

```php
$entreprise = Entreprise::create([
    'nom' => 'Ma Société',
    'formejuridique_id' => '5499', // SARL
    // ... autres champs
]);
```

---

## 🧪 Validation

Exécuter le script de tests CURL pour vérifier toutes les fonctionnalités :

```bash
chmod +x tests-curl-formesjuridiques.sh
./tests-curl-formesjuridiques.sh
```

---

## 📝 Notes importantes

1. **Séparateur CSV** : Point-virgule (;) - ne pas modifier
2. **Clé primaire** : String (code INSEE), non auto-incrémentée
3. **Champ `nom`** : Nullable, à remplir manuellement si besoin d'un résumé
4. **Relation** : `Entreprise` belongsTo `FormeJuridique` (onDelete: set null)
5. **Pagination** : Compatible avec votre architecture existante (CodePostal/Images)

---

## 🐛 Dépannage

### Erreur "File not found"
Vérifier le chemin du CSV dans `FormeJuridiqueSeeder.php`

### Erreur "league/csv not found"
```bash
composer require league/csv
```

### Migration échoue (foreign key)
Vérifier que la table `formesjuridiques` existe avant d'ajouter la relation dans `entreprises`

### Seeder vide la table mais n'importe rien
Vérifier l'encodage du CSV (UTF-8) et le séparateur (;)