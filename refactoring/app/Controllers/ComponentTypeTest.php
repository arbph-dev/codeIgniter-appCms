<?php
// app/Controllers/ComponentTypeTest.php
namespace App\Controllers;

use App\Models\ComponentTypeModel;
use CodeIgniter\Controller;

use App\Libraries\Components\ComponentCatalog;
use App\Libraries\Components\ComponentDefinition;

class ComponentTypeTest extends Controller
{
    public function index()
    {
        $log = [];

        $log[] = '<h2>🧪 Test ComponentTypeModel</h2>';

        // -------------------------------------------------
        // Étape 1 : Chargement du modèle
        // -------------------------------------------------

        $log[] = '<h3>📋 Étape 1 : Chargement du modèle</h3>';

        try {

            $model = new ComponentTypeModel();

            $log[] = '<span style="color:green;font-weight:bold">✅ ComponentTypeModel chargé</span>';

        } catch (\Throwable $e) {

            $log[] = '<span style="color:red;font-weight:bold">❌ Erreur</span>';
            $log[] = $e->getMessage();

            return $this->renderLog($log);

        }

        // -------------------------------------------------
        // Étape 2 : findActive()
        // -------------------------------------------------

        $log[] = '<h3>📊 Étape 2 : findActive()</h3>';

        try {

            $rows = $model->findActive();

            $log[] = "✅ " . count($rows) . " composant(s) actif(s)";

            if (empty($rows)) {

                $log[] = "⚠️ Aucun composant actif.";

            } else {

                $log[] = "<pre>";

                foreach ($rows as $row) {

                    $log[] =
                        sprintf(
                            "[%d] %s | %s | actif=%d",
                            $row['id'],
                            $row['name'],
                            $row['description'],
                            $row['is_active']
                        );

                }

                $log[] = "</pre>";

            }

        } catch (\Throwable $e) {

            $log[] = '❌ ' . $e->getMessage();

        }

        // -------------------------------------------------
        // Étape 3 : findByName()
        // -------------------------------------------------

        $log[] = '<h3>🔍 Étape 3 : findByName("apex")</h3>';

        try {

            $row = $model->findByName('apex');

            if ($row === null) {

                $log[] = "⚠️ Composant introuvable.";

            } else {

                $log[] = "<pre>";
                $log[] = print_r($row, true);
                $log[] = "</pre>";

            }

        } catch (\Throwable $e) {

            $log[] = '❌ ' . $e->getMessage();

        }

        // -------------------------------------------------
        // Étape 4 : getTypeMap()
        // -------------------------------------------------

        $log[] = '<h3>🗂 Étape 4 : getTypeMap()</h3>';

        try {

            $map = $model->getTypeMap();

            $log[] = "<pre>";

            foreach ($map as $id => $name) {

                $log[] = sprintf("%d => %s", $id, $name);

            }

            $log[] = "</pre>";

        } catch (\Throwable $e) {

            $log[] = '❌ ' . $e->getMessage();

        }
        // -------------------------------------------------
        // Étape 5 : ComponentCatalog
        // -------------------------------------------------
        
        $log[] = '<h3>📚 Étape 5 : ComponentCatalog</h3>';
        
        try {
        
            $catalog = new ComponentCatalog();
        
            $catalog->register(
                new ComponentDefinition(
                    type: 'test',
                    description: 'Composant de test',
                    descriptorClass: '',
                    rendererClass: '',
                    adminRendererClass: ''
                )
            );
        
            $log[] = $catalog->has('test')
                ? '✅ has("test")'
                : '❌ has("test")';
        
            $definition = $catalog->get('test');
        
            if ($definition !== null) {
        
                $log[] = '<pre>';
                $log[] = print_r($definition, true);
                $log[] = '</pre>';
        
            } else {
        
                $log[] = '❌ get("test")';
        
            }
        
            $log[] = 'Nombre de définitions : ' . count($catalog->all());
        
        } catch (\Throwable $e) {
        
            $log[] = '❌ ' . $e->getMessage();
        
        }
        return $this->renderLog($log);
    }

    // -------------------------------------------------

    private function renderLog(array $lines): string
    {
        $html = implode("\n", $lines);

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">

<title>ComponentTypeModel Test</title>

<style>

body
{
    font-family: monospace;
    margin:30px;
    line-height:1.7;
}

h2
{
    color:#333;
}

h3
{
    color:#555;
    border-bottom:1px solid #ddd;
}

pre
{
    background:#f4f4f4;
    padding:10px;
    border-radius:4px;
}

</style>

</head>

<body>

{$html}

</body>

</html>
HTML;
    }
}
