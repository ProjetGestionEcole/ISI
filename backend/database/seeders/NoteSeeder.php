<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        // Get enseignements and students
        $enseignements = DB::table('enseignements')->get();
        $etudiants = DB::table('users')->where('role', 'Etudiant')->pluck('id')->toArray();

        if ($enseignements->isEmpty() || empty($etudiants)) {
            $this->command->warn("Aucun enseignement ou étudiant trouvé.");
            return;
        }

        $noteCount = 0;
        
        // Create notes for each enseignement with random students
        foreach ($enseignements as $enseignement) {
            // Randomly select some students for this enseignement (simulate class enrollment)
            $selectedStudents = array_rand(array_flip($etudiants), min(rand(3, 8), count($etudiants)));
            if (!is_array($selectedStudents)) {
                $selectedStudents = [$selectedStudents];
            }
            
            foreach ($selectedStudents as $etudiantId) {
                try {
                    DB::table('notes')->updateOrInsert(
                        [
                            'code_enseignement' => $enseignement->code_enseignement,
                            'id_etudiant' => $etudiantId,
                        ],
                        [
                            'mcc' => rand(8, 20),
                            'examen' => rand(6, 20),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                    $noteCount++;
                } catch (\Exception $e) {
                    echo "Error creating note for enseignement {$enseignement->code_enseignement}: " . $e->getMessage() . "\n";
                }
            }
        }

        $this->command->info("$noteCount notes générées pour les enseignements.");
    }
}
