<?php

namespace App\Http\Controllers\V1;

use App\Models\User;
use App\Models\Enseignement;
use App\Models\Matiere;
use App\Models\Note;
use App\Models\Absence;
use App\Models\Inscription;
use App\Models\Leparent;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
class RoleBasedDataController extends Controller
{
    /**
     * Return a success JSON response
     */
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
     * Get user's role-specific enseignements
     */
    public function getMyEnseignements(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $enseignements = collect();

            switch ($user->role) {
                case 'Prof':
                    // Professor sees only their own enseignements
                    $enseignements = Enseignement::where('code_prof', $user->id)
                        ->with(['matiere', 'prof'])
                        ->get();
                    break;
                
                case 'Admin':
                    // Admin sees all enseignements
                    $enseignements = Enseignement::with(['matiere', 'prof'])->get();
                    break;
                
                case 'Etudiant':
                    // Student sees enseignements for their enrolled classes
                    $studentInscriptions = Inscription::where('etudiant_id', $user->id)
                        ->with('classe')
                        ->get();
                    
                    $classCodes = $studentInscriptions->pluck('code_classe');
                    
                    // Get enseignements for student's classes (this would need a classe_enseignement relationship)
                    // For now, return empty collection as the relationship isn't fully defined
                    $enseignements = collect();
                    break;
                
                default:
                    $enseignements = collect();
            }

            return $this->successResponse($enseignements, 'Enseignements récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enseignements', 500);
        }
    }

    /**
     * Get user's role-specific matieres
     */
    public function getMyMatieres(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $matieres = collect();

            switch ($user->role) {
                case 'Prof':
                    // Professor sees only matieres they teach
                    $enseignements = Enseignement::where('code_prof', $user->id)->get();
                    $matiereCodes = $enseignements->pluck('code_matiere');
                    
                    $matieres = Matiere::whereIn('code_matiere', $matiereCodes)
                        ->with(['ue', 'enseignements'])
                        ->get();
                    break;
                
                case 'Admin':
                    // Admin sees all matieres
                    $matieres = Matiere::with(['ue', 'enseignements'])->get();
                    break;
                
                case 'Etudiant':
                    // Student sees matieres for their enrolled classes
                    $studentInscriptions = Inscription::where('etudiant_id', $user->id)->get();
                    $classCodes = $studentInscriptions->pluck('code_classe');
                    
                    // This would need proper class-matiere relationships
                    // For now, return empty collection
                    $matieres = collect();
                    break;
                
                default:
                    $matieres = collect();
            }

            return $this->successResponse($matieres, 'Matières récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des matières', 500);
        }
    }

    /**
     * Get user's role-specific notes
     */
    public function getMyNotes(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $notes = collect();

            switch ($user->role) {
                case 'Prof':
                    // Professor sees notes for their enseignements
                    $enseignements = Enseignement::where('code_prof', $user->id)->get();
                    $enseignementCodes = $enseignements->pluck('code_enseignement');
                    
                    $notes = Note::whereIn('code_enseignement', $enseignementCodes)
                        ->with(['etudiant', 'enseignement.matiere'])
                        ->get();
                    break;
                
                case 'Etudiant':
                    // Student sees only their own notes
                    $notes = Note::where('id_etudiant', $user->id)
                        ->with(['enseignement.matiere', 'enseignement.prof'])
                        ->get();
                    break;
                
                case 'Parent':
                    // Parent sees notes for their children
                    $children = Leparent::where('user_id', $user->id)->pluck('eleve_id');
                    
                    $notes = Note::whereIn('id_etudiant', $children)
                        ->with(['etudiant', 'enseignement.matiere', 'enseignement.prof'])
                        ->get();
                    break;
                
                case 'Admin':
                    // Admin sees all notes
                    $notes = Note::with(['etudiant', 'enseignement.matiere', 'enseignement.prof'])->get();
                    break;
                
                default:
                    $notes = collect();
            }

            return $this->successResponse($notes, 'Notes récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes', 500);
        }
    }

    /**
     * Get user's role-specific absences
     */
    public function getMyAbsences(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $absences = collect();

            switch ($user->role) {
                case 'Prof':
                    // Professor sees absences they recorded
                    $absences = Absence::where('prof_id', $user->id)
                        ->with(['etudiant', 'matiere', 'prof'])
                        ->get();
                    break;
                
                case 'Etudiant':
                    // Student sees only their own absences
                    $absences = Absence::where('etudiant_id', $user->id)
                        ->with(['matiere', 'prof'])
                        ->get();
                    break;
                
                case 'Parent':
                    // Parent sees absences for their children
                    $children = Leparent::where('user_id', $user->id)->pluck('eleve_id');
                    
                    $absences = Absence::whereIn('etudiant_id', $children)
                        ->with(['etudiant', 'matiere', 'prof'])
                        ->get();
                    break;
                
                case 'Admin':
                    // Admin sees all absences
                    $absences = Absence::with(['etudiant', 'matiere', 'prof'])->get();
                    break;
                
                default:
                    $absences = collect();
            }

            return $this->successResponse($absences, 'Absences récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences', 500);
        }
    }

    /**
     * Get user's role-specific inscriptions
     */
    public function getMyInscriptions(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $inscriptions = collect();

            switch ($user->role) {
                case 'Etudiant':
                    // Student sees only their own inscriptions
                    $inscriptions = Inscription::where('etudiant_id', $user->id)
                        ->with(['etudiant', 'classe', 'anneeScolaire'])
                        ->get();
                    break;
                
                case 'Parent':
                    // Parent sees inscriptions for their children
                    $children = Leparent::where('user_id', $user->id)->pluck('eleve_id');
                    
                    $inscriptions = Inscription::whereIn('etudiant_id', $children)
                        ->with(['etudiant', 'classe', 'anneeScolaire'])
                        ->get();
                    break;
                
                case 'Admin':
                    // Admin sees all inscriptions
                    $inscriptions = Inscription::with(['etudiant', 'classe', 'anneeScolaire'])->get();
                    break;
                
                case 'Prof':
                    // Professor sees inscriptions for students in their classes
                    // This would need proper class-professor relationships
                    $inscriptions = collect();
                    break;
                
                default:
                    $inscriptions = collect();
            }

            return $this->successResponse($inscriptions, 'Inscriptions récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des inscriptions', 500);
        }
    }

    /**
     * Get user's children (for parents)
     */
    public function getMyChildren(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            if ($user->role !== 'Parent') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $children = Leparent::where('user_id', $user->id)
                ->with(['eleve'])
                ->get()
                ->map(function ($relation) {
                    return [
                        'id' => $relation->eleve->id,
                        'name' => $relation->eleve->name,
                        'email' => $relation->eleve->email,
                        'relation' => $relation->relation,
                        'profession' => $relation->profession,
                    ];
                });

        return $this->successResponse($children, 'Enfants récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enfants', 500);
        }
    }

    /**
     * Debug endpoint to check database data
     */
    public function debugDatabaseData(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            $debugData = [
                'user' => $user->toArray(),
                'all_notes' => Note::all()->toArray(),
                'user_notes' => Note::where('id_etudiant', $user->id)->get()->toArray(),
                'all_absences' => Absence::all()->toArray(),
                'user_absences' => Absence::where('etudiant_id', $user->id)->get()->toArray(),
                'all_inscriptions' => Inscription::all()->toArray(),
                'user_inscriptions' => Inscription::where('etudiant_id', $user->id)->get()->toArray(),
            ];

            return $this->successResponse($debugData, 'Debug data retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des données de debug: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get dashboard statistics based on user role
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', 401);
            }

            

            $stats = [];
            switch ($user->role) {
                case 'Prof':
                    // Get real data for professor
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
                    break;
                
                case 'Etudiant':
                    // Debug logging for student
                    
                    // Get real data for student
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
                    
                    // Get current class info
                    $currentInscription = Inscription::where('etudiant_id', $user->id)
                        ->with('classe')
                        ->latest()
                        ->first();
                    
                    
                    $stats = [
                        'notes_count' => $notesCount,
                        'absences_count' => $absencesCount,
                        'inscriptions_count' => $inscriptionsCount,
                        'average_grade' => round($averageGrade ?? 0, 2),
                        'current_class' => $currentInscription ? $currentInscription->classe->nom_classe : null,
                    ];
                    
                    break;
                
                case 'Parent':
                    // Get real data for parent
                    $childrenIds = Leparent::where('user_id', $user->id)->pluck('eleve_id');
                    $childrenCount = $childrenIds->count();
                    
                    $childrenNotesCount = Note::whereIn('id_etudiant', $childrenIds)->count();
                    $childrenAbsences = Absence::whereIn('etudiant_id', $childrenIds)->count();
                    
                    // Get children's average grades (calculate from mcc and examen)
                    $childrenNotesData = Note::whereIn('id_etudiant', $childrenIds)->get();
                    $childrenAverageGrade = 0;
                    if ($childrenNotesData->count() > 0) {
                        $totalGrade = 0;
                        $gradeCount = 0;
                        foreach ($childrenNotesData as $note) {
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
                    
                    $stats = [
                        'children_count' => $childrenCount,
                        'children_notes' => $childrenNotesCount,
                        'children_absences' => $childrenAbsences,
                        'children_average_grade' => round($childrenAverageGrade ?? 0, 2),
                    ];
                    break;
                
                case 'Admin':
                    // Get comprehensive admin statistics from database
                    $stats = [
                        'classes_count' => DB::table('classes')->count(),
                        'etudiants_count' => DB::table('users')->where('role', 'Etudiant')->count(),
                        'enseignants_count' => DB::table('users')->where('role', 'Prof')->count(),
                        'parents_count' => DB::table('users')->where('role', 'Parent')->count(),
                        'admins_count' => DB::table('users')->where('role', 'Admin')->count(),
                        'matieres_count' => DB::table('matieres')->count(),
                        'specialites_count' => DB::table('specialites')->count(),
                        'niveaux_count' => DB::table('niveaux')->count(),
                        'semestres_count' => DB::table('semestres')->count(),
                        'ues_count' => DB::table('ues')->count(),
                        'enseignements_count' => DB::table('enseignements')->count(),
                        'total_users' => DB::table('users')->count(),
                        'total_notes' => DB::table('notes')->count(),
                        'total_absences' => DB::table('absences')->count(),
                        'total_inscriptions' => DB::table('inscriptions')->count(),
                        'mentions_count' => DB::table('mentions')->count(),
                        'annees_scolaires_count' => DB::table('annee_scolaires')->count(),
                    ];
                    break;
                
                default:
                    $stats = [];
            }

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }
}
