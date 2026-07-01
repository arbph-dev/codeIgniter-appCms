<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class Dbtest extends Controller
{
    public function index()
    {
        $log = [];
        $log[] = '<h2>🔧 Test Connexion DB — CodeIgniter 4</h2>';

        // --- Chargement config ---
        $log[] = '<h3>📋 Étape 1 : Chargement de la configuration</h3>';

        try {

            $dbConfig = config('Database');

            $default = $dbConfig->default;

            $log[] = '✅ Config chargée depuis app/Config/Database.php';

            $log[] = '<pre>'
                . 'Hostname : ' . $default['hostname'] . "\n"
                . 'Database : ' . $default['database'] . "\n"
                . 'Username : ' . $default['username'] . "\n"
                . 'DBDriver : ' . $default['DBDriver'] . "\n"
                . '</pre>';

        } catch (\Throwable $e) {

            $log[] = '❌ Erreur chargement config : ' . $e->getMessage();
            return $this->renderLog($log);

        }

        // --- Connexion DB ---
        $log[] = '<h3>🔌 Étape 2 : Connexion à la base</h3>';
        $db = \Config\Database::connect();
        try {
            $db->initialize();
            $log[] = '<span style="color:green;font-weight:bold">✅ Connexion DB établie</span>';
        } 
        catch (\Throwable $e) {
            $log[] = '<span style="color:red;font-weight:bold">❌ Connexion DB échouée</span>';
            $log[] = $e->getMessage();
        }

        // --- Test requête ---
        $log[] = '<h3>📊 Étape 3 : Test SELECT</h3>';

        try {

            $query = $db->query("SELECT * FROM mots LIMIT 50");

            $rows = $query->getResult();

            $log[] = "✅ Requête exécutée : SELECT * FROM mots";

            if (empty($rows)) {

                $log[] = "⚠️ Table vide";

            } else {

                $log[] = "<pre>";

                foreach ($rows as $row) {
                    $log[] = "mot_id : {$row->mot_id} | mot_lbl : {$row->mot_lbl}";
                }

                $log[] = "</pre>";

            }

        } catch (\Throwable $e) {

            $log[] = '❌ Erreur requête : ' . $e->getMessage();

        }

        return $this->renderLog($log);
    }


    // ---------------------------------------------------
    private function renderLog(array $lines): string
    {
        $html = implode("\n", $lines);

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Dbtest</title>

<style>
body { font-family: monospace; margin: 30px; line-height: 1.7; }
h2 { color:#333; }
h3 { color:#555; border-bottom:1px solid #ddd; }
pre { background:#f4f4f4; padding:10px; border-radius:4px; }
</style>

</head>
<body>

{$html}

</body>
</html>
HTML;
    }
}
