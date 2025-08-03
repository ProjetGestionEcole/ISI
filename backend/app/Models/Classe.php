<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classe extends Model
{
    protected $fillable = [
        'code_classe',
        'nom_classe',
        'niveau_id',
        'specialite_id'
    ];

    /**
     * Relation Many-to-One avec Niveau
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Relation Many-to-One avec Specialite
     */
    public function specialite(): BelongsTo
    {
        return $this->belongsTo(Specialite::class);
    }

    /**
     * Relation Many-to-Many avec Semestres via table pivot classe_semestre
     * Each class has exactly 2 semesters
     */
    public function semestres(): BelongsToMany
    {
        return $this->belongsToMany(Semestre::class, 'classe_semestre', 'classe_id', 'code_semestre')
                    ->withPivot('annee_scolaire_id')
                    ->withTimestamps();
    }

    /**
     * Relation One-to-Many avec Inscriptions
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Get semestres for a specific academic year
     */
    public function semestresForYear($anneeScolaireId)
    {
        return $this->semestres()->wherePivot('annee_scolaire_id', $anneeScolaireId);
    }

    /**
     * Get all students of this class
     */
    public function etudiants()
    {
        return $this->hasManyThrough(
            User::class,
            Inscription::class,
            'classe_id', // Foreign key on inscriptions table
            'id', // Foreign key on users table
            'id', // Local key on classes table
            'etudiant_id' // Local key on inscriptions table
        )->where('users.role', 'Etudiant');
    }
}
