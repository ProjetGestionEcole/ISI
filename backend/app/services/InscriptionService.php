<?php

namespace App\Services;

use App\Models\Inscription;
use Illuminate\Database\Eloquent\Collection;

class InscriptionService
{
    /**
     * Get all inscriptions.
     *
     * @return Collection
     */
    public function getAllInscriptions(): Collection
    {
        return Inscription::all();
    }

    /**
     * Find a inscription by ID.
     *
     * @param int $id
     * @return Inscription|null
     */
    public function findInscriptionById(int $id): ?Inscription
    {
        return Inscription::find($id);
    }

    /**
     * Create a new inscription.
     *
     * @param array $data
     * @return Inscription
     */
    public function createInscription(array $data): Inscription
    {
        return Inscription::create($data);
    }

    /**
     * Update an existing inscription.
     *
     * @param int $id
     * @param array $data
     * @return Inscription|null
     */
    public function updateInscription(int $id, array $data): ?Inscription
    {
        $inscription = $this->findInscriptionById($id);
        if ($inscription) {
            $inscription->update($data);
        }
        return $inscription;
    }

    /**
     * Delete a inscription by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteInscription(int $id): bool
    {
        $inscription = $this->findInscriptionById($id);
        if ($inscription) {
            return $inscription->delete();
        }
        return false;
    }
}
