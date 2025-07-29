<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class UeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semestres = DB::table('semestres')
            ->join('niveaux', 'semestres.niveau_id', '=', 'niveaux.id')
            ->join('specialites', 'semestres.specialite_id', '=', 'specialites.id')
            ->select(
                'semestres.code_semestre',
                'niveaux.name as niveau_nom',
                'specialites.code_specialite as code_specialite',
                'specialites.name as specialite_nom'
            )
            ->get();

        foreach ($semestres as $semestre) {
            for ($i = 1; $i <= 5; $i++) {
                DB::table('ues')->updateOrInsert(
                    ['code_ue' =>'UE-'.$semestre->code_specialite. $i],
                    [
                        'code_ue' =>'UE-'.$semestre->code_specialite. $i,
                        'name' => "UE $i du {$semestre->code_semestre} ({$semestre->niveau_nom} - {$semestre->specialite_nom})",
                        'code_semestre' => $semestre->code_semestre,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
