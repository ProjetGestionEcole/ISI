<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class IdentifiantService extends BaseCacheService
{
    /**
     * Génère un numéro d'étudiant automatique - Format: ISI + année + séquence
     * Exemple: ISI2025001
     */
    public function genererNumeroEtudiant(): string
    {
        $annee = date('Y');
        $cacheKey = "numero_etudiant_{$annee}";
        
        return cache()->remember($cacheKey, 3600, function () use ($annee) {
            // Trouver le dernier numéro pour cette année
            $lastNumber = DB::table('eleves')
                ->where('matricule', 'like', "ISI{$annee}%")
                ->orderBy('matricule', 'desc')
                ->value('matricule');

            if ($lastNumber) {
                $sequence = intval(substr($lastNumber, -3)) + 1;
            } else {
                $sequence = 1;
            }

            return "ISI{$annee}" . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }

    /**
     * Génère un numéro de parent automatique - Format: P + année + séquence
     * Exemple: P2025001
     */
    public function genererNumeroParent(): string
    {
        $annee = date('Y');
        $cacheKey = "numero_parent_{$annee}";
        
        return cache()->remember($cacheKey, 3600, function () use ($annee) {
            // Compter les parents pour cette année (basé sur email pattern)
            $count = User::where('role', 'Parent')
                ->where('email', 'like', "parent{$annee}%@isi.sn")
                ->count();

            $sequence = $count + 1;
            return "P{$annee}" . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }

    /**
     * Génère un matricule enseignant automatique - Format: ENS + année + séquence
     * Exemple: ENS2025001
     */
    public function genererMatriculeEnseignant(): string
    {
        $annee = date('Y');
        $cacheKey = "matricule_enseignant_{$annee}";
        
        return cache()->remember($cacheKey, 3600, function () use ($annee) {
            // Trouver le dernier matricule pour cette année
            $lastMatricule = DB::table('enseignants')
                ->where('matricule', 'like', "ENS{$annee}%")
                ->orderBy('matricule', 'desc')
                ->value('matricule');

            if ($lastMatricule) {
                $sequence = intval(substr($lastMatricule, -3)) + 1;
            } else {
                $sequence = 1;
            }

            return "ENS{$annee}" . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }

    /**
     * Génère un email parent automatique basé sur le numéro
     * Format: parent{année}{séquence}@isi.sn
     */
    public function genererEmailParent(string $numeroParent): string
    {
        $annee = date('Y');
        $sequence = substr($numeroParent, -3);
        return "parent{$annee}{$sequence}@isi.sn";
    }

    /**
     * Valide le format d'un numéro de téléphone sénégalais
     * Format accepté: 7XXXXXXXX (9 chiffres commençant par 7)
     */
    public function validerTelephone(string $telephone): bool
    {
        // Nettoyer le numéro (supprimer espaces, tirets, etc.)
        $telephone = preg_replace('/[^0-9]/', '', $telephone);
        
        // Vérifier format sénégalais: 9 chiffres commençant par 7
        return preg_match('/^7[0-9]{8}$/', $telephone) === 1;
    }

    /**
     * Formate un numéro de téléphone sénégalais
     * Entrée: 775551234 ou 77 555 12 34
     * Sortie: 77 555 12 34
     */
    public function formaterTelephone(string $telephone): string
    {
        $telephone = preg_replace('/[^0-9]/', '', $telephone);
        
        if (strlen($telephone) === 9 && $this->validerTelephone($telephone)) {
            return substr($telephone, 0, 2) . ' ' . 
                   substr($telephone, 2, 3) . ' ' . 
                   substr($telephone, 5, 2) . ' ' . 
                   substr($telephone, 7, 2);
        }
        
        return $telephone; // Retourner tel quel si format invalide
    }

    /**
     * Valide un matricule d'étudiant ISI
     * Format: ISI + 4 chiffres (année) + 3 chiffres (séquence)
     */
    public function validerMatriculeEtudiant(string $matricule): bool
    {
        return preg_match('/^ISI\d{7}$/', $matricule) === 1;
    }

    /**
     * Valide un matricule d'enseignant
     * Format: ENS + 4 chiffres (année) + 3 chiffres (séquence)
     */
    public function validerMatriculeEnseignant(string $matricule): bool
    {
        return preg_match('/^ENS\d{7}$/', $matricule) === 1;
    }

    /**
     * Valide un numéro de parent
     * Format: P + 4 chiffres (année) + 3 chiffres (séquence)
     */
    public function validerNumeroParent(string $numero): bool
    {
        return preg_match('/^P\d{7}$/', $numero) === 1;
    }

    /**
     * Génère un nom d'utilisateur unique basé sur le nom complet
     * Exemple: "Mamadou Fall" → "mamadou.fall" ou "mamadou.fall.2" si existe
     */
    public function genererNomUtilisateur(string $prenom, string $nom): string
    {
        $baseUsername = strtolower($prenom . '.' . $nom);
        $baseUsername = preg_replace('/[^a-z0-9.]/', '', $baseUsername);
        
        $username = $baseUsername;
        $counter = 1;
        
        while (User::where('email', 'like', $username . '%@isi.sn')->exists()) {
            $counter++;
            $username = $baseUsername . '.' . $counter;
        }
        
        return $username;
    }

    /**
     * Génère un email institutionnel pour un étudiant
     * Format: {prenom}.{nom}.{sequence}@isi.sn
     */
    public function genererEmailInstitutionnel(string $prenom, string $nom): string
    {
        $username = $this->genererNomUtilisateur($prenom, $nom);
        return $username . '@isi.sn';
    }

    /**
     * Valide qu'un sexe correspond aux conventions sénégalaises
     */
    public function validerSexe(string $sexe): bool
    {
        return in_array(strtoupper($sexe), ['M', 'F']);
    }

    /**
     * Valide un lieu de naissance (villes principales du Sénégal)
     */
    public function validerLieuNaissance(string $lieu): bool
    {
        $villesSenegal = [
            'Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Kaolack',
            'Saint-Louis', 'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda',
            'Kolda', 'Sédhiou', 'Matam', 'Kaffrine', 'Kédougou', 'Fatick',
            'Mbour', 'Touba', 'Tivaouane', 'Richard-Toll'
        ];
        
        $lieu = trim($lieu);
        
        // Vérification exacte ou contient une ville connue
        foreach ($villesSenegal as $ville) {
            if (stripos($lieu, $ville) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Nettoie le cache des identifiants pour forcer la régénération
     */
    public function viderCacheIdentifiants(): void
    {
        $annee = date('Y');
        cache()->forget("numero_etudiant_{$annee}");
        cache()->forget("numero_parent_{$annee}");
        cache()->forget("matricule_enseignant_{$annee}");
    }

    /**
     * Génère des statistiques sur les identifiants générés
     */
    public function getStatistiquesIdentifiants(): array
    {
        $annee = date('Y');
        
        return [
            'annee_courante' => $annee,
            'etudiants_inscrits' => DB::table('eleves')
                ->where('matricule', 'like', "ISI{$annee}%")
                ->count(),
            'enseignants_recrutes' => DB::table('enseignants')
                ->where('matricule', 'like', "ENS{$annee}%")
                ->count(),
            'parents_enregistres' => User::where('role', 'Parent')
                ->where('email', 'like', "parent{$annee}%@isi.sn")
                ->count(),
            'dernier_numero_etudiant' => DB::table('eleves')
                ->where('matricule', 'like', "ISI{$annee}%")
                ->orderBy('matricule', 'desc')
                ->value('matricule'),
            'dernier_matricule_enseignant' => DB::table('enseignants')
                ->where('matricule', 'like', "ENS{$annee}%")
                ->orderBy('matricule', 'desc')
                ->value('matricule')
        ];
    }
}