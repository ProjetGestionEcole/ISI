<?php

namespace App\Http\Controllers\V1;

use App\Models\Etudiant;
use App\Models\User;
use App\Models\Note;
use App\Models\Absence;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class EtudiantController extends Controller
{

    protected function successResponse($data, $message = 'Success', $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Return an error JSON response
     */
    protected function errorResponse($message = 'Error', $code = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null
        ], $code);
    }

    /**
     * Return a validation error JSON response
     */
    protected function validationErrorResponse(ValidationException $e): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'data' => null,
            'errors' => $e->errors()
        ], 422);
    }
    /**
     * Display a listing of all students
     */
    public function index(): JsonResponse
    {
        try {
            $etudiants = Etudiant::with(['notes', 'absences', 'inscriptions'])->get();
            
            return $this->successResponse($etudiants, 'Étudiants récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des étudiants', 500);
        }
    }

    /**
     * Store a newly created student
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $validated['role'] = User::ROLE_ETUDIANT;

            $etudiant = Etudiant::create($validated);

            return $this->successResponse($etudiant, 'Étudiant créé avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'étudiant', 500);
        }
    }

    /**
     * Display the specified student
     */
    public function show($id): JsonResponse
    {
        try {
            $etudiant = Etudiant::with(['notes.matiere', 'absences', 'inscriptions.classe', 'parentRelations.parent'])
                ->findOrFail($id);

            return $this->successResponse($etudiant, 'Étudiant récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Étudiant non trouvé', 404);
        }
    }

    /**
     * Update the specified student
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $etudiant = Etudiant::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $etudiant->update($validated);

            return $this->successResponse($etudiant, 'Étudiant mis à jour avec succès');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'étudiant', 500);
        }
    }

    /**
     * Remove the specified student
     */
    public function destroy($id): JsonResponse
    {
        try {
            $etudiant = Etudiant::findOrFail($id);
            $etudiant->delete();

            return $this->successResponse(null, 'Étudiant supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'étudiant', 500);
        }
    }

    /**
     * Get student's notes
     */
    public function getNotes($id): JsonResponse
    {
        try {
            $etudiant = Etudiant::findOrFail($id);
            $notes = $etudiant->notes()->with(['matiere', 'ue'])->get();

            return $this->successResponse($notes, 'Notes de l\'étudiant récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get student's absences
     */
    public function getAbsences($id): JsonResponse
    {
        try {
            $etudiant = Etudiant::findOrFail($id);
            $absences = $etudiant->absences()->with('matiere')->get();

            return $this->successResponse($absences, 'Absences de l\'étudiant récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get student's statistics
     */
    public function getStatistics($id): JsonResponse
    {
        try {
            $etudiant = Etudiant::findOrFail($id);
            
            $statistics = [
                'average_grade' => $etudiant->getAverageGrade(),
                'total_absences' => $etudiant->getTotalAbsences(),
                'total_notes' => $etudiant->notes()->count(),
            ];

            return $this->successResponse($statistics, 'Statistiques de l\'étudiant récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    // ========== AUTHENTICATED USER ENDPOINTS ==========

    /**
     * Get authenticated student's notes
     */
    public function getMyNotes(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Etudiant') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $notes = Note::where('id_etudiant', $user->id)
                ->with(['enseignement.matiere', 'enseignement.prof'])
                ->get();

            return $this->successResponse($notes, 'Mes notes récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get authenticated student's absences
     */
    public function getMyAbsences(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Etudiant') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $absences = Absence::where('etudiant_id', $user->id)
                ->with(['matiere', 'prof'])
                ->get();

            return $this->successResponse($absences, 'Mes absences récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get authenticated student's inscriptions
     */
    public function getMyInscriptions(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Etudiant') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $inscriptions = Inscription::where('etudiant_id', $user->id)
                ->with(['classe', 'anneeScolaire'])
                ->get();

            return $this->successResponse($inscriptions, 'Mes inscriptions récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des inscriptions', 500);
        }
    }

    /**
     * Get authenticated student's dashboard statistics
     */
    public function getMyDashboardStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Etudiant') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            // Add logging for debugging

            $notesCount = Note::where('id_etudiant', $user->id)->count();
            $absencesCount = Absence::where('etudiant_id', $user->id)->count();
            $inscriptionsCount = Inscription::where('etudiant_id', $user->id)->count();
            
            // Get average grade (calculate from mcc and examen)
            $notes = Note::where('id_etudiant', $user->id)->get();
            $averageGrade = 0;
            if ($notes->count() > 0) {
                $totalGrade = 0;
                $gradeCount = 0;
                foreach ($notes as $note) {
                    // Calculate final grade: 40% MCC + 60% Examen
                    if ($note->mcc !== null && $note->examen !== null) {
                        $finalGrade = ($note->mcc * 0.4) + ($note->examen * 0.6);
                        $totalGrade += $finalGrade;
                        $gradeCount++;
                    }
                }
                if ($gradeCount > 0) {
                    $averageGrade = $totalGrade / $gradeCount;
                }
            }
            
            // Get current class info with better error handling
            $currentInscription = null;
            $currentClassName = null;
            
            try {
                $currentInscription = Inscription::where('etudiant_id', $user->id)
                    ->with('classe')
                    ->latest()
                    ->first();
                    
                if ($currentInscription && $currentInscription->classe) {
                    $currentClassName = $currentInscription->classe->nom_classe ?? null;
                }
            } catch (\Exception $e) {
            }
            
            $stats = [
                'notes_count' => $notesCount ?? 0,
                'absences_count' => $absencesCount ?? 0,
                'inscriptions_count' => $inscriptionsCount ?? 0,
                'average_grade' => round($averageGrade ?? 0, 2),
                'current_class' => $currentClassName,
            ];

            return $this->successResponse($stats, 'Mes statistiques récupérées avec succès');
        } catch (\Exception $e) {
            
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }
}
