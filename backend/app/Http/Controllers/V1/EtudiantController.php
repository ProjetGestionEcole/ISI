<?php

namespace App\Http\Controllers\V1;

use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class EtudiantController extends Controller
{

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
}
