<?php
//app/Models/ImageMotModel.php
namespace App\Models;

use CodeIgniter\Model;

/**
 * Pivot Image ↔ Mot — clé composite (image_id, mot_id).
 * Pas de CRUD ResourceController classique.
 */
class ImageMotModel extends Model
{
    protected $table            = 'image_mot';
    protected $primaryKey       = null; // composite — ne pas utiliser find($id)
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $allowedFields    = ['image_id', 'mot_id'];
    protected $useTimestamps    = false;

    public function exists(int $imageId, int $motId): bool
    {
        return $this
            ->where('image_id', $imageId)
            ->where('mot_id', $motId)
            ->countAllResults() > 0;
    }

    public function attach(int $imageId, int $motId): bool
    {
        if ($this->exists($imageId, $motId)) {
            return false; // déjà présent
        }

        /*
        return (bool) $this->insert([
            'image_id' => $imageId,
            'mot_id'   => $motId,
        ]);*/
        return (bool) $this->builder()->insert([
            'image_id' => $imageId,
            'mot_id'   => $motId,
        ]);

    }

    public function detach(int $imageId, int $motId): bool
    {
        return $this
            ->where('image_id', $imageId)
            ->where('mot_id', $motId)
            ->delete() !== false;
    }

    /** @return list<int> */
    public function motIdsForImage(int $imageId): array
    {
        $rows = $this
            ->select('mot_id')
            ->where('image_id', $imageId)
            ->findAll();

        return array_map(static fn ($r) => (int) $r['mot_id'], $rows);
    }

    /** @return list<int> */
    public function imageIdsForMot(int $motId): array
    {
        $rows = $this
            ->select('image_id')
            ->where('mot_id', $motId)
            ->findAll();

        return array_map(static fn ($r) => (int) $r['image_id'], $rows);
    }

    public function deleteAllForImage(int $imageId): void
    {
        $this->where('image_id', $imageId)->delete();
    }
}
