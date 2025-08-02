<?php

namespace App\Services;

use App\Models\Enseignement;
use Illuminate\Database\Eloquent\Collection;

class EnseignementService
{
    /**
     * Get all enseignements.
     *
     * @return Collection
     */
    public function getAllEnseignements(): Collection
    {
        return Enseignement::all();
    }

    /**
     * Find a enseignement by ID.
     *
     * @param int $id
     * @return Enseignement|null
     */
    public function findEnseignementById(int $id): ?Enseignement
    {
        return Enseignement::find($id);
    }

    /**
     * Create a new enseignement.
     *
     * @param array $data
     * @return Enseignement
     */
    public function createEnseignement(array $data): Enseignement
    {
        return Enseignement::create($data);
    }

    /**
     * Update an existing enseignement.
     *
     * @param int $id
     * @param array $data
     * @return Enseignement|null
     */
    public function updateEnseignement(int $id, array $data): ?Enseignement
    {
        $enseignement = $this->findEnseignementById($id);
        if ($enseignement) {
            $enseignement->update($data);
        }
        return $enseignement;
    }

    /**
     * Delete a enseignement by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteEnseignement(int $id): bool
    {
        $enseignement = $this->findEnseignementById($id);
        if ($enseignement) {
            return $enseignement->delete();
        }
        return false;
    }
}
