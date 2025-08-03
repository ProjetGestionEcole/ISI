<?php

namespace App\Models;

class Admin extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('role', function ($builder) {
            $builder->where('role', User::ROLE_ADMIN);
        });

        static::creating(function ($model) {
            $model->role = User::ROLE_ADMIN;
        });
    }

    // Admin has access to all system management functions
    // No specific relationships needed as admin manages all entities
}
