<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Etudiant extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('role', function ($builder) {
            $builder->where('role', User::ROLE_ETUDIANT);
        });

        static::creating(function ($model) {
            $model->role = User::ROLE_ETUDIANT;
        });
    }

    // Relationships
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'id_etudiant');
    }

    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class, 'etudiant_id');
    }

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class, 'etudiant_id');
    }

    public function parentRelations(): HasMany
    {
        return $this->hasMany(Leparent::class, 'eleve_id');
    }

    public function parents()
    {
        return $this->parentRelations()->with('parent');
    }

    // Helper methods
    public function getAverageGrade()
    {
        return $this->notes()->avg('valeur');
    }

    public function getTotalAbsences()
    {
        return $this->absences()->count();
    }
}
