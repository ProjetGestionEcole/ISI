<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\IdentifiantService;

class Enseignant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'matricule',
        'nom',
        'prenom',
        'date_naissance',
        'lieu_naissance',
        'sexe',
        'telephone',
        'email',
        'adresse',
        'diplome_principal',
        'specialites',
        'documents_administratifs',
        'salaire_base',
        'date_embauche',
        'statut_emploi',
        'type_contrat'
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_embauche' => 'date',
        'specialites' => 'array',
        'documents_administratifs' => 'array',
        'salaire_base' => 'decimal:2'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($enseignant) {
            if (empty($enseignant->matricule)) {
                $identifiantService = new IdentifiantService();
                $enseignant->matricule = $identifiantService->genererMatriculeEnseignant();
            }
            
            if (empty($enseignant->email) && !empty($enseignant->prenom) && !empty($enseignant->nom)) {
                $identifiantService = new IdentifiantService();
                $enseignant->email = $identifiantService->genererEmailInstitutionnel($enseignant->prenom, $enseignant->nom);
            }
            
            if (empty($enseignant->date_embauche)) {
                $enseignant->date_embauche = now();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class, 'code_prof');
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, 'enseignements', 'code_prof', 'code_classe', 'id', 'code_classe')
                    ->withPivot(['code_matiere'])
                    ->withTimestamps();
    }

    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'enseignements', 'code_prof', 'code_matiere', 'id', 'code_matiere')
                    ->withPivot(['code_classe'])
                    ->withTimestamps();
    }

    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }

    public function getTelephoneFormatteAttribute(): string
    {
        $identifiantService = new IdentifiantService();
        return $identifiantService->formaterTelephone($this->telephone);
    }

    public function getAgeAttribute(): int
    {
        return $this->date_naissance->diffInYears(now());
    }

    public function getAnneeExperienceAttribute(): int
    {
        return $this->date_embauche->diffInYears(now());
    }

    public function getSpecialitesPrincipalAttribute(): string
    {
        if (empty($this->specialites)) {
            return 'Non spécifié';
        }
        return implode(', ', array_slice($this->specialites, 0, 2));
    }

    public function scopeActif($query)
    {
        return $query->where('statut_emploi', 'actif');
    }

    public function scopeParContrat($query, $typeContrat)
    {
        return $query->where('type_contrat', $typeContrat);
    }

    public function scopeParSpecialite($query, $specialite)
    {
        return $query->whereJsonContains('specialites', $specialite);
    }

    public function scopeParSalaireMin($query, $salaireMin)
    {
        return $query->where('salaire_base', '>=', $salaireMin);
    }

    public function getTotalVolumeHoraireAttribute(): float
    {
        return $this->enseignements()->sum('volume_horaire');
    }

    public function peutEnseigner(Matiere $matiere): bool
    {
        if (empty($this->specialites)) {
            return false;
        }
        
        return in_array($matiere->nom, $this->specialites) || 
               in_array($matiere->code, $this->specialites);
    }
}
