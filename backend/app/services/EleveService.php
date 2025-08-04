<?php

namespace App\Services;

use App\Models\Eleve;
use App\Models\Classe;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class EleveService extends BaseCacheService
{
    protected $identifiantService;

    public function __construct()
    {
        parent::__construct();
        $this->identifiantService = new IdentifiantService();
    }

    public function getAllEleves(): Collection
    {
        return $this->getAllWithCache(function () {
            return Eleve::with(['classe', 'user'])->get();
        });
    }

    public function findEleveById(int $id): ?Eleve
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Eleve::with(['classe', 'user', 'notes', 'absences'])->find($id);
        });
    }

    public function createEleve(array $data): Eleve
    {
        return $this->storeWithCache($data, function ($data) {
            $this->validateEleveData($data);
            
            if (isset($data['telephone'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone'])) {
                    throw ValidationException::withMessages([
                        'telephone' => 'Le numéro de téléphone doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone'] = $this->identifiantService->formaterTelephone($data['telephone']);
            }
            
            if (isset($data['telephone_parent'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone_parent'])) {
                    throw ValidationException::withMessages([
                        'telephone_parent' => 'Le numéro du parent doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone_parent'] = $this->identifiantService->formaterTelephone($data['telephone_parent']);
            }
            
            if (isset($data['sexe']) && !$this->identifiantService->validerSexe($data['sexe'])) {
                throw ValidationException::withMessages([
                    'sexe' => 'Le sexe doit être M ou F'
                ]);
            }
            
            if (isset($data['lieu_naissance']) && !$this->identifiantService->validerLieuNaissance($data['lieu_naissance'])) {
                throw ValidationException::withMessages([
                    'lieu_naissance' => 'Le lieu de naissance doit être une ville du Sénégal'
                ]);
            }
            
            return Eleve::create($data);
        });
    }

    public function updateEleve(int $id, array $data): ?Eleve
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $eleve = Eleve::find($id);
            if (!$eleve) {
                return null;
            }

            $this->validateEleveData($data, $eleve);
            
            if (isset($data['telephone']) && !empty($data['telephone'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone'])) {
                    throw ValidationException::withMessages([
                        'telephone' => 'Le numéro de téléphone doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone'] = $this->identifiantService->formaterTelephone($data['telephone']);
            }
            
            if (isset($data['telephone_parent']) && !empty($data['telephone_parent'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone_parent'])) {
                    throw ValidationException::withMessages([
                        'telephone_parent' => 'Le numéro du parent doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone_parent'] = $this->identifiantService->formaterTelephone($data['telephone_parent']);
            }
            
            if (isset($data['sexe']) && !$this->identifiantService->validerSexe($data['sexe'])) {
                throw ValidationException::withMessages([
                    'sexe' => 'Le sexe doit être M ou F'
                ]);
            }
            
            if (isset($data['lieu_naissance']) && !$this->identifiantService->validerLieuNaissance($data['lieu_naissance'])) {
                throw ValidationException::withMessages([
                    'lieu_naissance' => 'Le lieu de naissance doit être une ville du Sénégal'
                ]);
            }

            $eleve->update($data);
            return $eleve->fresh(['classe', 'user']);
        });
    }

    public function deleteEleve(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $eleve = Eleve::find($id);
            if ($eleve) {
                return $eleve->delete();
            }
            return false;
        });
    }

    public function assignerClasse(int $eleveId, int $classeId): ?Eleve
    {
        $eleve = Eleve::find($eleveId);
        $classe = Classe::find($classeId);
        
        if (!$eleve || !$classe) {
            return null;
        }
        
        $capaciteActuelle = Eleve::where('classe_id', $classeId)->count();
        if ($capaciteActuelle >= $classe->capacite_max) {
            throw ValidationException::withMessages([
                'classe_id' => 'La classe a atteint sa capacité maximale'
            ]);
        }
        
        $eleve->update(['classe_id' => $classeId]);
        $this->clearItemCache($eleveId);
        
        return $eleve->fresh(['classe']);
    }

    public function getElevesParClasse(int $classeId): Collection
    {
        return cache()->remember("eleves_classe_{$classeId}", $this->cacheTtl, function () use ($classeId) {
            return Eleve::with(['user'])->where('classe_id', $classeId)->get();
        });
    }

    public function getElevesEnAttente(): Collection
    {
        return cache()->remember('eleves_en_attente', $this->cacheTtl, function () {
            return Eleve::with(['classe', 'user'])->enAttente()->get();
        });
    }

    public function changerStatutInscription(int $eleveId, string $statut): ?Eleve
    {
        $statutsValides = ['en_attente', 'inscrit', 'reinscrit', 'suspendu', 'exclu'];
        if (!in_array($statut, $statutsValides)) {
            throw ValidationException::withMessages([
                'statut' => 'Statut invalide'
            ]);
        }

        $eleve = Eleve::find($eleveId);
        if (!$eleve) {
            return null;
        }

        $eleve->update(['statut_inscription' => $statut]);
        $this->clearItemCache($eleveId);
        
        return $eleve->fresh();
    }

    public function getStatistiquesEleves(): array
    {
        return cache()->remember('statistiques_eleves', 1800, function () {
            return [
                'total_eleves' => Eleve::count(),
                'eleves_inscrits' => Eleve::inscrit()->count(),
                'eleves_en_attente' => Eleve::enAttente()->count(),
                'eleves_par_classe' => Eleve::selectRaw('classe_id, COUNT(*) as total')
                    ->whereNotNull('classe_id')
                    ->groupBy('classe_id')
                    ->with('classe:id,nom')
                    ->get(),
                'repartition_sexe' => Eleve::selectRaw('sexe, COUNT(*) as total')
                    ->groupBy('sexe')
                    ->get()
            ];
        });
    }

    private function validateEleveData(array $data, ?Eleve $eleve = null): void
    {
        if (isset($data['matricule']) && $eleve && $data['matricule'] !== $eleve->matricule) {
            if (Eleve::where('matricule', $data['matricule'])->exists()) {
                throw ValidationException::withMessages([
                    'matricule' => 'Ce matricule existe déjà'
                ]);
            }
        }
        
        if (isset($data['email']) && $eleve && $data['email'] !== $eleve->email) {
            if (Eleve::where('email', $data['email'])->exists()) {
                throw ValidationException::withMessages([
                    'email' => 'Cet email existe déjà'
                ]);
            }
        }
        
        if (isset($data['numero_parent']) && $eleve && $data['numero_parent'] !== $eleve->numero_parent) {
            if (Eleve::where('numero_parent', $data['numero_parent'])->exists()) {
                throw ValidationException::withMessages([
                    'numero_parent' => 'Ce numéro de parent existe déjà'
                ]);
            }
        }
    }
}