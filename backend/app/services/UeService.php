<?php

namespace App\Services;

use App\Models\Ue;
use Illuminate\Database\Eloquent\Collection;

class UeService
{
    /**
     * Get all ues.
     *
     * @return Collection
     */
    public function getAllUes(): Collection
    {
        return Ue::all();
    }

    /**
     * Find a ue by ID.
     *
     * @param int $id
     * @return Ue|null
     */
    public function findUeById(int $id): ?Ue
    {
        return Ue::find($id);
    }

    /**
     * Create a new ue.
     *
     * @param array $data
     * @return Ue
     */
    public function createUe(array $data): Ue
    {
        return Ue::create($data);
    }

    /**
     * Update an existing ue.
     *
     * @param int $id
     * @param array $data
     * @return Ue|null
     */
    public function updateUe(int $id, array $data): ?Ue
    {
        $ue = $this->findUeById($id);
        if ($ue) {
            $ue->update($data);
        }
        return $ue;
    }

    /**
     * Delete a ue by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteUe(int $id): bool
    {
        $ue = $this->findUeById($id);
        if ($ue) {
            return $ue->delete();
        }
        return false;
    }
}
