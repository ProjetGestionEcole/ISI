<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignement extends Model
{
    protected $guarded = [];

    /**
     * Un enseignement appartient à un enseignant
     * UML: Enseignement -> Enseignant (*)
     */
    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(Enseignant::class, 'code_prof');
    }

    /**
     * Un enseignement appartient à une matière
     * UML: Enseignement -> Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, 'code_matiere', 'code_matiere');
    }

    /**
     * Un enseignement appartient à une classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'code_classe', 'code_classe');
    }

    /**
     * Un enseignement appartient à une année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }
}
