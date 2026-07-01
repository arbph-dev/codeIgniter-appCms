<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Informatique extends BaseController
{
    public function index()
    {
        $data = [
            'title' => 'Informatique',
            'intro' => 'Une petite présentation des différents langages de progammation exploités pour ce site ou dans des applications décrites dans les artciles de la rubruique technologie',
            
            'langages' => [

                    [
                        'name'       => 'Javascript',
                        'description' => 'Javascript est un langage indissociable du Web. Il peut être employé en local dans des fichiers de commandes, une page html ou coté serveur',
                        'icon' => '/assets/img/technologies/informatique/logo_svg_JS.svg'
                    ],
                    [
                        'name'       => 'Python',
                        'description' => 'Python a réussi ou Java à échouer, c\'est un outil puissant de par sa communauté et ses librairies. Il permet de créer des application sous différents environnement : pc et android, on l\'utilise dans Obsidian et Jupyter',
                        'icon' => '/assets/img/technologies/informatique/logo_svg_PYTHON.svg'
                    ],
                ],	

        ];

        return view('pages/info_main', $data);
    }


    /**
     * Routage necessaire
     * use App\Controllers\Informatique;
     * 
     * $routes->get('informatique', 'Informatique::index');
     * $routes->get('informatique/(:segment)', [Informatique::class, 'show']); // Added 2026-03-25
     */
    public function show(?string $slug = null)
    {
        
       // $this->response->setStatusCode(404, 'Nope. Not here.');
        
        


        try {
            $file = new \CodeIgniter\Files\File( APPPATH . 'Views/pages/informatique/' . $slug .'.php' , true);
            $data['title'] = 'pages/informatique/' . $slug;
            // Utilisation du fichier...
        } 
        catch (\CodeIgniter\Files\Exceptions\FileNotFoundException $e) 
        {
            // Affichage du message d'erreur ou logique de repli
            $data['title'] = 'pages/informatique/devlogs';
        }           

        return view('pages/phpinfo', $data);
    }

}
