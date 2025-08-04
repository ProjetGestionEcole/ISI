<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    protected $fillable = [
        'etudiant_id',
        'prof_id',
        'code_matiere',
        'date_absence',
        'statut'
    ];

    protected $casts = [
        'date_absence' => 'date'
    ];

    /**
     * Relation Many-to-One avec Etudiant (User)
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id', 'id');
    }

    /**
     * Relation Many-to-One avec Prof (User)
     */
    public function prof(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id', 'id');
    }

    /**
     * Relation Many-to-One avec Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, 'code_matiere', 'code_matiere');
    }
}
