<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeparentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les étudiants et leurs parents du UserSeeder
        $etudiants = DB::table('users')->where('role', 'Etudiant')->get();
        $parents = DB::table('users')->where('role', 'Parent')->get();
        
        $prenomsGarcons = ['Mamadou', 'Oumar', 'Cheikh', 'Ibrahima', 'Abdoulaye', 'Modou', 'Serigne', 'Moussa', 'Amadou', 'Babacar'];
        $prenomsFilles = ['Aminata', 'Fatou', 'Coumba', 'Adji', 'Mame', 'Ndeye', 'Seynabou', 'Awa', 'Khady', 'Marième'];
        $noms = ['Diallo', 'Diop', 'Faye', 'Fall', 'Ndiaye', 'Sow', 'Ba', 'Gueye', 'Sy', 'Diouf', 'Thiam', 'Cissé'];
        
        $professions = [
            'Fonctionnaire', 'Commerçant', 'Enseignant', 'Chauffeur', 'Mécanicien',
            'Tailleur', 'Agriculteur', 'Pêcheur', 'Maçon', 'Électricien',
            'Médecin', 'Infirmier', 'Comptable', 'Banquier', 'Avocat'
        ];
        
        $adresses = [
            'Dakar, Plateau', 'Dakar, Medina', 'Dakar, Parcelles Assainies', 'Guédiawaye',
            'Pikine', 'Rufisque', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor',
            'Touba', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda'
        ];
        
        foreach ($etudiants as $index => $etudiant) {
            // Créer le père
            if ($index < count($parents)) {
                $parent = $parents[$index];
                DB::table('leparents')->insert([
                    'user_id' => $parent->id,
                    'eleve_id' => $etudiant->id,
                    'profession' => $professions[array_rand($professions)],
                    'relation' => 'Père',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            // Créer la mère si il y a assez de parents
            if (($index + 1) < count($parents)) {
                $parent = $parents[$index + 1];
                DB::table('leparents')->insert([
                    'user_id' => $parent->id,
                    'eleve_id' => $etudiant->id,
                    'profession' => $professions[array_rand($professions)],
                    'relation' => 'Mère',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
