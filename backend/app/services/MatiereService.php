<?php

namespace App\Services;

use App\Models\Matiere;
use Illuminate\Database\Eloquent\Collection;

class MatiereService extends BaseCacheService
{
    /**
     * Get all matieres with caching.
     *
     * @return Collection
     */
    public function getAllMatieres(): Collection
    {
        return $this->getAllWithCache(function () {
            return Matiere::all();
        });
    }

    /**
     * Find a matiere by ID with caching.
     *
     * @param int $id
     * @return Matiere|null
     */
    public function findMatiereById(int $id): ?Matiere
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Matiere::find($id);
        });
    }

    /**
     * Create a new matiere with cache invalidation.
     *
     * @param array $data
     * @return Matiere
     */
    public function createMatiere(array $data): Matiere
    {
        return $this->storeWithCache($data, function ($data) {
            return Matiere::create($data);
        });
    }

    /**
     * Update an existing matiere with cache invalidation.
     *
     * @param int $id
     * @param array $data
     * @return Matiere|null
     */
    public function updateMatiere(int $id, array $data): ?Matiere
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $matiere = Matiere::find($id);
            if ($matiere) {
                $matiere->update($data);
                return $matiere->fresh();
            }
            return null;
        });
    }

    /**
     * Delete a matiere by ID with cache invalidation.
     *
     * @param int $id
     * @return bool
     */
    public function deleteMatiere(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $matiere = Matiere::find($id);
            if ($matiere) {
                return $matiere->delete();
            }
            return false;
        });
    }
}
