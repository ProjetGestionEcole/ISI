<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NiveauService;

class NiveauController extends Controller
{
    protected $niveauService;
    /**
     * NiveauControlller constructor.
     */
    public function __construct()
    {
        $this->niveauService = new NiveauService();
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $niveaux = $this->niveauService->getAllNiveaux();
        return response()->json($niveaux);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $niveau = $this->niveauService->createNiveau($data);
        return response()->json($niveau, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $niveau = $this->niveauService->findNiveauById($id);
        if (!$niveau) {
            return response()->json(['message' => 'Niveau not found'], 404);
        }
        return response()->json($niveau);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $data = $request->all();
        $niveau = $this->niveauService->updateNiveau($id, $data);
        if (!$niveau) {
            return response()->json(['message' => 'Niveau not found'], 404);
        }
        return response()->json($niveau);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $deleted = $this->niveauService->deleteNiveau($id);
        if (!$deleted) {
            return response()->json(['message' => 'Niveau not found'], 404);
        }
        return response()->json(['message' => 'Niveau deleted successfully']);
    }
}
