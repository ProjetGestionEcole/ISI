<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnneeScolaire extends Model
{
    protected $guarded = [];

    /**
     * Une année scolaire a plusieurs inscriptions
     * UML: AnneeScolaire (*) -> multiple entities
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Une année scolaire a plusieurs enseignements
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Une année scolaire a plusieurs notes
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Une année scolaire a plusieurs classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }

    /**
     * Une année scolaire a plusieurs absences
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }
}
