<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;

class NoteService
{
    /**
     * Get all notes.
     *
     * @return Collection
     */
    public function getAllNotes(): Collection
    {
        return Note::all();
    }

    /**
     * Find a note by ID.
     *
     * @param int $id
     * @return Note|null
     */
    public function findNoteById(int $id): ?Note
    {
        return Note::find($id);
    }

    /**
     * Create a new note.
     *
     * @param array $data
     * @return Note
     */
    public function createNote(array $data): Note
    {
        return Note::create($data);
    }

    /**
     * Update an existing note.
     *
     * @param int $id
     * @param array $data
     * @return Note|null
     */
    public function updateNote(int $id, array $data): ?Note
    {
        $note = $this->findNoteById($id);
        if ($note) {
            $note->update($data);
        }
        return $note;
    }

    /**
     * Delete a note by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteNote(int $id): bool
    {
        $note = $this->findNoteById($id);
        if ($note) {
            return $note->delete();
        }
        return false;
    }
}
