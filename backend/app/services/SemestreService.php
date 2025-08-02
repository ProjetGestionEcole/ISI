<?php

namespace App\Services;

use App\Models\Semestre;
use Illuminate\Database\Eloquent\Collection;

class SemestreService
{
    /**
     * Get all semestres.
     *
     * @return Collection
     */
    public function getAllSemestres(): Collection
    {
        return Semestre::all();
    }

    /**
     * Find a semestre by ID.
     *
     * @param int $id
     * @return Semestre|null
     */
    public function findSemestreById(int $id): ?Semestre
    {
        return Semestre::find($id);
    }

    /**
     * Create a new semestre.
     *
     * @param array $data
     * @return Semestre
     */
    public function createSemestre(array $data): Semestre
    {
        return Semestre::create($data);
    }

    /**
     * Update an existing semestre.
     *
     * @param int $id
     * @param array $data
     * @return Semestre|null
     */
    public function updateSemestre(int $id, array $data): ?Semestre
    {
        $semestre = $this->findSemestreById($id);
        if ($semestre) {
            $semestre->update($data);
        }
        return $semestre;
    }

    /**
     * Delete a semestre by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteSemestre(int $id): bool
    {
        $semestre = $this->findSemestreById($id);
        if ($semestre) {
            return $semestre->delete();
        }
        return false;
    }
}
