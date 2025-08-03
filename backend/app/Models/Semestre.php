<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semestre extends Model
{
    protected $primaryKey = 'code_semestre';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code_semestre',
        'name',
        'description',
        'ordre'
    ];

    /**
     * Relation Many-to-Many avec Classes via table pivot classe_semestre
     */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, 'classe_semestre', 'code_semestre', 'classe_id')
                    ->withPivot('annee_scolaire_id')
                    ->withTimestamps();
    }

    /**
     * Relation One-to-Many avec UEs
     */
    public function ues(): HasMany
    {
        return $this->hasMany(Ue::class, 'code_semestre', 'code_semestre');
    }

    /**
     * Get classes for a specific academic year
     */
    public function classesForYear($anneeScolaireId)
    {
        return $this->classes()->wherePivot('annee_scolaire_id', $anneeScolaireId);
    }
}
