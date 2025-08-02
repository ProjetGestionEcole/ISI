<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\InscriptionService;

class InscriptionController extends Controller
{
    protected $inscriptionService;

    public function __construct(InscriptionService $inscriptionService)
    {
        $this->inscriptionService = $inscriptionService;
    }

    public function index()
    {
        $inscriptions = $this->inscriptionService->getAllInscriptions();
        return response()->json($inscriptions);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $inscription = $this->inscriptionService->createInscription($data);
        return response()->json($inscription, 201);
    }

    public function show(string $id)
    {
        $inscription = $this->inscriptionService->findInscriptionById($id);
        if (!$inscription) {
            return response()->json(['message' => 'Inscription not found'], 404);
        }
        return response()->json($inscription);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $inscription = $this->inscriptionService->updateInscription($id, $data);
        if (!$inscription) {
            return response()->json(['message' => 'Inscription not found'], 404);
        }
        return response()->json($inscription);
    }

    public function destroy(string $id)
    {
        $deleted = $this->inscriptionService->deleteInscription($id);
        if (!$deleted) {
            return response()->json(['message' => 'Inscription not found'], 404);
        }
        return response()->json(['message' => 'Inscription deleted successfully']);
    }
}
