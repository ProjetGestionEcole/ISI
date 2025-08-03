<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Leparent extends Model
{
    protected $fillable = [
        'user_id',
        'eleve_id', 
        'relation',
        'profession'
    ];

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    // Static methods to get parent users
    public static function getParentUsers()
    {
        return User::whereIn('id', static::distinct()->pluck('user_id'))->get();
    }

    // Helper methods
    public function getChildrenNotes($parentUserId)
    {
        return static::where('user_id', $parentUserId)
            ->with(['etudiant.notes.matiere'])
            ->get()
            ->flatMap(function ($relation) {
                return $relation->etudiant->notes ?? collect();
            });
    }

    public function getChildrenAbsences($parentUserId)
    {
        return static::where('user_id', $parentUserId)
            ->with(['etudiant.absences'])
            ->get()
            ->flatMap(function ($relation) {
                return $relation->etudiant->absences ?? collect();
            });
    }
}
