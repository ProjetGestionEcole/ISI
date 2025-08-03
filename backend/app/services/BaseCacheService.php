<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseCacheService
{
    protected string $cachePrefix;
    protected int $cacheTtl = 3600; // 1 hour default
    
    public function __construct()
    {
        $this->cachePrefix = strtolower(class_basename($this));
    }

    /**
     * Get cache key for all items
     */
    protected function getAllCacheKey(): string
    {
        return "{$this->cachePrefix}_all";
    }

    /**
     * Get cache key for single item
     */
    protected function getItemCacheKey(int $id): string
    {
        return "{$this->cachePrefix}_{$id}";
    }

    /**
     * Clear all cache for this model
     */
    protected function clearCache(): void
    {
        Cache::forget($this->getAllCacheKey());
        // Clear individual item caches - we'll implement a tag-based approach later if needed
    }

    /**
     * Clear specific item cache
     */
    protected function clearItemCache(int $id): void
    {
        Cache::forget($this->getItemCacheKey($id));
        Cache::forget($this->getAllCacheKey()); // Also clear the all cache
    }

    /**
     * Get all items with caching
     */
    protected function getAllWithCache(callable $dataLoader): Collection
    {
        return Cache::remember($this->getAllCacheKey(), $this->cacheTtl, $dataLoader);
    }

    /**
     * Get single item with caching
     */
    protected function getItemWithCache(int $id, callable $dataLoader): ?Model
    {
        return Cache::remember($this->getItemCacheKey($id), $this->cacheTtl, $dataLoader);
    }

    /**
     * Store item and update cache
     */
    protected function storeWithCache(array $data, callable $creator): Model
    {
        $item = $creator($data);
        $this->clearCache();
        return $item;
    }

    /**
     * Update item and update cache
     */
    protected function updateWithCache(int $id, array $data, callable $updater): ?Model
    {
        $item = $updater($id, $data);
        if ($item) {
            $this->clearItemCache($id);
        }
        return $item;
    }

    /**
     * Delete item and update cache
     */
    protected function deleteWithCache(int $id, callable $deleter): bool
    {
        $result = $deleter($id);
        if ($result) {
            $this->clearItemCache($id);
        }
        return $result;
    }
}
