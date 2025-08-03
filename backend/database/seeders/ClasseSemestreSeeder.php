<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClasseSemestreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Each class must have exactly 2 semesters
     */
    public function run(): void
    {
        // Check if classe_semestre table exists
        if (!Schema::hasTable('classe_semestre')) {
            echo "Warning: classe_semestre table does not exist. Skipping ClasseSemestreSeeder.\n";
            return;
        }

        $classes = DB::table('classes')->get();
        $anneeScolaire = DB::table('annee_scolaires')->first();
        
        if (!$anneeScolaire) {
            // Create a new academic year if none exists
            DB::table('annee_scolaires')->insert([
                'annee_scolaire' => '2024-2025',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-06-30',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $anneeScolaireKey = '2024-2025';
        } else {
            $anneeScolaireKey = $anneeScolaire->annee_scolaire;
        }

        foreach ($classes as $classe) {
            // Get available semesters for this class's specialite and niveau
            $semestres = DB::table('semestres')
                ->where('specialite_id', $classe->specialite_id)
                ->where('niveau_id', $classe->niveau_id)
                ->limit(2) // Each class gets exactly 2 semesters
                ->get();

            foreach ($semestres as $semestre) {
                try {
                    DB::table('classe_semestre')->updateOrInsert(
                        [
                            'classe_id' => $classe->id,
                            'code_semestre' => $semestre->code_semestre,
                            'annee_scolaire' => $anneeScolaireKey
                        ],
                        [
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                } catch (\Exception $e) {
                    echo "Error linking class {$classe->id} to semester {$semestre->code_semestre}: " . $e->getMessage() . "\n";
                }
            }
        }
    }
}
