<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class EnseignementSeeder extends Seeder
{
    /**
     * Run the database seeds.
    */
    public function run(): void
    {
      
   
      $matieres = array_slice(DB::table('matieres')->pluck('code_matiere')->toArray(), 0, 5);
      $classes = array_slice(DB::table('classes')->pluck('code_classe')->toArray(), 0, 5);
      $professeurs = DB::table('users')->where('role', 'Prof')->pluck('id')->toArray();
       // Vérifiez que toutes les données nécessaires sont disponibles
       if (empty($matieres)|| empty($classes)  || empty($professeurs) ) {
          $this->command->error('Certaines tables nécessaires sont vides. Veuillez vérifier vos seeders.');
          return;
       }

       // Exemple de logique pour créer des enseignements
       foreach ($classes as $classe) {
          foreach ($matieres as $matiere) {
             DB::table('enseignements')->insert([
                'code_classe' => $classe,
                'code_matiere' => $matiere,
                'code_prof' => $professeurs[array_rand($professeurs)],
                'created_at' => now(),
                'updated_at' => now(),
             ]);
          }
       }    
      

    }
}
