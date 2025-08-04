<?php

namespace App\Http\Controllers\V1;

use App\Services\EnseignantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class EnseignantsController extends EnhancedBaseController
{
    protected EnseignantService $enseignantService;

    public function __construct(EnseignantService $enseignantService)
    {
        $this->enseignantService = $enseignantService;
        $this->service = $enseignantService;
        $this->resourceName = 'Enseignant';
    }

    protected function validateStoreRequest(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:today',
            'lieu_naissance' => 'required|string|max:255',
            'sexe' => 'required|in:M,F',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|unique:enseignants,email',
            'adresse' => 'required|string|max:1000',
            'diplome_principal' => 'required|string|max:255',
            'specialites' => 'required|array|min:1',
            'specialites.*' => 'string|max:255',
            'documents_administratifs' => 'nullable|array',
            'salaire_base' => 'nullable|numeric|min:0',
            'date_embauche' => 'nullable|date',
            'type_contrat' => 'required|in:cdi,cdd,vacation',
            'matricule' => 'nullable|string|unique:enseignants,matricule'
        ]);
    }

    protected function validateUpdateRequest(Request $request, string $id): array
    {
        return $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'date_naissance' => 'sometimes|required|date|before:today',
            'lieu_naissance' => 'sometimes|required|string|max:255',
            'sexe' => 'sometimes|required|in:M,F',
            'telephone' => 'sometimes|required|string|max:20',
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('enseignants')->ignore($id)],
            'adresse' => 'sometimes|required|string|max:1000',
            'diplome_principal' => 'sometimes|required|string|max:255',
            'specialites' => 'sometimes|required|array|min:1',
            'specialites.*' => 'string|max:255',
            'documents_administratifs' => 'sometimes|nullable|array',
            'salaire_base' => 'sometimes|nullable|numeric|min:0',
            'date_embauche' => 'sometimes|nullable|date',
            'type_contrat' => 'sometimes|required|in:cdi,cdd,vacation',
            'statut_emploi' => 'sometimes|in:actif,conge,suspendu,demissionne',
            'matricule' => ['sometimes', 'nullable', 'string', Rule::unique('enseignants')->ignore($id)]
        ]);
    }

    public function changerStatut(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'statut' => 'required|in:actif,conge,suspendu,demissionne'
            ]);

            $enseignant = $this->enseignantService->changerStatutEmploi((int)$id, $validated['statut']);
            
            if (!$enseignant) {
                return response()->json(['error' => 'Enseignant non trouvé'], 404);
            }

            return response()->json([
                'message' => 'Statut modifié avec succès',
                'enseignant' => $enseignant
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors du changement de statut',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function ajusterSalaire(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'salaire' => 'required|numeric|min:0'
            ]);

            $enseignant = $this->enseignantService->ajusterSalaire((int)$id, $validated['salaire']);
            
            if (!$enseignant) {
                return response()->json(['error' => 'Enseignant non trouvé'], 404);
            }

            return response()->json([
                'message' => 'Salaire ajusté avec succès',
                'enseignant' => $enseignant
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'ajustement du salaire',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function assignerEnseignement(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'matiere_id' => 'required|exists:matieres,id',
                'classe_id' => 'required|exists:classes,id',
                'volume_horaire' => 'required|numeric|min:0'
            ]);

            $success = $this->enseignantService->assignerEnseignement(
                (int)$id,
                $validated['matiere_id'],
                $validated['classe_id'],
                $validated['volume_horaire']
            );
            
            if (!$success) {
                return response()->json(['error' => 'Impossible d\'assigner l\'enseignement'], 400);
            }

            return response()->json([
                'message' => 'Enseignement assigné avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'assignation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function actifs(): JsonResponse
    {
        try {
            $enseignants = $this->enseignantService->getEnseignantsActifs();
            return response()->json($enseignants);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des enseignants actifs',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function parContrat(string $typeContrat): JsonResponse
    {
        try {
            $enseignants = $this->enseignantService->getEnseignantsParContrat($typeContrat);
            return response()->json($enseignants);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des enseignants',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function parSpecialite(string $specialite): JsonResponse
    {
        try {
            $enseignants = $this->enseignantService->getEnseignantsParSpecialite($specialite);
            return response()->json($enseignants);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des enseignants',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function disponiblesPourMatiere(string $matiereId): JsonResponse
    {
        try {
            $enseignants = $this->enseignantService->getEnseignantsDisponibles((int)$matiereId);
            return response()->json($enseignants);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des enseignants disponibles',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function statistiques(): JsonResponse
    {
        try {
            $stats = $this->enseignantService->getStatistiquesEnseignants();
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
