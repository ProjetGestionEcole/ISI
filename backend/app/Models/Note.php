<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    protected $fillable = [
        'mcc',
        'examen',
        'code_enseignement',
        'id_etudiant'
    ];

    /**
     * Relation Many-to-One avec Enseignement
     */
    public function enseignement(): BelongsTo
    {
        return $this->belongsTo(Enseignement::class, 'code_enseignement', 'code_enseignement');
    }

    /**
     * Relation Many-to-One avec Etudiant (User)
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_etudiant', 'id');
    }
}
