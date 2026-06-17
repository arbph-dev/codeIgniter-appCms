# Fichiers et Répertoires

## Lecture et Écriture

### file_get_contents
Lit un fichier et le convertit en chaîne de caractères.

```php
$contents = file_get_contents($filename);
```

**Référence** : [W3Schools - file_get_contents](https://www.w3schools.com/php/func_filesystem_file_get_contents.asp)

### file_put_contents
Écrit les données dans un fichier.

```php
file_put_contents($filename, $data);
```

**Référence** : [W3Schools - file_put_contents](https://www.w3schools.com/php/func_filesystem_file_put_contents.asp)

---

## Lister les fichiers et dossiers

### scandir
Liste les fichiers et dossiers dans un dossier.

```php
scandir(
    string $directory,
    int $sorting_order = SCANDIR_SORT_ASCENDING,
    ?resource $context = null
): array|false
```

**Exemple** :
```php
$items = scandir(APPPATH . 'Views/pages/');
```

---

### glob
Recherche des chemins qui vérifient un masque.

```php
glob(
    string $pattern,
    int $flags = 0
): array|false
```

**Exemples** :
```php
// Tous les fichiers .txt
foreach (glob("*.txt") as $filename) {  
    echo "$filename occupe " . filesize($filename) . "\n";  
}

// Fichiers .txt ou .md dans les sous-dossiers
foreach (glob("path/*/*.{txt,md}", GLOB_BRACE) as $filename) {
    echo "$filename\n";
}
```

---

## Parcours récursif

### RecursiveDirectoryIterator et RecursiveIteratorIterator

Pour parcourir récursivement un répertoire et filtrer les fichiers PHP :

```php
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
                'ctime' => date('Y-m-d H:i:s', $file->getCTime())
            ];
        } else {
            if ($file->getExtension() === 'php') {
                $result[] = [
                    'type' => 'file',
                    'path' => $relativePath,
                    'size' => $file->getSize(),
                    'ctime' => date('Y-m-d H:i:s', $file->getCTime())
                ];
            }
        }
    }

    return $result;
}
```

---

## Helpers courants

### getDirectories
Récupère uniquement les répertoires (en ignorant `.` et `..`).

```php
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

**Utilisation** :
```php
$categories = $this->getDirectories(APPPATH . 'Views/pages/', ['portal']);
```

---

## Cas d'usage

### Scanner l'arborescence des vues

Pour les vues, utiliser `glob()` ou `scandir()` sur `APPPATH . 'Views/pages/informatique/'` :
1. Filtrer les fichiers `.php`
2. Retirer l'extension pour obtenir le slug
3. Construire la route `/informatique/{slug}`

```php
public function debug()
{
    $log = [];
    $categories = $this->getDirectories(APPPATH . 'Views/pages/', ['portal']);
    
    foreach ($categories as $categorie) {
        $log[] = '<h2>🔧 Debug arborescence ' . APPPATH . 'Views/pages/' . $categorie . '</h2>';
        $tree = $this->scanRecursive(APPPATH . 'Views/pages/' . $categorie);
        $log[] = '<pre>' . $this->renderTree($tree) . '</pre>';            
    }

    return $this->renderLog($log);
}
```

---

## Autres fonctions utiles

- `is_dir()` — Vérifie si un chemin est un répertoire
- `is_file()` — Vérifie si un chemin est un fichier
- `filesize()` — Obtient la taille d'un fichier
- `file_exists()` — Vérifie si un fichier existe
- `dirname()` — Obtient le répertoire parent
- `basename()` — Obtient le nom du fichier
- `pathinfo()` — Obtient les informations sur un chemin

**Référence** : [PHP - Filesystem Functions](https://www.php.net/manual/en/ref.filesystem.php)
