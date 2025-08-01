<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inscription;
use App\Models\Enseignement;
use App\Models\Note;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $inscriptions = Inscription::whereIn(
            'code_classe',
            Enseignement::distinct()->pluck('code_classe')
        )->take(5)->get();

        if ($inscriptions->isEmpty()) {
            $this->command->warn("Aucune inscription avec enseignement.");
            return;
        }

        foreach ($inscriptions as $inscription) {
            $enseignements = Enseignement::where('code_classe', $inscription->code_classe)->get();

            foreach ($enseignements as $enseignement) {
                Note::updateOrInsert(
                    [
                        'id_etudiant' => $inscription->etudiant_id,
                        'code_matiere' => $enseignement->code_matiere,
                    ],
                    [
                        'id_enseignant' => $enseignement->code_prof,
                        'mcc' => rand(8, 20),
                        'examen' => rand(6, 20),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        $this->command->info("Notes générées pour 5 inscriptions.");
    }
}
