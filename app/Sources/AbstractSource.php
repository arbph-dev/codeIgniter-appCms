<?php

namespace App\Sources;

abstract class AbstractSource
{
    protected bool $useCache = true;

    protected int $cacheTTL = 86400;

    protected int $timeout = 10;

    /**
     * Active ou dÃ©sactive le cache.
     */
    public function enableCache(
        bool $enable = true,
        int $ttl = 86400
    ): static {
        $this->useCache = $enable;
        $this->cacheTTL = $ttl;

        return $this;
    }

    /**
     * DÃ©finit le timeout HTTP.
     */
    public function setTimeout(
        int $seconds
    ): static {
        $this->timeout = $seconds;

        return $this;
    }

    public function getTimeout(): int
    {
        return $this->timeout;
    }

    public function isCacheEnabled(): bool
    {
        return $this->useCache;
    }

    public function getCacheTTL(): int
    {
        return $this->cacheTTL;
    }
}
