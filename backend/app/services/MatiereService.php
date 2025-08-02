<?php

namespace App\Services;

use App\Models\Matiere;
use Illuminate\Database\Eloquent\Collection;

class MatiereService
{
    /**
     * Get all matieres.
     *
     * @return Collection
     */
    public function getAllMatieres(): Collection
    {
        return Matiere::all();
    }

    /**
     * Find a matiere by ID.
     *
     * @param int $id
     * @return Matiere|null
     */
    public function findMatiereById(int $id): ?Matiere
    {
        return Matiere::find($id);
    }

    /**
     * Create a new matiere.
     *
     * @param array $data
     * @return Matiere
     */
    public function createMatiere(array $data): Matiere
    {
        return Matiere::create($data);
    }

    /**
     * Update an existing matiere.
     *
     * @param int $id
     * @param array $data
     * @return Matiere|null
     */
    public function updateMatiere(int $id, array $data): ?Matiere
    {
        $matiere = $this->findMatiereById($id);
        if ($matiere) {
            $matiere->update($data);
        }
        return $matiere;
    }

    /**
     * Delete a matiere by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteMatiere(int $id): bool
    {
        $matiere = $this->findMatiereById($id);
        if ($matiere) {
            return $matiere->delete();
        }
        return false;
    }
}
