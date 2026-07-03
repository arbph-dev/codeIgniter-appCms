<?php
// app/Models/CmsPartModel.php
namespace App\Models;

use CodeIgniter\Model;

class CmsPartModel extends Model
{
    protected $table            = 'cmsparts';
    protected $primaryKey       = 'id';

    protected $returnType       = 'array';

    protected $allowedFields = [
        'section_id',
        'type_id',
        'title',
        'content',
        'aside',
        'config',
        'position',
        'is_published'
    ];

    protected $useTimestamps = true;

    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';


    /**
     * Retourne les parts publiées d'une section
     */
    public function findPublishedBySection(int $sectionId): array
    {
        return $this
            ->where('section_id', $sectionId)
            ->where('is_published', 1)
            ->orderBy('position', 'ASC')
            ->findAll();
    }


    /**
     * Retourne toutes les parts d'une section

    public function findBySection(int $sectionId): array
    {
        return $this
            ->where('section_id', $sectionId)
            ->orderBy('position', 'ASC')
            ->findAll();
    }
     */

    public function findBySection(int $sectionId, bool $includeUnpublished = false): array
    {
        $builder = $this->where('section_id', $sectionId)
                        ->orderBy('position', 'ASC'); // ← toujours appliqué

        if (!$includeUnpublished) {
            $builder->where('is_published', 1);
        }

        return $builder->findAll();
    }
    
}
