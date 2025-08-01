<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnseignementSeeder extends Seeder
{
    /**
     * Run the database seeds.
    */
    public function run(): void
    {
      
   
      /**$matieres = DB::table('matieres')->pluck('code_matiere')->toArray();
       $niveaux = DB::table('niveaux')->pluck('code_niveau')->toArray();
       $specialites = DB::table('specialites')->pluck('code_specialite')->toArray();
       $classes = DB::table('classes')->pluck('code_classe')->toArray();
       $ues = DB::table('ues')->pluck('code_ue')->toArray();
       $professeurs = DB::table('users')->where('role', 'Professeur')->pluck('id')->toArray();
       $anneeScolaires = DB::table('annee_scolaires')->pluck('annee_scolaire')->toArray();

       // Vérifiez que toutes les données nécessaires sont disponibles
       if (empty($matieres) || empty($niveaux) || empty($specialites) || empty($classes) || empty($ues) || empty($professeurs) || empty($anneeScolaires)) {
          $this->command->error('Certaines tables nécessaires sont vides. Veuillez vérifier vos seeders.');
          return;
       }

       // Exemple de logique pour créer des enseignements
       foreach ($classes as $classe) {
          foreach ($matieres as $matiere) {
             DB::table('enseignements')->insert([
                'code_classe' => $classe,
                'code_matiere' => $matiere,
                'code_niveau' => $niveaux[array_rand($niveaux)],
                'code_specialite' => $specialites[array_rand($specialites)],
                'code_ue' => $ues[array_rand($ues)],
                'professeur_id' => $professeurs[array_rand($professeurs)],
                'annee_scolaire' => $anneeScolaires[array_rand($anneeScolaires)],
                'created_at' => now(),
                'updated_at' => now(),
             ]);
          }
       }    
      */

    }
}
