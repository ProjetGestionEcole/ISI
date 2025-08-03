<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Etudiant extends Model
{
    protected $guarded = [];

    /**
     * Un étudiant est associé à un utilisateur
     * UML: Etudiant -> User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un étudiant a plusieurs notes (1..*)
     * UML: Etudiant (1) -> Note (1..*)
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Un étudiant a plusieurs inscriptions
     * UML: Etudiant -> Inscription
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    /**
     * Un étudiant a plusieurs absences
     * UML: Etudiant -> Absence
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    /**
     * Relation avec les parents
     */
    public function parents(): HasMany
    {
        return $this->hasMany(Leparent::class, 'eleve_id');
    }

    /**
     * Méthode connect() comme dans le diagramme UML
     * UML: <<connect()>>
     */
    public function connect(): bool
    {
        // Logique de connexion de l'étudiant
        return true;
    }
}
