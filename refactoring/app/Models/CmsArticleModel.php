<?php
// app/Models/CmsArticleModel.php
namespace App\Models;

use CodeIgniter\Model;

class CmsArticleModel extends Model
{
    protected $table      = 'cmsarticles';
    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $allowedFields = [
        'cat_id',
        'slug',
        'title',
        'description',
        'is_published',
        'published_at'
    ];

    protected $useTimestamps = true;

    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';


    public function findBySlug(string $slug): ?array
    {
        return $this
            ->where('slug', $slug)
            ->where('is_published', 1)
            ->first();
    }


    public function findByCategory(int $categoryId): array
    {
        return $this
            ->where('cat_id', $categoryId)
            ->where('is_published', 1)
            ->findAll();
    }
}
