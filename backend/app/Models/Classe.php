<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classe extends Model
{
    protected $guarded = [];

    /**
     * Une classe appartient à un niveau
     * UML: Classe -> Niveau
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Une classe appartient à une spécialité
     * UML: Classe -> Specialite
     */
    public function specialite(): BelongsTo
    {
        return $this->belongsTo(Specialite::class);
    }

    /**
     * Une classe a plusieurs inscriptions
     * UML: Classe -> Inscription
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Une classe a plusieurs enseignements
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Étudiants inscrits dans cette classe via les inscriptions
     */
    public function etudiants()
    {
        return $this->hasManyThrough(Etudiant::class, Inscription::class);
    }
}
