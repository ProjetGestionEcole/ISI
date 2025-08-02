<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SemestreService;

class SemestreController extends Controller
{
    protected $semestreService;

    public function __construct(SemestreService $semestreService)
    {
        $this->semestreService = $semestreService;
    }

    public function index()
    {
        $semestres = $this->semestreService->getAllSemestres();
        return response()->json($semestres);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $semestre = $this->semestreService->createSemestre($data);
        return response()->json($semestre, 201);
    }

    public function show(string $id)
    {
        $semestre = $this->semestreService->findSemestreById($id);
        if (!$semestre) {
            return response()->json(['message' => 'Semestre not found'], 404);
        }
        return response()->json($semestre);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $semestre = $this->semestreService->updateSemestre($id, $data);
        if (!$semestre) {
            return response()->json(['message' => 'Semestre not found'], 404);
        }
        return response()->json($semestre);
    }

    public function destroy(string $id)
    {
        $deleted = $this->semestreService->deleteSemestre($id);
        if (!$deleted) {
            return response()->json(['message' => 'Semestre not found'], 404);
        }
        return response()->json(['message' => 'Semestre deleted successfully']);
    }
}
