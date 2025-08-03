<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SpecialiteService; 


class SpecialiteController extends Controller
{
    protected $specialiteService;
    /**
     * OffreController constructor.
     */
    public function __construct()
    {
        $this->specialiteService = new SpecialiteService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $specialites = $this->specialiteService->getAllSpecialites();
        return response()->json($specialites);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $specialites =  $this->specialitesService->store($request->validated());
        return response()->json($specialites,201);
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
