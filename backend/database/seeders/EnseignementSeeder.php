<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnseignementSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = DB::table('matieres')->pluck('code_matiere')->toArray();
        $classes = DB::table('classes')->pluck('code_classe')->toArray();
        $profs = DB::table('users')->where('role', 'Prof')->pluck('id')->toArray();

        if (count($matieres) < 1 || count($classes) < 1 || count($profs) < 1) {
            $this->command->error('Tables vides. Ajoutez des profs, matières, classes.');
            return;
        }

        $matieres = array_slice($matieres, 0, 5);
        $classes = array_slice($classes, 0, 5);

        foreach ($classes as $classe) {
            foreach ($matieres as $matiere) {
                DB::table('enseignements')->updateOrInsert(
                    [
                        'code_classe' => $classe,
                        'code_matiere' => $matiere,
                    ],
                    [
                        'code_prof' => $profs[array_rand($profs)],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        $this->command->info("Enseignements (5 classes × 5 matières) créés.");
    }
}
