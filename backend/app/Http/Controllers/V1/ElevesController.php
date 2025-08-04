<?php

namespace App\Http\Controllers\V1;

use App\Services\EleveService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ElevesController extends EnhancedBaseController
{
    protected EleveService $eleveService;

    public function __construct(EleveService $eleveService)
    {
        $this->eleveService = $eleveService;
        $this->service = $eleveService;
        $this->resourceName = 'Eleve';
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
            'email' => 'nullable|email|unique:eleves,email',
            'adresse' => 'required|string|max:500',
            'nom_pere' => 'nullable|string|max:255',
            'nom_mere' => 'nullable|string|max:255',
            'telephone_parent' => 'nullable|string|max:20',
            'email_parent' => 'nullable|email',
            'documents_justificatifs' => 'nullable|array',
            'classe_id' => 'nullable|exists:classes,id',
            'matricule' => 'nullable|string|unique:eleves,matricule',
            'numero_parent' => 'nullable|string|unique:eleves,numero_parent'
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
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('eleves')->ignore($id)],
            'adresse' => 'sometimes|required|string|max:500',
            'nom_pere' => 'sometimes|nullable|string|max:255',
            'nom_mere' => 'sometimes|nullable|string|max:255',
            'telephone_parent' => 'sometimes|nullable|string|max:20',
            'email_parent' => 'sometimes|nullable|email',
            'documents_justificatifs' => 'sometimes|nullable|array',
            'classe_id' => 'sometimes|nullable|exists:classes,id',
            'matricule' => ['sometimes', 'nullable', 'string', Rule::unique('eleves')->ignore($id)],
            'numero_parent' => ['sometimes', 'nullable', 'string', Rule::unique('eleves')->ignore($id)],
            'statut_inscription' => 'sometimes|in:en_attente,inscrit,reinscrit,suspendu,exclu'
        ]);
    }

    public function assignerClasse(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'classe_id' => 'required|exists:classes,id'
            ]);

            $eleve = $this->eleveService->assignerClasse((int)$id, $validated['classe_id']);
            
            if (!$eleve) {
                return response()->json(['error' => 'Élève ou classe non trouvé'], 404);
            }

            return response()->json([
                'message' => 'Élève assigné à la classe avec succès',
                'eleve' => $eleve
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'assignation à la classe',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function changerStatut(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'statut' => 'required|in:en_attente,inscrit,reinscrit,suspendu,exclu'
            ]);

            $eleve = $this->eleveService->changerStatutInscription((int)$id, $validated['statut']);
            
            if (!$eleve) {
                return response()->json(['error' => 'Élève non trouvé'], 404);
            }

            return response()->json([
                'message' => 'Statut modifié avec succès',
                'eleve' => $eleve
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors du changement de statut',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function parClasse(string $classeId): JsonResponse
    {
        try {
            $eleves = $this->eleveService->getElevesParClasse((int)$classeId);
            return response()->json($eleves);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des élèves',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function enAttente(): JsonResponse
    {
        try {
            $eleves = $this->eleveService->getElevesEnAttente();
            return response()->json($eleves);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des élèves en attente',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function statistiques(): JsonResponse
    {
        try {
            $stats = $this->eleveService->getStatistiquesEleves();
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
