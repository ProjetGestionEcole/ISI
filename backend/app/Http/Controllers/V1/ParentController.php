<?php

namespace App\Http\Controllers\V1;

use App\Models\User;
use App\Models\Leparent;
use App\Models\Note;
use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class ParentController extends Controller
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
     * Display a listing of all parents
     */
    public function index(): JsonResponse
    {
        try {
            $parents = User::parents()->get();
            
            return $this->successResponse($parents, 'Parents récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des parents', 500);
        }
    }

    /**
     * Store a newly created parent
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
            $validated['role'] = User::ROLE_PARENT;

            $parent = User::create($validated);

            return $this->successResponse($parent, 'Parent créé avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création du parent', 500);
        }
    }

    /**
     * Display the specified parent
     */
    public function show($id): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($id);

            return $this->successResponse($parent, 'Parent récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Parent non trouvé', 404);
        }
    }

    /**
     * Update the specified parent
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $parent->update($validated);

            return $this->successResponse($parent, 'Parent mis à jour avec succès');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du parent', 500);
        }
    }

    /**
     * Remove the specified parent
     */
    public function destroy($id): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($id);
            $parent->delete();

            return $this->successResponse(null, 'Parent supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du parent', 500);
        }
    }

    /**
     * Link a parent to a student
     */
    public function linkToStudent(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'parent_id' => 'required|exists:users,id',
                'student_id' => 'required|exists:users,id',
                'relation' => 'required|in:pere,mere,tuteur',
                'profession' => 'sometimes|string|max:255',
            ]);

            // Verify parent role
            $parent = User::parents()->findOrFail($validated['parent_id']);
            $student = User::etudiants()->findOrFail($validated['student_id']);

            $relation = Leparent::create([
                'user_id' => $validated['parent_id'],
                'eleve_id' => $validated['student_id'],
                'relation' => $validated['relation'],
                'profession' => $validated['profession'] ?? null,
            ]);

            return $this->successResponse($relation, 'Relation parent-étudiant créée avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la relation', 500);
        }
    }

    /**
     * Get parent's children
     */
    public function getChildren($parentId): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($parentId);
            
            $children = Leparent::where('user_id', $parentId)
                ->with(['etudiant'])
                ->get()
                ->map(function ($relation) {
                    return [
                        'student' => $relation->etudiant,
                        'relation' => $relation->relation,
                        'profession' => $relation->profession,
                    ];
                });

            return $this->successResponse($children, 'Enfants du parent récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enfants', 500);
        }
    }

    /**
     * Get children's notes for a parent
     */
    public function getChildrenNotes($parentId): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($parentId);
            
            $leparentModel = new Leparent();
            $notes = $leparentModel->getChildrenNotes($parentId);

            return $this->successResponse($notes, 'Notes des enfants récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get children's absences for a parent
     */
    public function getChildrenAbsences($parentId): JsonResponse
    {
        try {
            $parent = User::parents()->findOrFail($parentId);
            
            $leparentModel = new Leparent();
            $absences = $leparentModel->getChildrenAbsences($parentId);

            return $this->successResponse($absences, 'Absences des enfants récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get all parent-student relationships
     */
    public function getRelationships(): JsonResponse
    {
        try {
            $relationships = Leparent::with(['parent', 'etudiant'])->get();

            return $this->successResponse($relationships, 'Relations parent-étudiant récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des relations', 500);
        }
    }

    // ========== AUTHENTICATED USER ENDPOINTS ==========

    /**
     * Get authenticated parent's children
     */
    public function getMyChildren(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Parent') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $children = Leparent::where('user_id', $user->id)
                ->with(['etudiant'])
                ->get()
                ->map(function ($relation) {
                    return [
                        'id' => $relation->etudiant->id,
                        'name' => $relation->etudiant->name,
                        'email' => $relation->etudiant->email,
                        'relation' => $relation->relation,
                        'profession' => $relation->profession,
                    ];
                });

            return $this->successResponse($children, 'Mes enfants récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enfants', 500);
        }
    }

    /**
     * Get authenticated parent's children notes
     */
    public function getMyChildrenNotes(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Parent') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $childrenIds = Leparent::where('user_id', $user->id)->pluck('eleve_id');
            
            $notes = Note::whereIn('id_etudiant', $childrenIds)
                ->with(['etudiant', 'enseignement.matiere', 'enseignement.prof'])
                ->get();

            return $this->successResponse($notes, 'Notes de mes enfants récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get authenticated parent's children absences
     */
    public function getMyChildrenAbsences(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Parent') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $childrenIds = Leparent::where('user_id', $user->id)->pluck('eleve_id');
            
            $absences = Absence::whereIn('etudiant_id', $childrenIds)
                ->with(['etudiant', 'matiere', 'prof'])
                ->get();

            return $this->successResponse($absences, 'Absences de mes enfants récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get authenticated parent's dashboard statistics
     */
    public function getMyDashboardStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Parent') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            // Add logging for debugging

            $childrenIds = Leparent::where('user_id', $user->id)->pluck('eleve_id');
            $childrenCount = $childrenIds->count();
            
            
            $childrenNotes = 0;
            $childrenAbsences = 0;
            $childrenAverageGrade = 0;
            
            if ($childrenCount > 0) {
                try {
                    $childrenNotes = Note::whereIn('id_etudiant', $childrenIds)->count();
                    $childrenAbsences = Absence::whereIn('etudiant_id', $childrenIds)->count();
                    
                    // Get children's average grades
                    // Calculate average grade from mcc and examen for all children
                    $childrenNotes = Note::whereIn('id_etudiant', $childrenIds)->get();
                    $childrenAverageGrade = 0;
                    if ($childrenNotes->count() > 0) {
                        $totalGrade = 0;
                        $gradeCount = 0;
                        foreach ($childrenNotes as $note) {
                            // Calculate final grade: 40% MCC + 60% Examen
                            if ($note->mcc !== null && $note->examen !== null) {
                                $finalGrade = ($note->mcc * 0.4) + ($note->examen * 0.6);
                                $totalGrade += $finalGrade;
                                $gradeCount++;
                            }
                        }
                        if ($gradeCount > 0) {
                            $childrenAverageGrade = $totalGrade / $gradeCount;
                        }
                    }
                } catch (\Exception $e) {
                }
            }
            
            $stats = [
                'children_count' => $childrenCount ?? 0,
                'children_notes' => $childrenNotes ?? 0,
                'children_absences' => $childrenAbsences ?? 0,
                'children_average_grade' => round($childrenAverageGrade ?? 0, 2),
            ];

            return $this->successResponse($stats, 'Mes statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }
}
