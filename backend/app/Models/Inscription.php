<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inscription extends Model
{
    protected $guarded = [];

    /**
     * Une inscription appartient à un étudiant
     * UML: Association class between Etudiant, Classe, AnneeScolaire
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    /**
     * Une inscription appartient à une classe
     * UML: Association class between Etudiant, Classe, AnneeScolaire
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Une inscription appartient à une année scolaire
     * UML: Association class between Etudiant, Classe, AnneeScolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }
}
