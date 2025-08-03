<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mention extends Model
{
    protected $guarded = [];

    /**
     * Une mention a plusieurs notes
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }
}
