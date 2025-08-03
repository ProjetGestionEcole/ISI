<?php

namespace App\Http\Controllers\V1;

use App\Models\Prof;
use App\Models\User;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class ProfController extends Controller
{

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
}
