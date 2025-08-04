<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inscription extends Model
{
    protected $fillable = [
        'etudiant_id',
        'code_classe',
        'annee_scolaire',
        'date_inscription',
        'statut',
        'code_inscription'
    ];

    protected $casts = [
        'date_inscription' => 'date'
    ];

    /**
     * Relation Many-to-One avec Etudiant (User)
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id', 'id');
    }

    /**
     * Relation Many-to-One avec Classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'code_classe', 'code_classe');
    }

    /**
     * Relation Many-to-One avec AnneeScolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class, 'annee_scolaire', 'annee_scolaire');
    }
}
