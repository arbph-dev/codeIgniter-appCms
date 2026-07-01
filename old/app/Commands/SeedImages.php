<?php
// app/Commands/SeedImages.php
//
// Usage :
//   php spark images:seed /home/userovh/www/public/assets/img/ --user=1 --dry-run
//   php spark images:seed /home/userovh/www/public/assets/img/ --user=1
//
// Le chemin fourni doit être le root public : /home/userovh/www/public/
// Le script calcule automatiquement path = chemin relatif à ce root.

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\ImageModel;

class SeedImages extends BaseCommand
{
    protected $group       = 'Images';
    protected $name        = 'images:seed';
    protected $description = 'Seede la table images depuis un dossier du serveur.';

    protected $usage     = 'images:seed <scan_path> [options]';
    protected $arguments = [
        'scan_path' => 'Chemin absolu à scanner (ex: /home/userovh/www/public/assets/img/)',
    ];
    protected $options = [
        '--user'    => 'ID utilisateur Shield à attribuer aux images (défaut : 1)',
        '--root'    => 'Root public du serveur (défaut : déduit de scan_path jusqu\'à /public/)',
        '--dry-run' => 'Affiche les images sans insérer en base',
        '--ext'     => 'Extensions acceptées séparées par virgule (défaut : jpg,jpeg,png,gif,webp)',
    ];

    // Extensions supportées par GD
    private const GD_SUPPORTED = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

    public function run(array $params)
    {
        // ── Arguments ────────────────────────────────────────────────────────
        $scanPath = $params[0] ?? null;

        if (! $scanPath) {
            CLI::error('Argument <scan_path> requis.');
            return EXIT_INVALID;
        }

        $scanPath = rtrim($scanPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        if (! is_dir($scanPath)) {
            CLI::error("Dossier introuvable : {$scanPath}");
            return EXIT_INVALID;
        }

        $userId  = (int) CLI::getOption('user')  ?: 1;
        $dryRun  = CLI::getOption('dry-run') !== null;
        $extOpt  = CLI::getOption('ext') ?? 'jpg,jpeg,png,gif,webp';
        $allowed = array_map('trim', explode(',', strtolower($extOpt)));

        // ── Détermination du root public ──────────────────────────────────────
        $root = CLI::getOption('root');
        if (! $root) {
            // On cherche /public/ dans le chemin
            if (preg_match('#^(.+/public/)#', $scanPath, $m)) {
                $root = $m[1];
            } else {
                $root = $scanPath; // fallback : path relatif = ''
            }
        }
        $root = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        // ── Vérification GD ───────────────────────────────────────────────────
        if (! extension_loaded('gd')) {
            CLI::error('Extension GD requise (php-gd).');
            return EXIT_ERROR;
        }

        // ── Scan récursif ─────────────────────────────────────────────────────
        CLI::write("📁 Scan : {$scanPath}", 'cyan');
        CLI::write("🔑 user_id : {$userId}", 'cyan');
        CLI::write("📐 root    : {$root}", 'cyan');
        if ($dryRun) CLI::write('🚫 DRY-RUN — aucune insertion', 'yellow');

        $files = $this->scanImages($scanPath, $allowed);
        $total = count($files);
        CLI::write("🔍 {$total} image(s) trouvée(s)", 'green');

        if ($total === 0) return EXIT_SUCCESS;

        // ── Traitement ────────────────────────────────────────────────────────
        $model     = new ImageModel();
        $inserted  = 0;
        $skipped   = 0;
        $errors    = 0;

        foreach ($files as $absPath) {
            $info = $this->extractInfo($absPath, $root, $userId);

            if ($info === null) {
                CLI::write("  ⚠ Ignoré (GD) : {$absPath}", 'yellow');
                $skipped++;
                continue;
            }

            if ($dryRun) {
                CLI::write(sprintf(
                    '  ✓ %s  [%dx%d %.2f ko %s]',
                    $info['path'], $info['width'], $info['height'],
                    $info['size_ko'], $info['extension']
                ));
                $inserted++;
                continue;
            }

            // Évite les doublons sur (path, filename)
            $exists = $model
                ->where('path',     $info['path'])
                ->where('filename', $info['filename'])
                ->first();

            if ($exists) {
                $skipped++;
                continue;
            }

            if ($model->insert($info)) {
                $inserted++;
            } else {
                CLI::error('  ✗ Erreur : ' . implode(', ', $model->errors()));
                $errors++;
            }
        }

        // ── Résumé ────────────────────────────────────────────────────────────
        CLI::write('');
        CLI::write("✅ Insérées : {$inserted}", 'green');
        CLI::write("⏭  Ignorées : {$skipped}", 'yellow');
        if ($errors) CLI::write("❌ Erreurs  : {$errors}", 'red');

        return EXIT_SUCCESS;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function scanImages(string $dir, array $allowed): array
    {
        $result   = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if (! $file->isFile()) continue;
            $ext = strtolower($file->getExtension());
            if (! in_array($ext, $allowed, true)) continue;
            $result[] = $file->getPathname();
        }

        return $result;
    }

    private function extractInfo(string $absPath, string $root, int $userId): ?array
    {
        $ext = strtolower(pathinfo($absPath, PATHINFO_EXTENSION));

        // Lecture GD uniquement si supporté
        if (in_array($ext, self::GD_SUPPORTED, true)) {
            $size = @getimagesize($absPath);
            if (! $size) return null;
            [$width, $height] = $size;
        } else {
            // Format non lisible par GD (svg, ico…) : dimensions 0
            $width = $height = 0;
        }

        $ratio    = ($height > 0) ? round($width / $height, 2) : 0.0;
        $sizeKo   = round(filesize($absPath) / 1024, 2);
        $filename = basename($absPath);

        // path = chemin relatif au root public, avec / initial
        $relPath = str_replace($root, '', $absPath);
        if ($relPath[0] !== '/') $relPath = '/' . $relPath;

        return [
            'user_id'   => $userId,
            'width'     => $width,
            'height'    => $height,
            'ratio'     => $ratio,
            'extension' => $ext,
            'size_ko'   => $sizeKo,
            'path'      => $relPath,          // ex: /assets/img/zealot.png
            'filename'  => $filename,         // ex: zealot.png
            'alt'       => '',                // à compléter manuellement ou via IA
            'status'    => 'pending',
        ];
    }
}
