<?php

namespace Database\Seeders;

use App\Models\AnneeScolaire;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Ici, vous pouvez ajouter la logique pour peupler la table des inscriptions
        // Par exemple, vous pouvez créer des inscriptions pour les étudiants dans les niveaux et spécialités
        // Assurez-vous que les tables nécessaires (étudiants, niveaux, spécialités)
        // existent déjà avant de peupler les inscriptions.
        // Exemple de logique pour créer des inscriptions
       
        $etudiants = DB::table('users')
            ->where('role', 'Etudiant')
            ->pluck('id')
            ->toArray();        
        $anneeScolaires = DB::table('annee_scolaires')->pluck('annee_scolaire')->toArray();
        $classes = DB::table('classes')->select('id', 'niveau_id', 'specialite_id')->get();

        if (empty($etudiants) || empty($anneeScolaire) || empty($niveaux) || empty($specialites) || empty($classes) || empty($semestres)) {
            return; // Pas de données suffisantes pour peupler les inscriptions
        }
        foreach ($etudiants as $etudiantId) {
            // Exemple d'inscription aléatoire
            $classe = $classes->random();
            $anneeScolaire = $anneeScolaires[array_rand($anneeScolaires)];
            DB::table('inscriptions')->updateOrInsert(
                ['etudiant_id' => $etudiantId, 'annee_scolaire' => $anneeScolaire->$anneeScolaire,],
                [
                    'date_inscription' => now(),
                    'niveau_id'       => $classe->niveau_id,
                    'specialite_id' => $classe->specialite_id,
                    'classe_id'       => $classe->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
