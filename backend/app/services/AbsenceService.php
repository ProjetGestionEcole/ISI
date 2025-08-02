<?php

namespace App\Services;

use App\Models\Absence;
use Illuminate\Database\Eloquent\Collection;

class AbsenceService
{
    /**
     * Get all absences.
     *
     * @return Collection
     */
    public function getAllAbsences(): Collection
    {
        return Absence::all();
    }

    /**
     * Find a absence by ID.
     *
     * @param int $id
     * @return Absence|null
     */
    public function findAbsenceById(int $id): ?Absence
    {
        return Absence::find($id);
    }

    /**
     * Create a new absence.
     *
     * @param array $data
     * @return Absence
     */
    public function createAbsence(array $data): Absence
    {
        return Absence::create($data);
    }

    /**
     * Update an existing absence.
     *
     * @param int $id
     * @param array $data
     * @return Absence|null
     */
    public function updateAbsence(int $id, array $data): ?Absence
    {
        $absence = $this->findAbsenceById($id);
        if ($absence) {
            $absence->update($data);
        }
        return $absence;
    }

    /**
     * Delete a absence by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteAbsence(int $id): bool
    {
        $absence = $this->findAbsenceById($id);
        if ($absence) {
            return $absence->delete();
        }
        return false;
    }
}
