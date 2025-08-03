<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matiere extends Model
{
    protected $primaryKey = 'code_matiere';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code_matiere',
        'name',
        'code_ue',
        'coefficient',
        'credits'
    ];

    /**
     * Relation Many-to-One avec UE
     */
    public function ue(): BelongsTo
    {
        return $this->belongsTo(Ue::class, 'code_ue', 'code_ue');
    }

    /**
     * Relation One-to-Many avec Enseignements
     * Matiere + Prof = Enseignement
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class, 'code_matiere', 'code_matiere');
    }

    /**
     * Relation One-to-Many avec Notes
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'code_matiere', 'code_matiere');
    }
}
