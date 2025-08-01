<?php

/*namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Inscription;
use App\Models\Enseignement;
use App\Models\Note;
class NoteSeeder extends Seeder
{
   
      Run the database seeds.
    

     public function run(): void
     {
         // Récupère toutes les inscriptions des étudiants
         $inscriptions = Inscription::take(5)->get();
         if ($inscriptions->isEmpty()) {
             $this->command->warn("Aucune inscription trouvée. Aucune note n'a été générée.");
             return;
         }
         $this->command->info("Génération de notes pour les étudiants inscrits...");
         foreach ($inscriptions as $inscription) {
             $etudiantId = $inscription->etudiant_id;
             $classeCode = $inscription->code_classe;

             // Récupère tous les enseignements pour la classe
             $enseignements = Enseignement::where('code_classe', $classeCode)->get();
 
             foreach ($enseignements as $enseignement) {
                 // Vérifie si la note existe déjà pour éviter les doublons

                 $noteExiste = Note::where('id_etudiant', $etudiantId)
                                   ->where('code_matiere', $enseignement->code_matiere)
                                   ->exists();
 
                 if (!$noteExiste) {
                     Note::create([
                         'mcc' => rand(8, 20),
                         'examen' => rand(6, 20),
                         'code_matiere' => $enseignement->code_matiere,
                         'id_etudiant' => $etudiantId,
                         'id_enseignant' => $enseignement->code_prof,
                         'created_at' => now(),
                        'updated_at' => now(),
                     ]);
                        $this->command->info("Note générée pour l'étudiant ID: {$etudiantId}, Matière: {$enseignement->code_matiere}.");
                 }
                    else {
                        $this->command->warn("Note déjà existante pour l'étudiant ID: {$etudiantId}, Matière: {$enseignement->code_matiere}.");
                    }
             }
         }
 
         $this->command->info("Notes générées avec succès via la table 'enseignements'.");
     }

    
}
     */



namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inscription;
use App\Models\Enseignement;
use App\Models\Note;

class NoteSeeder extends Seeder
{
    public function run(): void
{
    // Récupère la liste des codes classes qui ont des enseignements
    $codesClassesAvecEnseignements = Enseignement::distinct()->pluck('code_classe')->toArray();

    // Récupère au plus 5 inscriptions dont le code_classe est dans cette liste
    $inscriptions = Inscription::whereIn('code_classe', $codesClassesAvecEnseignements)
                               ->take(5)
                               ->get();

    $this->command->info("Nombre d'inscriptions avec enseignements (max 5) : " . $inscriptions->count());

    if ($inscriptions->isEmpty()) {
        $this->command->warn("Aucune inscription avec enseignements trouvée. Aucune note générée.");
        return;
    }

    foreach ($inscriptions as $inscription) {
        $etudiantId = $inscription->etudiant_id;
        $classeCode = $inscription->code_classe;

        $enseignements = Enseignement::where('code_classe', $classeCode)->get();

        foreach ($enseignements as $enseignement) {
            $noteExiste = Note::where('id_etudiant', $etudiantId)
                              ->where('code_matiere', $enseignement->code_matiere)
                              ->exists();

            if (!$noteExiste) {
                Note::create([
                    'mcc' => rand(8, 20),
                    'examen' => rand(6, 20),
                    'code_matiere' => $enseignement->code_matiere,
                    'id_etudiant' => $etudiantId,
                    'id_enseignant' => $enseignement->code_prof,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $this->command->info("Note générée pour l'étudiant ID: {$etudiantId}, Matière: {$enseignement->code_matiere}.");
            } else {
                $this->command->warn("Note déjà existante pour l'étudiant ID: {$etudiantId}, Matière: {$enseignement->code_matiere}.");
            }
        }
    }

    $this->command->info("Notes générées avec succès via la table 'enseignements'.");
}

}

