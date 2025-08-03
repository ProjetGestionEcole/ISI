<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Role constants
    const ROLE_ADMIN = 'Admin';
    const ROLE_ETUDIANT = 'Etudiant';
    const ROLE_PROF = 'Prof';
    const ROLE_PARENT = 'Parent';

    // Role helper methods
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isEtudiant(): bool
    {
        return $this->role === self::ROLE_ETUDIANT;
    }

    public function isProf(): bool
    {
        return $this->role === self::ROLE_PROF;
    }

    public function isParent(): bool
    {
        return $this->role === self::ROLE_PARENT;
    }

    // Scopes for filtering by role
    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeEtudiants($query)
    {
        return $query->where('role', self::ROLE_ETUDIANT);
    }

    public function scopeProfs($query)
    {
        return $query->where('role', self::ROLE_PROF);
    }

    public function scopeParents($query)
    {
        return $query->where('role', self::ROLE_PARENT);
    }
}
