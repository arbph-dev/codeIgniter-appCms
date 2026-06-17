<?php

namespace App\Controllers;

use CodeIgniter\Controller;

/**
 * Catégorie   → /technologies
 * Rubrique    → /technologies/{rubrique}
 * Article     → /technologies/{rubrique}/{article}
 * 
 * 3 vues liées dans OVH2\app\Views\
 * app\Views\pages\technologies\index.php
 * pages\technologies\template_article.php
 * pages\technologies\template_rubrique.php
 */


class Technologies extends Controller
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = APPPATH . 'Views/pages/technologies/';
    }

    /**
     * /technologies
     * Liste des rubriques
     */
    public function index()
    {
        $rubriques = $this->getDirectories($this->basePath);

        $data = [
            'nav' => $this->buildNav($rubriques, '/technologies'),
            'title' => 'Technologies',
        ];

        return view('pages/technologies/index', $data);
    }

    /**
     * /technologies/{rubrique}
     */
    public function rubrique(string $slug)
    {
        $path = $this->basePath . $slug . '/';

        if (!is_dir($path)) {
            return $this->fallback();
        }

        $articles = $this->getFiles($path);

        $data = [
            'nav' => $this->buildNav($articles, "/technologies/{$slug}"),
            'rubrique' => $slug,
            'content' => "pages/technologies/{$slug}/index"
        ];

        return view('pages/template_rubrique', $data);
    }

    /**
     * /technologies/{rubrique}/{article}
     */
    public function show(string $rubrique, string $article)
    {
        $path = $this->basePath . $rubrique . '/';
        $file = $path . $article . '.php';

        if (!is_file($file)) {
            return $this->fallback("/technologies/{$rubrique}");
        }

        $articles = $this->getFiles($path);

        $data = [
            'nav' => $this->buildNav($articles, "/technologies/{$rubrique}"),
            'rubrique' => $rubrique,
            'content' => "pages/technologies/{$rubrique}/{$article}"
        ];

        return view('pages/template_article', $data);
    }


    /*
    public function debug()
    {
        $log = [];
        $log[] = '<h2>🔧 Test out — CodeIgniter 4</h2>';

        // $rubriques = $this->getDirectories(APPPATH);
        
        $rubriques = $this->basePath;          
        $log[] = $rubriques;

        $rubriques = $this->getDirectories( APPPATH . 'Views/pages/' );
        //var_dump( $rubriques );
        
        $scanned_directory = array_diff(
            scandir( APPPATH . 'Views/pages/' ),
            array('..', '.')
        );
        var_dump($scanned_directory);

        
        //$log[] = '<pre>' ;
        
        foreach ( $rubriques as $dir){

            $log[] = '<h3>' . $dir . '</h3>' ;
            $articles = $this->getFiles(APPPATH . 'Views/pages/'. $dir);

            foreach ($articles as $article){
                $log[] = $article . ' ; path = ' . APPPATH . 'Views/pages/' . $dir . '/' .$article . '.php  ; url = '.$dir . '/' .$article  . '<br/>';
            }
        }    
        return $this->renderLog($log);
    }
    */


    public function debug()
    {
        $log = [];
        // $categories = $this->getDirectories( APPPATH . 'Views/pages/' );
        // $log[] = 'arborescence : '. APPPATH . 'Views/pages/';
        // $log[] = '<h2>🔧 Debug arborescence ' . APPPATH . 'Views/pages/' . '</h2>';
        
        $categories =$this->getDirectories( APPPATH . 'Views/pages/' , ['portal']);
        
        foreach ( $categories as $categorie){
            $log[] = '<h2>🔧 Debug arborescence ' . APPPATH . 'Views/pages/' . $categorie . '</h2>';
            $tree = $this->scanRecursive( APPPATH . 'Views/pages/' . $categorie );
            $log[] = '<pre>' . $this->renderTree($tree) . '</pre>';            
        }
        
        $log[] = '<h2>🔧 Debug User </h2>';
            // Get the User Provider (UserModel by default)
            $users = auth()->getProvider();

            $usersList = $users
                ->withIdentities()
                ->withGroups()
                ->withPermissions()
                ->findAll(10);

                // Because identities are preloaded
                // Because groups are preloaded
                // Because permissions are preloaded
                // Because groups and permissions are preloaded

            foreach ($usersList as $u) {
            $log[] = '<pre>';                 
                
                $log[] = 'id : '. $u->id ;
                $log[] = 'email : '. $u->email ;
                $log[] = 'isActivated : ' . $u->isActivated() ;
                $log[] = 'username : '. $u->username ;
                $log[] = 'admin '. $u->inGroup('admin') ;
                // $log[] = ' groups '. $u->getGroups() ;  Array to string conversion              
                $log[] = 'HAS users.delete '. $u->hasPermission('users.delete') ;
                $log[] = 'CAN admin.access '. $u->can('admin.access') ;
                $log[] = 'CAN users.delete '. $u->can('users.delete');

            $log[] = '</pre><hr>';                 
            }


        return $this->renderLog($log);
    }

    //------------------------------------------------------
    private function renderLog(array $lines): string
    {
        $html = implode("\n", $lines);
        return <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Debug PHP</title>
            <style>
                body { font-family: monospace; margin: 30px; line-height: 1.7; }
                h2   { color: #333; }
                h3   { color: #555; border-bottom: 1px solid #ddd; }
                pre  { background: #f4f4f4; padding: 10px; border-radius: 4px; }
            </style>
        </head>
        <body>{$html}</body>
        </html>
        HTML;
    }

    //------------------------------------------------------
    private function renderTree(array $tree): string
    {
        $output = '';

        foreach ($tree as $item) {

            $depth = substr_count($item['path'], DIRECTORY_SEPARATOR);
            $indent = str_repeat('  ', $depth);

            if ($item['type'] === 'dir') {
                $output .= $indent . '📁 ' . $item['path'] . "\n";
            } else {
                $output .= $indent . '📄 ' . $item['path'] . " - taille " . $item['size'] . " modification " . $item['ctime'] . "\n";
            }
        }

        return $output;
    }
    //------------------------------------------------------  
    private function renderLink(array $tree): string
    {        
        $output = '';

        foreach ($tree as $item) {
            $depth = substr_count($item['path'], DIRECTORY_SEPARATOR);
            $indent = str_repeat('  ', $depth);

            if ($item['type'] === 'dir') {
                $output .= $indent . '📁 ' . $item['path'] . "\n";
            } 
            else {
                $output .= $indent . '📄 ' . $item['path'] .  "\n";
            }

        }

        return $output;
    }






    //------------------------------------------------------  
    /**
     * $filename = "/usr/local/something.txt";  
     * $file = new SplFileObject($filename, "r");  
     * $contents = $file->fread($file->getSize());  
     */

    private function scanRecursive(string $path): array
    {
        $result = [];

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {

            $relativePath = str_replace($path, '', $file->getPathname());

            if ($file->isDir()) {
                $result[] = [
                    'type' => 'dir',
                    'path' => $relativePath,
                    'size' => 0,
                    'ctime' => date( 'Y-m-d H:i:s', $file->getCTime() )
                ];
            } else {
                if ($file->getExtension() === 'php') {
                    $result[] = [
                        'type' => 'file',
                        'path' => $relativePath,
                        'size' => $file->getSize(),
                        'ctime' => date( 'Y-m-d H:i:s', $file->getCTime() )
                    ];
                }
            }
        }

        return $result;
    }


    // =========================================================
    // 🔧 HELPERS
    // =========================================================
    private function getDirectories(string $path, array $ignore = []): array
    {
        // Toujours ignorer ces éléments système
        $ignore = array_merge(['.', '..'], $ignore);

        return array_values(array_filter(
            scandir($path),
            function ($item) use ($path, $ignore) {
                return !in_array($item, $ignore, true)
                    && is_dir($path . $item);
            }
        ));
    }



    private function getFiles(string $path): array
    {
        return array_map(function ($file) {
            return pathinfo($file, PATHINFO_FILENAME);
        }, array_filter(scandir($path), function ($file) use ($path) {
            return $file !== '.' &&
                   $file !== '..' &&
                   $file !== 'index.php' &&
                   pathinfo($file, PATHINFO_EXTENSION) === 'php';
        }));
    }

    private function buildNav(array $items, string $baseUrl): array
    {
        return array_map(function ($item) use ($baseUrl) {
            return [
                'label' => ucfirst(str_replace('-', ' ', $item)),
                'url'   => $baseUrl . '/' . $item
            ];
        }, $items);
    }

    private function fallback(?string $redirect = null)
    {
        if ($redirect) {
            return redirect()->to($redirect);
        }

        throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
    }
}