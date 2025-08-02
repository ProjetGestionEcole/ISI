<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AnneeScolaireService;

class AnneeScolaireController extends Controller
{
    protected $anneeScolaireService;

    public function __construct(AnneeScolaireService $anneeScolaireService)
    {
        $this->anneeScolaireService = $anneeScolaireService;
    }

    public function index()
    {
        $anneeScolaires = $this->anneeScolaireService->getAllAnneeScolaires();
        return response()->json($anneeScolaires);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $anneeScolaire = $this->anneeScolaireService->createAnneeScolaire($data);
        return response()->json($anneeScolaire, 201);
    }

    public function show(string $id)
    {
        $anneeScolaire = $this->anneeScolaireService->findAnneeScolaireById($id);
        if (!$anneeScolaire) {
            return response()->json(['message' => 'AnneeScolaire not found'], 404);
        }
        return response()->json($anneeScolaire);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $anneeScolaire = $this->anneeScolaireService->updateAnneeScolaire($id, $data);
        if (!$anneeScolaire) {
            return response()->json(['message' => 'AnneeScolaire not found'], 404);
        }
        return response()->json($anneeScolaire);
    }

    public function destroy(string $id)
    {
        $deleted = $this->anneeScolaireService->deleteAnneeScolaire($id);
        if (!$deleted) {
            return response()->json(['message' => 'AnneeScolaire not found'], 404);
        }
        return response()->json(['message' => 'AnneeScolaire deleted successfully']);
    }
}
