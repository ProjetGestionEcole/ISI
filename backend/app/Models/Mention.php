<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mention extends Model
{
    protected $fillable = [
        'appreciation',
        'min_moyenne',
        'max_moyenne'
    ];

    protected $casts = [
        'min_moyenne' => 'float',
        'max_moyenne' => 'float'
    ];
}
