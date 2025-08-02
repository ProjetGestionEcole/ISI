<?php

namespace App\Services;

use App\Models\Mention;
use Illuminate\Database\Eloquent\Collection;

class MentionService
{
    /**
     * Get all mentions.
     *
     * @return Collection
     */
    public function getAllMentions(): Collection
    {
        return Mention::all();
    }

    /**
     * Find a mention by ID.
     *
     * @param int $id
     * @return Mention|null
     */
    public function findMentionById(int $id): ?Mention
    {
        return Mention::find($id);
    }

    /**
     * Create a new mention.
     *
     * @param array $data
     * @return Mention
     */
    public function createMention(array $data): Mention
    {
        return Mention::create($data);
    }

    /**
     * Update an existing mention.
     *
     * @param int $id
     * @param array $data
     * @return Mention|null
     */
    public function updateMention(int $id, array $data): ?Mention
    {
        $mention = $this->findMentionById($id);
        if ($mention) {
            $mention->update($data);
        }
        return $mention;
    }

    /**
     * Delete a mention by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteMention(int $id): bool
    {
        $mention = $this->findMentionById($id);
        if ($mention) {
            return $mention->delete();
        }
        return false;
    }
}
