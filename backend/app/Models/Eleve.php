<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\IdentifiantService;

class Eleve extends Model
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
        'nom_pere',
        'nom_mere',
        'telephone_parent',
        'email_parent',
        'numero_parent',
        'documents_justificatifs',
        'classe_id',
        'date_inscription',
        'statut_inscription'
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_inscription' => 'date',
        'documents_justificatifs' => 'array'
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($eleve) {
            if (empty($eleve->matricule)) {
                $identifiantService = new IdentifiantService();
                $eleve->matricule = $identifiantService->genererNumeroEtudiant();
            }
            
            if (empty($eleve->numero_parent) && (!empty($eleve->nom_pere) || !empty($eleve->nom_mere))) {
                $identifiantService = new IdentifiantService();
                $eleve->numero_parent = $identifiantService->genererNumeroParent();
            }
            
            if (empty($eleve->email_parent) && !empty($eleve->numero_parent)) {
                $identifiantService = new IdentifiantService();
                $eleve->email_parent = $identifiantService->genererEmailParent($eleve->numero_parent);
            }
            
            if (empty($eleve->date_inscription)) {
                $eleve->date_inscription = now();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
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

    public function getParentCompletAttribute(): string
    {
        $parents = [];
        if (!empty($this->nom_pere)) {
            $parents[] = "Père: {$this->nom_pere}";
        }
        if (!empty($this->nom_mere)) {
            $parents[] = "Mère: {$this->nom_mere}";
        }
        return implode(' | ', $parents);
    }

    public function scopeInscrit($query)
    {
        return $query->where('statut_inscription', 'inscrit');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut_inscription', 'en_attente');
    }

    public function scopeParClasse($query, $classeId)
    {
        return $query->where('classe_id', $classeId);
    }
}
