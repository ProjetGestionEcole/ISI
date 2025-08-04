<?php

namespace App\Http\Controllers\V1;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class AdminController extends Controller
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
     * Display a listing of all administrators
     */
    public function index(): JsonResponse
    {
        try {
            $admins = Admin::all();
            
            return $this->successResponse($admins, 'Administrateurs récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des administrateurs', 500);
        }
    }

    /**
     * Store a newly created administrator
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
            $validated['role'] = User::ROLE_ADMIN;

            $admin = Admin::create($validated);

            return $this->successResponse($admin, 'Administrateur créé avec succès', 201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'administrateur', 500);
        }
    }

    /**
     * Display the specified administrator
     */
    public function show($id): JsonResponse
    {
        try {
            $admin = Admin::findOrFail($id);

            return $this->successResponse($admin, 'Administrateur récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Administrateur non trouvé', 404);
        }
    }

    /**
     * Update the specified administrator
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $admin = Admin::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $admin->update($validated);

            return $this->successResponse($admin, 'Administrateur mis à jour avec succès');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'administrateur', 500);
        }
    }

    /**
     * Remove the specified administrator
     */
    public function destroy($id): JsonResponse
    {
        try {
            $admin = Admin::findOrFail($id);
            $admin->delete();

            return $this->successResponse(null, 'Administrateur supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'administrateur', 500);
        }
    }

    /**
     * Get system statistics (admin functionality)
     */
    public function getSystemStatistics(): JsonResponse
    {
        try {
            $statistics = [
                'total_users' => User::count(),
                'total_etudiants' => User::etudiants()->count(),
                'total_profs' => User::profs()->count(),
                'total_parents' => User::parents()->count(),
                'total_admins' => User::admins()->count(),
            ];

            return $this->successResponse($statistics, 'Statistiques système récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    // ========== AUTHENTICATED USER ENDPOINTS ==========

    /**
     * Get authenticated admin's dashboard statistics
     */
    public function getMyDashboardStats(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $user->role !== 'Admin') {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            \Log::info('Admin Dashboard Stats - User ID: ' . $user->id);

            // Initialize stats array with safe defaults
            $stats = [];

            // Get statistics with individual error handling
            try {
                $stats['classes_count'] = DB::table('classes')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting classes: ' . $e->getMessage());
                $stats['classes_count'] = 0;
            }

            try {
                $stats['etudiants_count'] = DB::table('users')->where('role', 'Etudiant')->count();
                $stats['enseignants_count'] = DB::table('users')->where('role', 'Prof')->count();
                $stats['parents_count'] = DB::table('users')->where('role', 'Parent')->count();
                $stats['admins_count'] = DB::table('users')->where('role', 'Admin')->count();
                $stats['total_users'] = DB::table('users')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting users: ' . $e->getMessage());
                $stats['etudiants_count'] = 0;
                $stats['enseignants_count'] = 0;
                $stats['parents_count'] = 0;
                $stats['admins_count'] = 0;
                $stats['total_users'] = 0;
            }

            try {
                $stats['matieres_count'] = DB::table('matieres')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting matieres: ' . $e->getMessage());
                $stats['matieres_count'] = 0;
            }

            try {
                $stats['specialites_count'] = DB::table('specialites')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting specialites: ' . $e->getMessage());
                $stats['specialites_count'] = 0;
            }

            try {
                $stats['niveaux_count'] = DB::table('niveaux')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting niveaux: ' . $e->getMessage());
                $stats['niveaux_count'] = 0;
            }

            try {
                $stats['semestres_count'] = DB::table('semestres')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting semestres: ' . $e->getMessage());
                $stats['semestres_count'] = 0;
            }

            try {
                $stats['ues_count'] = DB::table('ues')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting ues: ' . $e->getMessage());
                $stats['ues_count'] = 0;
            }

            try {
                $stats['enseignements_count'] = DB::table('enseignements')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting enseignements: ' . $e->getMessage());
                $stats['enseignements_count'] = 0;
            }

            try {
                $stats['total_notes'] = DB::table('notes')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting notes: ' . $e->getMessage());
                $stats['total_notes'] = 0;
            }

            try {
                $stats['total_absences'] = DB::table('absences')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting absences: ' . $e->getMessage());
                $stats['total_absences'] = 0;
            }

            try {
                $stats['total_inscriptions'] = DB::table('inscriptions')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting inscriptions: ' . $e->getMessage());
                $stats['total_inscriptions'] = 0;
            }

            try {
                $stats['mentions_count'] = DB::table('mentions')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting mentions: ' . $e->getMessage());
                $stats['mentions_count'] = 0;
            }

            try {
                $stats['annees_scolaires_count'] = DB::table('annee_scolaires')->count();
            } catch (\Exception $e) {
                \Log::warning('Error counting annee_scolaires: ' . $e->getMessage());
                $stats['annees_scolaires_count'] = 0;
            }

            \Log::info('Admin Dashboard Stats Result: ' . json_encode($stats));
            return $this->successResponse($stats, 'Mes statistiques administrateur récupérées avec succès');
        } catch (\Exception $e) {
            \Log::error('Admin Dashboard Stats Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }
}
