<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemestreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveaux = DB::table('niveaux')->pluck('id', 'code_niveau')->toArray();
        $specialites = DB::table('specialites')->select('id', 'code_specialite', 'duree', 'name')->get();

        // Create semesters based on existing specialites and niveaux (adapted to existing structure)
        foreach ($specialites as $spec) {
            $nbSemestres = $spec->duree * 2;
            $prefix = strtoupper(substr($spec->code_specialite, 0, 3));

            for ($i = 1; $i <= $nbSemestres; $i++) {
                $annee = ceil($i / 2);

                if (in_array($prefix, ['DIT', 'DIC', 'DUT'])) {
                    $codeNiveau = $prefix . $annee;
                } else {
                    // Logique LMD
                    if ($annee >= 1 && $annee <= 3) {
                        $codeNiveau = 'L' . $annee;
                    } elseif ($annee >= 4 && $annee <= 5) {
                        $codeNiveau = 'M' . ($annee - 3);
                    } else {
                        continue;
                    }
                }

                if (!isset($niveaux[$codeNiveau])) {
                    continue;
                }

                DB::table('semestres')->updateOrInsert(
                    ['code_semestre' => 'S' . $i . '_' . $spec->code_specialite],
                    [
                        'code_semestre' => 'S' . $i . '_' . $spec->code_specialite,
                        'name' => $spec->name . " Semestre $i",
                        'niveau_id' => $niveaux[$codeNiveau],
                        'specialite_id' => $spec->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
