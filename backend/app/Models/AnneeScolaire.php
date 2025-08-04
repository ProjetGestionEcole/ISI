<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnneeScolaire extends Model
{
    protected $primaryKey = 'annee_scolaire';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'annee_scolaire',
        'date_debut',
        'date_fin'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date'
    ];

    /**
     * Relation One-to-Many avec Inscriptions
     */
    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class, 'annee_scolaire', 'annee_scolaire');
    }
}
