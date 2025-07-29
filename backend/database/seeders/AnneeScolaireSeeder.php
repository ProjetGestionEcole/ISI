<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class AnneeScolaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $anneesScolaires = [
            ['annee_scolaire' => '2022-2023', 'date_debut' => '2022-09-01', 'date_fin' => '2023-06-30'],
            ['annee_scolaire' => '2023-2024', 'date_debut' => '2023-09-01', 'date_fin' => '2024-06-30'],
            ['annee_scolaire' => '2024-2025', 'date_debut' => '2024-09-01', 'date_fin' => '2025-06-30'],
            ['annee_scolaire' => '2025-2026', 'date_debut' => '2025-09-01', 'date_fin' => '2026-06-30'],
        ];
        foreach ($anneesScolaires as $annee) {
            DB::table('annee_scolaires')->updateOrInsert(
                ['annee_scolaire' => $annee['annee_scolaire']],
                [
                    'date_debut' => $annee['date_debut'],
                    'date_fin' => $annee['date_fin'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
