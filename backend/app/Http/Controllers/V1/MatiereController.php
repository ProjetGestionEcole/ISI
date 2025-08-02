<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MatiereService;

class MatiereController extends Controller
{
    protected $matiereService;

    public function __construct(MatiereService $matiereService)
    {
        $this->matiereService = $matiereService;
    }

    public function index()
    {
        $matieres = $this->matiereService->getAllMatieres();
        return response()->json($matieres);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $matiere = $this->matiereService->createMatiere($data);
        return response()->json($matiere, 201);
    }

    public function show(string $id)
    {
        $matiere = $this->matiereService->findMatiereById($id);
        if (!$matiere) {
            return response()->json(['message' => 'Matiere not found'], 404);
        }
        return response()->json($matiere);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $matiere = $this->matiereService->updateMatiere($id, $data);
        if (!$matiere) {
            return response()->json(['message' => 'Matiere not found'], 404);
        }
        return response()->json($matiere);
    }

    public function destroy(string $id)
    {
        $deleted = $this->matiereService->deleteMatiere($id);
        if (!$deleted) {
            return response()->json(['message' => 'Matiere not found'], 404);
        }
        return response()->json(['message' => 'Matiere deleted successfully']);
    }
}
