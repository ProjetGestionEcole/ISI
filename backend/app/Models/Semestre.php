<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semestre extends Model
{
    protected $guarded = [];

    /**
     * Un semestre appartient à une spécialité
     * UML: Semestre -> Specialite (*)
     */
    public function specialite(): BelongsTo
    {
        return $this->belongsTo(Specialite::class);
    }

    /**
     * Un semestre appartient à un niveau
     * UML: Semestre -> Niveau (*)
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Un semestre a plusieurs UEs (2..*)
     * UML: Semestre (2..*) -> UE
     */
    public function ues(): HasMany
    {
        return $this->hasMany(Ue::class);
    }
}
