<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Niveau extends Model
{
    protected $guarded = [];

    /**
     * Un niveau appartient à une spécialité
     * UML: Niveau -> Specialite (*)
     */
    public function specialite(): BelongsTo
    {
        return $this->belongsTo(Specialite::class);
    }

    /**
     * Un niveau a plusieurs semestres
     */
    public function semestres(): HasMany
    {
        return $this->hasMany(Semestre::class);
    }

    /**
     * Un niveau a plusieurs classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }
}
