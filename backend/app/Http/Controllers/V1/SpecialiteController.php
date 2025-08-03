<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SpecialiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SpecialiteController extends Controller
{
    protected $specialiteService;

    /**
     * SpecialiteController constructor.
     */
    public function __construct()
    {
        $this->specialiteService = new SpecialiteService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $specialites = $this->specialiteService->getAllSpecialites();
            return response()->json($specialites);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des spécialités'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'code_specialite' => 'required|string|max:50|unique:specialites',
                'duree' => 'required|integer|min:1'
            ]);

            $specialite = $this->specialiteService->createSpecialite($validatedData);
            return response()->json($specialite, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la création de la spécialité'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $specialite = $this->specialiteService->findSpecialiteById((int)$id);
            if (!$specialite) {
                return response()->json(['error' => 'Spécialité non trouvée'], 404);
            }
            return response()->json($specialite);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération de la spécialité'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'code_specialite' => 'required|string|max:50|unique:specialites,code_specialite,' . $id,
                'duree' => 'required|integer|min:1'
            ]);

            $specialite = $this->specialiteService->updateSpecialite((int)$id, $validatedData);
            if (!$specialite) {
                return response()->json(['error' => 'Spécialité non trouvée'], 404);
            }
            return response()->json($specialite);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour de la spécialité'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $deleted = $this->specialiteService->deleteSpecialite((int)$id);
            if (!$deleted) {
                return response()->json(['error' => 'Spécialité non trouvée'], 404);
            }
            return response()->json(['message' => 'Spécialité supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression de la spécialité'], 500);
        }
    }
}
