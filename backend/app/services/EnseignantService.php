<?php

namespace App\Services;

use App\Models\Enseignant;
use App\Models\Matiere;
use App\Models\Classe;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class EnseignantService extends BaseCacheService
{
    protected $identifiantService;

    public function __construct()
    {
        parent::__construct();
        $this->identifiantService = new IdentifiantService();
    }

    public function getAllEnseignants(): Collection
    {
        return $this->getAllWithCache(function () {
            return Enseignant::with(['user', 'enseignements.matiere', 'enseignements.classe'])->get();
        });
    }

    public function findEnseignantById(int $id): ?Enseignant
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Enseignant::with(['user', 'enseignements.matiere', 'enseignements.classe'])->find($id);
        });
    }

    public function createEnseignant(array $data): Enseignant
    {
        return $this->storeWithCache($data, function ($data) {
            $this->validateEnseignantData($data);
            
            if (isset($data['telephone'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone'])) {
                    throw ValidationException::withMessages([
                        'telephone' => 'Le numéro de téléphone doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone'] = $this->identifiantService->formaterTelephone($data['telephone']);
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
            
            return Enseignant::create($data);
        });
    }

    public function updateEnseignant(int $id, array $data): ?Enseignant
    {
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $enseignant = Enseignant::find($id);
            if (!$enseignant) {
                return null;
            }

            $this->validateEnseignantData($data, $enseignant);
            
            if (isset($data['telephone']) && !empty($data['telephone'])) {
                if (!$this->identifiantService->validerTelephone($data['telephone'])) {
                    throw ValidationException::withMessages([
                        'telephone' => 'Le numéro de téléphone doit être au format sénégalais (7XXXXXXXX)'
                    ]);
                }
                $data['telephone'] = $this->identifiantService->formaterTelephone($data['telephone']);
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

            $enseignant->update($data);
            return $enseignant->fresh(['user', 'enseignements']);
        });
    }

    public function deleteEnseignant(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $enseignant = Enseignant::find($id);
            if ($enseignant) {
                if ($enseignant->enseignements()->count() > 0) {
                    throw ValidationException::withMessages([
                        'enseignant' => 'Impossible de supprimer un enseignant ayant des enseignements en cours'
                    ]);
                }
                return $enseignant->delete();
            }
            return false;
        });
    }

    public function getEnseignantsActifs(): Collection
    {
        return cache()->remember('enseignants_actifs', $this->cacheTtl, function () {
            return Enseignant::actif()->with(['user'])->get();
        });
    }

    public function getEnseignantsParContrat(string $typeContrat): Collection
    {
        return cache()->remember("enseignants_contrat_{$typeContrat}", $this->cacheTtl, function () use ($typeContrat) {
            return Enseignant::parContrat($typeContrat)->with(['user'])->get();
        });
    }

    public function getEnseignantsParSpecialite(string $specialite): Collection
    {
        return cache()->remember("enseignants_specialite_{$specialite}", $this->cacheTtl, function () use ($specialite) {
            return Enseignant::parSpecialite($specialite)->with(['user'])->get();
        });
    }

    public function changerStatutEmploi(int $enseignantId, string $statut): ?Enseignant
    {
        $statutsValides = ['actif', 'conge', 'suspendu', 'demissionne'];
        if (!in_array($statut, $statutsValides)) {
            throw ValidationException::withMessages([
                'statut' => 'Statut invalide'
            ]);
        }

        $enseignant = Enseignant::find($enseignantId);
        if (!$enseignant) {
            return null;
        }

        $enseignant->update(['statut_emploi' => $statut]);
        $this->clearItemCache($enseignantId);
        
        return $enseignant->fresh();
    }

    public function ajusterSalaire(int $enseignantId, float $nouveauSalaire): ?Enseignant
    {
        if ($nouveauSalaire <= 0) {
            throw ValidationException::withMessages([
                'salaire' => 'Le salaire doit être positif'
            ]);
        }

        $enseignant = Enseignant::find($enseignantId);
        if (!$enseignant) {
            return null;
        }

        $enseignant->update(['salaire_base' => $nouveauSalaire]);
        $this->clearItemCache($enseignantId);
        
        return $enseignant->fresh();
    }

    public function assignerEnseignement(int $enseignantId, int $matiereId, int $classeId, float $volumeHoraire): bool
    {
        $enseignant = Enseignant::find($enseignantId);
        $matiere = Matiere::find($matiereId);
        $classe = Classe::find($classeId);
        
        if (!$enseignant || !$matiere || !$classe) {
            return false;
        }
        
        if (!$enseignant->peutEnseigner($matiere)) {
            throw ValidationException::withMessages([
                'matiere' => 'L\'enseignant n\'est pas qualifié pour cette matière'
            ]);
        }
        
        $enseignant->enseignements()->create([
            'matiere_id' => $matiereId,
            'classe_id' => $classeId,
            'volume_horaire' => $volumeHoraire
        ]);
        
        $this->clearItemCache($enseignantId);
        return true;
    }

    public function getStatistiquesEnseignants(): array
    {
        return cache()->remember('statistiques_enseignants', 1800, function () {
            return [
                'total_enseignants' => Enseignant::count(),
                'enseignants_actifs' => Enseignant::actif()->count(),
                'par_type_contrat' => Enseignant::selectRaw('type_contrat, COUNT(*) as total')
                    ->groupBy('type_contrat')
                    ->get(),
                'par_statut_emploi' => Enseignant::selectRaw('statut_emploi, COUNT(*) as total')
                    ->groupBy('statut_emploi')
                    ->get(),
                'salaire_moyen' => Enseignant::avg('salaire_base'),
                'salaire_median' => $this->getSalaireMedian(),
                'repartition_sexe' => Enseignant::selectRaw('sexe, COUNT(*) as total')
                    ->groupBy('sexe')
                    ->get(),
                'age_moyen' => $this->getAgeMoyen(),
                'total_volume_horaire' => $this->getTotalVolumeHoraire()
            ];
        });
    }

    public function getEnseignantsDisponibles(int $matiereId): Collection
    {
        $matiere = Matiere::find($matiereId);
        if (!$matiere) {
            return collect();
        }

        return cache()->remember("enseignants_disponibles_matiere_{$matiereId}", 1800, function () use ($matiere) {
            return Enseignant::actif()
                ->whereJsonContains('specialites', $matiere->nom)
                ->orWhereJsonContains('specialites', $matiere->code)
                ->with(['user', 'enseignements'])
                ->get();
        });
    }

    private function validateEnseignantData(array $data, ?Enseignant $enseignant = null): void
    {
        if (isset($data['matricule']) && $enseignant && $data['matricule'] !== $enseignant->matricule) {
            if (Enseignant::where('matricule', $data['matricule'])->exists()) {
                throw ValidationException::withMessages([
                    'matricule' => 'Ce matricule existe déjà'
                ]);
            }
        }
        
        if (isset($data['email']) && $enseignant && $data['email'] !== $enseignant->email) {
            if (Enseignant::where('email', $data['email'])->exists()) {
                throw ValidationException::withMessages([
                    'email' => 'Cet email existe déjà'
                ]);
            }
        }
    }

    private function getSalaireMedian(): float
    {
        $salaires = Enseignant::whereNotNull('salaire_base')
                              ->orderBy('salaire_base')
                              ->pluck('salaire_base');
        
        $count = $salaires->count();
        if ($count === 0) return 0;
        
        $middle = floor($count / 2);
        
        if ($count % 2 === 0) {
            return ($salaires[$middle - 1] + $salaires[$middle]) / 2;
        }
        
        return $salaires[$middle];
    }

    private function getAgeMoyen(): float
    {
        $ages = Enseignant::all()->map(function ($enseignant) {
            return $enseignant->age;
        });
        
        return $ages->avg() ?? 0;
    }

    private function getTotalVolumeHoraire(): float
    {
        return \DB::table('enseignements')->sum('volume_horaire');
    }
}