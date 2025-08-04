<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Prof extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('role', function ($builder) {
            $builder->where('role', User::ROLE_PROF);
        });

        static::creating(function ($model) {
            $model->role = User::ROLE_PROF;
        });
    }

    // Relationships
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class, 'code_prof');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'prof_id');
    }

    // Helper methods
    public function getSubjects()
    {
        return $this->enseignements()->with('matiere')->get()->pluck('matiere');
    }

    public function getStudentsCount()
    {
        return $this->enseignements()->with('classe.inscriptions')->get()
            ->sum(function ($enseignement) {
                return $enseignement->classe->inscriptions->count();
            });
    }
}
