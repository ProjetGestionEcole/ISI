<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ue extends Model
{
    protected $guarded = [];

    /**
     * Une UE appartient à une spécialité
     * UML: UE -> Specialite (*)
     */
    public function specialite(): BelongsTo
    {
        return $this->belongsTo(Specialite::class);
    }

    /**
     * Une UE appartient à un semestre
     * UML: UE -> Semestre (1)
     */
    public function semestre(): BelongsTo
    {
        return $this->belongsTo(Semestre::class);
    }

    /**
     * Une UE a plusieurs matières (2..*)
     * UML: UE -> Matiere (2..*)
     */
    public function matieres(): HasMany
    {
        return $this->hasMany(Matiere::class);
    }
}
