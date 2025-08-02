<?php

namespace App\Services;

use App\Models\Specialite;
use Illuminate\Database\Eloquent\Collection;


class SpecialiteService
{
    /**
     * Get all specialites.
     *
     * @return Collection
     */
    public function getAllSpecialites(): Collection
    {
        return Specialite::all();
    }

    /**
     * Find a specialite by ID.
     *
     * @param int $id
     * @return Specialite|null
     */
    public function findSpecialiteById(int $id): ?Specialite
    {
        return Specialite::find($id);
    }

    /**
     * Create a new specialite.
     *
     * @param array $data
     * @return Specialite
     */
    public function createSpecialite(array $data): Specialite
    {
        return Specialite::create($data);
    }

    /**
     * Update an existing specialite.
     *
     * @param int $id
     * @param array $data
     * @return Specialite|null
     */
    public function updateSpecialite(int $id, array $data): ?Specialite
    {
        $specialite = $this->findSpecialiteById($id);
        if ($specialite) {
            $specialite->update($data);
        }
        return $specialite;
    }

    /**
     * Delete a specialite by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteSpecialite(int $id): bool
    {
        $specialite = $this->findSpecialiteById($id);
        if ($specialite) {
            return $specialite->delete();
        }
        return false;
    }
}