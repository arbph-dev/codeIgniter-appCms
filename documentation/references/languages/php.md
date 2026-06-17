
# array
[[CI/PORTAIL/Portail/app/Controllers/Admin]] / [[CI/PORTAIL/Portail/app/Controllers/Admin.php]]
```
array_column
array_column($data['groups']      ?? [], 'name')
array_column($data['permissions'] ?? [], 'name'),

array_keys
'permissions' => array_keys($u->getPermissions())

array_map
$users = array_values(array_map(function ($u) {}

array_values
$users = array_values(array_map(function ($u) {}

$ignore = array_merge(['.', '..'], $ignore);

array_filter


```


[[CI/PORTAIL/Portail/app/Controllers/Admin]] / [[CI/PORTAIL/Portail/app/Controllers/Admin.php]]
```
foreach ($user->identities ?? [] as $identity) {
```

# Date
[[CI/PORTAIL/Portail/app/Controllers/Admin]] / [[CI/PORTAIL/Portail/app/Controllers/Admin.php]]
```
//'created_at'  => $u->created_at->toDateString(),//$u->created_at ?? null,
'created_at'  => $u->created_at->setTimezone('Europe/Paris')->toDateTimeString(),

        // dd(get_class(auth()->getProvider())); => "CodeIgniter\Shield\Models\UserModel"
```


[[CI/PORTAIL/Portail/app/Controllers/Admin]] / [[CI/PORTAIL/Portail/app/Controllers/Admin.php]]
```
session_id()
```


---
# Fichiers

## file_get_contents
Lire un fichier et le convertir en chaîne de caractères
https://www.w3schools.com/php/func_filesystem_file_get_contents.asp
## file_put_contents
Écrire les données dans un fichier
https://www.w3schools.com/php/func_filesystem_file_put_contents.asp



**Pour les vues** — `glob()` ou `scandir()` sur `APPPATH . 'Views/pages/informatique/'`, on filtre les `.php`, on retire l'extension pour obtenir le slug, et on construit `/informatique/{slug}`.
- scandir
	Liste les fichiers et dossiers dans un dossier
- glob
	Recherche des chemins qui vérifient un masque

### scandir
```php
scandir(
	string $directory,
	int $sorting_order = SCANDIR_SORT_ASCENDING,
	?resource $context = null
	): array|false

```


### glob
```php
glob(
	string $pattern,
	int $flags = 0
	): array|false
	
	
foreach (glob("*.txt") as $filename) {  
	echo "$filename occupe " . filesize($filename) . "\n";  
}


foreach (glob("path/*/*.{txt,md}", \GLOB_BRACE) as $filename) {
    echo "$filename\n";
}	
```

### Exemple

Dans cet exemple on utilise les fonctions suivantes :
- debug :  fonction principale 
- getDirectories
- scanRecursive
- renderTree
- renderLog : fonction générique pour la sortie html, utilisée dans les test
```php
// app/Controllers/Technologies.php
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

        return $this->renderLog($log);
    }
```


### getDirectories
```php
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
```

### scanRecursive
```php
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
```
### renderTree
```php
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
```
### renderLog
```php
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
```

### renderLink
```php
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
```

---
# Images

fonctions natives PHP pour les images (extension GD)

## Création et chargement d'images
imagecreate(width, height) : crée une nouvelle image vide en mémoire.
imagecreatefromjpeg(filename) : crée une image à partir d'un fichier JPEG.
imagecreatefrompng(filename) : crée une image à partir d'un fichier PNG.
imagecreatefromgif(filename) : crée une image à partir d'un fichier GIF.
imagecreatefromwebp(filename) : crée une image à partir d'un fichier WebP.

## Manipulation et modification
imagesx(image) et imagesy(image) : obtiennent la largeur et la hauteur d'une image.
imagecopy(dest, src, ...) : copie une partie d'une image source vers une image destination.
imagecopyresampled(dest, src, ...) : copie et redimensionne une image avec un meilleur rendu.
imagerotate(image, angle, bgcolor) : fait pivoter une image d'un certain angle.
imageflip(image, mode) : retourne une image horizontalement, verticalement ou les deux.
Dessiner sur une image
imageline(image, x1, y1, x2, y2, color) : dessine une ligne.
imagefilledrectangle(image, x1, y1, x2, y2, color) : dessine un rectangle rempli.
imagestring(image, font, x, y, string, color) : écrit une chaîne de caractères.

## Gestion des couleurs
imagecolorallocate(image, r, g, b) : alloue une couleur.
imagecolortransparent(image, color) : définit une couleur transparente.
Sauvegarde et affichage
imagejpeg(image, filename, quality) : sauvegarde une image au format JPEG.
imagepng(image, filename) : sauvegarde une image au format PNG.
imagegif(image, filename) : sauvegarde une image au format GIF.
imagewebp(image, filename) : sauvegarde une image au format WebP.
header('Content-Type: image/jpeg') + imagejpeg(image) : affiche une image directement dans le navigateur.
## Libération de la mémoire
imagedestroy(image) : libère la mémoire associée à une image.
Autres fonctions utiles
getimagesize(filename) : obtient les dimensions et le type d'une image.
imagefilter(image, filtertype, ...) : applique un filtre (ex : gris, flou, contraste).
imagestring() et imagettftext() : pour écrire du texte sur une image, la seconde utilisant des polices TrueType.

## Alternatives à GD
Imagick (extension PHP pour ImageMagick) propose des fonctions plus avancées pour le traitement d'images,

