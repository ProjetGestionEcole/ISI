<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

abstract class EnhancedBaseController extends Controller
{
    protected $service;
    protected string $resourceName;

    /**
     * Display a listing of the resource with enhanced error handling.
     */
    public function index(): JsonResponse
    {
        try {
            $items = $this->service->{"getAll{$this->resourceName}s"}();
            return response()->json($items);
        } catch (\Exception $e) {
            return response()->json([
                'error' => "Erreur lors de la récupération des {$this->resourceName}s",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage with validation.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateStoreRequest($request);
            $item = $this->service->{"create{$this->resourceName}"}($validatedData);
            
            return response()->json($item, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => "Erreur lors de la création du {$this->resourceName}",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $item = $this->service->{"find{$this->resourceName}ById"}((int)$id);
            if (!$item) {
                return response()->json(['error' => "{$this->resourceName} non trouvé"], 404);
            }
            return response()->json($item);
        } catch (\Exception $e) {
            return response()->json([
                'error' => "Erreur lors de la récupération du {$this->resourceName}",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $validatedData = $this->validateUpdateRequest($request, $id);
            $item = $this->service->{"update{$this->resourceName}"}((int)$id, $validatedData);
            
            if (!$item) {
                return response()->json(['error' => "{$this->resourceName} non trouvé"], 404);
            }
            return response()->json($item);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => "Erreur lors de la mise à jour du {$this->resourceName}",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $deleted = $this->service->{"delete{$this->resourceName}"}((int)$id);
            if (!$deleted) {
                return response()->json(['error' => "{$this->resourceName} non trouvé"], 404);
            }
            return response()->json(['message' => "{$this->resourceName} supprimé avec succès"]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => "Erreur lors de la suppression du {$this->resourceName}",
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate store request - to be implemented by child classes
     */
    abstract protected function validateStoreRequest(Request $request): array;

    /**
     * Validate update request - to be implemented by child classes
     */
    abstract protected function validateUpdateRequest(Request $request, string $id): array;
}
