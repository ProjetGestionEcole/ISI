<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MentionService;

class MentionController extends Controller
{
    protected $mentionService;

    public function __construct(MentionService $mentionService)
    {
        $this->mentionService = $mentionService;
    }

    public function index()
    {
        $mentions = $this->mentionService->getAllMentions();
        return response()->json($mentions);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $mention = $this->mentionService->createMention($data);
        return response()->json($mention, 201);
    }

    public function show(string $id)
    {
        $mention = $this->mentionService->findMentionById($id);
        if (!$mention) {
            return response()->json(['message' => 'Mention not found'], 404);
        }
        return response()->json($mention);
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $mention = $this->mentionService->updateMention($id, $data);
        if (!$mention) {
            return response()->json(['message' => 'Mention not found'], 404);
        }
        return response()->json($mention);
    }

    public function destroy(string $id)
    {
        $deleted = $this->mentionService->deleteMention($id);
        if (!$deleted) {
            return response()->json(['message' => 'Mention not found'], 404);
        }
        return response()->json(['message' => 'Mention deleted successfully']);
    }
}
