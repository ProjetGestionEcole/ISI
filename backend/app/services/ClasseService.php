<?php

namespace App\Services;

use App\Models\Classe;
use Illuminate\Database\Eloquent\Collection;

class ClasseService extends BaseCacheService
{
    /**
     * Get all classes with caching.
     *
     * @return Collection
     */
    public function getAllClasses(): Collection
    {
        return $this->getAllWithCache(function () {
            return Classe::all();
        });
    }

    /**
     * Find a classe by ID with caching.
     *
     * @param int $id
     * @return Classe|null
     */
    public function findClasseById(int $id): ?Classe
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Classe::find($id);
        });
    }

    /**
     * Create a new classe with cache invalidation.
     *
     * @param array $data
     * @return Classe
     */
    public function createClasse(array $data): Classe
    {
        return $this->storeWithCache($data, function ($data) {
            return Classe::create($data);
        });
    }

    /**
     * Update an existing classe with cache invalidation.
     *
     * @param int $id
     * @param array $data
     * @return Classe|null
     */
    public function updateClasse(int $id, array $data): ?Classe
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $classe = Classe::find($id);
            if ($classe) {
                $classe->update($data);
                return $classe->fresh();
            }
            return null;
        });
    }

    /**
     * Delete a classe by ID with cache invalidation.
     *
     * @param int $id
     * @return bool
     */
    public function deleteClasse(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $classe = Classe::find($id);
            if ($classe) {
                return $classe->delete();
            }
            return false;
        });
    }
}
