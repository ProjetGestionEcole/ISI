<?php

namespace App\Services;

use App\Models\Mention;
use Illuminate\Database\Eloquent\Collection;

class MentionService extends BaseCacheService
{
    /**
     * Get all mentions.
     *
     * @return Collection
     */
    public function getAllMentions(): Collection
    {
        return $this->getAllWithCache(function () {
            return Mention::all();
        });
    }

    /**
     * Find a mention by ID.
     *
     * @param int $id
     * @return Mention|null
     */
    public function findMentionById(int $id): ?Mention
    {
        return $this->getItemWithCache($id, function () use ($id) {
            return Mention::find($id);
        });
    }

    /**
     * Create a new mention.
     *
     * @param array $data
     * @return Mention
     */
    public function createMention(array $data): Mention
    {
        return $this->storeWithCache($data, function ($data) {
            return Mention::create($data);
        });
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
        return $this->updateWithCache($id, $data, function ($id, $data) {
            $mention = Mention::find($id);
            if ($mention) {
                $mention->update($data);
                return $mention->fresh();
            }
            return null;
        });
    }

    /**
     * Delete a mention by ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteMention(int $id): bool
    {
        return $this->deleteWithCache($id, function ($id) {
            $mention = Mention::find($id);
            if ($mention) {
                return $mention->delete();
            }
            return false;
        });
    }
}
