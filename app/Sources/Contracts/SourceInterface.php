<?php

namespace App\Sources\Contracts;

interface SourceInterface
{
    /**
     * Recherche libre.
     */
    public function search(
        string $query,
        array $options = []
    ): array;

    /**
     * Recherche directe par identifiant.
     */
    public function lookup(
        string $id,
        array $options = []
    ): ?array;

    /**
     * Nom unique de la source.
     */
    public function getName(): string;
}
