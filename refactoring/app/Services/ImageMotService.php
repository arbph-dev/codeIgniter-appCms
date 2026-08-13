<?php
//app/Services/ImageMotService.php
namespace App\Services;

use App\Models\ImageModel;
use App\Models\ImageMotModel;
use App\Models\MotModel;
use RuntimeException;

class ImageMotService
{
    protected ImageModel $images;
    protected MotModel $mots;
    protected ImageMotModel $pivot;

    public function __construct(
        ?ImageModel $images = null,
        ?MotModel $mots = null,
        ?ImageMotModel $pivot = null
    ) {
        $this->images = $images ?? new ImageModel();
        $this->mots   = $mots   ?? new MotModel();
        $this->pivot  = $pivot  ?? new ImageMotModel();
    }

    // ── Lectures ────────────────────────────────────────────────────────────

    /** @return list<array> mots complets */
    public function getMots(int $imageId): array
    {
        $this->assertImage($imageId);

        $motIds = $this->pivot->motIdsForImage($imageId);

        if ($motIds === []) {
            return [];
        }

        return $this->mots
            ->select('mot_id, mot_lbl')
            ->whereIn('mot_id', $motIds)
            ->orderBy('mot_lbl', 'ASC')
            ->findAll();
    }

    /** @return list<array> images  */
    public function getImages(int $motId): array
    {
        $this->assertMot($motId);

        $imageIds = $this->pivot->imageIdsForMot($motId);

        if ($imageIds === []) {
            return [];
        }

        return $this->images
            ->select('id, filename, path, alt')
            ->whereIn('id', $imageIds)
            ->orderBy('id', 'DESC')
            ->findAll();
    }

    // ── Mutations ───────────────────────────────────────────────────────────

    /**
     * @return array{
     *     image_id: int,
     *     mot_id: int,
     *     attached: bool,
     *     already: bool
     * }
     */
    public function attach(int $imageId, int $motId): array
    {
        $this->assertImage($imageId);
        $this->assertMot($motId);

        if ($this->pivot->exists($imageId, $motId)) {
            return [
                'image_id' => $imageId,
                'mot_id'   => $motId,
                'attached' => false,
                'already'  => true,
            ];
        }

        if (! $this->pivot->attach($imageId, $motId)) {
            throw new RuntimeException(
                'Échec de l\'association image↔mot.'
            );
        }

        return [
            'image_id' => $imageId,
            'mot_id'   => $motId,
            'attached' => true,
            'already'  => false,
        ];
    }

    public function detach(int $imageId, int $motId): bool
    {
        $this->assertImage($imageId);
        $this->assertMot($motId);

        if (! $this->pivot->exists($imageId, $motId)) {
            return false; // idempotent : rien à faire
        }

        return $this->pivot->detach($imageId, $motId);
    }

    /**
     * Remplace l'ensemble des mots liés à l'image.
     *
     * @param  list<int> $motIds
     * @return list<array> mots finaux
     */
    public function sync(int $imageId, array $motIds): array
    {
        $this->assertImage($imageId);

        $motIds = array_values(array_unique(array_map('intval', $motIds)));
        $motIds = array_filter($motIds, static fn ($id) => $id > 0);

        foreach ($motIds as $motId) {
            $this->assertMot($motId);
        }

        $db = $this->pivot->db;
        $db->transStart();

        $this->pivot->deleteAllForImage($imageId);

        foreach ($motIds as $motId) {
            $this->pivot->attach($imageId, $motId);
        }

        $db->transComplete();

        if (! $db->transStatus()) {
            throw new RuntimeException('Échec du sync image↔mot.');
        }

        return $this->getMots($imageId);
    }

    // ── Guards ──────────────────────────────────────────────────────────────

    protected function assertImage(int $imageId): array
    {
        $image = $this->images->find($imageId);
        if (! $image) {
            throw new RuntimeException("Image #{$imageId} introuvable.", 404);
        }
        return $image;
    }

    protected function assertMot(int $motId): array
    {
        $mot = $this->mots->find($motId);
        if (! $mot) {
            throw new RuntimeException("Mot #{$motId} introuvable.", 404);
        }
        return $mot;
    }
}