<?php

namespace App\Http\Controllers\V1;

use App\Models\Prof;
use App\Models\User;
use App\Models\Note;
use App\Models\Enseignement;
use App\Models\Matiere;
use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class ProfController extends Controller
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
     * Display a listing of all professors
     */
    public function index(): JsonResponse
    {
        try {
            $profs = Prof::with(['enseignements.matiere', 'enseignements.classe'])->get();
            
            return $this->successResponse($profs, 'Professeurs récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des professeurs', 500);
        }
    }

    /**
     * Store a newly created professor
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
            $validated['role'] = User::ROLE_PROF;

            $prof = Prof::create($validated);

            return $this->successResponse($prof, 'Professeur créé avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du professeur', 500);
        }
    }

    /**
     * Display the specified professor
     */
    public function show($id): JsonResponse
    {
        try {
            $prof = Prof::with(['enseignements.matiere', 'enseignements.classe', 'notes'])
                ->findOrFail($id);

            return $this->successResponse($prof, 'Professeur récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Professeur non trouvé', 404);
        }
    }

    /**
     * Update the specified professor
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $prof = Prof::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $prof->update($validated);

            return $this->successResponse($prof, 'Professeur mis à jour avec succès');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du professeur', 500);
        }
    }

    /**
     * Remove the specified professor
     */
    public function destroy($id): JsonResponse
    {
        try {
            $prof = Prof::findOrFail($id);
            $prof->delete();

            return $this->successResponse(null, 'Professeur supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du professeur', 500);
        }
    }

    /**
     * Add a note for a student (professor functionality)
     */
    public function addNote(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'matiere_id' => 'required|exists:matieres,id',
                'ue_id' => 'required|exists:ues,id',
                'valeur' => 'required|numeric|min:0|max:20',
                'type' => 'required|in:devoir,examen,tp,td',
                'coefficient' => 'sometimes|numeric|min:0.1|max:10',
                'prof_id' => 'required|exists:users,id',
            ]);

            $note = Note::create($validated);

            return $this->successResponse($note, 'Note ajoutée avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'ajout de la note', 500);
        }
    }

    /**
     * Get professor's teaching subjects
     */
    public function getSubjects($id): JsonResponse
    {
        try {
            $prof = Prof::findOrFail($id);
            $subjects = $prof->getSubjects();

            return $this->successResponse($subjects, 'Matières du professeur récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des matières', 500);
        }
    }

    /**
     * Get professor's students count
     */
    public function getStudentsCount($id): JsonResponse
    {
        try {
            $prof = Prof::findOrFail($id);
            $count = $prof->getStudentsCount();

            return $this->successResponse(['students_count' => $count], 'Nombre d\'étudiants récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du nombre d\'étudiants', 500);
        }
    }

    /**
     * Get all notes added by this professor
     */
    public function getNotesAdded($id): JsonResponse
    {
        try {
            $prof = Prof::findOrFail($id);
            $notes = $prof->notes()->with(['user', 'matiere', 'ue'])->get();

            return $this->successResponse($notes, 'Notes du professeur récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    // ========== AUTHENTICATED USER ENDPOINTS ==========

    /**
     * Get authenticated professor's enseignements
     */
    public function getMyEnseignements(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Prof') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $enseignements = Enseignement::where('code_prof', $user->id)
                ->with(['matiere', 'prof'])
                ->get();

            return $this->successResponse($enseignements, 'Mes enseignements récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enseignements', 500);
        }
    }

    /**
     * Get authenticated professor's subjects
     */
    public function getMyMatieres(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Prof') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $enseignements = Enseignement::where('code_prof', $user->id)->get();
            $matiereCodes = $enseignements->pluck('code_matiere');
            
            $matieres = Matiere::whereIn('code_matiere', $matiereCodes)
                ->with(['ue', 'enseignements'])
                ->get();

            return $this->successResponse($matieres, 'Mes matières récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des matières', 500);
        }
    }

    /**
     * Get authenticated professor's notes
     */
    public function getMyNotes(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Prof') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $enseignements = Enseignement::where('code_prof', $user->id)->get();
            $enseignementCodes = $enseignements->pluck('code_enseignement');
            
            $notes = Note::whereIn('code_enseignement', $enseignementCodes)
                ->with(['etudiant', 'enseignement.matiere'])
                ->get();

            return $this->successResponse($notes, 'Mes notes récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get authenticated professor's recorded absences
     */
    public function getMyAbsences(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Prof') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $absences = Absence::where('prof_id', $user->id)
                ->with(['etudiant', 'matiere'])
                ->get();

            return $this->successResponse($absences, 'Mes absences enregistrées récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get authenticated professor's dashboard statistics
     */
    public function getMyDashboardStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Prof') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $enseignementsCount = Enseignement::where('code_prof', $user->id)->count();
            $notesAdded = Note::whereHas('enseignement', function($query) use ($user) {
                $query->where('code_prof', $user->id);
            })->count();
            $absencesRecorded = Absence::where('prof_id', $user->id)->count();
            
            // Get subjects taught by this professor
            $matieresCount = Matiere::whereHas('enseignements', function($query) use ($user) {
                $query->where('code_prof', $user->id);
            })->count();
            
            // Get students taught by this professor
            $studentsCount = Note::whereHas('enseignement', function($query) use ($user) {
                $query->where('code_prof', $user->id);
            })->distinct('id_etudiant')->count();
            
            $stats = [
                'enseignements_count' => $enseignementsCount,
                'matieres_count' => $matieresCount,
                'notes_added' => $notesAdded,
                'absences_recorded' => $absencesRecorded,
                'students_count' => $studentsCount,
            ];

            return $this->successResponse($stats, 'Mes statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }
}
