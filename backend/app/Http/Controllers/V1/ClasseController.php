<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClasseService;

class ClasseController extends Controller
{
    protected $classeService;

    public function __construct(ClasseService $classeService)
    {
        $this->classeService = $classeService;
    }

    public function index()
    {
        $classes = $this->classeService->getAllClasses();
        return response()->json($classes);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $classe = $this->classeService->createClasse($data);
        return response()->json($classe, 201);
    }

    public function show(string $id)
    {
        $classe = $this->classeService->findClasseById($id);
        if (!$classe) {
            return response()->json(['message' => 'Classe not found'], 404);
        }
        return response()->json($classe);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $classe = $this->classeService->updateClasse($id, $data);
        if (!$classe) {
            return response()->json(['message' => 'Classe not found'], 404);
        }
        return response()->json($classe);
    }

    public function destroy(string $id)
    {
        $deleted = $this->classeService->deleteClasse($id);
        if (!$deleted) {
            return response()->json(['message' => 'Classe not found'], 404);
        }
        return response()->json(['message' => 'Classe deleted successfully']);
    }
}
