<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignement extends Model
{
    protected $primaryKey = 'code_enseignement';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code_enseignement',
        'code_matiere',
        'code_prof'
    ];

    /**
     * Relation Many-to-One avec Matiere
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, 'code_matiere', 'code_matiere');
    }

    /**
     * Relation Many-to-One avec Prof (User)
     */
    public function prof(): BelongsTo
    {
        return $this->belongsTo(User::class, 'code_prof', 'id');
    }
}
