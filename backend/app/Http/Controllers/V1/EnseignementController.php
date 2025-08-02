<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EnseignementService;

class EnseignementController extends Controller
{
    protected $enseignementService;

    public function __construct(EnseignementService $enseignementService)
    {
        $this->enseignementService = $enseignementService;
    }

    public function index()
    {
        $enseignements = $this->enseignementService->getAllEnseignements();
        return response()->json($enseignements);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $enseignement = $this->enseignementService->createEnseignement($data);
        return response()->json($enseignement, 201);
    }

    public function show(string $id)
    {
        $enseignement = $this->enseignementService->findEnseignementById($id);
        if (!$enseignement) {
            return response()->json(['message' => 'Enseignement not found'], 404);
        }
        return response()->json($enseignement);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $enseignement = $this->enseignementService->updateEnseignement($id, $data);
        if (!$enseignement) {
            return response()->json(['message' => 'Enseignement not found'], 404);
        }
        return response()->json($enseignement);
    }

    public function destroy(string $id)
    {
        $deleted = $this->enseignementService->deleteEnseignement($id);
        if (!$deleted) {
            return response()->json(['message' => 'Enseignement not found'], 404);
        }
        return response()->json(['message' => 'Enseignement deleted successfully']);
    }
}
