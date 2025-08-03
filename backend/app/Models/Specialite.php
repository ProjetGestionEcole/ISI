<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialite extends Model
{
    protected $guarded = [];

    /**
     * Une spécialité a plusieurs UEs
     * UML: Specialite (*) -> UE 
     */
    public function ues(): HasMany
    {
        return $this->hasMany(Ue::class);
    }

    /**
     * Une spécialité a plusieurs niveaux
     * UML: Specialite (*) -> Niveau
     */
    public function niveaux(): HasMany
    {
        return $this->hasMany(Niveau::class);
    }

    /**
     * Une spécialité a plusieurs semestres
     * UML: Specialite (*) -> Semestre
     */
    public function semestres(): HasMany
    {
        return $this->hasMany(Semestre::class);
    }

    /**
     * Une spécialité a plusieurs classes
     * UML: Specialite (*) -> Classe
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }
}
