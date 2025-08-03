<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leparent extends Model
{
    protected $guarded = [];

    /**
     * Un parent appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un parent est lié à un étudiant
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'eleve_id');
    }
}
