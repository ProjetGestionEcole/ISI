<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NoteService;

class NoteController extends Controller
{
    protected $noteService;

    public function __construct(NoteService $noteService)
    {
        $this->noteService = $noteService;
    }

    public function index()
    {
        $notes = $this->noteService->getAllNotes();
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $note = $this->noteService->createNote($data);
        return response()->json($note, 201);
    }

    public function show(string $id)
    {
        $note = $this->noteService->findNoteById($id);
        if (!$note) {
            return response()->json(['message' => 'Note not found'], 404);
        }
        return response()->json($note);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $note = $this->noteService->updateNote($id, $data);
        if (!$note) {
            return response()->json(['message' => 'Note not found'], 404);
        }
        return response()->json($note);
    }

    public function destroy(string $id)
    {
        $deleted = $this->noteService->deleteNote($id);
        if (!$deleted) {
            return response()->json(['message' => 'Note not found'], 404);
        }
        return response()->json(['message' => 'Note deleted successfully']);
    }
}
