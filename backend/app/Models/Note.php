<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    protected $guarded = [];

    /**
     * Une note appartient à un étudiant
     * UML: Note -> Etudiant (1)
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    /**
     * Une note appartient à une matière
     * UML: Note -> Matiere (1..*)
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }

    /**
     * Une note appartient à un semestre
     */
    public function semestre(): BelongsTo
    {
        return $this->belongsTo(Semestre::class);
    }

    /**
     * Une note appartient à une année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Une note peut avoir une mention
     */
    public function mention(): BelongsTo
    {
        return $this->belongsTo(Mention::class);
    }
}
