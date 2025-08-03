<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Matiere extends Model
{
    protected $guarded = [];

    /**
     * Une matière appartient à une UE
     * UML: Matiere -> UE (2..*)
     */
    public function ue(): BelongsTo
    {
        return $this->belongsTo(Ue::class);
    }

    /**
     * Une matière peut être enseignée par plusieurs professeurs
     * UML: Matiere (*) -> Professeur
     */
    public function professeurs(): BelongsToMany
    {
        return $this->belongsToMany(Professeur::class, 'enseignements')
                    ->withPivot('classe_id', 'annee_scolaire_id', 'volume_horaire')
                    ->withTimestamps();
    }

    /**
     * Une matière a plusieurs notes
     * UML: Matiere (1..*) -> Note
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Une matière a plusieurs enseignements
     * UML: Matiere -> Enseignement
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Une matière a plusieurs absences
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }
}
