<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NiveauService;

class NiveauController extends Controller
{
    protected $niveauService;
    /**
     * OffreController constructor.
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
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
