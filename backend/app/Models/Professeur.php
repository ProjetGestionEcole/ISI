<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Professeur extends Model
{
    protected $guarded = [];

    /**
     * Un professeur est associé à un utilisateur
     * UML: Professeur -> User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un professeur enseigne plusieurs matières
     * UML: Professeur (*) -> Matiere
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'enseignements')
                    ->withPivot('classe_id', 'annee_scolaire_id', 'volume_horaire')
                    ->withTimestamps();
    }

    /**
     * Un professeur a plusieurs enseignements
     * UML: Professeur (*) -> Enseignement
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Méthode connect() comme dans le diagramme UML
     * UML: Professeur.connect()
     */
    public function connect(): bool
    {
        // Logique de connexion du professeur
        return true;
    }
}
