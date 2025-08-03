<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ue extends Model
{
    protected $primaryKey = 'code_ue';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code_ue',
        'name',
        'code_semestre',
        'credits'
    ];

    /**
     * Relation Many-to-One avec Semestre
     */
    public function semestre(): BelongsTo
    {
        return $this->belongsTo(Semestre::class, 'code_semestre', 'code_semestre');
    }

    /**
     * Relation One-to-Many avec Matieres
     * Each UE has 2-4 Matieres
     */
    public function matieres(): HasMany
    {
        return $this->hasMany(Matiere::class, 'code_ue', 'code_ue');
    }
}
