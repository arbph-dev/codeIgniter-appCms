```php

namespace Database\Seeders;

use App\Models\FormeJuridique;
use Illuminate\Database\Seeder;
use League\Csv\Reader;
use Illuminate\Support\Facades\DB;

class FormeJuridiqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Chemin du fichier CSV

        //$csvPath = 'G:\DATA\DB\ECONOMIQUE\catjurique2022.csv';
$csvPath = 'storage/app/import/catjurique2022.csv';

        // Vérifier l'existence du fichier
        if (!file_exists($csvPath)) {
            $this->command->error("Fichier introuvable : {$csvPath}");
            return;
        }

        $this->command->info("📂 Lecture du fichier : {$csvPath}");

        // Configuration League\Csv\Reader
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setDelimiter(';'); // IMPORTANT : séparateur point-virgule

        //$csv->setHeaderOffset(null); // Pas d'en-tête dans le CSV INSEE
$csv->setHeaderOffset(0);

        // Vider la table avant import
        DB::table('formesjuridiques')->truncate();
        $this->command->info("🗑️  Table formesjuridiques vidée");

        $records = iterator_to_array($csv->getRecords());
        $totalRecords = count($records);
        $this->command->info("📊 {$totalRecords} enregistrements trouvés");

        // Import par batch de 100
        $batch = [];
        $batchSize = 100;
        $imported = 0;

        foreach ($records as $index => $record) {
            // $record[0] = Code
            // $record[1] = Libellé
            
            if (count($record) < 2) {
                continue; // Ignorer les lignes incomplètes
            }

            $code = trim($record[0]);
            $libelle = trim($record[1]);

            // Validation basique
            if (empty($code) || empty($libelle)) {
                continue;
            }

            $batch[] = [
                'id' => $code,
                'nom' => null, // On laisse null pour l'instant, sera rempli manuellement si besoin
                'description' => $libelle,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insérer par batch
            if (count($batch) >= $batchSize) {
                DB::table('formesjuridiques')->insert($batch);
                $imported += count($batch);
                $this->command->info("✅ {$imported}/{$totalRecords} importés...");
                $batch = [];
            }
        }

        // Insérer le dernier batch
        if (!empty($batch)) {
            DB::table('formesjuridiques')->insert($batch);
            $imported += count($batch);
        }

        $this->command->info("✨ Import terminé : {$imported} formes juridiques importées");
        
        // Statistiques
        $total = FormeJuridique::count();
        $this->command->info("📈 Total en base : {$total}");
    }
}
```