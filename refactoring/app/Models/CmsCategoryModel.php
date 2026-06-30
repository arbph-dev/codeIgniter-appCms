<?php
// app/Models/CmsCategoryModel.php
namespace App\Models;

use CodeIgniter\Model;

class CmsCategoryModel extends Model
{
    protected $table      = 'cmscategories';
    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $allowedFields = [
        'title',
        'slug',
        'description',
        'catp_id'
    ];

    protected $useTimestamps = true;

    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';


    public function findBySlug(string $slug): ?array
    {
        return $this
            ->where('slug', $slug)
            ->first();
    }


    public function findChildren(int $parentId): array
    {
        return $this
            ->where('catp_id', $parentId)
            ->findAll();
    }
}