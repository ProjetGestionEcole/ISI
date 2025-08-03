<?php

namespace App\Services;

use App\Models\Niveau;
use Illuminate\Database\Eloquent\Collection;

class NiveauService extends BaseCacheService
{
    /**
     * Get all niveaux with caching.
     *
     * @return Collection
     */
    public function getAllNiveaux(): Collection
    {
        return $this->getAllWithCache(function () {
            return Niveau::all();
        });
    }

    /**
     * Find a niveau by ID with caching.
     *
     * @param int $id
     * @return Niveau|null
     */
    public function findNiveauById(int $id): ?Niveau
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Niveau::find($id);
        });
    }

    /**
     * Create a new niveau with cache invalidation.
     *
     * @param array $data
     * @return Niveau
     */
    public function createNiveau(array $data): Niveau
    {
        return $this->storeWithCache($data, function ($data) {
            return Niveau::create($data);
        });
    }

    /**
     * Update an existing niveau with cache invalidation.
     *
     * @param int $id
     * @param array $data
     * @return Niveau|null
     */
    public function updateNiveau(int $id, array $data): ?Niveau
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $niveau = Niveau::find($id);
            if ($niveau) {
                $niveau->update($data);
                return $niveau->fresh();
            }
            return null;
        });
    }

    /**
     * Delete a niveau by ID with cache invalidation.
     *
     * @param int $id
     * @return bool
     */
    public function deleteNiveau(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $niveau = Niveau::find($id);
            if ($niveau) {
                return $niveau->delete();
            }
            return false;
        });
    }
}