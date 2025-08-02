<?php

namespace App\Services;

use App\Models\AnneeScolaire;
use Illuminate\Database\Eloquent\Collection;

class AnneeScolaireService
{
    /**
     * Get all anneeScolaires.
     *
     * @return Collection
     */
    public function getAllAnneeScolaires(): Collection
    {
        return AnneeScolaire::all();
    }

    /**
     * Find a anneeScolaire by ID.
     *
     * @param int $id
     * @return AnneeScolaire|null
     */
    public function findAnneeScolaireById(int $id): ?AnneeScolaire
    {
        return AnneeScolaire::find($id);
    }

    /**
     * Create a new anneeScolaire.
     *
     * @param array $data
     * @return AnneeScolaire
     */
    public function createAnneeScolaire(array $data): AnneeScolaire
    {
        return AnneeScolaire::create($data);
    }

    /**
     * Update an existing anneeScolaire.
     *
     * @param int $id
     * @param array $data
     * @return AnneeScolaire|null
     */
    public function updateAnneeScolaire(int $id, array $data): ?AnneeScolaire
    {
        $anneeScolaire = $this->findAnneeScolaireById($id);
        if ($anneeScolaire) {
            $anneeScolaire->update($data);
        }
        return $anneeScolaire;
    }

    /**
     * Delete a anneeScolaire by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteAnneeScolaire(int $id): bool
    {
        $anneeScolaire = $this->findAnneeScolaireById($id);
        if ($anneeScolaire) {
            return $anneeScolaire->delete();
        }
        return false;
    }
}
