<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnseignementSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = DB::table('matieres')->get();
        $profs = DB::table('users')->where('role', 'Prof')->pluck('id')->toArray();

        if ($matieres->isEmpty() || count($profs) < 1) {
            $this->command->error('Tables vides. Ajoutez des profs et matières.');
            return;
        }

        $enseignementCount = 0;
        
        // Create enseignements for each matiere with a random prof
        foreach ($matieres as $matiere) {
            $codeEnseignement = 'ENS_' . $matiere->code_matiere;
            
            try {
                DB::table('enseignements')->updateOrInsert(
                    [
                        'code_enseignement' => $codeEnseignement,
                    ],
                    [
                        'code_matiere' => $matiere->code_matiere,
                        'code_prof' => $profs[array_rand($profs)],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
                $enseignementCount++;
            } catch (\Exception $e) {
                echo "Error creating enseignement for {$matiere->code_matiere}: " . $e->getMessage() . "\n";
            }
        }

        $this->command->info("$enseignementCount enseignements créés (1 par matière).");
    }
}
