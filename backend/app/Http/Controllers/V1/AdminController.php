<?php

namespace App\Http\Controllers\V1;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{

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
}
