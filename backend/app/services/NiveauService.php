<?php

namespace app\services;

use App\Models\Niveau;
use Illuminate\Database\Eloquent\Collection;


class NiveauService
{
    /**
     * Get all niveaux.
     *
     * @return Collection
     */
    public function getAllNiveaux(): Collection
    {
        return Niveau::all();
    }

    /**
     * Find a niveau by ID.
     *
     * @param int $id
     * @return Niveau|null
     */
    public function findNiveauById(int $id): ?Niveau
    {
        return Niveau::find($id);
    }

    /**
     * Create a new niveau.
     *
     * @param array $data
     * @return Niveau
     */
    public function createNiveau(array $data): Niveau
    {
        return Niveau::create($data);
    }

    /**
     * Update an existing niveau.
     *
     * @param int $id
     * @param array $data
     * @return Niveau|null
     */
    public function updateNiveau(int $id, array $data): ?Niveau
    {
        $niveau = $this->findNiveauById($id);
        if ($niveau) {
            $niveau->update($data);
        }
        return $niveau;
    }

    /**
     * Delete a niveau by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteNiveau(int $id): bool
    {
        $niveau = $this->findNiveauById($id);
        if ($niveau) {
            return $niveau->delete();
        }
        return false;
    }
}