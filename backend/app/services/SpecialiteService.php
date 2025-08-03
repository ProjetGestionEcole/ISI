<?php

namespace App\Services;

use App\Models\Specialite;
use Illuminate\Database\Eloquent\Collection;

class SpecialiteService extends BaseCacheService
{
    /**
     * Get all specialites with caching.
     *
     * @return Collection
     */
    public function getAllSpecialites(): Collection
    {
        return $this->getAllWithCache(function () {
            return Specialite::all();
        });
    }

    /**
     * Find a specialite by ID with caching.
     *
     * @param int $id
     * @return Specialite|null
     */
    public function findSpecialiteById(int $id): ?Specialite
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Specialite::find($id);
        });
    }

    /**
     * Create a new specialite with cache invalidation.
     *
     * @param array $data
     * @return Specialite
     */
    public function createSpecialite(array $data): Specialite
    {
        return $this->storeWithCache($data, function ($data) {
            return Specialite::create($data);
        });
    }

    /**
     * Update an existing specialite with cache invalidation.
     *
     * @param int $id
     * @param array $data
     * @return Specialite|null
     */
    public function updateSpecialite(int $id, array $data): ?Specialite
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $specialite = Specialite::find($id);
            if ($specialite) {
                $specialite->update($data);
                return $specialite->fresh();
            }
            return null;
        });
    }

    /**
     * Delete a specialite by ID with cache invalidation.
     *
     * @param int $id
     * @return bool
     */
    public function deleteSpecialite(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $specialite = Specialite::find($id);
            if ($specialite) {
                return $specialite->delete();
            }
            return false;
        });
    }
}