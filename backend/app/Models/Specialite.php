<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialite extends Model
{
    protected $fillable = [
        'name',
        'code_specialite',
        'duree'
    ];

    protected $casts = [
        'duree' => 'integer'
    ];

    /**
     * Relation One-to-Many avec Classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class, 'specialite_id', 'id');
    }
}
