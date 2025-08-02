<?php

namespace App\Services;

use App\Models\Classe;
use Illuminate\Database\Eloquent\Collection;

class ClasseService
{
    /**
     * Get all classes.
     *
     * @return Collection
     */
    public function getAllClasses(): Collection
    {
        return Classe::all();
    }

    /**
     * Find a classe by ID.
     *
     * @param int $id
     * @return Classe|null
     */
    public function findClasseById(int $id): ?Classe
    {
        return Classe::find($id);
    }

    /**
     * Create a new classe.
     *
     * @param array $data
     * @return Classe
     */
    public function createClasse(array $data): Classe
    {
        return Classe::create($data);
    }

    /**
     * Update an existing classe.
     *
     * @param int $id
     * @param array $data
     * @return Classe|null
     */
    public function updateClasse(int $id, array $data): ?Classe
    {
        $classe = $this->findClasseById($id);
        if ($classe) {
            $classe->update($data);
        }
        return $classe;
    }

    /**
     * Delete a classe by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteClasse(int $id): bool
    {
        $classe = $this->findClasseById($id);
        if ($classe) {
            return $classe->delete();
        }
        return false;
    }
}
