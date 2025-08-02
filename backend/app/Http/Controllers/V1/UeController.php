<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UeService;

class UeController extends Controller
{
    protected $ueService;

    public function __construct(UeService $ueService)
    {
        $this->ueService = $ueService;
    }

    public function index()
    {
        $ues = $this->ueService->getAllUes();
        return response()->json($ues);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $ue = $this->ueService->createUe($data);
        return response()->json($ue, 201);
    }

    public function show(string $id)
    {
        $ue = $this->ueService->findUeById($id);
        if (!$ue) {
            return response()->json(['message' => 'Ue not found'], 404);
        }
        return response()->json($ue);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $ue = $this->ueService->updateUe($id, $data);
        if (!$ue) {
            return response()->json(['message' => 'Ue not found'], 404);
        }
        return response()->json($ue);
    }

    public function destroy(string $id)
    {
        $deleted = $this->ueService->deleteUe($id);
        if (!$deleted) {
            return response()->json(['message' => 'Ue not found'], 404);
        }
        return response()->json(['message' => 'Ue deleted successfully']);
    }
}
