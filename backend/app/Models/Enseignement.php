<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignement extends Model
{
    protected $guarded = [];

    /**
     * Un enseignement appartient à un professeur
     * UML: Enseignement -> Professeur (*)
     */
    public function professeur(): BelongsTo
    {
        return $this->belongsTo(Professeur::class);
    }

    /**
     * Un enseignement appartient à une matière
     * UML: Enseignement -> Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }

    /**
     * Un enseignement appartient à une classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Un enseignement appartient à une année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }
}
