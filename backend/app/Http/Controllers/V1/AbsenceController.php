<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AbsenceService;

class AbsenceController extends Controller
{
    protected $absenceService;

    public function __construct(AbsenceService $absenceService)
    {
        $this->absenceService = $absenceService;
    }

    public function index()
    {
        $absences = $this->absenceService->getAllAbsences();
        return response()->json($absences);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $absence = $this->absenceService->createAbsence($data);
        return response()->json($absence, 201);
    }

    public function show(string $id)
    {
        $absence = $this->absenceService->findAbsenceById($id);
        if (!$absence) {
            return response()->json(['message' => 'Absence not found'], 404);
        }
        return response()->json($absence);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $absence = $this->absenceService->updateAbsence($id, $data);
        if (!$absence) {
            return response()->json(['message' => 'Absence not found'], 404);
        }
        return response()->json($absence);
    }

    public function destroy(string $id)
    {
        $deleted = $this->absenceService->deleteAbsence($id);
        if (!$deleted) {
            return response()->json(['message' => 'Absence not found'], 404);
        }
        return response()->json(['message' => 'Absence deleted successfully']);
    }
}
